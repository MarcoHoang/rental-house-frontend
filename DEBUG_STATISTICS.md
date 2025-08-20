# Debug Tính năng Thống kê & Báo cáo

## Vấn đề hiện tại
Khi click vào nút "Xem thống kê" trong HostDashboard, người dùng bị chuyển hướng về trang chủ thay vì hiển thị thống kê.

## Các bước debug

### 1. Kiểm tra Console Browser
Mở Developer Tools (F12) và xem Console tab để kiểm tra:
- Các log từ `useAuth` hook
- Các log từ `HostStatistics` component
- Lỗi JavaScript hoặc network

### 2. Sử dụng Test Mode
Trong component thống kê, có nút "Bật Test Mode":
- Click vào nút này để hiển thị debug info
- Kiểm tra thông tin user, role, token
- Theo dõi URL changes

### 3. Kiểm tra thông tin User
Trong Test Mode, xem:
- **User ID**: Có tồn tại không?
- **User Role**: Có phải "HOST" không?
- **Token**: Có tồn tại trong localStorage không?
- **Current URL**: URL hiện tại có đúng không?

### 4. Kiểm tra Network Tab
Trong Developer Tools > Network:
- Xem có API call nào bị lỗi không
- Kiểm tra response status (401, 403, 500...)
- Xem có redirect nào không mong muốn không

### 5. Kiểm tra Application Tab
Trong Developer Tools > Application:
- **Local Storage**: Kiểm tra token và user data
- **Session Storage**: Kiểm tra session data
- **Cookies**: Kiểm tra authentication cookies

## Các nguyên nhân có thể

### 1. User không có role HOST
- Kiểm tra `user.roleName` có phải "HOST" không
- Nếu không phải, ProtectedRoute sẽ redirect về "/"

### 2. Token hết hạn
- API trả về 401 Unauthorized
- useAuth hook clear data và redirect

### 3. Lỗi trong API call
- Network error
- Server error (500)
- CORS error

### 4. Lỗi trong ProtectedRoute
- Logic kiểm tra quyền bị sai
- Redirect không mong muốn

## Cách sửa

### 1. Kiểm tra role user
```javascript
// Trong useAuth hook
console.log('User role:', user?.roleName);
```

### 2. Kiểm tra token
```javascript
// Trong localStorage
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
```

### 3. Kiểm tra API response
```javascript
// Trong HostStatistics component
try {
  const response = await hostApi.getStatistics(period);
  console.log('API response:', response);
} catch (err) {
  console.error('API error:', err.response);
}
```

### 4. Kiểm tra routing
```javascript
// Trong ProtectedRoute
console.log('Checking access for role:', userRole);
```

## Test Cases

### Test 1: User có role HOST
- Đăng nhập với tài khoản host
- Vào Dashboard
- Click "Xem thống kê"
- Kết quả mong đợi: Hiển thị thống kê

### Test 2: User không có role HOST
- Đăng nhập với tài khoản user thường
- Vào Dashboard
- Click "Xem thống kê"
- Kết quả mong đợi: Hiển thị lỗi "Không có quyền"

### Test 3: Token hết hạn
- Để token hết hạn
- Click "Xem thống kê"
- Kết quả mong đợi: Hiển thị lỗi "Phiên đăng nhập hết hạn"

## Logs cần kiểm tra

1. **useAuth.checkAuth**: Kiểm tra user data từ localStorage
2. **useAuth.checkAuth - User role**: Kiểm tra role của user
3. **HostStatistics useEffect**: Kiểm tra user và quyền truy cập
4. **HostStatistics fetchStatistics**: Kiểm tra API call
5. **ProtectedRoute**: Kiểm tra logic kiểm tra quyền

## Kết luận
Sử dụng Test Mode để debug và kiểm tra console logs để xác định nguyên nhân chính xác của vấn đề redirect.
