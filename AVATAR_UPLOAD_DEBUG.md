# Hướng dẫn Debug Upload Avatar

## Vấn đề hiện tại
- Lỗi 500 khi upload avatar
- API Error - Response Interceptor
- "Hệ thống đã xảy ra lỗi không mong muốn"
- **MỚI**: Lỗi CORS khi load ảnh đã upload (403 Forbidden)
- **MỚI**: URL không hợp lệ với double slashes

## Các bước debug

### 1. Kiểm tra Backend
- Đảm bảo backend đang chạy trên `http://localhost:8080`
- Kiểm tra endpoint `/api/files/upload/avatar` có hoạt động không
- Kiểm tra logs của backend để xem lỗi chi tiết
- **QUAN TRỌNG**: Kiểm tra cấu hình CORS cho file serving

### 2. Kiểm tra Frontend
- Mở Developer Tools (F12)
- Vào tab Console
- Thử upload avatar và xem logs chi tiết
- Kiểm tra Network tab để xem CORS errors

### 3. Vấn đề CORS mới

#### Lỗi CORS khi load ảnh:
```
Access to fetch at 'http://localhost:8080/api/files//default-avatar.png' 
from origin 'http://localhost:5174' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

#### Giải pháp đã implement:
1. **Authenticated Image Loading**: Sử dụng `fetch` với Authorization header
2. **Fallback Mechanism**: Thử load với auth trước, nếu thất bại thì thử không auth
3. **Placeholder Images**: Sử dụng placeholder thay vì local file bị corrupt
4. **Debug Functions**: Thêm debug để test các phương pháp load khác nhau

### 4. Test với các phương pháp khác nhau

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

#### Test 3: Test CORS với curl
```bash
# Test preflight request
curl -X OPTIONS \
  http://localhost:8080/api/files/avatar/test.jpg \
  -H 'Origin: http://localhost:5174' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: Authorization' \
  -v

# Test actual request
curl -X GET \
  http://localhost:8080/api/files/avatar/test.jpg \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Origin: http://localhost:5174' \
  -v
```

### 5. Kiểm tra cấu hình

#### Backend API endpoints:
- `/api/files/upload/avatar` - Upload avatar chuyên biệt
- `/api/files/upload` - Upload file chung với uploadType
- `/api/files/avatar/*` - Serve avatar files (cần CORS config)

#### Frontend configuration:
- Base URL: `http://localhost:8080/api`
- Content-Type: Không set cho FormData (để browser tự set)
- Authorization: Bearer token

#### CORS Configuration cần thiết:
Backend cần cấu hình CORS cho file serving:
```java
// Spring Boot CORS config
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/files/**")
            .allowedOrigins("http://localhost:5174", "http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

### 6. Các vấn đề có thể gặp

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

#### Vấn đề 5: CORS Configuration (MỚI)
- Backend không có CORS headers cho file serving
- Preflight request bị block
- Missing Access-Control-Allow-Origin header

### 7. Debug steps

1. **Kiểm tra token**: Đảm bảo user đã đăng nhập và có token
2. **Kiểm tra file**: Đảm bảo file hợp lệ
3. **Kiểm tra network**: Xem request/response trong Network tab
4. **Kiểm tra backend logs**: Xem lỗi chi tiết từ backend
5. **Test với file nhỏ**: Thử với file < 1MB trước
6. **Kiểm tra CORS**: Xem preflight request có thành công không
7. **Test authenticated loading**: Kiểm tra image loading với auth

### 8. Fallback options

Nếu endpoint `/api/files/upload/avatar` không hoạt động:
1. Thử endpoint `/api/files/upload` với `uploadType=avatar`
2. Kiểm tra backend có hỗ trợ endpoint nào
3. Liên hệ backend team để xác nhận API

Nếu CORS vẫn có vấn đề:
1. Sử dụng placeholder images tạm thời
2. Yêu cầu backend team cấu hình CORS cho file serving
3. Sử dụng proxy server để bypass CORS

### 9. Logs cần kiểm tra

#### Frontend logs:
```
authService.uploadAvatar - Token exists: true/false
authService.uploadAvatar - FormData entries
authService.uploadAvatar - Upload config
authService.uploadAvatar - Response/Error
debugImageLoading - Test results
loadAuthenticatedImage - Success/failure
```

#### Backend logs:
- Request received
- File processing
- File saved
- Response sent
- CORS headers added

### 10. Common solutions

1. **Restart backend**: Đôi khi backend cần restart
2. **Clear browser cache**: Xóa cache và thử lại
3. **Check file permissions**: Đảm bảo backend có quyền write
4. **Check disk space**: Đảm bảo server có đủ dung lượng
5. **Check CORS**: Đảm bảo CORS được cấu hình đúng
6. **Configure file serving**: Đảm bảo file serving có CORS headers

### 11. Test cases

#### Test case 1: File nhỏ (< 1MB)
- Upload file JPG < 1MB
- Kiểm tra response
- Kiểm tra image loading

#### Test case 2: File vừa (1-5MB)
- Upload file JPG 1-5MB
- Kiểm tra response
- Kiểm tra image loading

#### Test case 3: File lớn (> 5MB)
- Upload file > 5MB
- Kiểm tra error handling

#### Test case 4: File không hợp lệ
- Upload file không phải ảnh
- Kiểm tra validation

#### Test case 5: Không có token
- Upload không đăng nhập
- Kiểm tra authentication

#### Test case 6: CORS test (MỚI)
- Upload avatar thành công
- Kiểm tra image loading với auth
- Kiểm tra fallback khi auth thất bại

### 12. Temporary Workarounds

Nếu CORS vẫn là vấn đề:
1. Sử dụng placeholder images cho tất cả avatars
2. Implement server-side image serving với proper CORS
3. Sử dụng CDN cho image hosting
4. Base64 encode images (không khuyến khích cho production)
