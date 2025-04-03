import { describe, it, expect } from "vitest";
import { OrderPriceCalculator } from "./order-price-calculator";

describe("OrderPriceCalculator", () => {
    it("should calculate the total price of an order correctly", () => {
        const order = {
            items: [
                { price: 10, quantity: 2 },
                { price: 5, quantity: 4 },
            ],
        };

        const total = OrderPriceCalculator.calculateTotal(order);
        expect(total).toBe(40);
    });

    it("should throw an error if order items are missing", () => {
        const order = {};

        expect(() => OrderPriceCalculator.calculateTotal(order)).toThrow(
            "Order items are required"
        );
    });

    it("should throw an error if any item has a non-positive price", () => {
        const order = {
            items: [
                { price: 0, quantity: 2 },
                { price: 5, quantity: 4 },
            ],
        };

        expect(() => OrderPriceCalculator.calculateTotal(order)).toThrow(
            "Order items are invalid"
        );

        const order2 = {
            items: [
                { price: -10, quantity: 2 },
                { price: 5, quantity: 4 },
            ],
        };

        expect(() => OrderPriceCalculator.calculateTotal(order2)).toThrow(
            "Order items are invalid"
        );
    });

    it("should throw an error if any item has a non-positive quantity", () => {
        const order = {
            items: [
                { price: 10, quantity: 0 },
                { price: 5, quantity: 4 },
            ],
        };

        expect(() => OrderPriceCalculator.calculateTotal(order)).toThrow(
            "Order items are invalid"
        );

        const order2 = {
            items: [
                { price: 10, quantity: -2 },
                { price: 5, quantity: 4 },
            ],
        };

        expect(() => OrderPriceCalculator.calculateTotal(order2)).toThrow(
            "Order items are invalid"
        );
    });

    it("should throw an error if the item not a object", () => {
        const order = {
            items: [
                { price: 10, quantity: 2 },
                { price: 5, quantity: 4 },
                null,
            ],
        };

        expect(() => OrderPriceCalculator.calculateTotal(order)).toThrow(
            "Order items are invalid"
        );

        const order2 = {
            items: [
                { price: 10, quantity: 2 },
                { price: 5, quantity: 4 },
                "string",
            ],
        };
        expect(() => OrderPriceCalculator.calculateTotal(order2)).toThrow(
            "Order items are invalid"
        );

        const order3 = {
            items: [
                { price: 10, quantity: 2 },
                { price: 5, quantity: 4 },
                undefined,
            ],
        };

        expect(() => OrderPriceCalculator.calculateTotal(order3)).toThrow(
            "Order items are invalid"
        );

        const order4 = {
            items: [
                { price: 10, quantity: 2 },
                { price: 5, quantity: 4 },
                [],
            ],
        };
        expect(() => OrderPriceCalculator.calculateTotal(order4)).toThrow(
            "Order items are invalid"
        );
    });
});