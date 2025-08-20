# Tính năng Thống kê & Báo cáo cho Chủ nhà

## Tổng quan
Tính năng "Thống kê & Báo cáo" cung cấp cho chủ nhà cái nhìn tổng quan về hiệu suất kinh doanh của họ, bao gồm các chỉ số quan trọng như doanh thu, số lượng đơn thuê, và phân tích chi tiết về từng căn nhà.

## Các tính năng chính

### 1. Thống kê tổng quan
- **Số nhà được thuê**: Tổng số đơn thuê trong kỳ thời gian được chọn
- **Doanh thu dự kiến**: Tổng doanh thu trước khi trừ thuế và phí
- **Doanh thu sau thuế & phí**: Doanh thu thực nhận sau khi trừ thuế (10%) và phí sàn (10%)
- **Tỷ lệ lấp đầy**: Tỷ lệ căn nhà được thuê so với tổng số căn

### 2. So sánh với kỳ trước
- Hiển thị phần trăm thay đổi về doanh thu và số lượng đơn thuê
- Chỉ báo trực quan với mũi tên lên/xuống và màu sắc

### 3. Phân tích căn nhà
- **Top nhà được thuê nhiều nhất**: Danh sách 5 căn nhà có số đơn thuê cao nhất
- **Nhà được thuê ít nhất**: Danh sách 3 căn nhà có số đơn thuê thấp nhất
- Thông tin chi tiết: tên nhà, địa chỉ, số lần thuê, tổng doanh thu

### 4. Xu hướng doanh thu
- Biểu đồ doanh thu theo tháng
- Hiển thị doanh thu và số đơn thuê cho từng tháng

### 5. Thông tin thuế và phí
- Chi tiết về thuế thu nhập (10%)
- Chi tiết về phí sàn (10%)
- Tổng khấu trừ và doanh thu thực nhận

## Cách sử dụng

### 1. Truy cập tính năng
- Đăng nhập vào tài khoản chủ nhà
- Vào trang Dashboard
- Nhấn nút "Xem thống kê" (màu xanh lá)

### 2. Chọn kỳ thời gian
- **Tháng này**: Thống kê từ đầu tháng hiện tại
- **Tháng trước**: Thống kê của tháng trước
- **3 tháng gần đây**: Thống kê 3 tháng gần nhất
- **6 tháng gần đây**: Thống kê 6 tháng gần nhất
- **Năm nay**: Thống kê từ đầu năm

### 3. Làm mới dữ liệu
- Nhấn nút "Làm mới" để cập nhật dữ liệu mới nhất

### 4. Xuất báo cáo
- Nhấn nút "Xuất báo cáo" (tính năng sẽ được phát triển sau)

## Cấu trúc dữ liệu

### API Endpoints
- `GET /api/hosts/my-statistics?period={period}`: Lấy thống kê cho host hiện tại
- `GET /api/hosts/{id}/statistics?period={period}`: Lấy thống kê cho host cụ thể

### Response Format
```json
{
  "hostId": 1,
  "period": "current_month",
  "totalRentals": 15,
  "totalRevenue": 45000000,
  "netRevenue": 36450000,
  "occupancyRate": 85.0,
  "revenueChange": 5000000,
  "revenueChangePercentage": 12.5,
  "rentalChange": 3,
  "rentalChangePercentage": 25.0,
  "topHouses": [...],
  "leastRentedHouses": [...],
  "monthlyTrend": [...],
  "taxAmount": 4500000,
  "platformFee": 4500000,
  "totalDeductions": 9000000
}
```

## Công nghệ sử dụng

### Frontend
- React.js với styled-components
- Lucide React cho icons
- Responsive design với CSS Grid

### Backend
- Spring Boot với JPA/Hibernate
- RESTful API
- JWT Authentication

## Cải tiến trong tương lai

### 1. Biểu đồ tương tác
- Sử dụng Chart.js hoặc Recharts để tạo biểu đồ động
- Biểu đồ đường cho xu hướng doanh thu
- Biểu đồ cột cho so sánh các kỳ

### 2. Xuất báo cáo
- Export PDF với iText hoặc Apache PDFBox
- Export Excel với Apache POI
- Gửi báo cáo qua email

### 3. Thông báo và cảnh báo
- Cảnh báo khi doanh thu giảm
- Thông báo khi có đơn thuê mới
- Nhắc nhở về các khoản thuế và phí

### 4. Phân tích nâng cao
- Dự đoán doanh thu tương lai
- Phân tích theo mùa vụ
- So sánh với thị trường

## Troubleshooting

### Lỗi thường gặp
1. **Không thể tải dữ liệu**: Kiểm tra kết nối mạng và quyền truy cập
2. **Dữ liệu không chính xác**: Làm mới trang hoặc kiểm tra kỳ thời gian
3. **Hiển thị lỗi**: Kiểm tra console để xem chi tiết lỗi

### Hỗ trợ
Nếu gặp vấn đề, vui lòng liên hệ đội phát triển hoặc tạo issue trên repository.
