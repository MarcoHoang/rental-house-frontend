# Hướng dẫn quản lý đánh giá cho chủ nhà

## 🎯 **Tính năng mới: Quản lý đánh giá**

Chủ nhà giờ đây có thể quản lý các đánh giá của user về nhà của mình với hai quyền chính:

### **1. Ẩn đánh giá (Hide Review)**
- ✅ **Chỉ ẩn đi, không mất số sao**
- ✅ **Vẫn tính vào trung bình rating**
- ✅ **Có thể hiện lại bất cứ lúc nào**
- ✅ **Phù hợp cho đánh giá không phù hợp nhưng không muốn mất sao**

### **2. Xóa đánh giá (Delete Review)**
- ✅ **Xóa hoàn toàn khỏi hệ thống**
- ✅ **Mất cả đánh giá và số sao**
- ✅ **Không thể khôi phục**
- ✅ **Phù hợp cho đánh giá spam hoặc vi phạm nghiêm trọng**

## 🚀 **Cách sử dụng:**

### **Trong trang chi tiết nhà (HouseDetailPage):**
1. **Đăng nhập với tài khoản chủ nhà**
2. **Vào trang chi tiết nhà của mình**
3. **Cuộn xuống phần "Đánh giá từ người thuê"**
4. **Sẽ thấy các nút quản lý cho mỗi review:**
   - 👁️ **Eye icon**: Ẩn/Hiện đánh giá
   - 🗑️ **Trash icon**: Xóa đánh giá

### **Trong trang quản lý tài sản (HostDashboard):**
1. **Vào Host Dashboard**
2. **Chọn "Quản lý tài sản"**
3. **Chọn nhà cụ thể**
4. **Sẽ có tab "Quản lý đánh giá" riêng biệt**

## 🎨 **Giao diện quản lý:**

### **Review hiển thị bình thường:**
- Nền trắng, opacity 100%
- Có nút "Ẩn đánh giá" (EyeOff icon)
- Có nút "Xóa đánh giá" (Trash icon)

### **Review đã bị ẩn:**
- Nền xám nhạt, opacity 70%
- Có badge "Đánh giá đã bị ẩn" màu vàng
- Có nút "Hiện đánh giá" (Eye icon)
- Vẫn có nút "Xóa đánh giá"

### **Thống kê tổng quan:**
- ⭐ **Rating trung bình**: Tính từ tất cả review (kể cả ẩn)
- 📊 **Số review hiển thị**: Chỉ những review đang hiển thị
- 👁️ **Số review ẩn**: Những review đã bị ẩn

## ⚠️ **Lưu ý quan trọng:**

### **Về rating trung bình:**
- **Review ẩn vẫn tính vào rating trung bình**
- **Review bị xóa sẽ không tính vào rating trung bình**
- **Điều này đảm bảo tính công bằng cho chủ nhà**

### **Về quyền hạn:**
- **Chỉ chủ nhà mới có quyền quản lý review của nhà mình**
- **Admin có quyền quản lý tất cả review**
- **User thường chỉ có thể edit/delete review của mình**

### **Về dữ liệu:**
- **Review ẩn vẫn tồn tại trong database**
- **Review bị xóa sẽ mất hoàn toàn**
- **Có thể xem lịch sử review ẩn trong admin panel**

## 🔧 **Cách implement:**

### **1. Backend API:**
```java
// Toggle review visibility
PUT /api/reviews/{id}/toggle-visibility

// Delete review
DELETE /api/reviews/{id}
```

### **2. Frontend Components:**
- **ReviewSection.jsx**: Hiển thị nút quản lý cho chủ nhà
- **ReviewManagement.jsx**: Component riêng để quản lý review
- **reviewApi.jsx**: API calls cho toggle visibility và delete

### **3. Logic xử lý:**
- **Ẩn review**: Chỉ thay đổi `isVisible = false`
- **Xóa review**: Xóa hoàn toàn khỏi database
- **Hiển thị**: Filter review theo `isVisible !== false`

## 📱 **Responsive Design:**

- **Desktop**: Hiển thị đầy đủ thông tin và nút bấm
- **Tablet**: Tối ưu layout cho màn hình vừa
- **Mobile**: Stack layout, nút bấm dễ thao tác

## 🧪 **Test Cases:**

### **Test ẩn review:**
1. Chủ nhà ẩn một review
2. Kiểm tra review có bị ẩn không
3. Kiểm tra rating trung bình có thay đổi không
4. Kiểm tra số review hiển thị có giảm không

### **Test hiện review:**
1. Chủ nhà hiện lại review đã ẩn
2. Kiểm tra review có hiển thị lại không
3. Kiểm tra số review hiển thị có tăng không

### **Test xóa review:**
1. Chủ nhà xóa một review
2. Kiểm tra review có bị xóa không
3. Kiểm tra rating trung bình có thay đổi không
4. Kiểm tra tổng số review có giảm không

## 🚨 **Troubleshooting:**

### **Lỗi thường gặp:**
1. **"Không có quyền"**: Kiểm tra user có phải chủ nhà không
2. **"Review không tồn tại"**: Kiểm tra reviewId có đúng không
3. **"Lỗi server"**: Kiểm tra backend có hoạt động không

### **Debug:**
- Sử dụng console.log để kiểm tra data
- Kiểm tra network requests trong DevTools
- Kiểm tra backend logs

## 📋 **Checklist hoàn thành:**

- [x] Tạo component ReviewManagement
- [x] Cập nhật ReviewSection với nút quản lý cho chủ nhà
- [x] Thêm method toggleReviewVisibility vào reviewApi
- [x] Cập nhật logic hiển thị review (chỉ hiển thị review visible)
- [x] Cập nhật logic tính rating trung bình (bao gồm cả review ẩn)
- [x] Thêm CSS cho nút ẩn/hiện
- [x] Test tính năng ẩn/hiện review
- [x] Test tính năng xóa review
- [x] Test hiển thị thống kê chính xác

## 🎉 **Kết quả mong đợi:**

- ✅ Chủ nhà có thể ẩn review không mong muốn
- ✅ Chủ nhà có thể xóa review vi phạm
- ✅ Rating trung bình vẫn chính xác
- ✅ Giao diện thân thiện và dễ sử dụng
- ✅ Responsive trên mọi thiết bị
- ✅ Bảo mật và phân quyền rõ ràng
