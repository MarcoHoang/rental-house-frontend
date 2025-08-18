# Hướng dẫn sử dụng Debug Components

## 🧪 **Các Component Debug có sẵn**

### 1. **ReviewDebugComponent**
Component để test tính năng review một cách riêng biệt.

**Vị trí**: `src/components/debug/ReviewDebugComponent.jsx`

**Cách sử dụng**:
```jsx
import ReviewDebugComponent from '../components/debug/ReviewDebugComponent';

// Thêm vào trang để test
<ReviewDebugComponent />
```

**Chức năng**:
- Form test tạo review
- Hiển thị thông tin user và authentication
- Log chi tiết lỗi nếu có
- Test với house ID cụ thể

### 2. **ApiTestComponent**
Component để test các API endpoint một cách có hệ thống.

**Vị trí**: `src/components/debug/ApiTestComponent.jsx`

**Cách sử dụng**:
```jsx
import ApiTestComponent from '../components/debug/ApiTestComponent';

// Thêm vào trang để test
<ApiTestComponent />
```

**Chức năng**:
- Test kết nối API cơ bản
- Test Reviews endpoint
- Test Create Review
- Test Authentication Status
- Hiển thị kết quả từng test riêng biệt

## 🔍 **Cách Debug Lỗi Review**

### **Bước 1: Sử dụng ReviewDebugComponent**
1. Import component vào trang
2. Điền thông tin test (House ID, Rating, Comment)
3. Nhấn "Test Tạo Review"
4. Xem kết quả và console logs

### **Bước 2: Sử dụng ApiTestComponent**
1. Import component vào trang
2. Chạy từng test một cách tuần tự
3. Xem kết quả của từng test
4. Xác định test nào bị lỗi

### **Bước 3: Kiểm tra Console Logs**
Mở Developer Tools (F12) > Console tab:
```javascript
// Cần thấy các log này:
console.log('=== REVIEW DEBUG START ===');
console.log('User:', user);
console.log('Token:', localStorage.getItem('token'));
console.log('Form data:', formData);
console.log('Review data to send:', reviewData);
console.log('=== REVIEW DEBUG END ===');
```

### **Bước 4: Kiểm tra Network Tab**
Trong Developer Tools > Network tab:
- Xem request đến `/api/reviews`
- Kiểm tra status code
- Xem request payload và response

## 🚨 **Các Lỗi Thường Gặp**

### **1. AxiosError - Network Error**
```
Error type: AxiosError
Error message: Network Error
Error code: NETWORK_ERROR
```

**Nguyên nhân**: Backend không chạy hoặc không accessible
**Khắc phục**: 
- Kiểm tra backend có đang chạy không
- Kiểm tra URL API có đúng không
- Kiểm tra CORS configuration

### **2. AxiosError - 401 Unauthorized**
```
Error status: 401
Error message: Unauthorized
```

**Nguyên nhân**: Token hết hạn hoặc không hợp lệ
**Khắc phục**:
- Đăng nhập lại
- Kiểm tra token trong localStorage
- Kiểm tra JWT configuration

### **3. AxiosError - 400 Bad Request**
```
Error status: 400
Error message: Bad Request
```

**Nguyên nhân**: Dữ liệu gửi không hợp lệ
**Khắc phục**:
- Kiểm tra format dữ liệu
- Kiểm tra required fields
- Kiểm tra validation rules

### **4. AxiosError - 404 Not Found**
```
Error status: 404
Error message: Not Found
```

**Nguyên nhân**: Endpoint không tồn tại hoặc resource không tìm thấy
**Khắc phục**:
- Kiểm tra API endpoint
- Kiểm tra House ID có tồn tại không
- Kiểm tra User ID có tồn tại không

### **5. AxiosError - 500 Internal Server Error**
```
Error status: 500
Error message: Internal Server Error
```

**Nguyên nhân**: Lỗi server hoặc database
**Khắc phục**:
- Kiểm tra backend logs
- Kiểm tra database connection
- Kiểm tra database schema

## 🛠️ **Công cụ Debug**

### **1. Console Logs**
```javascript
// Thêm vào code để debug
console.log('Debug info:', { user, houseId, formData });
console.error('Error details:', error);
```

### **2. Network Tab**
- Xem request/response details
- Kiểm tra headers
- Kiểm tra payload

### **3. Application Tab**
- Kiểm tra localStorage
- Kiểm tra sessionStorage
- Kiểm tra cookies

### **4. Sources Tab**
- Set breakpoints
- Step through code
- Inspect variables

## 📋 **Checklist Debug**

- [ ] **Backend**: Đang chạy và accessible
- [ ] **Database**: Bảng reviews đã được tạo
- [ ] **Authentication**: User đã đăng nhập, token còn hiệu lực
- [ ] **API Endpoints**: `/api/reviews` hoạt động
- [ ] **Data Validation**: Dữ liệu đúng format
- [ ] **CORS**: Không có lỗi CORS
- [ ] **Network**: Không có lỗi kết nối

## 🚀 **Quick Debug Commands**

### **Frontend**:
```javascript
// Kiểm tra user context
console.log('User:', user);

// Kiểm tra token
console.log('Token:', localStorage.getItem('token'));

// Kiểm tra API config
console.log('API URL:', import.meta.env.VITE_API_URL);
```

### **Backend**:
```bash
# Xem logs
tail -f logs/rental-house.log

# Restart service
mvn spring-boot:run

# Kiểm tra database
mysql -u username -p database_name
SHOW TABLES LIKE 'reviews';
```

## 📞 **Hỗ trợ Debug**

Nếu vẫn gặp lỗi, hãy cung cấp:

1. **Console logs** từ frontend
2. **Network request/response** details
3. **Backend logs** nếu có
4. **Screenshot** của lỗi
5. **Steps to reproduce** lỗi
6. **Environment info** (browser, OS, etc.)

## 🎯 **Mục tiêu Debug**

- ✅ Xác định chính xác nguyên nhân lỗi
- ✅ Khắc phục lỗi một cách có hệ thống
- ✅ Đảm bảo tính năng review hoạt động ổn định
- ✅ Cải thiện user experience
- ✅ Giảm thiểu lỗi trong tương lai
