import { PaymentService } from "./payment.service";
import { PaymentMethod } from "../models/payment.model";
import { Order } from "../models/order.model";

describe("PaymentService", () => {
  let paymentService: PaymentService;
  let originalWindowOpen: typeof window.open;

  beforeEach(() => {
    paymentService = new PaymentService();
    originalWindowOpen = window.open;
    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = originalWindowOpen;
  });

  describe("buildPaymentMethod", () => {
    it("should return all payment methods when total price is less than or equal to 300,000", () => {
      const totalPrice = 300000;

      const result = paymentService.buildPaymentMethod(totalPrice);

      expect(result).toBe(
        `${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY},${PaymentMethod.AUPAY}`
      );
    });

    it("should exclude AUPAY when total price is between 300,000 and 500,000", () => {
      const totalPrice = 400000;

      const result = paymentService.buildPaymentMethod(totalPrice);

      expect(result).toBe(`${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY}`);
    });

    it("should only include CREDIT when total price is greater than 500,000", () => {
      const totalPrice = 600000;

      const result = paymentService.buildPaymentMethod(totalPrice);

      expect(result).toBe(PaymentMethod.CREDIT);
    });

    it("should handle edge case at exactly 500,000", () => {
      const totalPrice = 500000;

      const result = paymentService.buildPaymentMethod(totalPrice);

      expect(result).toBe(`${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY}`);
    });

    it("should handle zero total price", () => {
      const totalPrice = 0;

      const result = paymentService.buildPaymentMethod(totalPrice);

      expect(result).toBe(
        `${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY},${PaymentMethod.AUPAY}`
      );
    });

    it("should handle negative total price (though this should be prevented at validation level)", () => {
      const totalPrice = -100;

      const result = paymentService.buildPaymentMethod(totalPrice);

      expect(result).toBe(
        `${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY},${PaymentMethod.AUPAY}`
      );
    });
  });

  describe("payViaLink", () => {
    it("should open payment link in a new window", async () => {
      const order: Order = {
        id: "order-123",
        totalPrice: 200000,
        items: [
          {
            id: "item-1",
            productId: "product-1",
            price: 100000,
            quantity: 2,
          },
        ],
        paymentMethod: PaymentMethod.CREDIT,
      };

      await paymentService.payViaLink(order);

      expect(window.open).toHaveBeenCalledWith(
        `https://payment.example.com/pay?orderId=${order.id}`,
        "_blank"
      );
    });

    it("should handle orders with special characters in ID", async () => {
      const order: Order = {
        id: "order-special@#$",
        totalPrice: 100000,
        items: [
          {
            id: "item-2",
            productId: "product-2",
            price: 50000,
            quantity: 2,
          },
        ],
        paymentMethod: PaymentMethod.PAYPAY,
      };

      await paymentService.payViaLink(order);

      expect(window.open).toHaveBeenCalledWith(
        `https://payment.example.com/pay?orderId=${order.id}`,
        "_blank"
      );
    });

    it("should handle orders with coupon", async () => {
      const order: Order = {
        id: "order-with-coupon",
        totalPrice: 150000,
        items: [
          {
            id: "item-3",
            productId: "product-3",
            price: 75000,
            quantity: 2,
          },
        ],
        couponId: "DISCOUNT20",
        paymentMethod: PaymentMethod.AUPAY,
      };

      await paymentService.payViaLink(order);

      expect(window.open).toHaveBeenCalledWith(
        `https://payment.example.com/pay?orderId=${order.id}`,
        "_blank"
      );
    });
  });
});
