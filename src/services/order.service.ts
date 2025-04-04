import { PaymentMethod } from '../models/payment.model';
import { Order } from '../models/order.model';
import { PaymentService } from './payment.service';


export class OrderService {
  constructor(private readonly paymentService: PaymentService) {}

  async getCouponByIdMethod(couponId: string) {
    const response = await fetch(`https://67eb7353aa794fb3222a4c0e.mockapi.io/coupons/${couponId}`);
    const coupon = await response.json();

    if (!coupon) {
      throw new Error('Invalid coupon');
    }

    return coupon;
  }

  async createOrderMethod(orderPayload: Partial<Order>) {
    const orderResponse = await fetch('https://67eb7353aa794fb3222a4c0e.mockapi.io/order', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
      headers: { 'Content-Type': 'application/json' }
    });

    const createdOrder = await orderResponse.json();
    return createdOrder;
  }

  async process(order: Partial<Order>) {
    if (!order.items?.length) {
      throw new Error('Order items are required');
    }

    if (order.items.some(item => item.price <= 0 || item.quantity <= 0)) {
      throw new Error('Order items are invalid');
    }

    let totalPrice = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (order.couponId) {
      const coupon = await this.getCouponByIdMethod(order.couponId);

      if (!coupon) {
        throw new Error('Invalid coupon');
      }

      totalPrice -= coupon.discount;

      if (totalPrice < 0) {
        totalPrice = 0;
      }
    }

    const orderPayload = {
      ...order,
      totalPrice,
      paymentMethod: this.paymentService.buildPaymentMethod(totalPrice) as PaymentMethod,
    };

    const createdOrder = await this.createOrderMethod(orderPayload);
    this.paymentService.payViaLink(createdOrder);

    return createdOrder;
  }
}