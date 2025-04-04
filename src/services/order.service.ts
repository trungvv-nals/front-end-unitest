import { Order } from "../models/order.model";

import { CouponService } from "./coupon.service";
import { PaymentService } from "./payment.service";
import { OrderPriceCalculator } from "./order-price-calculator";

export class OrderService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly couponService: CouponService
  ) {}

  async process(order: Partial<Order>): Promise<void> {
    let totalPrice = OrderPriceCalculator.calculateTotal(order);
    totalPrice = await this.couponService.applyDiscount(
      totalPrice,
      order.couponId
    );

    const orderPayload = {
      ...order,
      totalPrice,
      paymentMethod: this.paymentService.buildPaymentMethod(totalPrice),
    };

    const orderResponse = await fetch(
      "https://67eb7353aa794fb3222a4c0e.mockapi.io/order",
      {
        method: "POST",
        body: JSON.stringify(orderPayload),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!orderResponse.ok) throw new Error("Failed to create order");

    const createdOrder = await orderResponse.json();

    if (!createdOrder.id) {
      throw new Error("Invalid order ID");
    }

    this.paymentService.payViaLink(createdOrder);
  }
}
