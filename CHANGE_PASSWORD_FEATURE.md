# Tính năng Đổi Mật khẩu

## Tổng quan
Tính năng đổi mật khẩu cho phép người dùng thay đổi mật khẩu của họ một cách an toàn với các validation đầy đủ.

## Các thành phần đã phát triển

### 1. API Service (`src/api/authService.jsx`)
- Method `changePassword(userId, oldPassword, newPassword, confirmPassword)`
- Gọi API `PUT /api/users/{id}/change-password`
- Xử lý response và error handling

### 2. Component Đổi Mật khẩu (`src/components/common/ChangePassword.jsx`)
- Form đổi mật khẩu với validation real-time
- Hiển thị độ mạnh mật khẩu
- Toggle hiển thị/ẩn mật khẩu
- Xử lý lỗi từ backend

### 3. Modal Component (`src/components/common/ChangePasswordModal.jsx`)
- Modal overlay để hiển thị form đổi mật khẩu
- Có thể đóng bằng cách click bên ngoài hoặc nút X

### 4. Trang Đổi Mật khẩu (`src/pages/ChangePasswordPage.jsx`)
- Trang riêng biệt cho đổi mật khẩu
- Có nút quay lại về trang profile

### 5. Tích hợp vào UserProfilePage
- Nút "Đổi mật khẩu" trong trang profile
- Mở modal đổi mật khẩu khi click

## Cách sử dụng

### 1. Từ trang Profile
1. Đăng nhập vào hệ thống
2. Vào trang Profile (`/profile`)
3. Click nút "Đổi mật khẩu"
4. Điền thông tin:
   - Mật khẩu hiện tại
   - Mật khẩu mới (tối thiểu 6 ký tự)
   - Xác nhận mật khẩu mới
5. Click "Đổi mật khẩu" để xác nhận

### 2. Từ trang riêng biệt
1. Truy cập trực tiếp `/change-password`
2. Điền thông tin tương tự như trên
3. Click "Đổi mật khẩu"

## Validation

### Frontend Validation
- Mật khẩu hiện tại: Bắt buộc
- Mật khẩu mới: Tối thiểu 6 ký tự, tối đa 20 ký tự
- Xác nhận mật khẩu: Phải khớp với mật khẩu mới
- Mật khẩu mới không được trùng với mật khẩu cũ

### Backend Validation
- Kiểm tra mật khẩu hiện tại có đúng không
- Kiểm tra mật khẩu xác nhận có khớp không
- Kiểm tra mật khẩu mới có trùng với mật khẩu cũ không
- Validation theo annotation `@Size(min = 6, max = 20)`

## Xử lý lỗi

### Các loại lỗi được xử lý
- `INVALID_PASSWORD`: Mật khẩu hiện tại không đúng
- `PASSWORD_CONFIRMATION_MISMATCH`: Mật khẩu xác nhận không khớp
- `DUPLICATE_OLD_PASSWORD`: Mật khẩu mới trùng với mật khẩu cũ
- `FORBIDDEN_ACTION`: Không có quyền thực hiện
- `USER_NOT_FOUND`: Không tìm thấy user
- Validation errors từ backend

### Hiển thị lỗi
- Lỗi được hiển thị dưới từng field tương ứng
- Toast notification cho lỗi chung
- Clear error khi user bắt đầu nhập lại

## Bảo mật

### Frontend
- Mật khẩu được ẩn mặc định
- Có thể toggle hiển thị/ẩn
- Validation real-time để UX tốt hơn

### Backend
- Kiểm tra quyền truy cập (chỉ user hiện tại mới đổi được mật khẩu của mình)
- Mã hóa mật khẩu mới trước khi lưu
- Validation đầy đủ

## API Endpoint

```
PUT /api/users/{id}/change-password
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "oldPassword": "string",
  "newPassword": "string", 
  "confirmPassword": "string"
}

Response:
{
  "code": "00",
  "message": "Đổi mật khẩu thành công"
}
```

## Cấu trúc file

```
src/
├── api/
│   └── authService.jsx          # API service cho đổi mật khẩu
├── components/
│   └── common/
│       ├── ChangePassword.jsx   # Component form đổi mật khẩu
│       └── ChangePasswordModal.jsx # Modal wrapper
├── pages/
│   ├── ChangePasswordPage.jsx   # Trang đổi mật khẩu riêng biệt
│   └── UserProfilePage.jsx      # Tích hợp nút đổi mật khẩu
└── App.jsx                      # Route configuration
```

## Lưu ý

1. **Authentication**: Cần đăng nhập để sử dụng tính năng
2. **Token**: API call cần có Bearer token hợp lệ
3. **Session**: Nếu token hết hạn, user sẽ được chuyển hướng về trang login
4. **UX**: Có loading state và confirmation modal để tránh thao tác nhầm
5. **Error Handling**: Xử lý đầy đủ các trường hợp lỗi từ backend

## Testing

### Test cases cần kiểm tra
1. Đổi mật khẩu thành công
2. Mật khẩu hiện tại sai
3. Mật khẩu xác nhận không khớp
4. Mật khẩu mới trùng với mật khẩu cũ
5. Mật khẩu mới quá ngắn/dài
6. Không có quyền truy cập
7. Token hết hạn
8. Network error

### Manual testing
1. Test từ trang profile
2. Test từ trang riêng biệt
3. Test các validation
4. Test error handling
5. Test responsive design
