# Test Case Checklist

## Class: OrderService

### Method: process
- [x] Should process an order with a valid coupon.
- [x] Should throw an error if the order creation fails.
- [x] Should handle an order without coupon.
- [x] Should throw an error if the order items are invalid.
- [x] Should throw an error if the order ID is invalid.
- [x] Should throw an error if the order response is not ok.
- [x] Should throw an error if JSON.stringify fails.

## Class: PaymentService

### Method: buildPaymentMethod
- [x] Should return all payment methods for a price within all limits.
- [x] Should return only methods within the price limit.
- [x] Should return CREDIT only for a price exceeding all other limits.
- [x] Should return an empty string for a price of 0.
- [x] Should return an empty string for a negative price

### Method: payViaLink
- [x] Should open a new window with the correct URL when a valid order is provided.
- [x] Should throw an error if the order ID is invalid.
- [x] Should throw an error if the order is null or undefined

## Class: CouponService

### Method: applyDiscount
- [x] Should apply a valid discount to the total price.
- [x] Should return the original total price if the coupon is invalid.
- [x] Should return 0 if the discount is greater than the order total.
- [x] Should throw an error if the coupon data is invalid.
- [x] Should throw an error if the coupon fetch fails.

## Class: OrderPriceCalculator

### Method: calculateTotal
- [x] Should calculate the total price of an order correctly.
- [x] Should throw an error if order items are missing.
- [x] Should throw an error if any item has a non-positive price
- [x] Should throw an error if any item has a non-positive quantity
- [x] Should throw an error if the item not a object