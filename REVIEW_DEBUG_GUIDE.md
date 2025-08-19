# Hướng dẫn Debug tính năng Review

## 🚨 **Vấn đề hiện tại:**

Tính năng tạo review vẫn bị lỗi 400 Bad Request sau khi đã sửa field mapping. Cần debug chi tiết hơn để tìm nguyên nhân thực sự.

## 🔍 **Các bước debug đã thực hiện:**

### **1. Sửa field mapping**
- ✅ `userId` → `reviewerId`
- ✅ `reviewData.userId` → `reviewData.reviewerId`

### **2. Thêm validation chi tiết**
- ✅ Kiểm tra House ID hợp lệ
- ✅ Kiểm tra User ID hợp lệ  
- ✅ Kiểm tra Rating từ 1-5
- ✅ Kiểm tra Comment không rỗng và độ dài hợp lệ

### **3. Đảm bảo data types**
- ✅ `houseId: Number(houseId)`
- ✅ `reviewerId: Number(user.id)`
- ✅ `rating: Number(formData.rating)`

### **4. Thêm console logs chi tiết**
- ✅ Log toàn bộ reviewData
- ✅ Log data types
- ✅ Log request body trong API

## 🧪 **Component Debug mới:**

Đã tạo `ReviewDebugForm` component để test tạo review một cách độc lập:

### **Tính năng:**
- Form đơn giản với các field cần thiết
- Validation rõ ràng
- Log chi tiết về data và response
- Hiển thị kết quả success/error

### **Cách sử dụng:**
1. **Chỉ hiển thị trong development mode**
2. **Điền đầy đủ thông tin:**
   - House ID (số)
   - Reviewer ID (số)
   - Rating (1-5)
   - Comment (1-1000 ký tự)
3. **Click "Test Tạo Review"**
4. **Xem kết quả và console logs**

## 🔍 **Debug checklist:**

### **Frontend Validation:**
- [ ] House ID là số hợp lệ
- [ ] Reviewer ID là số hợp lệ
- [ ] Rating từ 1-5
- [ ] Comment không rỗng và độ dài hợp lệ

### **Data Types:**
- [ ] `houseId` là number
- [ ] `reviewerId` là number
- [ ] `rating` là number
- [ ] `comment` là string

### **API Request:**
- [ ] Request body có đúng field names
- [ ] Data types đúng
- [ ] Validation annotations pass

### **Backend Response:**
- [ ] Error message cụ thể
- [ ] Validation errors
- [ ] Database constraints

## 🚀 **Cách debug:**

### **Bước 1: Sử dụng ReviewDebugForm**
1. Vào trang chi tiết nhà
2. Cuộn xuống cuối để thấy ReviewDebugForm
3. Điền thông tin test
4. Submit và xem kết quả

### **Bước 2: Kiểm tra Console Logs**
1. Mở DevTools Console
2. Submit review
3. Xem logs chi tiết:
   - Form data
   - Converted data
   - Data types
   - API request
   - Response/Error

### **Bước 3: Kiểm tra Network Tab**
1. Mở DevTools Network
2. Submit review
3. Xem request payload
4. Xem response details

### **Bước 4: Kiểm tra Backend Logs**
1. Xem backend console
2. Kiểm tra validation errors
3. Kiểm tra database constraints

## 📋 **Test Cases:**

### **Test Case 1: Dữ liệu hợp lệ**
```
House ID: 14
Reviewer ID: 1
Rating: 5
Comment: "Nhà đẹp, rất hài lòng!"
```
**Kết quả mong đợi:** Success 200

### **Test Case 2: Rating không hợp lệ**
```
House ID: 14
Reviewer ID: 1
Rating: 0
Comment: "Test comment"
```
**Kết quả mong đợi:** Error - Rating phải từ 1-5

### **Test Case 3: Comment quá dài**
```
House ID: 14
Reviewer ID: 1
Rating: 5
Comment: "A".repeat(1001)
```
**Kết quả mong đợi:** Error - Comment quá 1000 ký tự

### **Test Case 4: House ID không tồn tại**
```
House ID: 99999
Reviewer ID: 1
Rating: 5
Comment: "Test comment"
```
**Kết quả mong đợi:** Error 404 - House not found

## 🔧 **Các vấn đề có thể gặp:**

### **1. Validation Errors:**
- Rating không đúng range (1-5)
- Comment quá ngắn hoặc quá dài
- House ID hoặc Reviewer ID không hợp lệ

### **2. Data Type Errors:**
- String thay vì number cho ID
- String thay vì number cho rating
- Null/undefined values

### **3. Backend Constraints:**
- House không tồn tại
- User không tồn tại
- Database foreign key violations

### **4. API Issues:**
- Endpoint không đúng
- Authentication/Authorization
- CORS issues

## 📝 **Debug Logs cần xem:**

### **Frontend Logs:**
```
=== DEBUG REVIEW SUBMISSION ===
Submitting review data: {...}
User object: {...}
Reviewer ID: 1
House ID: 14
Rating: 5
Comment: "Test comment"
=== END DEBUG ===
```

### **API Logs:**
```
=== DEBUG REVIEW API ===
Creating review: {...}
Request body: {...}
Request body types: {...}
Request body values: {...}
=== END DEBUG ===
```

### **Error Logs:**
```
Error creating review: AxiosError
Error response: {...}
Error status: 400
Error data: {...}
```

## 🎯 **Mục tiêu debug:**

1. **Xác định chính xác nguyên nhân lỗi 400**
2. **Đảm bảo data validation pass**
3. **Đảm bảo data types đúng**
4. **Đảm bảo API request thành công**
5. **Khôi phục tính năng tạo review**

## 🚀 **Bước tiếp theo:**

1. **Sử dụng ReviewDebugForm** để test
2. **Xem console logs** chi tiết
3. **Kiểm tra network requests**
4. **Xác định nguyên nhân lỗi**
5. **Khắc phục vấn đề**

Bây giờ hãy sử dụng ReviewDebugForm để debug và tìm ra nguyên nhân thực sự của lỗi 400! 🔍
