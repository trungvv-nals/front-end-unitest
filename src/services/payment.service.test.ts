import { describe, it, expect, vi } from 'vitest';
import { PaymentService } from './payment.service';
import { PaymentMethod } from '../models/payment.model';
import { Order } from '../models/order.model';

describe('PaymentService', () => {
    const paymentService = new PaymentService();

    describe('buildPaymentMethod', () => {
        it('should return all payment methods for a price within all limits', () => {
            const result = paymentService.buildPaymentMethod(100000);
            expect(result).toBe(`${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY},${PaymentMethod.AUPAY}`);
        });

        it('should return only methods within the price limit', () => {
            const result = paymentService.buildPaymentMethod(400000);
            expect(result).toBe(`${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY}`);
        });

        it('should return CREDIT only for a price exceeding all other limits', () => {
            const result = paymentService.buildPaymentMethod(600000);
            expect(result).toBe(PaymentMethod.CREDIT);
        });

        it('should return an empty string for a price of 0', () => {
            const result = paymentService.buildPaymentMethod(0);
            expect(result).toBe('');
        });


        it('should return an empty string for a negative price', () => {
            const result = paymentService.buildPaymentMethod(-100);
            expect(result).toBe('');
        });
    });

    describe('payViaLink', () => {
        it('should open a new window with the correct URL when a valid order is provided', async () => {
            const mockWindowOpen = vi.spyOn(window, 'open').mockImplementation(() => null);
            const order: Order = { id: '12345' };

            await paymentService.payViaLink(order);

            expect(mockWindowOpen).toHaveBeenCalledWith('https://payment.example.com/pay?orderId=12345', '_blank');
            mockWindowOpen.mockRestore();
        });

        it('should throw an error if the order ID is invalid', async () => {
            const invalidOrder: Order = { id: '' };

            await expect(paymentService.payViaLink(invalidOrder)).rejects.toThrow('Invalid order ID');
        });

        it('should throw an error if the order is null or undefined', async () => {
            await expect(paymentService.payViaLink(null as unknown as Order)).rejects.toThrow('Invalid order ID');
            await expect(paymentService.payViaLink(undefined as unknown as Order)).rejects.toThrow('Invalid order ID');
        });
    });
});