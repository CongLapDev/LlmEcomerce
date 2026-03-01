# QUY TẮC NGHIỆP VỤ (BUSINESS RULES)
## Hệ thống Quản lý Bán hàng E-commerce

---

## 1. Giới thiệu

Tài liệu này mô tả các quy tắc nghiệp vụ (Business Rules) của hệ thống E-commerce. Các quy tắc này được rút ra từ phân tích code thực tế và định nghĩa cách hệ thống hoạt động, xử lý nghiệp vụ, và đảm bảo tính toàn vẹn dữ liệu.

**Mục đích:**
- Làm cơ sở để Dev team implement logic nghiệp vụ
- Giúp QA team xây dựng test case
- Đảm bảo tính nhất quán trong xử lý nghiệp vụ
- Hỗ trợ maintenance và mở rộng hệ thống

---

## 2. Phân loại Business Rules

Hệ thống được chia thành 4 module chính:

1. **Xác thực & Phân quyền (Authentication & Authorization)**
2. **Quản lý Đơn hàng (Order Processing)**
3. **Tích hợp Thanh toán (Payment Integration)**
4. **Quản lý Sản phẩm & Kho (Product & Inventory)**

---

## 3. Module 1: Xác thực & Phân quyền

### 3.1. Business Requirement
- **REQ-AUTH-01**: Hệ thống cần xác thực người dùng trước khi cho phép truy cập các chức năng
- **REQ-AUTH-02**: Phân quyền rõ ràng giữa Admin và User thường
- **REQ-AUTH-03**: Bảo mật thông tin đơn hàng - chỉ chủ đơn hàng hoặc Admin mới xem được

### 3.2. Business Rules

#### 3.2.1. Quy tắc Xác thực (Authentication Rules)

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-AUTH-001** | Constraint | Hệ thống sử dụng JWT token để xác thực. Session phải là STATELESS (không lưu session trên server) |
| **BR-AUTH-002** | Process | Mọi request đều phải qua `JwtFilter` để validate token TRƯỚC KHI kiểm tra quyền truy cập |
| **BR-AUTH-003** | Data | Mật khẩu PHẢI được mã hóa bằng BCrypt trước khi lưu database. Tuyệt đối KHÔNG lưu plain text |
| **BR-AUTH-004** | Constraint | Hệ thống hỗ trợ 2 phương thức đăng nhập: (1) Username/Password, (2) Google OAuth2 |
| **BR-AUTH-005** | Process | Các endpoint public (xem sản phẩm, danh mục) KHÔNG cần xác thực. Các endpoint khác BẮT BUỘC phải có JWT hợp lệ |
| **BR-AUTH-006** | Constraint | CORS cho phép request từ `localhost:3000` và `localhost:8085` (dev). Production phải giới hạn domain cụ thể |

#### 3.2.2. Quy tắc Phân quyền (Authorization Rules)

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-AUTH-007** | Constraint | Hệ thống có 2 role: `ROLE_ADMIN` và `ROLE_USER`. Role được gán khi đăng ký và KHÔNG thể tự thay đổi |
| **BR-AUTH-008** | Process | Kiểm tra quyền truy cập đơn hàng phải thực hiện ở service layer qua `OrderSecurityService` |
| **BR-AUTH-009** | Constraint | **Xem đơn hàng**: User chỉ xem được đơn của mình (`order.userId == user.id`) HOẶC là Admin |
| **BR-AUTH-010** | Constraint | **Hủy đơn hàng**: User chỉ hủy được đơn của mình (nếu đơn cho phép hủy) HOẶC là Admin |
| **BR-AUTH-011** | Constraint | **Cập nhật trạng thái đơn**: CHỈ Admin mới được phép. User thường KHÔNG được trực tiếp đổi trạng thái |
| **BR-AUTH-012** | Process | Hệ thống lấy `userId` từ JWT principal qua interface `IUserDetail`. Nếu lấy thất bại → trả về 401 Unauthorized |
| **BR-AUTH-013** | Process | Lỗi xác thực (401) xử lý bởi `RestAuthenticationEntryPoint`. Lỗi phân quyền (403) xử lý bởi `RestAccessDeniedHandler` |
| **BR-AUTH-014** | Process | Trước khi thực hiện thao tác nhạy cảm (hủy đơn, hoàn tiền), PHẢI gọi `verifyOwnership()` để kiểm tra quyền sở hữu |

