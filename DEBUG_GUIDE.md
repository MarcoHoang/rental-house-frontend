# Hướng dẫn Debug

## Các lỗi hiện tại

### 1. Lỗi 403 khi load avatar
**Vấn đề:** Backend trả về lỗi 403 khi truy cập file avatar
**Giải pháp tạm thời:** Đã sửa `avatarHelper.js` để sử dụng placeholder thay vì gọi API

### 2. Lỗi 400 khi gửi đơn đăng ký
**Vấn đề:** "Thông tin người dùng không đầy đủ"
**Nguyên nhân có thể:**
- User chưa đăng nhập hoặc token hết hạn
- Dữ liệu user trong localStorage không đầy đủ
- Backend validation lỗi

## Cách debug

### 1. Kiểm tra localStorage
Mở `test-localStorage.html` trong browser:
1. Click "Check LocalStorage" để xem token và user data
2. Click "Test User Data" để kiểm tra thông tin user
3. Click "Test API" để test API với token

### 2. Kiểm tra console
Mở Developer Tools (F12) và xem:
- Logs từ `HostRegistrationForm.jsx`
- Logs từ `hostApi.jsx`
- Network tab để xem request/response

### 3. Kiểm tra backend
Mở `test-backend.html` để test API trực tiếp:
1. Test file upload
2. Test submit application
3. Test get applications

## Các bước khắc phục

### Bước 1: Kiểm tra đăng nhập
1. Đăng xuất và đăng nhập lại
2. Kiểm tra localStorage có token và user data không
3. Test API profile endpoint

### Bước 2: Kiểm tra user data
User data cần có:
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "User Name",
  "username": "username",
  "roleName": "USER"
}
```

### Bước 3: Test API trực tiếp
Sử dụng `test-backend.html` để test:
1. Submit application không có file
2. Submit application có file
3. Kiểm tra response format

## Cấu trúc dữ liệu gửi đến backend

### Request format:
```json
{
  "userId": 1,
  "userEmail": "user@example.com",
  "username": "User Name",
  "status": "PENDING",
  "reason": "Đăng ký làm chủ nhà - CCCD: 123456789, Địa chỉ: Test Address\n\nẢnh đính kèm:\n- Mặt trước: http://localhost:8080/api/files/proof-of-ownership/front.jpg\n- Mặt sau: http://localhost:8080/api/files/proof-of-ownership/back.jpg",
  "requestDate": "2024-01-01T00:00:00.000Z"
}
```

### Response format:
```json
{
  "code": "00",
  "message": "Created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "userEmail": "user@example.com",
    "username": "User Name",
    "status": "PENDING",
    "reason": "...",
    "requestDate": "2024-01-01T00:00:00.000Z",
    "processedDate": null
  }
}
```

## Troubleshooting

### Lỗi "Thông tin người dùng không đầy đủ"
1. Kiểm tra localStorage có user data không
2. Kiểm tra user.id và user.email có tồn tại không
3. Đăng nhập lại nếu cần

### Lỗi 400 "Yêu cầu không hợp lệ"
1. Kiểm tra format dữ liệu gửi đến backend
2. Kiểm tra validation rules của backend
3. Test API trực tiếp với Postman hoặc test-backend.html

### Lỗi 403 khi load avatar
1. Tạm thời sử dụng placeholder
2. Cần kiểm tra backend để cho phép truy cập public avatar
3. Hoặc implement authenticated image loading

## Files test
- `test-localStorage.html`: Test localStorage và user data
- `test-backend.html`: Test API endpoints
- `test-api.html`: Test API trực tiếp

## Logs cần kiểm tra
1. Console logs từ HostRegistrationForm
2. Console logs từ hostApi
3. Network requests trong Developer Tools
4. Backend logs (nếu có quyền truy cập)
