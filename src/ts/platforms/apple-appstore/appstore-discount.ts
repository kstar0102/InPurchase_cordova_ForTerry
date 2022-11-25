namespace CdvPurchase {

  /**
   * Apple AppStore adapter using StoreKit version 1
   */
  export namespace AppleAppStore {

    export type DiscountType = "Introductory" | "Subscription";

    export interface DiscountEligibilityRequest {
        productId: string;
        discountType: DiscountType;
        discountId: string;
    }

    /** @internal */
    export namespace Internal {
      export class DiscountEligibilities {
        request: DiscountEligibilityRequest[];
        response: boolean[];
        constructor(request: DiscountEligibilityRequest[], response: boolean[]) {
          this.request = request;
          this.response = response;
        }
        isEligible(productId: string, discountType: DiscountType, discountId: string): boolean {
          for (let i = 0; i < this.request.length; ++i) {
            const req = this.request[i];
            if (req.productId === productId && req.discountId === discountId && req.discountType === discountType) {
              return this.response[i] ?? false;
            }
          }
          return false;
        }
      }
    }

  }

}
