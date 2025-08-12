# Hướng dẫn Test Đơn Đăng Ký Làm Chủ Nhà

## Tổng quan
Đã cập nhật hệ thống đơn đăng ký làm chủ nhà để phù hợp với cấu trúc DTO mới và loại bỏ việc yêu cầu người dùng nhập lại thông tin đã có trong profile.

## Những thay đổi chính

### 1. Cập nhật Form Đăng Ký (`HostRegistrationForm.jsx`)
- **Loại bỏ trường địa chỉ**: Không yêu cầu người dùng nhập lại địa chỉ đã có trong profile
- **Hiển thị thông tin profile**: Hiển thị thông tin từ hồ sơ cá nhân (họ tên, email, số điện thoại, địa chỉ)
- **Chỉ yêu cầu thông tin bổ sung**: 
  - Số căn cước công dân/CMT
  - Ảnh mặt trước CCCD/CMT
  - Ảnh mặt sau CCCD/CMT
- **Validation cải tiến**: Kiểm tra thông tin profile trước khi cho phép gửi đơn

### 2. Cập nhật API (`hostApi.jsx`)
- **Format dữ liệu phù hợp**: Gửi đúng format `HouseRenterRequestDTO`
- **Upload files**: Tự động upload ảnh CCCD và thêm URL vào reason
- **Xử lý lỗi tốt hơn**: Thông báo lỗi chi tiết và rõ ràng

### 3. Cấu trúc DTO được sử dụng
```java
// HouseRenterRequestDTO
{
  id: Long,
  userId: Long,
  userEmail: String,
  username: String,
  status: String, // PENDING, APPROVED, REJECTED
  reason: String,
  requestDate: LocalDateTime,
  processedDate: LocalDateTime
}
```

## Cách test

### 1. Chuẩn bị
- Đăng nhập với tài khoản user thường
- Đảm bảo đã cập nhật thông tin profile (họ tên, số điện thoại)

### 2. Test gửi đơn đăng ký
1. Truy cập trang test: `/host-application-test`
2. Click "Gửi đơn đăng ký làm chủ nhà"
3. Form sẽ hiển thị thông tin từ profile
4. Điền số CCCD và upload ảnh
5. Gửi đơn

### 3. Test trạng thái đơn
- Xem trạng thái đơn đăng ký trong cùng trang test
- Hoặc vào trang profile để xem trạng thái

### 4. Test Admin duyệt đơn
- Đăng nhập admin
- Vào Admin Panel > Quản lý đơn đăng ký chủ nhà
- Duyệt hoặc từ chối đơn

## Lưu ý quan trọng

### Thông tin từ Profile
Form sẽ tự động lấy và hiển thị:
- **Họ tên** (bắt buộc)
- **Email** (bắt buộc)
- **Số điện thoại** (bắt buộc)
- **Địa chỉ** (nếu có)

### Validation
- Kiểm tra thông tin profile đầy đủ trước khi cho phép gửi đơn
- Validate số CCCD (9-12 số)
- Bắt buộc upload ảnh CCCD mặt trước và mặt sau

### Files Upload
- Ảnh CCCD được upload tự động
- URL ảnh được thêm vào reason để admin xem xét
- Hỗ trợ format: JPG, PNG

## Troubleshooting

### Lỗi thường gặp
1. **"Thông tin người dùng không đầy đủ"**
   - Giải pháp: Đăng nhập lại hoặc cập nhật profile

2. **"Vui lòng cập nhật họ tên/số điện thoại trong hồ sơ cá nhân"**
   - Giải pháp: Vào trang profile và cập nhật thông tin

3. **"Số căn cước/CMT không hợp lệ"**
   - Giải pháp: Nhập đúng 9-12 số

4. **"Vui lòng tải lên ảnh CCCD"**
   - Giải pháp: Upload ảnh rõ nét, đầy đủ thông tin

### Debug
- Mở Developer Tools (F12) để xem console logs
- Kiểm tra Network tab để xem API calls
- Xem localStorage để kiểm tra thông tin user

## Kết quả mong đợi
- Form đơn giản hơn, chỉ yêu cầu thông tin bổ sung
- Thông tin từ profile được hiển thị rõ ràng
- Validation chặt chẽ và thông báo lỗi rõ ràng
- Upload files hoạt động ổn định
- Admin có thể xem đầy đủ thông tin để xét duyệt
