# Hướng dẫn sử dụng tính năng Đăng ký làm chủ nhà

## Tổng quan

Tính năng đăng ký làm chủ nhà cho phép người dùng thường (USER) đăng ký để trở thành chủ nhà (HOST) và có quyền đăng tin cho thuê nhà. Quá trình này bao gồm việc gửi đơn đăng ký và admin duyệt.

## Cấu trúc DTO

### HostRequestDTO
```java
public class HostRequestDTO {
    private Long id;
    private Long userId;
    private String userEmail;
    private String username;
    private String status; // PENDING, APPROVED, REJECTED
    private String reason;
    private LocalDateTime requestDate;
    private LocalDateTime processedDate;
}
```

### HostDTO
```java
public class HostDTO {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String avatar;
    private String nationalId;
    private String proofOfOwnershipUrl;
    private String address;
    private LocalDateTime approvedDate;
    private boolean approved;
}
```

## Luồng hoạt động

### 1. User đăng ký làm chủ nhà

1. **Truy cập trang Dashboard Chủ nhà**
   - Đường dẫn: `/host/dashboard`
   - Chỉ user đã đăng nhập mới có thể truy cập

2. **Điền form đăng ký**
   - Thông tin cá nhân (tự động lấy từ profile)
   - Số CCCD/CMT (bắt buộc)
   - Địa chỉ (bắt buộc)
   - Số điện thoại (bắt buộc)
   - Ảnh mặt trước CCCD/CMT (bắt buộc)
   - Ảnh mặt sau CCCD/CMT (bắt buộc)
   - Giấy tờ chứng minh quyền sở hữu (bắt buộc)

3. **Gửi đơn đăng ký**
   - Hệ thống upload files lên server
   - Tạo bản ghi HostRequestDTO với status = "PENDING"
   - Hiển thị thông báo thành công

### 2. Admin duyệt đơn đăng ký

1. **Truy cập trang quản lý đơn đăng ký**
   - Đường dẫn: `/admin/host-applications`
   - Chỉ admin mới có thể truy cập

2. **Xem danh sách đơn đăng ký**
   - Hiển thị tất cả đơn đăng ký với trạng thái
   - Thống kê số lượng đơn theo trạng thái
   - Tìm kiếm và lọc đơn đăng ký

3. **Xem chi tiết đơn đăng ký**
   - Thông tin người đăng ký
   - Files đính kèm (CCCD, giấy tờ sở hữu)
   - Lý do đăng ký

4. **Duyệt hoặc từ chối**
   - **Duyệt**: Chuyển role user từ USER sang HOST, tạo bản ghi HostDTO
   - **Từ chối**: Cập nhật status thành REJECTED, thêm lý do từ chối

### 3. Sau khi được duyệt

1. **User trở thành HOST**
   - Role được cập nhật từ USER sang HOST
   - Có thể truy cập các tính năng dành cho chủ nhà

2. **Dashboard chủ nhà**
   - Hiển thị thông tin chủ nhà
   - Thống kê hoạt động (sẽ phát triển thêm)
   - Hướng dẫn sử dụng

## API Endpoints

### Host Requests (User)
- `POST /api/host-requests` - Gửi đơn đăng ký
- `GET /api/host-requests/user/{userId}` - Lấy đơn đăng ký của user
- `GET /api/host-requests/{id}` - Lấy chi tiết đơn đăng ký

### Host Management (Admin)
- `GET /api/host-requests` - Lấy tất cả đơn đăng ký
- `POST /api/host-requests/{id}/approve` - Duyệt đơn đăng ký
- `POST /api/host-requests/{id}/reject` - Từ chối đơn đăng ký

### Host Info
- `GET /api/hosts` - Lấy danh sách host đã được duyệt
- `GET /api/hosts/{id}` - Lấy thông tin host
- `PUT /api/hosts/{id}` - Cập nhật thông tin host

## Components

### User Components
- `HostRegistrationForm` - Form đăng ký làm chủ nhà
- `HostApplicationStatus` - Hiển thị trạng thái đơn đăng ký
- `HostInfo` - Hiển thị thông tin chủ nhà sau khi được duyệt
- `HostDashboardPage` - Trang dashboard tổng hợp

### Admin Components
- `HostApplicationsManagement` - Quản lý đơn đăng ký
- `HostManagement` - Quản lý danh sách host

## Validation

### Form Validation
- Số CCCD/CMT: 9-12 số
- Số điện thoại: 10-11 số
- Địa chỉ: không được để trống
- Files: phải upload đầy đủ

### Business Logic
- User chỉ có thể gửi 1 đơn đăng ký
- Admin phải xem xét kỹ thông tin trước khi duyệt
- Khi duyệt, tự động tạo bản ghi HostDTO

## Security

- Chỉ user đã đăng nhập mới có thể đăng ký
- Chỉ admin mới có thể duyệt/từ chối đơn
- Files được upload an toàn với validation
- Token authentication cho tất cả API calls

## Error Handling

- Hiển thị thông báo lỗi rõ ràng cho user
- Log lỗi chi tiết cho developer
- Graceful fallback khi API fails
- Validation errors được hiển thị inline

## Future Enhancements

1. **Email notifications**
   - Gửi email thông báo khi đơn được duyệt/từ chối
   - Email hướng dẫn sau khi được duyệt

2. **Advanced validation**
   - OCR để đọc thông tin từ CCCD
   - Verify số CCCD với cơ sở dữ liệu quốc gia

3. **Dashboard features**
   - Thống kê chi tiết hoạt động
   - Quản lý tin đăng
   - Quản lý booking

4. **Admin features**
   - Bulk approve/reject
   - Export data
   - Advanced filtering

## Testing

### Manual Testing
1. Test form validation
2. Test file upload
3. Test admin approval flow
4. Test role change
5. Test error scenarios

### API Testing
1. Test all endpoints
2. Test authentication
3. Test file upload limits
4. Test concurrent requests

## Deployment Notes

1. **Environment variables**
   - API base URL
   - File upload limits
   - Email configuration

2. **Database**
   - Ensure tables exist
   - Check indexes for performance
   - Backup strategy

3. **File storage**
   - Configure file upload directory
   - Set proper permissions
   - Implement cleanup strategy

