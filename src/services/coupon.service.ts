
export class CouponService {
  async applyDiscount(orderTotal: number, couponId?: string): Promise<number> {
    if (!couponId) return orderTotal;

    try {
      const response = await fetch(
        `https://67eb7353aa794fb3222a4c0e.mockapi.io/coupons/${couponId}`
      );
      if (!response.ok) throw new Error("Failed to fetch coupon");

      const coupon = await response.json();
      if (!coupon || typeof coupon.discount !== "number") throw new Error("Invalid coupon");

      return Math.max(0, orderTotal - coupon.discount);
    } catch (error) {
      console.error("Coupon validation error:", error);
      throw new Error("Error processing coupon");
    }
  }
}
