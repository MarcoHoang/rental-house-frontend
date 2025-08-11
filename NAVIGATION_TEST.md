# Test Navigation Flow - Đổi mật khẩu

## Các trường hợp test

### 1. Từ Profile → Change Password → Quay lại
**Steps:**
1. Vào trang Profile (`/profile`)
2. Bấm nút "Đổi mật khẩu"
3. Trang Change Password mở ra
4. Bấm "Quay lại" hoặc "Hủy"
5. **Expected:** Quay lại trang Profile

### 2. Từ Profile → Change Password → Đổi thành công
**Steps:**
1. Vào trang Profile (`/profile`)
2. Bấm nút "Đổi mật khẩu"
3. Điền form và đổi mật khẩu thành công
4. **Expected:** Quay lại trang Profile với thông báo thành công

### 3. Truy cập trực tiếp Change Password
**Steps:**
1. Truy cập trực tiếp `/change-password`
2. Bấm "Quay lại" hoặc "Hủy"
3. **Expected:** Chuyển về trang Profile (fallback)

### 4. Từ trang khác → Change Password
**Steps:**
1. Từ bất kỳ trang nào khác
2. Navigate đến `/change-password` với state
3. Bấm "Quay lại"
4. **Expected:** Quay lại trang gốc

## Cách test

### Test 1: Navigation từ Profile
```javascript
// Trong UserProfilePage
navigate('/change-password', { 
  state: { from: '/profile' } 
});

// Trong ChangePasswordPage
const originalPage = getOriginalPage(); // Returns '/profile'
navigate(originalPage, { replace: true });
```

### Test 2: Truy cập trực tiếp
```javascript
// Truy cập trực tiếp /change-password
// Không có state

// Trong ChangePasswordPage
const originalPage = getOriginalPage(); // Returns '/profile' (fallback)
navigate(originalPage, { replace: true });
```

## Kết quả mong đợi

✅ **Đã sửa:**
- Navigation từ Profile → Change Password → Quay lại Profile
- Không còn loop vô tận
- Fallback về Profile khi truy cập trực tiếp
- Sử dụng `replace: true` để tránh thêm vào history stack

## Files đã cập nhật

1. **`src/pages/ChangePasswordPage.jsx`**
   - Thêm `useLocation` hook
   - Thêm `getOriginalPage()` function
   - Cập nhật `handleSuccess`, `handleCancel`, `handleGoBack`
   - Sử dụng `replace: true` để tránh loop

2. **`src/pages/UserProfilePage.jsx`**
   - Cập nhật nút "Đổi mật khẩu" để truyền state

## Lưu ý

- Sử dụng `replace: true` để thay thế entry hiện tại trong history stack
- Fallback về `/profile` khi không có state
- Đảm bảo navigation flow mượt mà và logic
