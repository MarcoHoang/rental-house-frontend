# Hướng dẫn tính năng Đổi mật khẩu

## Tổng quan
Tính năng đổi mật khẩu cho phép người dùng thay đổi mật khẩu hiện tại của họ thông qua giao diện web.

## Tính năng chính
- Form đổi mật khẩu với 3 trường: mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu mới
- Hiển thị/ẩn mật khẩu
- Kiểm tra độ mạnh mật khẩu
- Validation client-side và server-side
- Modal xác nhận trước khi đổi mật khẩu
- Thông báo kết quả (toast notifications)

## Validation
- Kiểm tra độ dài mật khẩu (6-20 ký tự)
- Kiểm tra mật khẩu mới và xác nhận mật khẩu phải giống nhau
- Validation mật khẩu cũ khi submit (backend sẽ kiểm tra)
- Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ

## UI/UX
- Modal đẹp mắt với animation
- ConfirmModal thay thế alert/confirm của browser
- Loading spinner khi đang xử lý
- Toast notifications cho feedback
- Timeout 30 giây để tránh loading quá lâu

## Bảo mật
- Kiểm tra mật khẩu cũ
- Validation server-side
- Token authentication
- Kiểm tra quyền truy cập

## API Endpoints
- `PUT /api/users/{userId}/change-password` - Đổi mật khẩu
  - Request body: `{ oldPassword, newPassword, confirmPassword }`
  - Response: Success/Error message

## Components
- `ChangePassword.jsx` - Component chính cho form đổi mật khẩu
- `ChangePasswordModal.jsx` - Modal wrapper cho form
- `ConfirmModal.jsx` - Modal xác nhận thay thế alert/confirm

## Files đã tạo/cập nhật
- `src/components/common/ChangePassword.jsx`
- `src/components/common/ChangePasswordModal.jsx`
- `src/components/common/ConfirmModal.jsx`
- `src/pages/ChangePasswordPage.jsx`
- `src/pages/UserProfilePage.jsx`
- `src/api/authService.jsx`
- `src/App.jsx`

## Cách sử dụng
1. Vào trang Profile
2. Nhấn nút "Đổi mật khẩu"
3. Nhập mật khẩu hiện tại và mật khẩu mới
4. Nhấn "Đổi mật khẩu" để xác nhận
5. Nhấn "Xác nhận" trong modal
6. Chờ kết quả và thông báo

## Lưu ý
- Backend sẽ tự động kiểm tra mật khẩu cũ khi gọi API changePassword
- Không cần endpoint verify-password riêng
- Có timeout 30 giây để tránh loading quá lâu
- Tất cả validation được thực hiện khi submit
