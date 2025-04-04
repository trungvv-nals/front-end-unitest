import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { OrderService } from "../services/order.service";
import { PaymentService } from "../services/payment.service";
import { Order } from "../models/order.model";

// Mock OrderService
describe("OrderService", () => {
  let orderService: OrderService;
  let paymentServiceMock: PaymentService;

  // Mock data reusable
const mockItems = [
  { id: "id1", productId: "product1", price: 100, quantity: 2 },
  { id: "id2", productId: "product2", price: 50, quantity: 1 },
];

const mockEmptyOrder = { items: [] };

const mockInvalidOrder = {
  items: [
    { id: "id1", productId: "product1", price: -1, quantity: 1 },
    { id: "id2", productId: "product2", price: 1, quantity: -1 },
  ],
};

const mockValidOrder = {
  items: mockItems,
  couponId: "valid",
};

const mockOrderWithInvalidCoupon = {
  items: [{ id: 'id', productId: 'product1', price: 50, quantity: 2 }],
  couponId: "invalid",
};

const mockOrderWithInvalidTotalPrice = {
  items: [
    { id: "id1", productId: "product1", price: 0, quantity: 1 },
    { id: "id2", productId: "product2", price: 1, quantity: 0 },
  ],
};

  beforeEach(() => {
    paymentServiceMock = {
      buildPaymentMethod: vi.fn().mockReturnValue("mocked_payment_method"),
      payViaLink: vi.fn(),
    } as unknown as PaymentService;
    orderService = new OrderService(paymentServiceMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe(".getCouponByIdMethod", () => {
    it("should: return the coupon data when a valid coupon ID is provided", async () => {
      const couponId = "valid";
      const couponData = { id: couponId, discount: 10 };
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(couponData),
      });

      const result = await orderService.getCouponByIdMethod(couponId);
      expect(result).toEqual(couponData);
    });

    it("should: throw an error when the coupon ID is invalid", async () => {
      const couponId = "invalid";
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(null),
      });

      await expect(orderService.getCouponByIdMethod(couponId)).rejects.toThrow(
        "Invalid coupon"
      );
    });
  });

  describe(".createOrderMethod", () => {
    it("should: successfully create and return an order when valid data is provided", async () => {
      const orderPayload = { items: [], couponId: "valid" };
      const createdOrder = { id: "mocked_order_id", ...orderPayload };
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(createdOrder),
      });

      const result = await orderService.createOrderMethod(orderPayload);
      expect(result).toEqual(createdOrder);
    });
  });

  describe(".process", () => {
    it("should: throw an error if the order has no items", async () => {
      await expect(orderService.process(mockEmptyOrder)).rejects.toThrow(
        "Order items are required"
      );
    });

    it("should: throw an error if the order items are invalid", async () => {
      await expect(orderService.process(mockInvalidOrder)).rejects.toThrow(
        "Order items are invalid"
      );
    });

    it("should: throw an error if the total price is less than or equal to 0", async () => {
      await expect(
        orderService.process(mockOrderWithInvalidTotalPrice)
      ).rejects.toThrow("Order items are invalid");
    });

    it("should: throw an error if the coupon is invalid", async () => {
      vi.spyOn(orderService, "getCouponByIdMethod").mockResolvedValue(null);
      await expect(
        orderService.process(mockOrderWithInvalidCoupon)
      ).rejects.toThrow("Invalid coupon");
    });

    it("should: correctly apply the coupon discount", async () => {
      vi.spyOn(orderService, "getCouponByIdMethod").mockResolvedValue({
        discount: 10,
      });
      vi.spyOn(orderService, "createOrderMethod").mockImplementation(
        async (orderPayload: Partial<Order>) => {
          return {
            ...orderPayload,
            id: "mocked_order_id",
            createdAt: new Date(),
          };
        }
      );
      const result = await orderService.process(mockValidOrder);
      expect(result.totalPrice).toBe(240);
    });

    it('should: not allow the total price to be less than 0 after applying the coupon', async () => {
      vi.spyOn(orderService, 'getCouponByIdMethod').mockResolvedValue({
        discount: 110,
      });
      vi.spyOn(orderService, 'createOrderMethod').mockImplementation(
        async (orderPayload: Partial<Order>) => {
          return {
            ...orderPayload,
            id: 'mocked_order_id',
            createdAt: new Date(),
          };
        }
      );

      const result = await orderService.process(mockOrderWithInvalidCoupon);
      expect(result.totalPrice).toBe(0);
    });
  });
});