**Ví dụ thực tế:**
```
Scenario: User A (userId=123) cố gắng xem đơn hàng #456 của User B (userId=789)
→ System check: order.userId (789) != authentication.userId (123) && !isAdmin
→ Result: Throw OrderAccessDeniedException → HTTP 403
```

---

## 4. Module 2: Quản lý Đơn hàng

### 4.1. Business Requirement
- **REQ-ORD-01**: Hệ thống cần quản lý vòng đời đơn hàng từ tạo đến hoàn thành
- **REQ-ORD-02**: Hỗ trợ 2 hình thức thanh toán: COD và Online Payment
- **REQ-ORD-03**: Đảm bảo tính toàn vẹn dữ liệu - tổng tiền phải chính xác, không bị gian lận

### 4.2. Business Rules

#### 4.2.1. Quy tắc State Machine (Trạng thái đơn hàng)

**Sơ đồ trạng thái:**

```
COD Flow:     PENDING_PAYMENT → CONFIRMED → PREPARING → SHIPPING → DELIVERED → COMPLETED
Online Flow:  PENDING_PAYMENT → PAID → CONFIRMED → PREPARING → SHIPPING → DELIVERED → COMPLETED
Cancel Flow:  (PENDING_PAYMENT/PAID/CONFIRMED/PREPARING) → CANCELLED
Return Flow:  (DELIVERED/COMPLETED) → RETURNED
```

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-ORD-001** | Constraint | Mỗi đơn hàng CHỈ tồn tại ở 1 trong 9 trạng thái: `PENDING_PAYMENT`, `PAID`, `CONFIRMED`, `PREPARING`, `SHIPPING`, `DELIVERED`, `COMPLETED`, `CANCELLED`, `RETURNED` |
| **BR-ORD-002** | Process | Đơn hàng mới tạo MẶC ĐỊNH ở trạng thái `PENDING_PAYMENT` (id=1) với note "Order created - awaiting payment" |
| **BR-ORD-003** | Process | **Đơn COD**: Bỏ qua trạng thái `PAID`, chuyển thẳng từ `PENDING_PAYMENT` → `CONFIRMED` |
| **BR-ORD-004** | Process | **Đơn Online**: Phải qua `PAID` trước khi `CONFIRMED` |
| **BR-ORD-005** | Constraint | **Hủy đơn**: Chỉ được phép từ trạng thái `PENDING_PAYMENT`, `PAID`, `CONFIRMED`, `PREPARING`. KHÔNG được hủy khi đã `SHIPPING` |
| **BR-ORD-006** | Constraint | **Trả hàng**: Chỉ được phép từ trạng thái `DELIVERED` hoặc `COMPLETED` |
| **BR-ORD-007** | Constraint | Trạng thái `COMPLETED`, `CANCELLED`, `RETURNED` là **trạng thái cuối** - không chuyển được sang trạng thái khác |
| **BR-ORD-008** | Computation | Method `isFinalState()` trả về `true` nếu trạng thái là `COMPLETED`, `CANCELLED`, hoặc `RETURNED` |
| **BR-ORD-009** | Computation | Method `isCancellable()` trả về `true` nếu `status.id < SHIPPING.id` VÀ chưa ở trạng thái cuối |
| **BR-ORD-010** | Computation | Method `isReturnable()` trả về `true` CHỈ KHI trạng thái là `DELIVERED` hoặc `COMPLETED` |

