# OrderService Checklist

## getCouponByIdMethod
- [ ] **Should: return the coupon data when a valid coupon ID is provided**
  - Condition: `couponId` is valid
  - Expected Result: Returns the correct coupon data
  
- [ ] **Should: throw an error when the coupon ID is invalid**
  - Condition: `couponId` is invalid
  - Expected Result: Throws error with message `"Invalid coupon"`

## createOrderMethod
- [ ] **Should: successfully create and return an order when valid data is provided**
  - Condition: Order payload with valid data
  - Expected Result: Successfully creates the order and returns it with an `id`

## process
- [ ] **Should: throw an error if the order has no items**
  - Condition: `order.items` is empty
  - Expected Result: Throws error with message `"Order items are required"`

- [ ] **Should: throw an error if the order items are invalid**
  - Condition: Invalid order items (negative quantity or price)
  - Expected Result: Throws error with message `"Order items are invalid"`

- [ ] **Should: throw an error if the total price is less than or equal to 0**
  - Condition: `totalPrice <= 0`
  - Expected Result: Throws error with message `"Order items are invalid"`

- [ ] **Should: throw an error if the coupon is invalid**
  - Condition: Invalid coupon ID or coupon data
  - Expected Result: Throws error with message `"Invalid coupon"`

- [ ] **Should: correctly apply the coupon discount**
  - Condition: Coupon ID is valid
  - Expected Result: Correctly applies the discount to the order total price

- [ ] **Should: not allow the total price to be less than 0 after applying the coupon**
  - Condition: Coupon discount causes total price to be negative
  - Expected Result: Total price should be 0 (or above, if applicable)

# PaymentService Checklist

## buildPaymentMethod
- [ ] **Should: return all methods when totalPrice is low**
  - Condition: `totalPrice` <= 500,000
  - Expected Result: Returns `[CREDIT, PAYPAY, AUPAY]`
  
- [ ] **Should: remove PAYPAY when totalPrice exceeds 500,000**
  - Condition: `totalPrice` > 500,000
  - Expected Result: Returns `[CREDIT]`
  
- [ ] **Should: remove AUPAY when totalPrice exceeds 300,000**
  - Condition: `totalPrice` > 300,000 and <= 500,000
  - Expected Result: Returns `[CREDIT, PAYPAY]`

- [ ] **Should: return only CREDIT when totalPrice is too high**
  - Condition: `totalPrice` > 999,999
  - Expected Result: Returns `CREDIT`

## payViaLink
- [ ] **Should: open payment link in a new tab with the correct orderId**
  - Condition: Order is passed to the `payViaLink` method
  - Expected Result: Opens a new tab with the correct URL: `https://payment.example.com/pay?orderId={orderId}`
