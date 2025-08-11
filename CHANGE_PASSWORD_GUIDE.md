# Hướng dẫn sử dụng chức năng Đổi mật khẩu

## Tổng quan
Chức năng đổi mật khẩu đã được phát triển hoàn chỉnh và tích hợp vào hệ thống. Người dùng có thể đổi mật khẩu thông qua giao diện web một cách an toàn và dễ dàng.

## Các tính năng chính

### 1. Giao diện người dùng
- **Form đổi mật khẩu**: Giao diện đẹp mắt với validation real-time
- **Hiển thị/ẩn mật khẩu**: Nút toggle để hiển thị hoặc ẩn mật khẩu
- **Độ mạnh mật khẩu**: Hiển thị độ mạnh của mật khẩu mới (yếu/trung bình/mạnh)
- **Validation real-time**: Kiểm tra lỗi ngay khi người dùng nhập

### 2. Validation
- **Mật khẩu hiện tại**: Bắt buộc nhập
- **Mật khẩu mới**: 
  - Tối thiểu 6 ký tự, tối đa 20 ký tự
  - Không được trùng với mật khẩu cũ
  - Hiển thị độ mạnh mật khẩu
- **Xác nhận mật khẩu**: Phải khớp với mật khẩu mới

### 3. Xử lý lỗi
- **Lỗi mật khẩu hiện tại**: Hiển thị thông báo nếu mật khẩu cũ không đúng
- **Lỗi validation**: Hiển thị lỗi cụ thể cho từng trường
- **Lỗi mạng**: Xử lý các lỗi kết nối và timeout
- **Lỗi server**: Hiển thị thông báo lỗi từ backend

### 4. Bảo mật
- **Xác nhận trước khi đổi**: Modal xác nhận trước khi thực hiện
- **Token authentication**: Sử dụng JWT token để xác thực
- **Logout tự động**: Tự động đăng xuất nếu token hết hạn

## Cách sử dụng

### 1. Truy cập trang đổi mật khẩu
- Đăng nhập vào hệ thống
- Vào trang **Hồ sơ cá nhân** (`/profile`)
- Cuộn xuống phần **"Bảo mật tài khoản"**
- Nhấn nút **"Đổi mật khẩu"**

### 2. Hoặc truy cập trực tiếp
- Truy cập đường dẫn: `/change-password`

### 3. Thực hiện đổi mật khẩu
1. Nhập **mật khẩu hiện tại**
2. Nhập **mật khẩu mới** (tối thiểu 6 ký tự)
3. **Xác nhận mật khẩu mới**
4. Nhấn **"Đổi mật khẩu"**
5. Xác nhận trong modal
6. Chờ thông báo thành công

## Cấu trúc code

### 1. Components
- `src/components/common/ChangePassword.jsx` - Component chính
- `src/components/common/ChangePasswordModal.jsx` - Modal wrapper
- `src/pages/ChangePasswordPage.jsx` - Trang đổi mật khẩu

### 2. API Service
- `src/api/authService.jsx` - Service gọi API đổi mật khẩu

### 3. Routes
- `/change-password` - Trang đổi mật khẩu (yêu cầu đăng nhập)

## API Endpoint

### Backend API
```
PUT /api/users/{userId}/change-password
```

### Request Body
```json
{
  "oldPassword": "string",
  "newPassword": "string", 
  "confirmPassword": "string"
}
```

### Response
```json
{
  "code": "00",
  "message": "Đổi mật khẩu thành công",
  "data": null
}
```

## Validation Rules

### Frontend Validation
- **oldPassword**: Bắt buộc nhập
- **newPassword**: 6-20 ký tự, không trùng mật khẩu cũ
- **confirmPassword**: Phải khớp với newPassword

### Backend Validation (Jakarta Validation)
- **@NotBlank**: Tất cả trường bắt buộc
- **@Size(min=6, max=20)**: Mật khẩu mới từ 6-20 ký tự

## Xử lý lỗi

### Các loại lỗi được xử lý
1. **400 Bad Request**: Lỗi validation từ backend
2. **401 Unauthorized**: Token hết hạn
3. **403 Forbidden**: Không có quyền
4. **404 Not Found**: User không tồn tại
5. **Network errors**: Lỗi kết nối, timeout

### Thông báo lỗi cụ thể
- Mật khẩu hiện tại không đúng
- Mật khẩu xác nhận không khớp
- Mật khẩu mới trùng với mật khẩu cũ
- Mật khẩu không đủ độ dài
- Phiên đăng nhập hết hạn

## Testing

### Test Cases
1. **Đổi mật khẩu thành công**
2. **Mật khẩu cũ sai**
3. **Mật khẩu mới quá ngắn**
4. **Mật khẩu xác nhận không khớp**
5. **Mật khẩu mới trùng mật khẩu cũ**
6. **Chưa đăng nhập**
7. **Token hết hạn**

### Cách test
1. Chạy ứng dụng: `npm start`
2. Đăng nhập với tài khoản test
3. Vào trang profile hoặc `/change-password`
4. Test các trường hợp trên

## Lưu ý quan trọng

1. **Bảo mật**: Mật khẩu được mã hóa trước khi gửi lên server
2. **Session**: Sau khi đổi mật khẩu thành công, người dùng có thể tiếp tục sử dụng
3. **Validation**: Cả frontend và backend đều có validation để đảm bảo an toàn
4. **UX**: Giao diện thân thiện với thông báo rõ ràng
5. **Error Handling**: Xử lý lỗi toàn diện với thông báo cụ thể

## Tương lai

### Có thể cải thiện
1. **Two-factor authentication**: Thêm xác thực 2 yếu tố
2. **Password history**: Kiểm tra mật khẩu đã sử dụng trước đó
3. **Email notification**: Gửi email thông báo khi đổi mật khẩu
4. **Password strength meter**: Hiển thị độ mạnh mật khẩu chi tiết hơn
5. **Rate limiting**: Giới hạn số lần đổi mật khẩu
