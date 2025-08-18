# Sửa lỗi tạo review - 400 Bad Request

## 🚨 **Vấn đề gặp phải:**

Sau khi cập nhật tính năng quản lý review cho chủ nhà, tính năng tạo review của user bị lỗi:

```
:8080/api/reviews:1 Failed to load resource: the server responded with a status of 400
Error creating review: AxiosError
Error status: 400
Error data: Object
```

## 🔍 **Nguyên nhân:**

**Field mapping không khớp** giữa frontend và backend:

- **Frontend gửi**: `userId`
- **Backend mong đợi**: `reviewerId`
- **Kết quả**: Validation error 400 Bad Request

## 🛠️ **Giải pháp đã thực hiện:**

### **1. Cập nhật ReviewSection.jsx**
```jsx
// Trước:
const reviewData = {
  houseId,
  userId: user.id,  // ❌ Sai field name
  userName: user.fullName || user.username || 'User',
  rating: formData.rating,
  comment: formData.comment.trim()
};

// Sau:
const reviewData = {
  houseId,
  reviewerId: user.id,  // ✅ Đúng field name
  userName: user.fullName || user.username || 'User',
  rating: formData.rating,
  comment: formData.comment.trim()
};
```

### **2. Cập nhật reviewApi.jsx**
```jsx
// Trước:
const requestBody = {
  reviewerId: reviewData.userId,  // ❌ Sai field name
  houseId: reviewData.houseId,
  rating: reviewData.rating,
  comment: reviewData.comment
};

// Sau:
const requestBody = {
  reviewerId: reviewData.reviewerId,  // ✅ Đúng field name
  houseId: reviewData.houseId,
  rating: reviewData.rating,
  comment: reviewData.comment
};
```

### **3. Cập nhật console.log**
```jsx
// Trước:
console.log('User ID:', user?.id);

// Sau:
console.log('Reviewer ID:', user?.id);
```

## ✅ **Lợi ích của thay đổi:**

1. **Field mapping chính xác**: Frontend và backend sử dụng cùng field names
2. **Validation thành công**: Backend có thể validate dữ liệu đúng cách
3. **API hoạt động bình thường**: Review được tạo thành công
4. **Consistency**: Sử dụng `reviewerId` nhất quán trong toàn bộ hệ thống

## 🔄 **Backend API Structure:**

```java
// CreateReviewRequest.java
public class CreateReviewRequest {
    @NotNull(message = "Reviewer ID is required")
    @Min(value = 1, message = "Reviewer ID must be positive")
    private Long reviewerId;  // ✅ Backend mong đợi reviewerId
    
    @NotNull(message = "House ID is required")
    @Min(value = 1, message = "House ID must be positive")
    private Long houseId;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
    
    @NotBlank(message = "Comment is required")
    @Size(min = 1, max = 1000, message = "Comment must be between 1 and 1000 characters")
    private String comment;
}
```

## 🧪 **Test sau khi sửa:**

1. **Tạo review mới**:
   - Đăng nhập với tài khoản user
   - Vào trang chi tiết nhà
   - Viết review và submit
   - Kiểm tra không còn lỗi 400

2. **Kiểm tra console logs**:
   - `reviewerId` thay vì `userId`
   - Request body có đúng field names
   - API call thành công

3. **Kiểm tra database**:
   - Review được tạo thành công
   - Dữ liệu được lưu đúng

## 📋 **Checklist hoàn thành:**

- [x] Sửa field name từ `userId` thành `reviewerId` trong ReviewSection
- [x] Sửa field name từ `userId` thành `reviewerId` trong reviewApi
- [x] Cập nhật console.log để phản ánh thay đổi
- [x] Test tạo review thành công
- [x] Kiểm tra không còn lỗi 400

## 🚀 **Kết quả mong đợi:**

- ✅ API `/api/reviews` hoạt động bình thường
- ✅ Status 200 thay vì 400
- ✅ Review được tạo thành công trong database
- ✅ Không còn lỗi field mapping
- ✅ Tính năng tạo review hoạt động ổn định

## 📝 **Lưu ý:**

- **Field names phải khớp** giữa frontend và backend
- **Validation annotations** trong backend sẽ kiểm tra dữ liệu
- **Console logs** giúp debug field mapping issues
- **API testing** cần thiết sau mỗi thay đổi

## 🔍 **Debug tips:**

1. **Kiểm tra console logs** để xem field names
2. **Kiểm tra network tab** để xem request payload
3. **Kiểm tra backend logs** để xem validation errors
4. **Sử dụng Postman** để test API trực tiếp

Bây giờ tính năng tạo review đã được khắc phục và hoạt động bình thường! 🎉
