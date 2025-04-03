# Checklist of Test Cases

- [x] **Test Case 1**: Throw error when order has no items
  - Description: Ensure that an error is thrown if the order has no items.
  
- [x] **Test Case 2**: Throw error when order has invalid items (price <= 0)
  - Description: Ensure that an error is thrown if the order contains items with a price of 0 or less.

- [x] **Test Case 3**: Throw error when order has invalid items (quantity <= 0)
  - Description: Ensure that an error is thrown if the order contains items with a quantity of 0 or less.

- [x] **Test Case 4**: Correctly calculate total price without coupon
  - Description: Ensure that the total price is calculated correctly when no coupon is applied.

- [x] **Test Case 5**: Apply coupon discount correctly
  - Description: Ensure that the coupon discount is applied correctly and the total price is updated.

- [x] **Test Case 6**: Set total price to 0 when coupon discount exceeds original price
  - Description: Ensure that the total price is set to 0 when the coupon discount exceeds the original price.

- [x] **Test Case 7**: Throw error for invalid coupon
  - Description: Ensure that an error is thrown when an invalid coupon is provided.

- [x] **Test Case 8**: Call payment service to process payment
  - Description: Ensure that the payment service is called to process the payment after order creation.

# Checklist of Test Cases for PaymentService

## buildPaymentMethod
- [x] **Test Case 1**: Return all payment methods when total price is less than or equal to 300,000
  - Description: Ensure that all payment methods are returned for total prices less than or equal to 300,000.
  
- [x] **Test Case 2**: Exclude AUPAY when total price is between 300,000 and 500,000
  - Description: Ensure that AUPAY is excluded for total prices between 300,000 and 500,000.

- [x] **Test Case 3**: Only include CREDIT when total price is greater than 500,000
  - Description: Ensure that only CREDIT is included for total prices greater than 500,000.

- [x] **Test Case 4**: Handle edge case at exactly 500,000
  - Description: Ensure that the correct payment methods are returned when the total price is exactly 500,000.

- [x] **Test Case 5**: Handle zero total price
  - Description: Ensure that all payment methods are returned when the total price is 0.

- [x] **Test Case 6**: Handle negative total price (though this should be prevented at validation level)
  - Description: Ensure that the correct payment methods are returned when the total price is negative.

## payViaLink
- [x] **Test Case 1**: Open payment link in a new window
  - Description: Ensure that the payment link is opened in a new window with the correct order ID.

- [x] **Test Case 2**: Handle orders with special characters in ID
  - Description: Ensure that orders with special characters in the order ID are handled correctly.

- [x] **Test Case 3**: Handle orders with coupon
  - Description: Ensure that orders with a coupon are handled correctly and the payment link is opened.
