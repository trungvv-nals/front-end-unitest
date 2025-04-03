import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentService } from './payment.service';
import { PaymentMethod } from '../models/payment.model';
import { Order } from '../models/order.model';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  describe('buildPaymentMethod', () => {
    it('should include all payment methods if totalPrice is below thresholds', () => {
      const result = paymentService.buildPaymentMethod(100000);
      expect(result).toBe(`${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY},${PaymentMethod.AUPAY}`);
    });

    it('should exclude PAYPAY if totalPrice exceeds 500,000', () => {
      const result = paymentService.buildPaymentMethod(600000);
      expect(result).toBe(PaymentMethod.CREDIT);
    });

    it('should exclude AUPAY if totalPrice exceeds 300,000', () => {
      const result = paymentService.buildPaymentMethod(400000);
      expect(result).toBe(`${PaymentMethod.CREDIT},${PaymentMethod.PAYPAY}`);
    });

    it('should exclude both PAYPAY and AUPAY if totalPrice exceeds 500,000', () => {
      const result = paymentService.buildPaymentMethod(600000);
      expect(result).toBe(`${PaymentMethod.CREDIT}`);
    });
  });

  describe('payViaLink', () => {
    it('should open a new window with the correct payment URL', () => {
      const order: Order = { id: '123', items: [], totalPrice: 0, paymentMethod: PaymentMethod.CREDIT }; // Mock order
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      paymentService.payViaLink(order);

      expect(openSpy).toHaveBeenCalledWith(
        'https://payment.example.com/pay?orderId=123',
        '_blank'
      );

      openSpy.mockRestore();
    });
  });
});