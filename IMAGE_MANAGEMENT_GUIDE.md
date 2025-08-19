# Hướng dẫn Quản lý Ảnh Nhà

## Tổng quan
Chức năng quản lý ảnh nhà cho phép chủ nhà thêm, xóa và sắp xếp lại thứ tự ảnh của nhà mình.

## Tính năng chính

### 1. Thêm ảnh mới
- **Kéo/thả ảnh**: Kéo ảnh từ máy tính và thả vào vùng dropzone
- **Click để chọn**: Click vào vùng dropzone để mở hộp thoại chọn file
- **Hỗ trợ định dạng**: JPEG, PNG, GIF, WebP
- **Kích thước tối đa**: 5MB mỗi ảnh
- **Upload nhiều ảnh**: Có thể chọn nhiều ảnh cùng lúc

### 2. Xóa ảnh
- Hover vào ảnh để hiển thị nút xóa (màu đỏ)
- Click nút xóa để xóa ảnh
- Xác nhận xóa ảnh

### 3. Sắp xếp thứ tự ảnh
- **Nút mũi tên lên**: Di chuyển ảnh lên trên
- **Nút mũi tên xuống**: Di chuyển ảnh xuống dưới
- **Thứ tự hiển thị**: Số thứ tự hiển thị ở góc trên bên trái mỗi ảnh
- **Lưu tự động**: Thứ tự được lưu tự động sau mỗi thay đổi

### 4. Hiển thị ảnh trong tab thông tin cơ bản
- **Xem ảnh hiện tại**: Trong tab "Thông tin cơ bản" hiển thị tất cả ảnh của nhà
- **Số lượng ảnh**: Hiển thị tổng số ảnh hiện có
- **Thứ tự ảnh**: Mỗi ảnh có số thứ tự rõ ràng
- **Hover effects**: Hiệu ứng hover đẹp mắt khi di chuột qua ảnh
- **Hướng dẫn**: Thông báo hướng dẫn chuyển sang tab quản lý ảnh

## Cách sử dụng

### Trong EditHouseModal
1. Mở modal chỉnh sửa nhà
2. Chuyển sang tab "Quản lý ảnh"
3. Sử dụng các tính năng quản lý ảnh

### Trong SimpleImageManager
1. Import component vào trang cần sử dụng
2. Truyền `houseId` và `onImagesChange` callback
3. Component sẽ tự động load và quản lý ảnh

## API Endpoints

### Backend
- `GET /api/house-images/house/{houseId}` - Lấy danh sách ảnh
- `POST /api/house-images/house/{houseId}` - Thêm ảnh mới
- `DELETE /api/house-images/{imageId}/house/{houseId}` - Xóa ảnh
- `PUT /api/house-images/house/{houseId}/order` - Cập nhật thứ tự
- `DELETE /api/house-images/house/{houseId}/all` - Xóa tất cả ảnh

### Frontend
- `houseImageApi.getHouseImages(houseId)` - Lấy ảnh
- `houseImageApi.addHouseImage(houseId, imageUrl)` - Thêm ảnh
- `houseImageApi.deleteHouseImage(imageId, houseId)` - Xóa ảnh
- `houseImageApi.updateImageOrder(houseId, imageIds)` - Cập nhật thứ tự

## Cấu trúc dữ liệu

### HouseImage Entity
```java
public class HouseImage extends BaseEntity {
    private Long id;
    private House house;
    private String imageUrl;
    private Integer sortOrder;
}
```

### HouseImageDTO
```javascript
{
  id: number,
  houseId: number,
  imageUrl: string,
  sortOrder: number,
  createdAt: string,
  updatedAt: string
}
```

## Bảo mật
- Chỉ chủ nhà mới có quyền chỉnh sửa ảnh nhà của mình
- Sử dụng JWT token để xác thực
- Kiểm tra quyền truy cập trước mỗi thao tác

## Xử lý lỗi
- Hiển thị thông báo lỗi rõ ràng
- Rollback thay đổi nếu có lỗi
- Loading state cho các thao tác bất đồng bộ

## Responsive Design
- Grid layout tự động điều chỉnh theo kích thước màn hình
- Mobile-friendly với touch gestures
- Hover effects chỉ hiển thị trên desktop

## Performance
- Lazy loading ảnh
- Optimized image upload
- Efficient state management
- Debounced API calls

## Testing
- Demo page: `/image-management-demo`
- Test với các loại file khác nhau
- Test với kích thước file lớn
- Test với mạng chậm
