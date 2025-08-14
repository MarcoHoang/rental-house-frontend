# 🔧 Hướng dẫn Khắc phục Lỗi

## 🚨 Lỗi "Không thể tải thông tin nhà"

### Nguyên nhân
Lỗi này xảy ra khi:
1. **Không có dữ liệu nhà** trong database
2. **Backend chưa chạy** hoặc không thể kết nối
3. **API endpoint** không hoạt động đúng
4. **ID nhà không tồn tại** trong database

### Cách khắc phục

#### 1. **Kiểm tra Backend**
```bash
# Chạy backend
cd rental-house-backend
./mvnw spring-boot:run
```

#### 2. **Kiểm tra Database**
- Đảm bảo MySQL đang chạy
- Kiểm tra kết nối database trong `application.yaml`
- Kiểm tra bảng `houses` có dữ liệu không

#### 3. **Tạo dữ liệu mẫu**
Backend sẽ tự động tạo dữ liệu mẫu khi khởi động:
- 4 nhà mẫu với đầy đủ thông tin
- 1 user HOST để làm chủ nhà
- Ảnh mẫu từ Unsplash

#### 4. **Kiểm tra API**
```bash
# Test API endpoint
curl -X GET "http://localhost:8080/api/houses" -H "Content-Type: application/json"
curl -X GET "http://localhost:8080/api/houses/1" -H "Content-Type: application/json"
```

#### 5. **Kiểm tra Console**
Mở Chrome DevTools (F12) và kiểm tra:
- **Console tab**: Xem lỗi chi tiết
- **Network tab**: Xem API calls
- **Response**: Kiểm tra response từ server

### Debug Steps

#### Step 1: Kiểm tra Backend Logs
```bash
# Xem logs backend
tail -f rental-house-backend/logs/application.log
```

#### Step 2: Kiểm tra Database
```sql
-- Kết nối MySQL và kiểm tra
USE rental_house;
SELECT * FROM houses;
SELECT * FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'HOST');
```

#### Step 3: Test API trực tiếp
```bash
# Test tất cả nhà
curl -X GET "http://localhost:8080/api/houses"

# Test nhà cụ thể
curl -X GET "http://localhost:8080/api/houses/1"
```

#### Step 4: Kiểm tra Frontend
1. Mở Chrome DevTools (F12)
2. Vào tab Console
3. Xem các log messages
4. Kiểm tra Network tab cho API calls

### Common Issues

#### Issue 1: "Cannot connect to backend"
**Nguyên nhân**: Backend chưa chạy
**Giải pháp**: 
```bash
cd rental-house-backend
./mvnw spring-boot:run
```

#### Issue 2: "No houses found"
**Nguyên nhân**: Database trống
**Giải pháp**: 
- Restart backend để trigger data seeding
- Hoặc chạy SQL script tạo dữ liệu

#### Issue 3: "404 Not Found"
**Nguyên nhân**: ID nhà không tồn tại
**Giải pháp**: 
- Kiểm tra danh sách nhà có sẵn
- Sử dụng ID hợp lệ

#### Issue 4: "500 Internal Server Error"
**Nguyên nhân**: Lỗi backend
**Giải pháp**: 
- Kiểm tra backend logs
- Restart backend
- Kiểm tra database connection

### Data Seeding

#### Tự động (Recommended)
Backend sẽ tự động tạo dữ liệu khi khởi động:
```java
// HouseDataSeeder.java
@Bean
public CommandLineRunner seedHouses(...) {
    // Tạo 4 nhà mẫu
    // Tạo 1 HOST user
    // Tạo ảnh mẫu
}
```

#### Thủ công
Nếu cần tạo dữ liệu thủ công:
```sql
-- Tạo HOST user
INSERT INTO users (username, email, phone, password, role_id, active, full_name, address)
VALUES ('host1', 'host1@example.com', '0987654321', '$2a$10$...', 2, true, 'Nguyễn Văn Chủ Nhà', 'Hà Nội');

-- Tạo nhà mẫu
INSERT INTO houses (host_id, title, description, address, price, area, status, house_type)
VALUES (2, 'Căn hộ cao cấp', 'Mô tả nhà', 'Hà Nội', 15000000, 80, 'AVAILABLE', 'APARTMENT');
```

### Environment Variables

#### Backend (.env hoặc application.yaml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/rental_house
    username: root
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080
```

### Testing

#### Test Backend
```bash
# Test health check
curl -X GET "http://localhost:8080/actuator/health"

# Test houses API
curl -X GET "http://localhost:8080/api/houses"
```

#### Test Frontend
1. Mở browser
2. Truy cập `http://localhost:5173`
3. Vào trang "Tất cả nhà"
4. Click "Xem chi tiết" trên một nhà

### Logs Analysis

#### Backend Logs
```bash
# Xem logs real-time
tail -f rental-house-backend/logs/application.log

# Tìm lỗi
grep "ERROR" rental-house-backend/logs/application.log
```

#### Frontend Logs
1. Mở Chrome DevTools (F12)
2. Console tab
3. Filter by "Error" level
4. Check Network tab for failed requests

### Performance Issues

#### Slow Loading
- Kiểm tra database indexes
- Optimize API queries
- Enable caching

#### Memory Issues
- Check JVM heap size
- Monitor memory usage
- Optimize image loading

### Security Issues

#### CORS Errors
```java
// Backend configuration
@CrossOrigin("*")
@RestController
public class HouseController {
    // ...
}
```

#### Authentication Issues
- Check JWT token
- Verify user roles
- Check API permissions

### Contact Support

Nếu vẫn gặp vấn đề:
1. **Collect logs**: Backend + Frontend logs
2. **Screenshot**: Error messages
3. **Steps to reproduce**: Detailed steps
4. **Environment**: OS, Java version, Node version

**Email**: [your.email@example.com]
**Issue Tracker**: [GitHub Issues Link] 