#### 4.2.2. Quy tắc Tạo đơn hàng & Validation

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-ORD-011** | Computation | **QUAN TRỌNG**: Tổng tiền đơn hàng PHẢI tính ở server = SUM(OrderLine.total) + ShippingMethod.price. BỎ QUA giá trị từ client để tránh gian lận |
| **BR-ORD-012** | Constraint | Tổng tiền đơn hàng PHẢI > 0. Đơn có tổng tiền ≤ 0 sẽ bị reject với `IllegalArgumentException` |
| **BR-ORD-013** | Constraint | Đơn hàng PHẢI có ít nhất 1 sản phẩm (OrderLine). Đơn rỗng bị reject |
| **BR-ORD-014** | Computation | Mỗi `OrderLine.total` = `OrderLine.qty × ProductItem.price`. Hệ thống validate công thức này trước khi tạo đơn |
| **BR-ORD-015** | Process | `ShippingMethod` PHẢI được load từ database qua `ShippingMethodRepository.findById()` để đảm bảo giá ship chính xác |
| **BR-ORD-016** | Data | `orderDate` PHẢI được set = thời gian hiện tại UTC (`new Date()`). BỎ QUA giá trị từ client |
| **BR-ORD-017** | Process | Khi tạo đơn, tự động tạo record `ShopOrderStatus` với `status=PENDING_PAYMENT` và liên kết với đơn hàng |
| **BR-ORD-018** | Process | Khi tạo đơn, tự động tạo record `ShopOrderPayment` với `status=PENDING` và liên kết với đơn hàng |
| **BR-ORD-019** | Data | Tất cả `OrderLine` phải set reference `order` về đơn hàng cha trước khi lưu database |

**Ví dụ thực tế:**
```
Client gửi: order.total = 1,000,000 VND
Server tính:
  - OrderLine 1: 2 × 200,000 = 400,000
  - OrderLine 2: 1 × 500,000 = 500,000
  - Shipping: 50,000
  → Server total = 950,000 VND
→ System IGNORE client value, use 950,000 VND
```

#### 4.2.3. Quy tắc Chuyển trạng thái

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-ORD-020** | Process | Mọi thay đổi trạng thái PHẢI được ghi vào bảng `ShopOrderStatus` với timestamp và note mô tả lý do |
| **BR-ORD-021** | Process | Method `confirmOrder()` chuyển đơn từ `PENDING_PAYMENT` → `PAID`. CHỈ gọi sau khi xác nhận thanh toán thành công |
| **BR-ORD-022** | Process | Method `cancelOrder()` chuyển đơn → `CANCELLED`. PHẢI kiểm tra `isCancellable()` trước khi thực hiện |
| **BR-ORD-023** | Process | **Idempotency**: Nếu đơn đã ở trạng thái đích, bỏ qua việc chuyển và log warning (tránh duplicate) |
| **BR-ORD-024** | Constraint | Chuyển trạng thái vi phạm state machine (VD: `SHIPPING` → `PENDING_PAYMENT`) sẽ bị reject với `IllegalStateException` |

---

## 5. Module 3: Tích hợp Thanh toán (ZaloPay)

### 5.1. Business Requirement
- **REQ-PAY-01**: Tích hợp cổng thanh toán ZaloPay để khách hàng thanh toán online
- **REQ-PAY-02**: Đảm bảo bảo mật giao dịch qua HMAC signature
- **REQ-PAY-03**: Xử lý callback từ ZaloPay để cập nhật trạng thái thanh toán
- **REQ-PAY-04**: Hỗ trợ hoàn tiền cho đơn hàng đã thanh toán

### 5.2. Business Rules

#### 5.2.1. Quy tắc Tạo yêu cầu thanh toán

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-PAY-001** | Data | `app_trans_id` PHẢI unique toàn hệ thống, format: `yyMMdd_orderId_timestamp` (VD: `260128_12345_1738080000000`). Dùng timezone GMT+7 |
| **BR-PAY-002** | Computation | Công thức tạo `app_trans_id`: `getCurrentTimeString("yyMMdd") + "_" + orderId + "_" + System.currentTimeMillis()` |
| **BR-PAY-003** | Data | `amount` PHẢI convert từ `BigDecimal` sang `Long` (VND). Giá trị ≤ 0 bị reject |
| **BR-PAY-004** | Constraint | Field `item` PHẢI là JSON array hợp lệ chứa thông tin sản phẩm. Array rỗng `[]` bị reject |
| **BR-PAY-005** | Constraint | `app_time` = thời gian hiện tại (milliseconds). ZaloPay yêu cầu xử lý trong vòng 15 phút kể từ `app_time` |
| **BR-PAY-006** | Constraint | `expire_duration_seconds` = 900 giây (15 phút) - thời gian hết hạn giao dịch |
| **BR-PAY-007** | Data | `callback_url` PHẢI trỏ đến public endpoint của server (VD: `https://domain.com/api/v1/payment/zalopay/callback`) |
| **BR-PAY-008** | Data | `embed_data` PHẢI chứa JSON với `redirecturl` trỏ về trang success của frontend |

