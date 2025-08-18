# Hướng dẫn sử dụng Admin Dashboard

## 🎯 Tổng quan

Admin Dashboard đã được cập nhật với trang tổng quan hoàn chỉnh, hiển thị các thống kê quan trọng và dữ liệu thực từ hệ thống.

## 📊 Tính năng Dashboard

### 1. Thống kê tổng quan
- **Tổng người dùng**: Hiển thị số lượng user, host, admin
- **Tổng nhà cho thuê**: Hiển thị số lượng nhà theo trạng thái
- **Tổng đơn thuê**: Hiển thị số lượng đơn thuê theo trạng thái
- **Doanh thu**: Hiển thị doanh thu tháng và tổng doanh thu

### 2. Nhà mới đăng gần đây
- Hiển thị 5 nhà được đăng gần đây nhất
- Thông tin: tên nhà, địa chỉ, giá, trạng thái, chủ nhà
- Hình ảnh nhà (nếu có)

### 3. Đơn thuê gần đây
- Hiển thị 5 đơn thuê gần đây nhất
- Thông tin: nhà, người thuê, ngày thuê, giá, trạng thái

## 🔧 API Endpoints

### Dashboard Statistics
```
GET /api/admin/dashboard/stats
```
Trả về:
```json
{
  "users": {
    "total": 150,
    "hosts": 45,
    "admins": 3
  },
  "houses": {
    "total": 89,
    "available": 67,
    "rented": 18,
    "inactive": 4
  },
  "rentals": {
    "total": 234,
    "pending": 12,
    "active": 45,
    "completed": 177
  },
  "revenue": {
    "total": 1500000000,
    "monthly": 180000000
  }
}
```

### Recent Houses
```
GET /api/admin/dashboard/recent-houses
```
Trả về danh sách 5 nhà mới nhất

### Recent Rentals
```
GET /api/admin/dashboard/recent-rentals
```
Trả về danh sách 5 đơn thuê mới nhất

## 🎨 Giao diện

### Màu sắc trạng thái
- **Có sẵn**: Xanh lá (#c6f6d5)
- **Đã thuê**: Xanh dương (#bee3f8)
- **Không hoạt động**: Đỏ nhạt (#fed7d7)
- **Chờ duyệt**: Cam nhạt (#fef5e7)
- **Đã duyệt**: Xanh lá đậm (#d1fae5)
- **Đã lên lịch**: Xanh dương đậm (#dbeafe)
- **Đã nhận phòng**: Tím nhạt (#e0e7ff)
- **Đã trả phòng**: Tím đậm (#f3e8ff)
- **Từ chối**: Đỏ đậm (#fee2e2)
- **Đã hủy**: Xám (#f3f4f6)

## 🚀 Cách sử dụng

1. **Đăng nhập Admin**: Truy cập `/admin/login`
2. **Xem Dashboard**: Sau khi đăng nhập, dashboard sẽ hiển thị tự động
3. **Refresh dữ liệu**: Dữ liệu được tải tự động khi vào trang
4. **Xem chi tiết**: Click vào các mục để xem chi tiết

## 📱 Responsive Design

Dashboard được thiết kế responsive:
- **Desktop**: Hiển thị đầy đủ 4 thẻ thống kê
- **Tablet**: 2 thẻ thống kê mỗi hàng
- **Mobile**: 1 thẻ thống kê mỗi hàng

## 🔄 Cập nhật dữ liệu

Dữ liệu được cập nhật:
- **Tự động**: Khi vào trang dashboard
- **Real-time**: Khi có thay đổi trong hệ thống
- **Manual**: Có thể refresh trang để cập nhật

## 🛠️ Troubleshooting

### Lỗi thường gặp

1. **Không hiển thị dữ liệu**
   - Kiểm tra kết nối database
   - Kiểm tra API endpoints
   - Xem console log

2. **Lỗi 403/401**
   - Kiểm tra JWT token
   - Đăng nhập lại admin

3. **Dữ liệu không chính xác**
   - Kiểm tra logic tính toán trong service
   - Kiểm tra database queries

### Debug

```javascript
// Kiểm tra API response
console.log('Dashboard stats:', stats);
console.log('Recent houses:', recentHouses);
console.log('Recent rentals:', recentRentals);
```

## 📈 Performance

- **Lazy loading**: Dữ liệu được tải khi cần
- **Caching**: Sử dụng React state để cache
- **Optimization**: Sử dụng Promise.all để tải song song
- **Error handling**: Xử lý lỗi gracefully

## 🔮 Tính năng tương lai

- [ ] Biểu đồ doanh thu theo thời gian
- [ ] Thống kê theo địa lý
- [ ] Export báo cáo PDF/Excel
- [ ] Real-time notifications
- [ ] Custom date range filters 