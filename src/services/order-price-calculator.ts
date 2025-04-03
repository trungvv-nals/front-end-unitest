import { Order } from "../models/order.model";

export class OrderPriceCalculator {
  static calculateTotal(order: Partial<Order>): number {
    if (!order.items?.length) {
      throw new Error("Order items are required");
    }

    if (
      order.items.some(
        (item) =>
          item === null ||
          typeof item === "string" ||
          typeof item === "undefined" ||
          Array.isArray(item) ||
          item.price <= 0 ||
          item.quantity <= 0
      )
    ) {
      throw new Error("Order items are invalid");
    }

    const total = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    return total;
  }
}
