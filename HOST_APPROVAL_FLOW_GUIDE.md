# Hướng Dẫn Luồng Xử Lý Duyệt Đơn Đăng Ký Làm Chủ Nhà

## Tổng quan
Khi admin duyệt đơn đăng ký làm chủ nhà, hệ thống sẽ tự động thực hiện các thay đổi sau:

1. **Cập nhật role của user từ USER sang HOST**
2. **Chuyển user ra khỏi danh sách quản lý User thường**
3. **Thêm user vào danh sách quản lý Chủ nhà**

## Luồng xử lý chi tiết

### 1. Admin duyệt đơn đăng ký

#### Bước 1: Admin vào trang "Đơn đăng ký chủ nhà"
- Truy cập: `/admin/host-applications`
- Xem danh sách các đơn đăng ký với trạng thái PENDING

#### Bước 2: Admin xem chi tiết đơn đăng ký
- Click nút "Xem" để xem thông tin chi tiết
- Kiểm tra thông tin user và ảnh CCCD
- Đảm bảo thông tin hợp lệ

#### Bước 3: Admin duyệt đơn
- Click nút "Duyệt"
- Hệ thống hiển thị confirm dialog với thông tin:
  ```
  Bạn có chắc chắn muốn duyệt đơn đăng ký này?

  Khi duyệt:
  • User "Tên User" sẽ được chuyển từ role USER sang HOST
  • User này sẽ được chuyển ra khỏi danh sách quản lý User thường
  • User này sẽ có quyền đăng tin cho thuê nhà
  ```

#### Bước 4: Backend xử lý
Khi admin confirm, backend sẽ tự động:

1. **Cập nhật đơn đăng ký:**
   - Status: `PENDING` → `APPROVED`
   - ProcessedDate: Thời gian hiện tại

2. **Cập nhật user:**
   - Role: `USER` → `HOST`
   - Giữ nguyên các thông tin khác (email, phone, address, etc.)

3. **Trả về response thành công**

#### Bước 5: Frontend hiển thị thông báo
```
✅ Đã duyệt đơn đăng ký thành công!

User "Tên User" đã được:
• Chuyển từ role USER sang HOST
• Có quyền đăng tin cho thuê nhà
• Chuyển ra khỏi danh sách quản lý User thường
```

### 2. Thay đổi trong giao diện admin

#### Trang "Quản lý User" (`/admin/user-management`)
- **Chỉ hiển thị user có role USER**
- User đã được duyệt làm chủ nhà sẽ **không còn xuất hiện** trong danh sách này
- Filter: `roleName: 'USER'`

#### Trang "Quản lý Chủ nhà" (`/admin/host-management`)
- **Chỉ hiển thị user có role HOST**
- User đã được duyệt sẽ **xuất hiện** trong danh sách này
- Filter: `roleName: 'HOST'`
- Hiển thị thống kê: "Tổng số chủ nhà đã được duyệt"

### 3. Thay đổi quyền của user

#### Trước khi duyệt (role USER):
- Chỉ có thể xem danh sách nhà cho thuê
- Có thể gửi đơn đăng ký làm chủ nhà
- Không thể đăng tin cho thuê nhà

#### Sau khi duyệt (role HOST):
- Có thể đăng tin cho thuê nhà
- Có thể quản lý tin đăng của mình
- Có thể xem đơn đặt phòng
- Truy cập trang `/host` thay vì `/`

### 4. API Endpoints

#### Approve Application
```http
POST /api/house-renter-requests/{id}/approve
Authorization: Bearer {adminToken}
```

**Response:**
```json
{
  "code": "00",
  "message": "Application approved successfully",
  "data": {
    "id": 1,
    "userId": 123,
    "userEmail": "user@example.com",
    "username": "User Name",
    "status": "APPROVED",
    "requestDate": "2024-01-01T00:00:00.000Z",
    "processedDate": "2024-01-01T10:30:00.000Z"
  }
}
```

#### Get Users by Role
```http
GET /api/admin/users?roleName=USER&page=0&size=10
GET /api/admin/users?roleName=HOST&page=0&size=10
```

### 5. Database Changes

#### Bảng `house_renter_requests`:
```sql
UPDATE house_renter_requests 
SET status = 'APPROVED', 
    processed_date = NOW() 
WHERE id = {application_id};
```

#### Bảng `users`:
```sql
UPDATE users 
SET role_name = 'HOST' 
WHERE id = {user_id};
```

### 6. Testing

#### Test Case 1: Duyệt đơn đăng ký
1. Đăng nhập admin
2. Vào `/admin/host-applications`
3. Duyệt một đơn đăng ký
4. Kiểm tra:
   - Đơn chuyển sang status APPROVED
   - User không còn trong `/admin/user-management`
   - User xuất hiện trong `/admin/host-management`

#### Test Case 2: User đăng nhập sau khi được duyệt
1. User đăng nhập với tài khoản đã được duyệt
2. Kiểm tra:
   - Redirect đến `/host` thay vì `/`
   - Có thể truy cập các chức năng của chủ nhà

#### Test Case 3: Từ chối đơn đăng ký
1. Admin từ chối đơn đăng ký
2. Kiểm tra:
   - Đơn chuyển sang status REJECTED
   - User vẫn giữ role USER
   - User vẫn trong `/admin/user-management`

### 7. Lưu ý quan trọng

#### Security:
- Chỉ admin mới có quyền duyệt/từ chối đơn
- Cần validate thông tin user trước khi duyệt
- Log lại tất cả các thao tác duyệt/từ chối

#### Performance:
- Sử dụng transaction để đảm bảo tính nhất quán
- Cập nhật cache nếu có
- Refresh danh sách sau khi duyệt

#### User Experience:
- Hiển thị thông báo rõ ràng về thay đổi role
- Cập nhật UI ngay lập tức sau khi duyệt
- Cung cấp hướng dẫn cho user mới được duyệt

## Kết luận
Luồng xử lý này đảm bảo:
- **Tính nhất quán**: User được chuyển đúng role và quyền
- **Tính bảo mật**: Chỉ admin mới có quyền thay đổi role
- **Tính minh bạch**: Admin biết rõ những gì sẽ xảy ra khi duyệt
- **Tính trải nghiệm**: User được thông báo rõ ràng về thay đổi

