import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { CouponService } from './coupon.service';
import { OrderPriceCalculator } from './order-price-calculator';

describe('OrderService', () => {
    const mockPaymentService = {
        buildPaymentMethod: vi.fn(),
        payViaLink: vi.fn(),
    } as unknown as PaymentService;

    const mockCouponService = {
        applyDiscount: vi.fn(),
    } as unknown as CouponService;

    const orderService = new OrderService(mockPaymentService, mockCouponService);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should process an order with a valid coupon', async () => {
        const order = { items: [{ id: 'item1', price: 10, quantity: 2 }], couponId: 'valid-coupon' };
        const totalPrice = 20;
        const discountedPrice = 15;
        const totalAfterDiscount = totalPrice - discountedPrice;

        vi.spyOn(OrderPriceCalculator, 'calculateTotal').mockReturnValue(totalPrice);
        mockCouponService.applyDiscount.mockResolvedValue(totalAfterDiscount);
        mockPaymentService.buildPaymentMethod.mockReturnValue('mock-payment-method');

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({ id: 'order123', totalPrice: totalAfterDiscount }),
        });

        await orderService.process(order);

        expect(OrderPriceCalculator.calculateTotal).toHaveBeenCalledWith(order);
        expect(mockCouponService.applyDiscount).toHaveBeenCalledWith(totalPrice, 'valid-coupon');
        expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(totalAfterDiscount);
        expect(mockPaymentService.payViaLink).toHaveBeenCalledWith({ id: 'order123', totalPrice: totalAfterDiscount });
    });

    it('should throw an error if the order creation fails', async () => {
        const order = { items: [{ id: 'item1', price: 10, quantity: 1 }], couponId: 'invalid-coupon' };
        const totalPrice = 10;

        vi.spyOn(OrderPriceCalculator, 'calculateTotal').mockReturnValue(totalPrice);

        mockCouponService.applyDiscount.mockImplementation(() => {
            throw new Error('Error creating order');
        });

        global.fetch = vi.fn().mockResolvedValue({ ok: false });

        await expect(orderService.process(order)).rejects.toThrow('Error creating order');

        expect(OrderPriceCalculator.calculateTotal).toHaveBeenCalledWith(order);
        expect(mockCouponService.applyDiscount).toHaveBeenCalled();
        expect(mockPaymentService.buildPaymentMethod).not.toHaveBeenCalled();
        expect(mockPaymentService.payViaLink).not.toHaveBeenCalled();
    });

    it('should handle order without coupon', async () => {
        const order = { items: [{ id: 'item1', price: 50, quantity: 1 }] };
        const totalPrice = 50;

        vi.spyOn(OrderPriceCalculator, 'calculateTotal').mockReturnValue(totalPrice);
        mockCouponService.applyDiscount.mockResolvedValue(totalPrice);
        mockPaymentService.buildPaymentMethod.mockReturnValue('mock-payment-method');

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({ id: 'order456', totalPrice }),
        });

        await orderService.process(order);

        expect(OrderPriceCalculator.calculateTotal).toHaveBeenCalledWith(order);
        expect(mockCouponService.applyDiscount).toHaveBeenCalledWith(totalPrice, undefined);
        expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(totalPrice);
        expect(mockPaymentService.payViaLink).toHaveBeenCalledWith({ id: 'order456', totalPrice });
    });

    it('should throw an error if the order items are invalid', async () => {
        const order = { items: [{ id: 'item1', price: -10, quantity: 1 }] };

        vi.spyOn(OrderPriceCalculator, 'calculateTotal').mockImplementation(() => {
            throw new Error('Order items are invalid');
        });

        await expect(orderService.process(order)).rejects.toThrow('Order items are invalid');

        expect(OrderPriceCalculator.calculateTotal).toHaveBeenCalledWith(order);
        expect(mockCouponService.applyDiscount).not.toHaveBeenCalled();
        expect(mockPaymentService.buildPaymentMethod).not.toHaveBeenCalled();
        expect(mockPaymentService.payViaLink).not.toHaveBeenCalled();
    });

    it('should throw an error if the total price is zero', async () => {
        const order = { items: [{ id: 'item1', price: 0, quantity: 1 }] };

        vi.spyOn(OrderPriceCalculator, 'calculateTotal').mockImplementation(() => {
            throw new Error('Total price must be greater than 0.');
        });

        await expect(orderService.process(order)).rejects.toThrow('Total price must be greater than 0.');

        expect(OrderPriceCalculator.calculateTotal).toHaveBeenCalledWith(order);
        expect(mockCouponService.applyDiscount).not.toHaveBeenCalled();
        expect(mockPaymentService.buildPaymentMethod).not.toHaveBeenCalled();
        expect(mockPaymentService.payViaLink).not.toHaveBeenCalled();
    });

    it('should throw an error if the order ID is invalid', async () => {
        const order = { items: [{ id: 'item1', price: 10, quantity: 1 }] };
        const totalPrice = 10;

        vi.spyOn(OrderPriceCalculator, 'calculateTotal').mockReturnValue(totalPrice);
        mockCouponService.applyDiscount.mockResolvedValue(totalPrice);
        mockPaymentService.buildPaymentMethod.mockReturnValue('mock-payment-method');

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({ id: null }),
        });

        await expect(orderService.process(order)).rejects.toThrow('Invalid order ID');

        expect(OrderPriceCalculator.calculateTotal).toHaveBeenCalledWith(order);
        expect(mockCouponService.applyDiscount).toHaveBeenCalledWith(totalPrice, undefined);
        expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(totalPrice);
        expect(mockPaymentService.payViaLink).not.toHaveBeenCalled();
    });

    it('should throw an error if the order response is not ok', async () => {
        const order = { items: [{ id: 'item1', price: 10, quantity: 1 }] };
        const totalPrice = 10;

        vi.spyOn(OrderPriceCalculator, 'calculateTotal').mockReturnValue(totalPrice);
        mockCouponService.applyDiscount.mockResolvedValue(totalPrice);
        mockPaymentService.buildPaymentMethod.mockReturnValue('mock-payment-method');

        global.fetch = vi.fn().mockResolvedValue({ ok: false });

        await expect(orderService.process(order)).rejects.toThrow('Failed to create order');

        expect(OrderPriceCalculator.calculateTotal).toHaveBeenCalledWith(order);
        expect(mockCouponService.applyDiscount).toHaveBeenCalledWith(totalPrice, undefined);
        expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(totalPrice);
        expect(mockPaymentService.payViaLink).not.toHaveBeenCalled();
    });

    it('should throw an error if JSON.stringify fails', async () => {
        const order = { items: [{ id: 'item1', price: 10, quantity: 1 }] };
        const totalPrice = 10;

        vi.spyOn(OrderPriceCalculator, 'calculateTotal').mockReturnValue(totalPrice);
        mockCouponService.applyDiscount.mockResolvedValue(totalPrice);
        mockPaymentService.buildPaymentMethod.mockReturnValue('mock-payment-method');

        global.fetch = vi.fn().mockImplementation(() => {
            throw new Error('Failed to stringify order payload');
        });

        await expect(orderService.process(order)).rejects.toThrow('Failed to stringify order payload');

        expect(OrderPriceCalculator.calculateTotal).toHaveBeenCalledWith(order);
        expect(mockCouponService.applyDiscount).toHaveBeenCalledWith(totalPrice, undefined);
        expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(totalPrice);
        expect(mockPaymentService.payViaLink).not.toHaveBeenCalled();
    }); 
});