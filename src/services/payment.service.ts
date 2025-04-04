import { PaymentMethod } from "../models/payment.model";
import { Order } from "../models/order.model";

// Interface giúp tách window.open ra để test
export interface IPaymentGateway {
  openPaymentLink(orderId: string): void;
}

export class PaymentService {
  private readonly PAYMENT_METHODS = [
    PaymentMethod.CREDIT,
    PaymentMethod.PAYPAY,
    PaymentMethod.AUPAY,
  ];

  constructor(private readonly gateway: IPaymentGateway) {}

  buildPaymentMethod(totalPrice: number): string {
    return this.PAYMENT_METHODS
      .filter(method => this.isAvailable(method, totalPrice))
      .join(',');
  }

  private isAvailable(method: PaymentMethod, totalPrice: number): boolean {
    const LIMITS: Record<PaymentMethod, number | null> = {
      [PaymentMethod.CREDIT]: null, // no limit
      [PaymentMethod.PAYPAY]: 500_000,
      [PaymentMethod.AUPAY]: 300_000,
    };

    const limit = LIMITS[method];
    return limit === null || totalPrice <= limit;
  }

  async payViaLink(order: Order): Promise<void> {
    this.gateway.openPaymentLink(order.id);
  }
}
