# Checklist: Unit Test Cases

## 1. **Test OrderService**
### 1.1 Validate Order Items
- [ ] Test: Throw error if order has no items
- [ ] Test: Throw error if any item has price <= 0 or quantity <= 0
### 1.2 Calculate Total Price
- [ ] Test: Throw error if total price <= 0
- [ ] Test: Validate coupon application and discount
- [ ] Test: Ensure total price is not negative after coupon
### 1.3 Sending the Order
- [ ] Test: Ensure the order is sent with the correct payload and headers

## 2. **Test PaymentService**
### 2.1 Build Payment Method
- [ ] Test: Return all payment methods when total price <= 300,000
- [ ] Test: Exclude AUPAY when total price > 300,000
- [ ] Test: Exclude PAYPAY and AUPAY when total price > 500,000
### 2.2 Pay Via Link
- [ ] Test: Ensure correct URL is opened for payment with the order ID

## 3. **Test setupCounter**
### 3.1 DOM Interaction with Counter
- [ ] Test: Ensure initial innerHTML of #counter is "count is 0"
- [ ] Test: Ensure innerHTML of #counter updates to "count is 1" after one click
- [ ] Test: Ensure innerHTML of #counter increments to "count is 2" after two clicks

## 4. **Test main**
## 4.1. **Test Rendering of the Vite Template**
- [ ] Test: Ensure that `#app` is rendered and contains the Vite and TypeScript logos.
- [ ] Test: Ensure that the header contains `"Vite + TypeScript"`.
- [ ] Test: Ensure that the button `#counter` is present.
## 4.2. **Test Counter Button Functionality**
- [ ] Test: Ensure initial content of the `#counter` button is `"count is 0"`.
- [ ] Test: Ensure clicking the `#counter` button increments the count and updates the content to `"count is 1"`.
- [ ] Test: Ensure clicking the `#counter` button twice updates the content to `"count is 2"`.
## 4.3. **Test DOM Interaction**
- [ ] Test: Ensure button click events trigger correctly and update the DOM as expected.
- [ ] Test: Ensure that `setupCounter` function behaves correctly when linked with the `#counter` button.