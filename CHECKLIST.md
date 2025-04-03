# Test Case Checklist

## main.test.ts
- [ ] createAppHTML: Should return the correct HTML structure.
- [ ] initializeApp: Should throw an error if the `#app` element is not found.
- [ ] initializeApp: Should call `setupCounter` with the counter button.

## counter.test.ts
- [ ] setupCounter: Should initialize the counter to 0.
- [ ] setupCounter: Should increment the counter on button click.
- [ ] setupCounter: Should attach a click event listener to the button.

## payment.service.test.ts
- [ ] buildPaymentMethod: Should include all payment methods if `totalPrice` is below thresholds.
- [ ] buildPaymentMethod: Should exclude `PAYPAY` if `totalPrice` exceeds 500,000.
- [ ] buildPaymentMethod: Should exclude `AUPAY` if `totalPrice` exceeds 300,000.
- [ ] buildPaymentMethod: Should exclude both `PAYPAY` and `AUPAY` if `totalPrice` exceeds 500,000.
- [ ] payViaLink: Should open a new window with the correct payment URL.

## order.service.test.ts
- [ ] validateOrder: Should throw an error if order items are missing.
- [ ] validateOrder: Should throw an error if any item has a price <= 0.
- [ ] validateOrder: Should throw an error if any item has a quantity <= 0.
- [ ] validateOrder: Should not throw an error if all items are valid.
- [ ] calculateFinalPrice: Should calculate total price without a coupon.
- [ ] calculateFinalPrice: Should apply a valid coupon and reduce the total price.
- [ ] calculateFinalPrice: Should set total price to 0 if coupon discount exceeds total price.
- [ ] buildOrderPayload: Should build the correct order payload.
- [ ] createOrder: Should send a POST request to create an order.
- [ ] process: Should process an order end-to-end.
- [ ] fetchCoupon: Should fetch a coupon and return its discount.
- [ ] fetchCoupon: Should throw an error if the coupon is invalid.