#### 5.2.2. Quy tắc HMAC Signature (Bảo mật)

**Mục đích:** Đảm bảo dữ liệu không bị giả mạo giữa hệ thống và ZaloPay

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-PAY-009** | Constraint | Mọi request tới ZaloPay PHẢI có field `mac` (Message Authentication Code) dùng HMAC-SHA256 |
| **BR-PAY-010** | Computation | **Tạo payment**: HMAC input = `app_id\|app_trans_id\|app_user\|amount\|app_time\|embed_data\|item` (phân cách bằng `\|`) |
| **BR-PAY-011** | Computation | Công thức: `mac = HMacHexStringEncode(HMACSHA256, key1, hmacInput)` với `key1` là secret key từ ZaloPay |
| **BR-PAY-012** | Process | `key1` PHẢI được `.trim()` (bỏ khoảng trắng đầu/cuối) trước khi tính HMAC để tránh lỗi signature |
| **BR-PAY-013** | Data | MAC PHẢI encode thành lowercase hex string trước khi gửi ZaloPay |
| **BR-PAY-014** | Computation | **Query status**: HMAC input = `app_id\|app_trans_id\|key1` |
| **BR-PAY-015** | Computation | **Refund**: HMAC input = `app_id\|zp_trans_id\|amount\|description\|timestamp` |
| **BR-PAY-016** | Process | **Verify callback**: Dùng `key2` (callback secret). HMAC input = raw `data` field từ callback |
| **BR-PAY-017** | Computation | Công thức verify: `expectedMac = HmacSHA256(key2, callback.data)`, so sánh với `callback.mac` (case-insensitive) |
| **BR-PAY-018** | Constraint | Nếu MAC không khớp → reject callback với `return_code=-1`, `return_message="mac not equal"` và throw `PaymentCallbackException` |

**Ví dụ thực tế:**
```
Tạo payment cho đơn #12345, amount=950000
HMAC Input: "2554|260128_12345_1738080000000|user123|950000|1738080000000|{...}|[...]"
Key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn"
→ MAC: "a1b2c3d4e5f6..." (64 ký tự hex)
```

#### 5.2.3. Quy tắc Xử lý Callback & Idempotency

**Idempotency**: Đảm bảo callback xử lý 1 lần duy nhất, tránh duplicate

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-PAY-019** | Process | Dùng `ConcurrentHashMap<app_trans_id, Boolean>` để track các callback đang xử lý (tránh race condition) |
| **BR-PAY-020** | Process | Trước khi xử lý callback, check `processingOrders.putIfAbsent(app_trans_id)`. Nếu đã tồn tại → return `return_code=1, "already processed"` |
| **BR-PAY-021** | Process | Check đơn hàng đã ở trạng thái `PAID` chưa. Nếu rồi → return `return_code=1, "already paid"` (idempotency) |
| **BR-PAY-022** | Process | Sau khi xử lý xong, PHẢI remove `app_trans_id` khỏi map trong `finally` block (tránh memory leak) |
| **BR-PAY-023** | Computation | Extract `orderId` từ `app_trans_id` format `yyMMdd_orderId_timestamp` (bỏ qua date prefix) |
| **BR-PAY-024** | Process | Khi callback thành công, PHẢI: (1) Update order → `PAID`, (2) Update payment.status → `PAID`, (3) Lưu `zp_trans_id` vào `payment.orderNumber`, (4) Set `payment.updateAt` |
| **BR-PAY-025** | Constraint | Response callback cho ZaloPay PHẢI trả về trong 3 giây với JSON: `{return_code: 1/-1, return_message: "..."}` |

