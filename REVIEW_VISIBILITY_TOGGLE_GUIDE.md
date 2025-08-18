# Hướng dẫn sử dụng tính năng toggle hiển thị review ẩn

## 🎯 **Vấn đề đã được khắc phục:**

Trước đây, khi chủ nhà ẩn một review, review đó sẽ biến mất hoàn toàn và chủ nhà không thể thấy để hiện lại. Bây giờ đã có giải pháp hoàn chỉnh!

## 🔧 **Giải pháp mới:**

### **1. Chủ nhà luôn thấy tất cả review (kể cả ẩn)**
- Review ẩn vẫn hiển thị nhưng với style khác biệt
- Có badge "ĐÃ ẨN" để đánh dấu rõ ràng
- Opacity giảm và background màu xám nhạt

### **2. Nút toggle để quản lý hiển thị**
- **"Hiện tất cả review (kể cả ẩn)"**: Hiển thị tất cả review
- **"Chỉ hiện review đang hiển thị"**: Chỉ hiển thị review visible

### **3. Thống kê thông minh**
- Số review hiển thị: Chỉ những review đang visible
- Số review ẩn: Click vào để toggle hiển thị
- Rating trung bình: Tính từ tất cả review (kể cả ẩn)

## 🚀 **Cách sử dụng:**

### **Bước 1: Đăng nhập với tài khoản chủ nhà**
- Vào trang chi tiết nhà của mình
- Cuộn xuống phần "Đánh giá từ người thuê"

### **Bước 2: Quản lý review**
- **Ẩn review**: Click nút 👁️ (EyeOff) để ẩn
- **Hiện review**: Click nút 👁️ (Eye) để hiện lại
- **Xóa review**: Click nút 🗑️ (Trash) để xóa hoàn toàn

### **Bước 3: Toggle hiển thị review ẩn**
- **Mặc định**: Chỉ hiển thị review đang visible
- **Click "Hiện tất cả review (kể cả ẩn)"**: Hiển thị cả review ẩn
- **Click "Chỉ hiện review đang hiển thị"**: Ẩn review ẩn

## 🎨 **Giao diện mới:**

### **Review đang hiển thị:**
- Nền trắng, opacity 100%
- Nút "Ẩn đánh giá" (👁️)
- Nút "Xóa đánh giá" (🗑️)

### **Review đã bị ẩn:**
- Nền xám nhạt, opacity 60%
- Badge "ĐÃ ẨN" màu vàng
- Nút "Hiện đánh giá" (👁️)
- Nút "Xóa đánh giá" (🗑️)

### **Panel quản lý cho chủ nhà:**
- Nền xanh nhạt với border
- Thông báo "Quản lý đánh giá: Bạn có thể ẩn/hiện hoặc xóa đánh giá"
- Nút toggle để hiển thị/ẩn review ẩn

## 📊 **Logic hiển thị:**

### **Cho chủ nhà:**
```jsx
// Chủ nhà có thể toggle hiển thị review ẩn
if (user && user.roleName === 'HOST') {
  return showHiddenReviews ? true : review.isVisible !== false;
}
```

### **Cho user thường:**
```jsx
// User thường chỉ thấy review visible
return review.isVisible !== false;
```

### **Thống kê:**
```jsx
// Rating trung bình: Tất cả review (kể cả ẩn)
const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

// Số review hiển thị: Chỉ review visible
const visibleReviewsCount = reviews.filter(review => review.isVisible !== false).length;

// Số review ẩn: Click để toggle
<span onClick={() => setShowHiddenReviews(!showHiddenReviews)}>
  ({reviews.length - visibleReviewsCount} ẩn)
</span>
```

## 🔄 **Workflow hoàn chỉnh:**

### **1. Ẩn review:**
1. Chủ nhà click nút 👁️ (EyeOff)
2. Review bị ẩn (`isVisible = false`)
3. Review vẫn hiển thị nhưng với style khác
4. Rating trung bình không thay đổi

### **2. Hiện review:**
1. Chủ nhà click nút 👁️ (Eye)
2. Review được hiện lại (`isVisible = true`)
3. Review trở về style bình thường
4. Rating trung bình không thay đổi

### **3. Xóa review:**
1. Chủ nhà click nút 🗑️ (Trash)
2. Review bị xóa hoàn toàn khỏi database
3. Rating trung bình thay đổi
4. Không thể khôi phục

## ⚠️ **Lưu ý quan trọng:**

### **Về hiển thị:**
- **Chủ nhà**: Luôn thấy tất cả review, có thể toggle hiển thị
- **User thường**: Chỉ thấy review visible
- **Admin**: Thấy tất cả review và có quyền quản lý

### **Về rating:**
- **Review ẩn**: Vẫn tính vào rating trung bình
- **Review bị xóa**: Không tính vào rating trung bình
- **Điều này đảm bảo tính công bằng**

### **Về dữ liệu:**
- **Review ẩn**: Vẫn tồn tại trong database
- **Review bị xóa**: Mất hoàn toàn, không thể khôi phục
- **Có thể xem lịch sử trong admin panel**

## 🧪 **Test Cases:**

### **Test ẩn review:**
1. Chủ nhà ẩn một review
2. Kiểm tra review có bị ẩn không (style thay đổi)
3. Kiểm tra badge "ĐÃ ẨN" có hiển thị không
4. Kiểm tra rating trung bình có thay đổi không

### **Test hiện review:**
1. Chủ nhà hiện lại review đã ẩn
2. Kiểm tra review có trở về style bình thường không
3. Kiểm tra badge "ĐÃ ẨN" có biến mất không
4. Kiểm tra rating trung bình có thay đổi không

### **Test toggle hiển thị:**
1. Chủ nhà click "Hiện tất cả review (kể cả ẩn)"
2. Kiểm tra review ẩn có hiển thị không
3. Chủ nhà click "Chỉ hiện review đang hiển thị"
4. Kiểm tra review ẩn có bị ẩn không

## 🎉 **Kết quả mong đợi:**

- ✅ Chủ nhà có thể thấy tất cả review (kể cả ẩn)
- ✅ Chủ nhà có thể toggle hiển thị review ẩn
- ✅ Review ẩn có style khác biệt rõ ràng
- ✅ Badge "ĐÃ ẨN" đánh dấu review ẩn
- ✅ Rating trung bình vẫn chính xác
- ✅ Giao diện thân thiện và dễ sử dụng
- ✅ Không còn bị "mất" review ẩn

## 📱 **Responsive Design:**

- **Desktop**: Hiển thị đầy đủ thông tin và nút bấm
- **Tablet**: Tối ưu layout cho màn hình vừa
- **Mobile**: Stack layout, nút bấm dễ thao tác
- **Touch-friendly**: Các nút có kích thước phù hợp

Bây giờ chủ nhà đã có thể quản lý review một cách hoàn chỉnh và không bao giờ bị "mất" review ẩn nữa! 🎉
