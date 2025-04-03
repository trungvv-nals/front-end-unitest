import { Order } from '../models/order.model';
import { PaymentService } from './payment.service';

export class OrderService {
  constructor(private readonly paymentService: PaymentService) {}

  async process(order: Partial<Order>) {
    this.validateOrderItems(order);
    const totalPrice = this.calculateTotalPrice(order) as number;
    const finalPrice = await this.applyDiscountIfValid(order, totalPrice);
    const createdOrder = await this.createOrder(order, finalPrice);
    this.paymentService.payViaLink(createdOrder);
  }

  private validateOrderItems(order: Partial<Order>) {
    if (!order.items?.length) {
      throw new Error('Order items are required');
    }

    if (order.items.some(item => item.price <= 0 || item.quantity <= 0)) {
      throw new Error('Order items are invalid');
    }
  }

  private calculateTotalPrice(order: Partial<Order>) {
    const totalPrice = order.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // This case cannot occur.

    // if (totalPrice <= 0) {
    //   throw new Error('Total price must be greater than 0');
    // }
    return totalPrice;
  }

  private async applyDiscountIfValid(order: Partial<Order>, totalPrice: number) {
    if (order.couponId) {
      const coupon = await this.fetchCoupon(order.couponId);
      if (!coupon) {
        throw new Error('Invalid coupon');
      }
      const discount = coupon.discount;
      let discountedPrice = totalPrice - discount;
      return discountedPrice < 0 ? 0 : discountedPrice;
    }
    return totalPrice;
  }

  private async fetchCoupon(couponId: string) {
    const response = await fetch(`https://67eb7353aa794fb3222a4c0e.mockapi.io/coupons/${couponId}`);
    return response.json();
  }

  private async createOrder(order: Partial<Order>, totalPrice: number) {
    const orderPayload = {
      ...order,
      totalPrice,
      paymentMethod: this.paymentService.buildPaymentMethod(totalPrice),
    };
    const response = await fetch('https://67eb7353aa794fb3222a4c0e.mockapi.io/order', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }
}