#### 5.2.4. Quy tắc Polling Status (Cho localhost dev)

**Lý do:** Localhost không nhận được callback từ ZaloPay → phải chủ động poll status

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-PAY-026** | Process | Môi trường localhost PHẢI implement polling status qua `TaskScheduler` |
| **BR-PAY-027** | Constraint | Lần poll đầu tiên sau 10 giây. Các lần sau cách nhau `pollingIntervalSeconds` (default: 30s) |
| **BR-PAY-028** | Constraint | Poll tối đa `maxPollingAttempts` lần (default: 20). Vượt quá → dừng poll |
| **BR-PAY-029** | Process | Xử lý `return_code` từ ZaloPay: `1`=success (dừng poll), `2`=failed (dừng poll), `3`=processing (tiếp tục poll), khác=tiếp tục poll |
| **BR-PAY-030** | Process | Nếu `return_code=1` → gọi `handleSuccessfulPayment()` và dừng poll |
| **BR-PAY-031** | Process | Nếu `return_code=2` → gọi `handleFailedPayment()` (cancel đơn) và dừng poll |
| **BR-PAY-032** | Process | Dùng `JSONObject.optInt(return_code, -999)` để tránh exception khi field null/missing |

#### 5.2.5. Quy tắc Validation & Error Handling

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-PAY-033** | Constraint | Trước khi tạo payment, PHẢI validate `order.total > 0`. Nếu không → reject với error message |
| **BR-PAY-034** | Process | Check đơn đã thanh toán chưa (tìm record `PAID`). Nếu rồi → reject duplicate payment |
| **BR-PAY-035** | Process | Check `payment.orderNumber` có null/empty không. Nếu có giá trị → đã có payment, reject duplicate |
| **BR-PAY-036** | Process | Nếu ZaloPay trả `return_code != 1` → return error response cho client (KHÔNG throw exception) |
| **BR-PAY-037** | Process | PHẢI log tất cả request payload (app_id, app_trans_id, amount, mac) và raw response để debug/audit |
| **BR-PAY-038** | Process | Nếu parse JSON response thất bại → log raw response và return error message |

#### 5.2.6. Quy tắc Hoàn tiền (Refund)

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-PAY-039** | Constraint | CHỈ hoàn tiền cho đơn ở trạng thái `PAID`. Phải verify status trước khi refund |
| **BR-PAY-040** | Constraint | **Phân quyền refund**: User phải là chủ đơn HOẶC có role `ADMIN`. Nếu không → throw `InsufficientAuthenticationException` |
| **BR-PAY-041** | Computation | `m_refund_id` format: `yyMMdd_appId_uid` với `uid` = `timestamp + random(111-999)` |
| **BR-PAY-042** | Data | Request refund PHẢI có: `app_id`, `zp_trans_id`, `m_refund_id`, `timestamp`, `amount`, `description`, `mac` |
| **BR-PAY-043** | Computation | Refund MAC = `HMacHexStringEncode(HMACSHA256, key1, "app_id\|zp_trans_id\|amount\|description\|timestamp")` |
| **BR-PAY-044** | Process | Dùng `getRefundStatus(m_refund_id)` để query trạng thái refund từ ZaloPay |

---

## 6. Module 4: Quản lý Sản phẩm & Kho

### 6.1. Business Requirement
- **REQ-INV-01**: Quản lý sản phẩm và các biến thể (ProductItem: size, color, etc.)
- **REQ-INV-02**: Đảm bảo tính toàn vẹn dữ liệu - không xóa sản phẩm đã bán
- **REQ-INV-03**: Quản lý tồn kho theo từng biến thể sản phẩm

### 6.2. Business Rules

