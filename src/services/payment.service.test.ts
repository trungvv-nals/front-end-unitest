// payment.service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { PaymentMethod } from '../models/payment.model';
import { PaymentService } from '../services/payment.service';
import { Order } from '../models/order.model';

describe('PaymentService.buildPaymentMethod', () => {
  const mockGateway = { openPaymentLink: vi.fn() };
  const service = new PaymentService(mockGateway);

  it('should: return all methods when totalPrice is low', () => {
    const result = service.buildPaymentMethod(100000);
    expect(result).toBe([PaymentMethod.CREDIT, PaymentMethod.PAYPAY, PaymentMethod.AUPAY].join(','));
  });

  it('should: remove PAYPAY when totalPrice exceeds 500,000', () => {
    const result = service.buildPaymentMethod(600000);
    expect(result).toBe([PaymentMethod.CREDIT].join(','));
  });

  it('should: remove AUPAY when totalPrice exceeds 300,000', () => {
    const result = service.buildPaymentMethod(350000);
    expect(result).toBe([PaymentMethod.CREDIT, PaymentMethod.PAYPAY].join(','));
  });

  it('should: return only CREDIT when price is too high', () => {
    const result = service.buildPaymentMethod(999999);
    expect(result).toBe(PaymentMethod.CREDIT);
  });
});

describe('PaymentService.payViaLink', () => {
  it('should: open payment link in a new tab with the correct orderId', () => {
    const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const service = new PaymentService({ openPaymentLink: (id: string) => window.open(`https://payment.example.com/pay?orderId=${id}`, '_blank') });
    const order: Order = { id: 'abc123', items: [], totalPrice: 0, paymentMethod: PaymentMethod.CREDIT };
    service.payViaLink(order);
    expect(spy).toHaveBeenCalledWith('https://payment.example.com/pay?orderId=abc123', '_blank');
    spy.mockRestore();
  });
});
