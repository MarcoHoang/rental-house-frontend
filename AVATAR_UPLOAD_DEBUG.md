# Hướng dẫn Debug Upload Avatar

## Vấn đề hiện tại
- Lỗi 500 khi upload avatar
- API Error - Response Interceptor
- "Hệ thống đã xảy ra lỗi không mong muốn"

## Các bước debug

### 1. Kiểm tra Backend
- Đảm bảo backend đang chạy trên `http://localhost:8080`
- Kiểm tra endpoint `/api/files/upload/avatar` có hoạt động không
- Kiểm tra logs của backend để xem lỗi chi tiết

### 2. Kiểm tra Frontend
- Mở Developer Tools (F12)
- Vào tab Console
- Thử upload avatar và xem logs chi tiết

### 3. Test với các phương pháp khác nhau

#### Test 1: Sử dụng trang test
1. Vào trang `/avatar-test` (nếu có route)
2. Chọn file ảnh
3. Click "Test Upload Only" để xem logs chi tiết
4. Kiểm tra console để xem kết quả

#### Test 2: Sử dụng Postman hoặc curl
```bash
curl -X POST \
  http://localhost:8080/api/files/upload/avatar \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@/path/to/image.jpg' \
  -F 'uploadType=avatar'
```

### 4. Kiểm tra cấu hình

#### Backend API endpoints:
- `/api/files/upload/avatar` - Upload avatar chuyên biệt
- `/api/files/upload` - Upload file chung với uploadType

#### Frontend configuration:
- Base URL: `http://localhost:8080/api`
- Content-Type: Không set cho FormData (để browser tự set)
- Authorization: Bearer token

### 5. Các vấn đề có thể gặp

#### Vấn đề 1: Content-Type header
- Không set `Content-Type: multipart/form-data` cho FormData
- Để browser tự set với boundary

#### Vấn đề 2: FormData structure
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('uploadType', 'avatar');
```

#### Vấn đề 3: Authorization header
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

#### Vấn đề 4: File validation
- Kiểm tra file size (tối đa 5MB)
- Kiểm tra file type (JPG, PNG)
- Kiểm tra file không bị corrupt

### 6. Debug steps

1. **Kiểm tra token**: Đảm bảo user đã đăng nhập và có token
2. **Kiểm tra file**: Đảm bảo file hợp lệ
3. **Kiểm tra network**: Xem request/response trong Network tab
4. **Kiểm tra backend logs**: Xem lỗi chi tiết từ backend
5. **Test với file nhỏ**: Thử với file < 1MB trước

### 7. Fallback options

Nếu endpoint `/api/files/upload/avatar` không hoạt động:
1. Thử endpoint `/api/files/upload` với `uploadType=avatar`
2. Kiểm tra backend có hỗ trợ endpoint nào
3. Liên hệ backend team để xác nhận API

### 8. Logs cần kiểm tra

#### Frontend logs:
```
authService.uploadAvatar - Token exists: true/false
authService.uploadAvatar - FormData entries
authService.uploadAvatar - Upload config
authService.uploadAvatar - Response/Error
```

#### Backend logs:
- Request received
- File processing
- File saved
- Response sent

### 9. Common solutions

1. **Restart backend**: Đôi khi backend cần restart
2. **Clear browser cache**: Xóa cache và thử lại
3. **Check file permissions**: Đảm bảo backend có quyền write
4. **Check disk space**: Đảm bảo server có đủ dung lượng
5. **Check CORS**: Đảm bảo CORS được cấu hình đúng

### 10. Test cases

#### Test case 1: File nhỏ (< 1MB)
- Upload file JPG < 1MB
- Kiểm tra response

#### Test case 2: File vừa (1-5MB)
- Upload file JPG 1-5MB
- Kiểm tra response

#### Test case 3: File lớn (> 5MB)
- Upload file > 5MB
- Kiểm tra error handling

#### Test case 4: File không hợp lệ
- Upload file không phải ảnh
- Kiểm tra validation

#### Test case 5: Không có token
- Upload không đăng nhập
- Kiểm tra authentication