#### 6.2.1. Quy tắc Quản lý Product Item

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-INV-001** | Constraint | Mỗi `ProductItem` (biến thể) PHẢI thuộc về 1 `Product` cha. Không cho phép ProductItem mồ côi |
| **BR-INV-002** | Constraint | **QUAN TRỌNG**: ProductItem đã có trong `OrderLine` (đã bán) KHÔNG được phép xóa. Xóa sẽ bị reject với `IllegalStateException` |
| **BR-INV-003** | Process | Trước khi xóa ProductItem, PHẢI check `OrderLineRepository.existsByProductItemId()`. Nếu có → reject |
| **BR-INV-004** | Process | Khi xóa ProductItem, PHẢI cascade delete tất cả `CartItem` liên quan qua `CartItemRepository.deleteByProductItemId()` |
| **BR-INV-005** | Process | Khi xóa ProductItem, PHẢI cascade delete tất cả `WarehouseItem` (tồn kho) qua `WarehouseItemRepository.deleteByProductItemId()` |
| **BR-INV-006** | Process | Update ProductItem dùng `ObjectUtils.merge()` để merge giá trị mới với giá trị cũ (giữ lại field không update) |
| **BR-INV-007** | Process | Nếu ProductItem không tồn tại khi update → throw `ResourceNotFoundException` |

**Ví dụ thực tế:**
```
Scenario: Admin muốn xóa ProductItem #789 (Áo size M màu đỏ)
→ System check: OrderLine có reference đến #789 không?
  - Nếu CÓ (đã có người mua) → Reject với message "Cannot delete - product has been ordered"
  - Nếu KHÔNG → OK, xóa ProductItem + cascade delete CartItem + WarehouseItem
```

#### 6.2.2. Quy tắc Quản lý Tồn kho

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-INV-008** | Constraint | Tồn kho PHẢI track ở level `ProductItem` (biến thể), KHÔNG phải level `Product` (để hỗ trợ multi-variant) |
| **BR-INV-009** | Process | **Recommended**: Khi tạo đơn, NÊN reserve inventory để tránh overselling (chưa implement trong code hiện tại) |
| **BR-INV-010** | Process | **Recommended**: Khi hủy đơn, NÊN release inventory về available stock (chưa implement trong code hiện tại) |
| **BR-INV-011** | Process | **Recommended**: NÊN validate tồn kho khi tạo đơn để tránh đặt hàng out-of-stock (enhancement suggestion) |

#### 6.2.3. Quy tắc Data Integrity

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-INV-012** | Data | Giá sản phẩm PHẢI dùng `BigDecimal` (hỗ trợ decimal). KHÔNG dùng Integer |
| **BR-INV-013** | Constraint | Giá ProductItem PHẢI immutable sau khi đã có trong đơn hàng. Thay đổi giá CHỈ áp dụng cho đơn mới |
| **BR-INV-014** | Constraint | `OrderLine.total` PHẢI được preserve ngay cả khi ProductItem bị xóa/sửa (đảm bảo lịch sử đơn hàng chính xác) |

---

## 7. Quy tắc Cross-Cutting (Áp dụng toàn hệ thống)

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-GLB-001** | Data | Tất cả giá trị tiền tệ PHẢI dùng `BigDecimal` với precision tối thiểu 2 chữ số thập phân |
| **BR-GLB-002** | Data | Tất cả timestamp PHẢI lưu theo UTC timezone để tránh lỗi timezone |
| **BR-GLB-003** | Process | Mọi transaction thay đổi state (order status, payment) PHẢI có `@Transactional` để đảm bảo ACID |
| **BR-GLB-004** | Process | PHẢI log đầy đủ các thao tác critical (payment, order status change, auth failure) dùng SLF4J |
| **BR-GLB-005** | Process | Tích hợp API bên ngoài (ZaloPay, OAuth2) PHẢI có retry logic với exponential backoff cho network error |
| **BR-GLB-006** | Constraint | Error message cho user PHẢI được localize và KHÔNG được expose thông tin hệ thống (stack trace, schema) |
| **BR-GLB-007** | Process | Validation PHẢI thực hiện ở 2 layer: Controller (input validation) và Service (business logic validation) |

---

## 8. Quy tắc Compliance (Tuân thủ)

