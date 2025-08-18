# Hướng dẫn khắc phục lỗi Review

## 🚨 **Lỗi: "Có lỗi xảy ra khi lưu đánh giá"**

### **Nguyên nhân có thể:**

#### 1. **Database chưa có bảng reviews**
- Bảng `reviews` chưa được tạo trong database
- Cần chạy migration để tạo bảng

#### 2. **Authentication/Authorization**
- User chưa đăng nhập
- Token hết hạn
- Không có quyền tạo review

#### 3. **Validation errors**
- Dữ liệu không hợp lệ
- House ID không tồn tại
- User ID không tồn tại

#### 4. **Backend service errors**
- Lỗi trong ReviewService
- Lỗi database connection
- Lỗi validation

### **🔧 Cách khắc phục:**

#### **Bước 1: Kiểm tra Database**
```sql
-- Kiểm tra xem bảng reviews có tồn tại không
SHOW TABLES LIKE 'reviews';

-- Nếu không có, chạy migration
-- File: rental-house-backend/src/main/resources/db/migration/V2__create_reviews_table.sql
```

#### **Bước 2: Kiểm tra Console Log**
Mở Developer Tools (F12) và xem Console tab:
```javascript
// Cần thấy các log này:
console.log('Submitting review data:', reviewData);
console.log('User object:', user);
console.log('House ID:', houseId);
console.log('Creating review:', reviewData);
console.log('API endpoint: /reviews');
console.log('Request body:', requestBody);
```

#### **Bước 3: Kiểm tra Network Tab**
Trong Developer Tools > Network tab:
- Xem request đến `/api/reviews`
- Kiểm tra status code
- Xem response data

#### **Bước 4: Kiểm tra Backend Logs**
```bash
# Xem logs của backend
tail -f rental-house-backend/logs/rental-house.log

# Hoặc xem console khi chạy backend
mvn spring-boot:run
```

#### **Bước 5: Test với Debug Component**
Sử dụng `ReviewDebugComponent` để test:
```jsx
import ReviewDebugComponent from '../components/debug/ReviewDebugComponent';

// Thêm vào trang để test
<ReviewDebugComponent />
```

### **📋 Checklist khắc phục:**

- [ ] **Database**: Bảng `reviews` đã được tạo
- [ ] **Backend**: Service đang chạy và accessible
- [ ] **Authentication**: User đã đăng nhập, token còn hiệu lực
- [ ] **Data**: House ID và User ID hợp lệ
- [ ] **Network**: Không có lỗi CORS hoặc connection
- [ ] **Validation**: Dữ liệu đúng format

### **🐛 Debug Commands:**

#### **Frontend:**
```javascript
// Kiểm tra user context
console.log('User:', user);
console.log('Token:', localStorage.getItem('token'));

// Kiểm tra form data
console.log('Form data:', formData);
console.log('House ID:', houseId);
```

#### **Backend:**
```java
// Thêm log vào ReviewServiceImpl
@Slf4j
public class ReviewServiceImpl {
    
    @Override
    @Transactional
    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        log.info("Creating review: {}", reviewDTO);
        
        User reviewer = findUserByIdOrThrow(reviewDTO.getReviewerId());
        log.info("Found reviewer: {}", reviewer.getId());
        
        House house = findHouseByIdOrThrow(reviewDTO.getHouseId());
        log.info("Found house: {}", house.getId());
        
        // ... rest of the method
    }
}
```

### **🔍 Common Error Patterns:**

#### **Error 400 (Bad Request):**
- Dữ liệu không hợp lệ
- Thiếu required fields
- Format không đúng

#### **Error 401 (Unauthorized):**
- Token hết hạn
- User chưa đăng nhập
- Token không hợp lệ

#### **Error 404 (Not Found):**
- House ID không tồn tại
- User ID không tồn tại
- API endpoint không đúng

#### **Error 500 (Internal Server Error):**
- Lỗi database
- Lỗi trong service logic
- Exception không được handle

### **✅ Test Cases:**

1. **Test với user đã đăng nhập**
2. **Test với house ID hợp lệ**
3. **Test với rating 1-5**
4. **Test với comment không rỗng**
5. **Test tạo review lần đầu**
6. **Test tạo review trùng lặp (sẽ bị từ chối)**

### **📞 Hỗ trợ:**

Nếu vẫn gặp lỗi, hãy cung cấp:
1. **Console logs** từ frontend
2. **Network request/response** details
3. **Backend logs** nếu có
4. **Database schema** của bảng reviews
5. **User authentication** status

### **🚀 Quick Fix:**

```bash
# 1. Restart backend
cd rental-house-backend
mvn spring-boot:run

# 2. Clear browser cache và localStorage
# 3. Đăng nhập lại
# 4. Test với ReviewDebugComponent
```
