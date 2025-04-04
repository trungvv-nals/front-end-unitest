import { PaymentMethod } from "../models/payment.model";
import { Order } from '../models/order.model';

export class PaymentService {
  private readonly PAYMENT_METHODS = [
    PaymentMethod.CREDIT,
    PaymentMethod.PAYPAY,
    PaymentMethod.AUPAY,
  ];

  private readonly PAYMENT_LIMITS: Record<PaymentMethod, number> = {
    [PaymentMethod.PAYPAY]: 500000,
    [PaymentMethod.AUPAY]: 300000,
    [PaymentMethod.CREDIT]: Infinity, // No limit for CREDIT
  };

  buildPaymentMethod(totalPrice: number): string {
    if (totalPrice <= 0) {
      return '';
    }

    return this.PAYMENT_METHODS
      .filter(method => totalPrice <= this.PAYMENT_LIMITS[method])
      .join(',');
  }

  async payViaLink(order: Order): Promise<void> {
    if (!order?.id) {
      throw new Error('Invalid order ID');
    }
    window.open(`https://payment.example.com/pay?orderId=${order.id}`, '_blank');
  }
}