| ID | Loại | Quy tắc |
|----|------|---------|
| **BR-REG-001** | Constraint | Tuân thủ PCI-DSS: KHÔNG được lưu số thẻ, CVV, hoặc thông tin thẻ đầy đủ. Thanh toán phải qua gateway (ZaloPay) |
| **BR-REG-002** | Constraint | Mật khẩu PHẢI: (1) Mã hóa BCrypt, (2) Độ dài tối thiểu 8 ký tự, (3) KHÔNG log hoặc truyền plain text |
| **BR-REG-003** | Process | PHẢI có audit trail cho mọi giao dịch tài chính (tạo đơn, thanh toán, refund) với timestamp và user attribution |
| **BR-REG-004** | Constraint | Dữ liệu cá nhân (email, phone, địa chỉ) PHẢI được bảo vệ theo GDPR/PDPA. Chỉ user được phân quyền mới truy cập được |

---

## 9. Traceability Matrix (Mapping Rule → Code)

| Rule ID | File Implementation | Method/Class |
|---------|---------------------|--------------|
| BR-AUTH-001 đến BR-AUTH-006 | `SecurityConfig.java` | `filterChain()`, `corsConfigurationSource()` |
| BR-AUTH-007 đến BR-AUTH-014 | `OrderSecurityService.java` | `canView()`, `canCancel()`, `canUpdateStatus()` |
| BR-ORD-001 đến BR-ORD-010 | `OrderStatus.java` | Enum + `isFinalState()`, `isCancellable()` |
| BR-ORD-011 đến BR-ORD-019 | `ShopOrderService.java` | `createOrder()` |
| BR-PAY-001 đến BR-PAY-008 | `ZalopayService.java` | `purchaseZalo()` |
| BR-PAY-009 đến BR-PAY-018 | `OrderInfo.java`, `ZalopayService.java` | Constructor, `zalopayHandlerCallBack()` |
| BR-PAY-019 đến BR-PAY-025 | `ZalopayService.java` | `zalopayHandlerCallBack()` + `processingOrders` |
| BR-PAY-026 đến BR-PAY-032 | `ZalopayService.java` | `schedulePaymentStatusPolling()` |
| BR-PAY-039 đến BR-PAY-044 | `ZalopayService.java` | `refund()`, `getRefundStatus()` |
| BR-INV-001 đến BR-INV-007 | `ProductItemService.java` | `create()`, `deleteById()`, `update()` |

---

## 10. Ví dụ Use Case thực tế

### UC-01: Khách hàng đặt hàng và thanh toán ZaloPay

**Business Requirement:**
- Khách hàng có thể đặt hàng và thanh toán qua ZaloPay

**Business Rules áp dụng:**

| Giai đoạn | Rules áp dụng | Mô tả |
|-----------|---------------|-------|
| **1. Tạo đơn hàng** | BR-ORD-011, BR-ORD-012, BR-ORD-013 | - Server tính tổng tiền (không tin client)<br>- Validate total > 0<br>- Phải có ít nhất 1 sản phẩm |
| | BR-ORD-014, BR-ORD-015 | - Validate OrderLine.total = qty × price<br>- Load ShippingMethod từ DB |
| | BR-ORD-002, BR-ORD-017, BR-ORD-018 | - Set trạng thái ban đầu = PENDING_PAYMENT<br>- Tạo ShopOrderStatus và ShopOrderPayment |
| **2. Tạo payment ZaloPay** | BR-PAY-001, BR-PAY-002, BR-PAY-003 | - Generate unique app_trans_id<br>- Convert amount sang Long VND<br>- Validate amount > 0 |
| | BR-PAY-010, BR-PAY-011, BR-PAY-012 | - Tạo HMAC signature với key1<br>- Input: app_id\|app_trans_id\|...<br>- Trim key1 trước khi hash |
| | BR-PAY-033, BR-PAY-034, BR-PAY-035 | - Check order.total > 0<br>- Check đơn chưa thanh toán<br>- Check chưa có payment duplicate |
| **3. Xử lý callback** | BR-PAY-016, BR-PAY-017, BR-PAY-018 | - Verify MAC với key2<br>- So sánh expectedMac vs callback.mac<br>- Reject nếu không khớp |
| | BR-PAY-019, BR-PAY-020, BR-PAY-021 | - Check idempotency (processingOrders map)<br>- Check đơn đã PAID chưa<br>- Tránh duplicate processing |
| | BR-PAY-024 | - Update order → PAID<br>- Update payment.status → PAID<br>- Lưu zp_trans_id |
| **4. Polling (localhost)** | BR-PAY-026, BR-PAY-027, BR-PAY-028 | - Poll sau 10s, mỗi 30s<br>- Tối đa 20 lần |
| | BR-PAY-029, BR-PAY-030, BR-PAY-031 | - return_code=1 → success<br>- return_code=2 → failed (cancel đơn)<br>- return_code=3 → tiếp tục poll |

