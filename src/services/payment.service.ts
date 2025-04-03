import { PaymentMethod } from "../models/payment.model";
import { Order } from '../models/order.model';

interface PaymentMethodRule {
  method: PaymentMethod;
  maxAmount: number;
}

export class PaymentService {
  private readonly PAYMENT_METHODS: PaymentMethodRule[] = [
    { method: PaymentMethod.CREDIT, maxAmount: Infinity },
    { method: PaymentMethod.PAYPAY, maxAmount: 500000 },
    { method: PaymentMethod.AUPAY, maxAmount: 300000 },
  ];

  buildPaymentMethod(totalPrice: number): string {
    const price = Math.max(0, totalPrice);
    
    const availableMethods = this.PAYMENT_METHODS
      .filter(rule => price <= rule.maxAmount)
      .map(rule => rule.method);
    
    return availableMethods.join(',');
  }

  async payViaLink(order: Order) {
    window.open(`https://payment.example.com/pay?orderId=${order.id}`, '_blank');
  }
}
