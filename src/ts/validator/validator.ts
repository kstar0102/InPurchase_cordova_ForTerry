namespace CdvPurchase {


    /**
     * @internal
     */
    export namespace Internal {

        export interface ReceiptResponse {
            receipt: Receipt;
            payload: Validator.Response.Payload;
        }

        /** Queue of receipts to validate */
        export class ReceiptsToValidate {
            private array: Receipt[] = [];

            get(): Receipt[] {
                return this.array.concat();
            }

            add(receipt: Receipt) {
                if (!this.has(receipt))
                    this.array.push(receipt);
            }

            clear() {
                while (this.array.length !== 0)
                    this.array.pop();
            }

            has(receipt: Receipt): boolean {
                return !!this.array.find(el => el === receipt);
            }
        }

        export interface ValidatorController {
            get validator(): string | Validator.Function | Validator.Target | undefined;
            get localReceipts(): Receipt[];
            get adapters(): Adapters;
            get validator_privacy_policy(): PrivacyPolicyItem | PrivacyPolicyItem[] | undefined;
            getApplicationUsername(): string | undefined;
            get verifiedCallbacks(): Callbacks<VerifiedReceipt>;
            get unverifiedCallbacks(): Callbacks<UnverifiedReceipt>;
            finish(receipt:VerifiedReceipt): Promise<void>;
        }

        /** Handles communication with the remote receipt validation service */
        export class Validator {

            /** List of receipts waiting for validation */
            private receiptsToValidate: ReceiptsToValidate = new ReceiptsToValidate();

            /**  */
            private controller: ValidatorController;

            /** Logger */
            private log: Logger;

            /** List of verified receipts */
            public verifiedReceipts: VerifiedReceipt[] = [];

            constructor(controller: ValidatorController, log: Logger) {
                this.controller = controller;
                this.log = log.child('Validator');
            }

            /** Add/update a verified receipt from the server response */
            addVerifiedReceipt(receipt: Receipt, data: Validator.Response.SuccessPayload['data']): VerifiedReceipt {
                for (const vr of this.verifiedReceipts) {
                    if (vr.platform === receipt.platform && vr.id === data.id) {
                        // update existing receipt
                        this.log.debug("Updating existing receipt.")
                        vr.set(receipt, data);
                        return vr;
                    }
                }
                this.log.debug("Register a new verified receipt.")
                const newVR = new VerifiedReceipt(receipt, data, this.controller);
                this.verifiedReceipts.push(newVR);
                return newVR;
            }

            /** Add a receipt to the validation queue. It'll get validated after a few milliseconds. */
            add(receiptOrTransaction: Receipt | Transaction) {
                this.log.debug("Schedule validation: " + JSON.stringify(receiptOrTransaction));
                const receipt: Receipt = (receiptOrTransaction instanceof Transaction) ? receiptOrTransaction.parentReceipt : receiptOrTransaction;
                this.receiptsToValidate.add(receipt);
            }

            /** Run validation for all receipts in the queue */
            run() {
                // pseudo implementation
                const receipts = this.receiptsToValidate.get();
                this.receiptsToValidate.clear();

                const onResponse = async (r: ReceiptResponse) => {
                    const { receipt, payload } = r;
                    try {
                        const adapter = this.controller.adapters.find(receipt.platform);
                        await adapter?.handleReceiptValidationResponse(receipt, payload);
                        if (payload.ok) {
                            const vr = this.addVerifiedReceipt(receipt, payload.data);
                            this.controller.verifiedCallbacks.trigger(vr);
                            // this.verifiedCallbacks.trigger(data.receipt);
                        }
                        else {
                            this.controller.unverifiedCallbacks.trigger({receipt, payload});
                        }
                    }
                    catch (err) {
                        this.log.error('Exception probably caused by an invalid response from the validator.' + (err as Error).message);
                    }
                };
                receipts.forEach(receipt => this.runOnReceipt(receipt, onResponse));
            }

            private async runOnReceipt(receipt: Receipt, callback: Callback<ReceiptResponse>) {

                if (receipt.platform === Platform.TEST) {
                    this.log.debug('Using Test Adapter mock verify function.');
                    return Test.Adapter.verify(receipt, callback);
                }
                if (!this.controller.validator) return;
                const body = await this.buildRequestBody(receipt);
                if (!body) return;

                if (typeof this.controller.validator === 'function')
                    return this.runValidatorFunction(this.controller.validator, receipt, body, callback);

                const target: Validator.Target = typeof this.controller.validator === 'string'
                    ? { url: this.controller.validator }
                    : this.controller.validator;

                return this.runValidatorRequest(target, receipt, body, callback);
            }

            private runValidatorFunction(validator: Validator.Function, receipt: Receipt, body: Validator.Request.Body, callback: Callback<ReceiptResponse>) {
                try {
                    validator(body, (payload: Validator.Response.Payload) => callback({ receipt, payload }));
                }
                catch (error) {
                    this.log.warn("user provided validator function failed with error: " + (error as Error)?.stack);
                }
            }

            private async buildRequestBody(receipt: Receipt): Promise<Validator.Request.Body | undefined> {

                // Let the adapter generate the initial content
                const adapter = this.controller.adapters.find(receipt.platform);
                const body = await adapter?.receiptValidationBody(receipt);
                if (!body) return;

                // Add the applicationUsername
                body.additionalData = {
                    ...body.additionalData ?? {},
                    applicationUsername: this.controller.getApplicationUsername(),
                }
                if (!body.additionalData.applicationUsername) delete body.additionalData.applicationUsername;

                // Add device information
                body.device = {
                    ...body.device ?? {},
                    ...CdvPurchase.Validator.Internal.getDeviceInfo(this.controller),
                }

                // Add legacy pricing information
                if (body.offers?.length === 1) {
                    const offer = body.offers[0];
                    if (offer.pricingPhases.length === 1) {
                        const pricing = offer.pricingPhases[0];
                        body.currency = pricing.currency;
                        body.priceMicros = pricing.priceMicros;
                    }
                    else if (offer.pricingPhases.length === 2) {
                        const pricing = offer.pricingPhases[1];
                        body.currency = pricing.currency;
                        body.priceMicros = pricing.priceMicros;
                        const intro = offer.pricingPhases[0];
                        body.introPriceMicros = intro.priceMicros;
                    }
                }

                return body;
            }

            /**
             * For each md5-hashed values of the validator request's ".transaction" field,
             * store the response from the server.
             *
             * This way, if a subsequent request is necessary (without a couple of minutes)
             * we just reuse the same data.
             */
            private cache: {
                [bodyTransactionHash: string]: {
                    payload: Validator.Response.Payload;
                    expires: number;
                }
            } = {};

            private removeExpiredCache() {
                const now = +new Date();
                const deleteList: string[] = [];
                for (const hash in this.cache) {
                    if (this.cache[hash].expires < now) {
                        deleteList.push(hash);
                    }
                }
                for (const hash of deleteList) {
                    delete this.cache[hash];
                }
            }

            private runValidatorRequest(target: Validator.Target, receipt: Receipt, body: Validator.Request.Body, callback: Callback<ReceiptResponse>) {

                this.removeExpiredCache();
                const bodyTransactionHash = Utils.md5(JSON.stringify(body.transaction));
                const cached = this.cache[bodyTransactionHash];
                if (cached) {
                    return callback({receipt, payload: cached.payload});
                }

                CdvPurchase.Utils.ajax<Validator.Response.Payload>(this.log.child("Ajax"), {
                    url: target.url,
                    method: 'POST',
                    customHeaders: target.headers,
                    data: body,
                    success: (response) => {
                        this.log.debug("validator success, response: " + JSON.stringify(response));
                        if (!isValidatorResponsePayload(response))
                            return callback({
                                receipt,
                                payload: {
                                    ok: false,
                                    code: ErrorCode.BAD_RESPONSE,
                                    message: 'Validator responded with invalid data',
                                    data: { latest_receipt: (response as any)?.data?.latest_receipt },
                                } as Validator.Response.ErrorPayload
                            });
                        this.cache[bodyTransactionHash] = {
                            payload: response,
                            expires: (+new Date()) + 120000, // expires in 2 minutes
                        };
                        callback({ receipt, payload: response });
                    },
                    error: (status, message, data) => {
                        var fullMessage = "Error " + status + ": " + message;
                        this.log.debug("validator failed, response: " + JSON.stringify(fullMessage));
                        this.log.debug("body => " + JSON.stringify(data));
                        callback({
                            receipt,
                            payload: {
                                ok: false,
                                message: fullMessage,
                                data: {},
                            }
                        });
                    }
                });
            }
        }

        /**
         * Check if a payload looks like a valid validator response.
         */
        function isValidatorResponsePayload(payload: unknown): payload is Validator.Response.Payload {
            // TODO: could be made more robust.
            return (!!payload)
                && (typeof payload === 'object')
                && ('ok' in payload)
                && (typeof (payload as any).ok === 'boolean');
        }
    }
}