**Flow diagram:**
```
1. User tạo đơn → Server validate (BR-ORD-011 đến BR-ORD-019)
2. Server tạo payment ZaloPay (BR-PAY-001 đến BR-PAY-008)
3. Server generate HMAC (BR-PAY-009 đến BR-PAY-013)
4. ZaloPay trả QR code → User scan & thanh toán
5. ZaloPay gửi callback → Server verify MAC (BR-PAY-016 đến BR-PAY-018)
6. Server check idempotency (BR-PAY-019 đến BR-PAY-021)
7. Server update order status PAID (BR-PAY-024)
8. (Localhost) Server poll status (BR-PAY-026 đến BR-PAY-032)
```

---

## 11. Testing Strategy

Để đảm bảo các Business Rule được implement đúng:

### 11.1. Unit Testing
- **Mỗi rule NÊN có unit test riêng**
- Ví dụ:
  - `BR-ORD-009`: Test `isCancellable()` với các trạng thái khác nhau
  - `BR-PAY-011`: Test HMAC generation với input chuẩn
  - `BR-INV-002`: Test delete ProductItem đã có trong OrderLine

### 11.2. Integration Testing
- **Test end-to-end flow:**
  - Tạo đơn → Thanh toán → Callback → Update status
  - Hủy đơn → Check trạng thái → Validate rule BR-ORD-005
  - Xóa ProductItem → Check OrderLine reference → Validate BR-INV-002

### 11.3. Security Testing
- Test authentication rules (BR-AUTH-*)
- Test authorization (canView, canCancel, canUpdateStatus)
- Test HMAC verification (BR-PAY-016 đến BR-PAY-018)

### 11.4. Payment Testing
- Test trong ZaloPay sandbox
- Test callback với MAC đúng/sai
- Test idempotency (gửi duplicate callback)
- Test polling logic

---

## 12. Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-28 | Initial version - Phân tích từ codebase hiện tại | BA Team |

---

## 13. Kết luận

Tài liệu này định nghĩa **70+ business rules** cho hệ thống E-commerce, được phân loại thành 4 module chính:

1. **Authentication & Authorization**: 14 rules về xác thực và phân quyền
2. **Order Processing**: 24 rules về quản lý đơn hàng và state machine
3. **Payment Integration**: 44 rules về tích hợp ZaloPay, HMAC, callback, polling
4. **Product & Inventory**: 7 rules về quản lý sản phẩm và tồn kho

Tất cả các rules đều:
- ✅ Được rút ra từ code thực tế
- ✅ Có ID để dễ tracking
- ✅ Phân loại rõ ràng (Constraint/Process/Data/Computation)
- ✅ Có ví dụ thực tế
- ✅ Có traceability matrix mapping tới code

**Lưu ý quan trọng:**
- Rules được đánh dấu **"QUAN TRỌNG"** cần ưu tiên review kỹ
- Rules có **"Recommended"** là enhancement suggestion (chưa implement)
- Mọi thay đổi rule PHẢI update tài liệu này và thông báo team

---

**Tài liệu được tạo bởi:** Senior Business Analyst  
**Ngày:** 28/01/2026  
**Dựa trên:** Phân tích codebase thực tế (Java Spring Boot + React)
