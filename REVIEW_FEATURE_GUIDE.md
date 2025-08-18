# Hướng dẫn sử dụng tính năng Đánh giá (Review)

## Tổng quan
Tính năng đánh giá cho phép người dùng đã thuê nhà và đã checkout có thể đánh giá về trải nghiệm của họ với căn nhà đó.

## Cách hoạt động

### 1. Điều kiện để đánh giá
- Người dùng phải đã đăng nhập
- Không phải là chủ nhà của căn nhà đó
- Chưa đánh giá nhà này (mỗi user chỉ đánh giá một lần)
- **Lưu ý**: Hiện tại cho phép tất cả user đánh giá, không cần phải thuê nhà trước

### 2. Các trạng thái thuê nhà
- `PENDING`: Chờ host duyệt
- `APPROVED`: Host đã đồng ý
- `SCHEDULED`: Đã lên lịch
- `CHECKED_IN`: Đang thuê nhà
- `CHECKED_OUT`: Đã trả phòng (có thể đánh giá)
- `REJECTED`: Bị từ chối
- `CANCELED`: Đã hủy

### 3. Quy trình đánh giá
1. User đăng nhập vào hệ thống
2. Vào trang chi tiết nhà muốn đánh giá
3. Nhấn nút "Viết đánh giá"
4. Chọn số sao và viết nhận xét
5. Gửi đánh giá

**Lưu ý**: Hiện tại không yêu cầu phải thuê nhà trước khi đánh giá

## Các component chính

### ReviewSection.jsx
- Hiển thị danh sách đánh giá
- Form để tạo/sửa đánh giá
- Kiểm tra quyền đánh giá
- Hiển thị trạng thái thuê nhà của user

### reviewApi.jsx
- API calls đến backend
- CRUD operations cho reviews
- Kiểm tra user review

## Backend API

### Endpoints
- `GET /api/reviews/house/{houseId}`: Lấy đánh giá của một nhà
- `POST /api/reviews`: Tạo đánh giá mới
- `PUT /api/reviews/{id}`: Cập nhật đánh giá
- `DELETE /api/reviews/{id}`: Xóa đánh giá

### Validation
- ~~Kiểm tra user đã thuê nhà và checkout~~ (đã tạm thời bỏ)
- Kiểm tra user chưa đánh giá nhà này
- Chỉ cho phép user sửa/xóa đánh giá của mình

## Cách sử dụng

### 1. Xem đánh giá
- Vào trang chi tiết nhà
- Cuộn xuống phần "Đánh giá từ người thuê"
- Xem danh sách đánh giá và rating trung bình

### 2. Tạo đánh giá
- Đăng nhập với tài khoản user (không phải host)
- Nhấn nút "Viết đánh giá"
- Chọn số sao (1-5)
- Viết nhận xét
- Nhấn "Gửi đánh giá"

### 3. Sửa đánh giá
- Nhấn nút sửa (biểu tượng bút chì)
- Thay đổi rating hoặc comment
- Nhấn "Cập nhật"

### 4. Xóa đánh giá
- Nhấn nút xóa (biểu tượng thùng rác)
- Xác nhận xóa

## Tính năng bảo mật

### Quyền truy cập
- Tất cả user đã đăng nhập (không phải host) đều có thể đánh giá
- Chỉ user sở hữu đánh giá mới có thể sửa/xóa
- Admin có thể sửa/xóa mọi đánh giá

### Validation
- ~~Kiểm tra trạng thái thuê nhà~~ (đã tạm thời bỏ)
- Kiểm tra user không đánh giá trùng lặp
- Sanitize input data

## Troubleshooting

### Lỗi thường gặp
1. **"Bạn chưa từng thuê nhà này"**
   - ~~Lỗi này không còn xuất hiện~~ (đã tạm thời bỏ điều kiện thuê nhà)

2. **"Bạn đang thuê nhà này, hãy đợi đến ngày check-out"**
   - ~~Lỗi này không còn xuất hiện~~ (đã tạm thời bỏ điều kiện thuê nhà)

3. **"Bạn đã đánh giá nhà này"**
   - User chỉ có thể đánh giá một lần
   - Có thể sửa đánh giá hiện tại

### Debug
- Kiểm tra console log để xem thông tin debug
- Kiểm tra network tab để xem API calls
- Kiểm tra trạng thái user và rental

## Tương lai

### Tính năng có thể thêm
- Đánh giá theo nhiều tiêu chí (vị trí, giá cả, dịch vụ...)
- Phản hồi từ chủ nhà
- Filter và sort đánh giá
- Report đánh giá không phù hợp
- Đánh giá ẩn danh

### Cải tiến
- Cache đánh giá để tăng performance
- Pagination cho danh sách đánh giá
- Real-time updates
- Email notification khi có đánh giá mới
