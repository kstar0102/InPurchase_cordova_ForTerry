namespace CdvPurchase {
    export namespace WindowsStore {
        export class Adapter implements CdvPurchase.Adapter {
            id = Platform.WINDOWS_STORE;
            name = 'WindowsStore';
            ready = false;
            products: Product[] = [];
            receipts: Receipt[] = [];
            async initialize(): Promise<IError | undefined> { return; }
            get isSupported(): boolean {
                return false;
            }
            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> {
                return products.map(p => storeError(ErrorCode.PRODUCT_NOT_AVAILABLE, 'TODO'));
            }
            async order(offer: Offer): Promise<undefined | IError> {
                return storeError(ErrorCode.UNKNOWN, 'TODO: Not implemented');
            }
            async finish(transaction: Transaction): Promise<undefined | IError> {
                return storeError(ErrorCode.UNKNOWN, 'TODO: Not implemented');
            }
            async handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                return;
            }
            receiptValidationBody(receipt: Receipt): Validator.Request.Body | undefined {
                return;
            }
            async requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined> {
                return storeError(ErrorCode.UNKNOWN, 'requestPayment not supported');
            }
            async manageSubscriptions(): Promise<IError | undefined> {
                return storeError(ErrorCode.UNKNOWN, 'manageSubscriptions not supported');
            }
            checkSupport(functionality: PlatformFunctionality): boolean {
                return false;
            }
        }
    }
}
