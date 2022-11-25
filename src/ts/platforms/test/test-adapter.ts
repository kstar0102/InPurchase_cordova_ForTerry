namespace CdvPurchase {

    /**
     * Test Adapter and related classes.
     */
    export namespace Test {

        const platform = Platform.TEST;
        let verifiedPurchases: VerifiedPurchase[] = [];

        function updateVerifiedPurchases(tr: Transaction) {
            tr.products.forEach(p => {
                const existing = verifiedPurchases.find(v => p.id === v.id);
                const attributes: VerifiedPurchase = {
                    id: p.id,
                    purchaseDate: tr.purchaseDate?.getTime(),
                    expiryDate: tr.expirationDate?.getTime(),
                    lastRenewalDate: tr.lastRenewalDate?.getTime(),
                    renewalIntent: tr.renewalIntent,
                    renewalIntentChangeDate: tr.renewalIntentChangeDate?.getTime(),
                }
                if (existing) {
                    Object.assign(existing, attributes);
                }
                else {
                    verifiedPurchases.push(attributes);
                }
            });
        }

        /**
         * Test Adapter used for local testing with mock products.
         *
         * This adapter simulates a payment platform that supports both In-App Products and Payment Requests.
         *
         * The list of supported In-App Products
         *
         * @see {@link Test.TEST_PRODUCTS}
         */
        export class Adapter implements CdvPurchase.Adapter {

            id = Platform.TEST;
            name = 'Test';
            ready = false;
            products: Product[] = [];
            receipts: Receipt[] = [];

            private context: Internal.AdapterContext;
            private log: Logger;

            constructor(context: Internal.AdapterContext) {
                this.context = context;
                this.log = context.log.child("Test");
            }

            get isSupported(): boolean {
                return true;
            }

            async initialize(): Promise<IError | undefined> { return; }

            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> {

                return products.map(registerProduct => {
                    if (!testProductsArray.find(p => p.id === registerProduct.id && p.type === registerProduct.type)) {
                        return storeError(ErrorCode.PRODUCT_NOT_AVAILABLE, 'This product is not available');
                    }
                    // Ensure it's not been loaded already.
                    const existingProduct = this.products.find(p => p.id === registerProduct.id);
                    if (existingProduct) return existingProduct;

                    // Enable the active subscription if loaded by the user.
                    if (registerProduct.id === testProducts.PAID_SUBSCRIPTION_ACTIVE.id) {
                        setTimeout(() => {
                            this.reportActiveSubscription();
                        }, 500); // it'll get reported in 500ms
                    }

                    const product = initTestProduct(registerProduct.id, this.context.apiDecorators);
                    if (!product) return storeError(ErrorCode.PRODUCT_NOT_AVAILABLE, 'Could not load this product');
                    this.products.push(product);
                    this.context.listener.productsUpdated(Platform.TEST, [product]);
                    return product;
                });
            }

            async order(offer: Offer): Promise<undefined | IError> {
                // Purchasing products with "-fail-" in the id will fail.
                if (offer.id.indexOf("-fail-") > 0) {
                    return storeError(ErrorCode.PURCHASE, 'Purchase failed.');
                }
                const product = this.products.find(p => p.id === offer.productId);
                if (!Internal.LocalReceipts.canPurchase(this.receipts, product)) {
                    return storeError(ErrorCode.PURCHASE, 'Product already owned');
                }
                // a receipt containing a transaction with the given product.
                const response = prompt(`Do you want to purchase ${offer.productId} for ${offer.pricingPhases[0].price}?\nEnter "Y" to confirm.\nEnter "E" to fail with an error.\Anything else to cancel.`);
                if (response?.toUpperCase() === 'E') return storeError(ErrorCode.PURCHASE, 'Purchase failed');
                if (response?.toUpperCase() !== 'Y') return storeError(ErrorCode.PAYMENT_CANCELLED, 'Purchase flow has been cancelled by the user');
                // purchase succeeded, let's generate a mock receipt.
                const receipt = new Receipt(platform, this.context.apiDecorators);
                const tr = new Transaction(platform, receipt, this.context.apiDecorators);
                receipt.transactions = [tr];
                tr.products = [{
                    id: offer.productId,
                    offerId: offer.id,
                }];
                tr.state = TransactionState.APPROVED;
                tr.purchaseDate = new Date();
                tr.transactionId = offer.productId + '-' + (new Date().getTime());
                tr.isAcknowledged = false;
                updateVerifiedPurchases(tr);
                this.receipts.push(receipt);
                this.context.listener.receiptsUpdated(Platform.TEST, [receipt]);
            }

            finish(transaction: Transaction): Promise<undefined | IError> {
                return new Promise(resolve => {
                    setTimeout(() => {
                        transaction.state = TransactionState.FINISHED;
                        transaction.isAcknowledged = true;
                        updateVerifiedPurchases(transaction);
                        const product = this.products.find(p => transaction.products[0].id === p.id);
                        if (product?.type === ProductType.CONSUMABLE) transaction.isConsumed = true;
                        const receipts = this.receipts.filter(r => r.hasTransaction(transaction));
                        this.context.listener.receiptsUpdated(platform, receipts);
                        resolve(undefined);
                    }, 500);
                });
            }

            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined {
                return;
            }

            async handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                return;
            }

            async requestPayment(paymentRequest: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined> {

                await Utils.asyncDelay(100); // maybe app has some UI to update... and "prompt" prevents that
                const response = prompt(`Mock payment of ${paymentRequest.amountMicros / 1000000} ${paymentRequest.currency}. Enter "Y" to confirm. Enter "E" to trigger an error.`);
                if (response?.toUpperCase() === 'E') return storeError(ErrorCode.PAYMENT_NOT_ALLOWED, 'Payment not allowed');
                if (response?.toUpperCase() !== 'Y') return;
                const receipt = new Receipt(platform, this.context.apiDecorators);
                const transaction = new Transaction(Platform.TEST, receipt, this.context.apiDecorators);
                transaction.purchaseDate = new Date();
                transaction.products = paymentRequest.productIds.map(productId => ({ id: productId }));
                transaction.state = TransactionState.APPROVED;
                transaction.transactionId = 'payment-' + new Date().getTime();
                transaction.amountMicros = paymentRequest.amountMicros;
                transaction.currency = paymentRequest.currency;
                receipt.transactions = [transaction];
                this.receipts.push(receipt);
                setTimeout(() => {
                    this.context.listener.receiptsUpdated(platform, [receipt]);
                }, 400);
                return transaction;
            }

            async manageSubscriptions(): Promise<IError | undefined> {
                alert('Pseudo subscription management interface. Close it when you are done.')
                return;
            }

            private reportActiveSubscription() {

                if (this.receipts.find(r => r.transactions[0].transactionId === transactionId(1))) {
                    // already reported
                    return;
                }

                const RENEWS_EVERY_MS = 2 * 60000; // 2 minutes

                const receipt = new Receipt(platform, this.context.apiDecorators);
                const makeTransaction = (n: number) => {
                    const tr = new Transaction(platform, receipt, this.context.apiDecorators);
                    tr.products = [{
                        id: testProducts.PAID_SUBSCRIPTION_ACTIVE.id,
                        offerId: testProducts.PAID_SUBSCRIPTION_ACTIVE.extra.offerId,
                    }];
                    tr.state = TransactionState.APPROVED;
                    tr.transactionId = transactionId(n);
                    tr.isAcknowledged = n == 1;
                    tr.renewalIntent = RenewalIntent.RENEW;
                    const firstPurchase = +(receipt?.transactions?.[0]?.purchaseDate || new Date());
                    tr.purchaseDate = new Date(firstPurchase);
                    tr.lastRenewalDate = new Date(firstPurchase + RENEWS_EVERY_MS * (n - 1));
                    tr.expirationDate = new Date(firstPurchase + RENEWS_EVERY_MS * n);
                    updateVerifiedPurchases(tr);
                    return tr;
                }
                receipt.transactions.push(makeTransaction(1));
                this.receipts.push(receipt);
                this.context.listener.receiptsUpdated(Platform.TEST, [receipt]);

                function transactionId(n: number) {
                    return 'test-active-subscription-transaction-' + n;
                }

                let transactionNumber = 1;
                setInterval(() => {
                    this.log.info('auto-renewing the mock subscription')
                    transactionNumber += 1;
                    receipt.transactions.push(makeTransaction(transactionNumber));
                    this.context.listener.receiptsUpdated(Platform.TEST, [receipt]);
                }, RENEWS_EVERY_MS);
            }

            static verify(receipt: Receipt, callback: Callback<Internal.ReceiptResponse>) {
                setTimeout(() => {
                    callback({
                        receipt,
                        payload: {
                            ok: true,
                            data: {
                                id: receipt.transactions[0]?.products[0]?.id,
                                latest_receipt: true,
                                transaction: { type: 'test' },
                                collection: verifiedPurchases,
                            }
                        }
                    });
                }, 500);
            }

            checkSupport(functionality: PlatformFunctionality): boolean {
                return true;
            }

            async restorePurchases(): Promise<void> {
            }
        }
    }
}
