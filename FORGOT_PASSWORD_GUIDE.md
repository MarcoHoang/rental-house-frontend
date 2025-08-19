# Hướng dẫn sử dụng tính năng Quên mật khẩu

## Tổng quan
Tính năng quên mật khẩu cho phép người dùng đặt lại mật khẩu khi quên mật khẩu cũ. Tính năng này hoạt động thông qua việc gửi token xác thực qua email.

## Luồng hoạt động

### Bước 1: Nhập email
- Người dùng nhập email đã đăng ký trong hệ thống
- Hệ thống gửi request đến backend để gửi email chứa token reset password

### Bước 2: Kiểm tra email
- Hiển thị thông báo email đã được gửi
- Cung cấp hướng dẫn kiểm tra email
- Có nút gửi lại email nếu cần thiết
- Nút "Tiếp tục" để chuyển sang bước nhập token

### Bước 3: Nhập token
- Người dùng copy token từ email và paste vào ô input
- Token thường là chuỗi ký tự dài (UUID format)
- Có nút gửi lại email nếu cần thiết
- Nút "Xác thực token" để chuyển sang bước đặt mật khẩu

### Bước 4: Đặt mật khẩu mới
- Người dùng nhập mật khẩu mới (tối thiểu 6 ký tự)
- Xác nhận mật khẩu mới
- Có tính năng hiển thị/ẩn mật khẩu
- Nút "Đặt lại mật khẩu" để hoàn tất quá trình

## API Endpoints

### Backend
- `POST /api/users/password-reset/request?email={email}` - Gửi request reset password
- `POST /api/users/password-reset/confirm?token={token}&newPassword={newPassword}` - Xác nhận token và đặt mật khẩu mới

### Frontend
- `authService.requestPasswordReset(email)` - Gửi request reset password
- `authService.resetPassword(token, newPassword)` - Đặt lại mật khẩu

## Tính năng bổ sung

### Gửi lại email
- Người dùng có thể gửi lại email chứa token mới
- Hữu ích khi email bị mất hoặc token hết hạn

### Validation
- Kiểm tra email hợp lệ
- Kiểm tra mật khẩu tối thiểu 6 ký tự
- Kiểm tra mật khẩu xác nhận khớp với mật khẩu mới

### UX/UI
- Step indicator rõ ràng
- Thông báo lỗi và thành công
- Loading states
- Responsive design
- Icons trực quan

## Bảo mật

### Token
- Token có thời hạn 30 phút
- Token được tạo ngẫu nhiên (UUID)
- Token bị xóa sau khi sử dụng

### Mật khẩu
- Mật khẩu được mã hóa trước khi lưu vào database
- Validation mật khẩu mạnh
- Không cho phép sử dụng mật khẩu cũ

## Xử lý lỗi

### Email không tồn tại
- Backend không trả về lỗi cụ thể để tránh lộ thông tin
- Frontend hiển thị thông báo chung

### Token hết hạn
- Backend trả về lỗi TOKEN_INVALID
- Frontend hướng dẫn người dùng gửi lại email

### Mật khẩu trùng với mật khẩu cũ
- Backend trả về lỗi DUPLICATE_OLD_PASSWORD
- Frontend hiển thị thông báo yêu cầu mật khẩu khác

## Tương lai

### Chuyển sang OTP
Khi backend được cập nhật để sử dụng OTP thay vì token:
1. Cập nhật `EmailService.sendResetPasswordEmail()` để gửi OTP
2. Thêm endpoint `POST /api/users/password-reset/verify-otp`
3. Cập nhật frontend để sử dụng OTP thay vì token
4. Thêm countdown timer cho OTP

### Cải thiện UX
- Thêm countdown timer cho token/OTP
- Auto-refresh khi token hết hạn
- Remember email để gửi lại dễ dàng
- Dark mode support

## Testing

### Test cases
1. Email hợp lệ - nhận được email
2. Email không tồn tại - không có lỗi cụ thể
3. Token hợp lệ - chuyển sang bước đặt mật khẩu
4. Token hết hạn - hiển thị lỗi
5. Mật khẩu mới hợp lệ - reset thành công
6. Mật khẩu trùng với mật khẩu cũ - hiển thị lỗi

### Manual testing
1. Truy cập `/forgot-password`
2. Nhập email hợp lệ
3. Kiểm tra email nhận được
4. Copy token và paste vào form
5. Đặt mật khẩu mới
6. Đăng nhập với mật khẩu mới

## Troubleshooting

### Email không nhận được
- Kiểm tra thư mục spam/junk
- Kiểm tra cấu hình SMTP backend
- Kiểm tra logs backend

### Token không hoạt động
- Kiểm tra token có bị cắt không
- Kiểm tra token có hết hạn không
- Gửi lại email để có token mới

### Lỗi validation
- Kiểm tra mật khẩu đủ 6 ký tự
- Kiểm tra mật khẩu xác nhận khớp
- Kiểm tra email format hợp lệ
