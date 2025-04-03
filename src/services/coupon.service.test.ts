import { describe, it, expect, vi } from "vitest";
import { CouponService } from "./coupon.service";

describe("CouponService", () => {
    const mockCoupon = { code: "discount200", discount: 200, id: "2" };
    const mockFetch = vi.fn();

    beforeEach(() => {
        global.fetch = mockFetch;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should return the original order total if no couponId is provided", async () => {
        const service = new CouponService();
        const orderTotal = 500;

        const result = await service.applyDiscount(orderTotal);

        expect(result).toBe(orderTotal);
    });

    it("should apply the discount if a valid couponId is provided", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockCoupon,
        });

        const service = new CouponService();
        const orderTotal = 500;

        const result = await service.applyDiscount(orderTotal, mockCoupon.id);

        expect(result).toBe(300); // 500 - 200
        expect(mockFetch).toHaveBeenCalledWith(
            `https://67eb7353aa794fb3222a4c0e.mockapi.io/coupons/${mockCoupon.id}`
        );
    });

    it("should throw an error if the coupon fetch fails", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
        });

        const service = new CouponService();
        const orderTotal = 500;

        await expect(service.applyDiscount(orderTotal, mockCoupon.id)).rejects.toThrow(
            "Error processing coupon"
        );
    });

    it("should throw an error if the coupon data is invalid", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ code: "invalid", discount: "not-a-number" }),
        });

        const service = new CouponService();
        const orderTotal = 500;

        await expect(service.applyDiscount(orderTotal, mockCoupon.id)).rejects.toThrow(
            "Error processing coupon"
        );
    });

    it("should return 0 if the discount is greater than the order total", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ code: "big-discount", discount: 1000 }),
        });

        const service = new CouponService();
        const orderTotal = 500;

        const result = await service.applyDiscount(orderTotal, "big-discount");

        expect(result).toBe(0);
    });
});
