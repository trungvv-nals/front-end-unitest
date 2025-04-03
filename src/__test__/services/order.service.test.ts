import { Order } from "../../models/order.model";
import { OrderService } from "../../services/order.service";
import { PaymentService } from "../../services/payment.service";

vi.mock('../services/payment.service');

describe('OrderService', () => {
  const mockFetch = vi.fn();
  globalThis.fetch = mockFetch;

  let orderService: OrderService;
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
    orderService = new OrderService(paymentService);
    mockFetch.mockReset();
  });

  it('should throw error when no items in the order', async () => {
    const order: Partial<Order> = { items: [] };
    await expect(orderService.process(order)).rejects.toThrowError('Order items are required');
  });

  it('should throw error when item price or quantity is invalid', async () => {
    const order1: Partial<Order> = {
      items: [{ id: '1', productId: 'product1', price: -1, quantity: 2 }]
    };

    const order2: Partial<Order> = {
      items: [{ id: '1', productId: 'product1', price: 2, quantity: 0 }]
    };
    await expect(orderService.process(order1)).rejects.toThrowError('Order items are invalid');
    await expect(orderService.process(order2)).rejects.toThrowError('Order items are invalid');

  });

  it('should return total price unchanged if no coupon is applied', async () => {
    const order: Partial<Order> = {
      items: [{ id: '1', productId: 'product1', price: 10, quantity: 2 }],
    };

    const result = await orderService['applyDiscountIfValid'](order, 20);
    expect(result).toBe(20); // Giá không thay đổi nếu không có coupon
  });

  it('should apply valid coupon correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => ({ discount: 5 }) // Giả lập API trả về mã giảm giá hợp lệ
    });

    const order: Partial<Order> = {
      items: [{ id: '1', productId: 'product1', price: 10, quantity: 2 }],
      couponId: 'validCouponId'
    };

    const result = await orderService['applyDiscountIfValid'](order, 20);
    expect(result).toBe(15); // 20 - 5 = 15
    expect(mockFetch).toHaveBeenCalledWith('https://67eb7353aa794fb3222a4c0e.mockapi.io/coupons/validCouponId');
  });

  it('should set total price to 0 if discount is greater than total price', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => ({ discount: 50 }) // Giả lập API trả về mã giảm giá lớn hơn tổng giá đơn hàng
    });

    const order: Partial<Order> = {
      items: [{ id: '1', productId: 'product1', price: 10, quantity: 2 }],
      couponId: 'validCouponId'
    };

    const result = await orderService['applyDiscountIfValid'](order, 20);
    expect(result).toBe(0); // Không thể có giá âm, nên trả về 0
  });

  it('should throw error if coupon is invalid', async () => {
    mockFetch.mockResolvedValueOnce({ json: () => null }); // Giả lập API trả về coupon không hợp lệ

    const order: Partial<Order> = {
      items: [{ id: '1', productId: 'product1', price: 10, quantity: 2 }],
      couponId: 'invalidCouponId'
    };

    await expect(orderService['applyDiscountIfValid'](order, 20)).rejects.toThrowError('Invalid coupon');
  });

  it('should apply invalid coupon and throw an error', async () => {
    mockFetch.mockResolvedValueOnce({ json: () => null }); // Giả lập phản hồi null từ API

    const order: Partial<Order> = {
      items: [{ id: '1', productId: 'product1', price: 10, quantity: 2 }],
      couponId: 'invalidCouponId'
    };

    await expect(orderService.process(order)).rejects.toThrowError('Invalid coupon');
  });

  it('should create order and initiate payment correctly', async () => {
    mockFetch.mockResolvedValueOnce({ json: () => ({ discount: 5 }) }); // Giả lập coupon hợp lệ
    mockFetch.mockResolvedValueOnce({ json: () => ({ id: 'order1' }) }); // Giả lập tạo đơn hàng

    const order: Partial<Order> = {
      items: [{ id: '1', productId: 'product1', price: 10, quantity: 2 }],
      couponId: 'validCouponId'
    };

    await orderService.process(order);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://67eb7353aa794fb3222a4c0e.mockapi.io/order', 
      expect.objectContaining({ method: 'POST' })
    );
  });
});
