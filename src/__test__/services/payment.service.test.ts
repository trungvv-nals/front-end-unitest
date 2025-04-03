import { PaymentService } from "../../services/payment.service";
import { PaymentMethod } from "../../models/payment.model";
import { Order } from "../../models/order.model";

describe("PaymentService", () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  describe("buildPaymentMethod", () => {
    it("should return all payment methods when total price is within all limits", () => {
      const result = paymentService.buildPaymentMethod(100000);
      expect(result).toBe(
        `${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY},${PaymentMethod.AUPAY}`
      );
    });

    it("should remove PAYPAY if total price exceeds 500,000", () => {
      const result = paymentService.buildPaymentMethod(600000);
      expect(result).toBe(`${PaymentMethod.CREDIT}`);
    });

    it("should remove AUPAY if total price exceeds 300,000", () => {
      const result = paymentService.buildPaymentMethod(350000);
      expect(result).toBe(`${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY}`);
    });

    it("should remove both PAYPAY and AUPAY if total price exceeds both limits", () => {
      const result = paymentService.buildPaymentMethod(600000);
      expect(result).toBe(`${PaymentMethod.CREDIT}`);
    });
  });

  describe("payViaLink", () => {
    beforeEach(() => {
      globalThis.open = vi.fn();
    });

    it("should open the correct payment URL with order ID", () => {
      const order: Order = { id: "order123", items: [], totalPrice: 100,paymentMethod: PaymentMethod.CREDIT };
      paymentService.payViaLink(order);
      expect(globalThis.open).toHaveBeenCalledWith(
        "https://payment.example.com/pay?orderId=order123",
        "_blank"
      );
    });

    it('should throw an error if order ID is missing', () => {
      // @ts-ignore
      const order: Order = { items: [], totalPrice: 100,paymentMethod: PaymentMethod.CREDIT }; // Missing ID
      expect(() => paymentService.payViaLink(order)).toThrowError(
        "Invalid order: Missing order ID"
      );
    })
  });
});
