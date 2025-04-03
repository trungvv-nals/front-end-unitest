### 📌 **Test Cases cho `setupCounter`**  

#### ✅ **1. Khởi tạo counter**  
- Khi gọi `setupCounter`, nội dung của nút (`button.innerHTML`) phải là `"count is 0"`.  

#### ✅ **2. Nên tăng bộ đếm khi nhấn nút**  
- Khi nhấn vào nút lần đầu tiên, nội dung phải là `"count is 1"`.  
- Khi nhấn lần thứ hai, nội dung phải là `"count is 2"`, v.v.  

#### ✅ **3. Nên kiểm tra sự kiện click**  
- Hàm `setupCounter` phải đăng ký sự kiện `"click"` vào nút.  
- Kiểm tra bằng cách spy `addEventListener`.  

#### ✅ **4. Nên xử lý đúng khi nhấn nút nhiều lần**  
- Khi nhấn nút liên tục, bộ đếm phải tiếp tục tăng mà không bị reset về `0`.  

#### ✅ **5. Nên cập nhật UI khi thêm nhiều nút**  
- Khi gọi `setupCounter` trên nhiều nút khác nhau, mỗi nút phải hoạt động độc lập mà không ảnh hưởng đến nhau.  

---

### 📌 **Test Cases cho `OrderService`**

#### ✅ **1. Kiểm tra khi không có sản phẩm trong đơn hàng**
- Khi đơn hàng không có sản phẩm (`items` là mảng rỗng hoặc `undefined`), hàm sẽ ném lỗi: `"Order items are required"`.

#### ✅ **2. Kiểm tra khi sản phẩm có giá hoặc số lượng không hợp lệ**
- Khi sản phẩm có giá nhỏ hơn hoặc bằng 0, hoặc số lượng nhỏ hơn hoặc bằng 0, hàm sẽ ném lỗi: `"Order items are invalid"`.

#### ✅ **3. Kiểm tra khi không áp dụng mã giảm giá**
- Khi không có mã giảm giá, tổng giá trị đơn hàng không thay đổi.

#### ✅ **4. Kiểm tra khi sử dụng mã giảm giá không hợp lệ**
- Khi mã giảm giá (`couponId`) không hợp lệ hoặc không tìm thấy, hàm sẽ ném lỗi: `"Invalid coupon"`.

#### ✅ **5. Kiểm tra khi áp dụng mã giảm giá hợp lệ**
- Khi mã giảm giá hợp lệ, giá trị đơn hàng sẽ được giảm đi đúng với giá trị mã giảm giá.

#### ✅ **6. Kiểm tra khi giá trị mã giảm giá lớn hơn tổng giá trị đơn hàng**
- Khi giá trị mã giảm giá lớn hơn hoặc bằng tổng giá trị đơn hàng, hàm sẽ trả về `0` thay vì giá trị âm.

#### ✅ **7. Kiểm tra khi gọi API tạo đơn hàng và thanh toán**
- Khi đơn hàng hợp lệ và được xử lý, hàm sẽ gửi yêu cầu `POST` để tạo đơn hàng và gọi phương thức thanh toán.

---

### 📌 **Test Cases cho `PaymentService`**

#### ✅ **1. Kiểm tra trả về tất cả các phương thức thanh toán khi giá trị đơn hàng trong giới hạn**
- Khi giá trị tổng đơn hàng nhỏ hơn hoặc bằng các giới hạn của tất cả các phương thức thanh toán, hàm sẽ trả về tất cả các phương thức thanh toán: `CREDIT`, `PAYPAY`, và `AUPAY`.

#### ✅ **2. Kiểm tra loại bỏ PAYPAY nếu giá trị đơn hàng vượt quá 500,000**
- Khi tổng giá trị đơn hàng lớn hơn 500,000, phương thức thanh toán `PAYPAY` sẽ bị loại bỏ khỏi danh sách.

#### ✅ **3. Kiểm tra loại bỏ AUPAY nếu giá trị đơn hàng vượt quá 300,000**
- Khi tổng giá trị đơn hàng lớn hơn 300,000, phương thức thanh toán `AUPAY` sẽ bị loại bỏ khỏi danh sách.

#### ✅ **4. Kiểm tra loại bỏ cả PAYPAY và AUPAY nếu giá trị đơn hàng vượt quá cả hai giới hạn**
- Khi tổng giá trị đơn hàng lớn hơn cả 500,000 và 300,000, cả hai phương thức thanh toán `PAYPAY` và `AUPAY` sẽ bị loại bỏ khỏi danh sách, chỉ còn lại `CREDIT`.

#### ✅ **5. Kiểm tra mở đúng URL thanh toán với ID đơn hàng**
- Khi gọi `payViaLink` với đơn hàng hợp lệ, hàm sẽ mở đúng URL thanh toán chứa ID của đơn hàng.

#### ✅ **6. Kiểm tra lỗi nếu ID đơn hàng bị thiếu**
- Khi gọi `payViaLink` với đơn hàng không có ID, hàm sẽ ném lỗi `"Invalid order: Missing order ID"`.

