import { OrderService } from "./order.service";
import { PaymentService } from "./payment.service";
import { OrderItem, Order } from "../models/order.model";
import { PaymentMethod } from "../models/payment.model";

jest.mock("./payment.service");

describe("OrderService", () => {
  let orderService: OrderService;
  let mockPaymentService: jest.Mocked<PaymentService>;

  const originalFetch = global.fetch;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockPaymentService = {
      buildPaymentMethod: jest.fn(),
      payViaLink: jest.fn(),
    } as unknown as jest.Mocked<PaymentService>;

    orderService = new OrderService(mockPaymentService);

    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  describe("process", () => {
    const validOrderItem: OrderItem = {
      id: "item-1",
      productId: "product-1",
      price: 100,
      quantity: 2,
    };

    it("should throw error when order has no items", async () => {
      const order: Partial<Order> = {
        id: "order-1",
        items: [],
      };

      await expect(orderService.process(order)).rejects.toThrow(
        "Order items are required"
      );
    });

    it("should throw error when order has invalid items (price <= 0)", async () => {
      const order: Partial<Order> = {
        id: "order-1",
        items: [{ ...validOrderItem }, { ...validOrderItem, price: 0 }],
      };

      await expect(orderService.process(order)).rejects.toThrow(
        "Order items are invalid"
      );
    });

    it("should throw error when order has invalid items (quantity <= 0)", async () => {
      const order: Partial<Order> = {
        id: "order-1",
        items: [{ ...validOrderItem }, { ...validOrderItem, quantity: 0 }],
      };

      await expect(orderService.process(order)).rejects.toThrow(
        "Order items are invalid"
      );
    });

    it("should calculate total price correctly without coupon", async () => {
      const order: Partial<Order> = {
        id: "order-1",
        items: [
          { ...validOrderItem },
          { ...validOrderItem, price: 150, quantity: 1 },
        ],
      };

      const expectedTotalPrice = 350;

      mockPaymentService.buildPaymentMethod.mockReturnValue(
        PaymentMethod.CREDIT
      );

      mockFetch.mockResolvedValueOnce({
        json: jest
          .fn()
          .mockResolvedValue({ id: "order-1", totalPrice: expectedTotalPrice }),
      });

      await orderService.process(order);

      expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(
        expectedTotalPrice
      );
      expect(mockFetch).toHaveBeenCalledWith(
        "https://67eb7353aa794fb3222a4c0e.mockapi.io/order",
        expect.objectContaining({
          method: "POST",
          body: expect.any(String),
        })
      );

      const sentBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(sentBody.totalPrice).toBe(expectedTotalPrice);
    });

    it("should apply coupon discount correctly", async () => {
      const order: Partial<Order> = {
        id: "order-1",
        items: [{ ...validOrderItem }],
        couponId: "coupon-1",
      };

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ id: "coupon-1", discount: 50 }),
      });

      const expectedTotalPrice = 150;

      mockPaymentService.buildPaymentMethod.mockReturnValue(
        PaymentMethod.CREDIT
      );

      mockFetch.mockResolvedValueOnce({
        json: jest
          .fn()
          .mockResolvedValue({ id: "order-1", totalPrice: expectedTotalPrice }),
      });

      await orderService.process(order);

      expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(
        expectedTotalPrice
      );
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        "https://67eb7353aa794fb3222a4c0e.mockapi.io/coupons/coupon-1"
      );

      const sentBody = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(sentBody.totalPrice).toBe(expectedTotalPrice);
    });

    it("should set total price to 0 when coupon discount exceeds original price", async () => {
      const order: Partial<Order> = {
        id: "order-1",
        items: [{ ...validOrderItem }],
        couponId: "coupon-1",
      };

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ id: "coupon-1", discount: 250 }),
      });

      const expectedTotalPrice = 0;

      mockPaymentService.buildPaymentMethod.mockReturnValue(
        PaymentMethod.CREDIT
      );

      mockFetch.mockResolvedValueOnce({
        json: jest
          .fn()
          .mockResolvedValue({ id: "order-1", totalPrice: expectedTotalPrice }),
      });

      await orderService.process(order);

      expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(
        expectedTotalPrice
      );
      const sentBody = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(sentBody.totalPrice).toBe(expectedTotalPrice);
    });

    it("should throw error for invalid coupon", async () => {
      const order: Partial<Order> = {
        id: "order-1",
        items: [{ ...validOrderItem }],
        couponId: "invalid-coupon",
      };

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(null),
      });

      await expect(orderService.process(order)).rejects.toThrow(
        "Invalid coupon"
      );
    });

    it("should call payment service to process payment", async () => {
      const order: Partial<Order> = {
        id: "order-1",
        items: [{ ...validOrderItem }],
      };

      const expectedTotalPrice = 200;
      const createdOrder: Order = {
        id: "order-1",
        totalPrice: expectedTotalPrice,
        items: [{ ...validOrderItem }],
        paymentMethod: PaymentMethod.CREDIT,
      };

      mockPaymentService.buildPaymentMethod.mockReturnValue(
        PaymentMethod.CREDIT
      );

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(createdOrder),
      });

      await orderService.process(order);

      expect(mockPaymentService.payViaLink).toHaveBeenCalledWith(createdOrder);
    });
  });
});
