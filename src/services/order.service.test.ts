import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { OrderService } from "./order.service";
import { PaymentService } from "./payment.service";
import { Order } from "../models/order.model";

describe("OrderService", () => {
  let paymentService: PaymentService;
  let orderService: OrderService;

  beforeEach(() => {
    paymentService = {
      buildPaymentMethod: vi.fn().mockReturnValue("mock-payment-method"),
      payViaLink: vi.fn(),
    } as unknown as PaymentService;

    orderService = new OrderService(paymentService);

    // Mock global fetch
    globalThis.fetch = vi.fn();
  });

  describe("validateOrder", () => {
    it("should throw an error if order items are missing", () => {
      const order = { items: [] };

      expect(() => orderService["validateOrder"](order)).toThrow(
        "Order items are required"
      );
    });

    it("should throw an error if any item has a price <= 0", () => {
      const order = {
        items: [{ id: "1", productId: "1", price: 0, quantity: 1 }],
      };

      expect(() => orderService["validateOrder"](order)).toThrow(
        "Order items are invalid"
      );
    });

    it("should throw an error if any item has a quantity <= 0", () => {
      const order = {
        items: [{ id: "1", productId: "1", price: 100, quantity: 0 }],
      };

      expect(() => orderService["validateOrder"](order)).toThrow(
        "Order items are invalid"
      );
    });

    it("should not throw an error if all items are valid", () => {
      const order = {
        items: [{ id: "1", productId: "1", price: 100, quantity: 1 }],
      };

      expect(() => orderService["validateOrder"](order)).not.toThrow();
    });
  });

  describe("calculateFinalPrice", () => {
    it("should calculate total price without a coupon", async () => {
      const order = {
        items: [{ id: "1", productId: "1", price: 100, quantity: 2 }],
      };

      const totalPrice = await orderService["calculateFinalPrice"](order);

      expect(totalPrice).toBe(200);
    });

    it("should apply a valid coupon and reduce the total price", async () => {
      const order = {
        items: [{ id: "1", productId: "1", price: 100, quantity: 2 }],
        couponId: "valid-coupon",
      };

      (globalThis.fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce({ discount: 50 }),
      });

      const totalPrice = await orderService["calculateFinalPrice"](order);

      expect(totalPrice).toBe(150);
    });

    it("should set total price to 0 if coupon discount exceeds total price", async () => {
      const order = {
        items: [{ id: "1", productId: "1", price: 50, quantity: 1 }],
        couponId: "valid-coupon",
      };

      (globalThis.fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce({ discount: 100 }),
      });

      const totalPrice = await orderService["calculateFinalPrice"](order);

      expect(totalPrice).toBe(0);
    });
  });

  describe("buildOrderPayload", () => {
    it("should build the correct order payload", () => {
      const order = {
        items: [{ id: "1", productId: "1", price: 100, quantity: 1 }],
      };
      const totalPrice = 100;

      const payload = orderService["buildOrderPayload"](order, totalPrice);

      expect(payload).toEqual({
        ...order,
        totalPrice,
        paymentMethod: "mock-payment-method",
      });
    });
  });

  describe("createOrder", () => {
    it("should send a POST request to create an order", async () => {
      const orderPayload = {
        items: [{ price: 100, quantity: 1 }],
        totalPrice: 100,
      };

      (globalThis.fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce({ id: "mock-order-id" }),
      });

      const createdOrder = await orderService["createOrder"](orderPayload);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://67eb7353aa794fb3222a4c0e.mockapi.io/order",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(orderPayload),
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(createdOrder).toEqual({ id: "mock-order-id" });
    });
  });

  describe("process", () => {
    it("should process an order end-to-end", async () => {
      const order: Partial<Order> = {
        items: [{ id: "1", productId: "1", price: 100, quantity: 1 }],
      };

      (globalThis.fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce({ id: "mock-order-id" }),
      });

      await orderService.process(order);

      expect(paymentService.payViaLink).toHaveBeenCalledWith({
        id: "mock-order-id",
      });
    });
  });

  describe("fetchCoupon", () => {
    it("should fetch a coupon and return its discount", async () => {
      const couponId = "valid-coupon";
      const coupon = { discount: 50 };

      (globalThis.fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(coupon),
      });

      const result = await orderService["fetchCoupon"](couponId);

      expect(result).toEqual(coupon);
    });

    it("should throw an error if the coupon is invalid", async () => {
      const couponId = "invalid-coupon";

      (globalThis.fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(null),
      });

      await expect(orderService["fetchCoupon"](couponId)).rejects.toThrow(
        "Invalid coupon"
      );
    });
  });
});
