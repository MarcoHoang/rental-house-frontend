# House Components

## ImageGallery Component

Component `ImageGallery` được sử dụng để hiển thị gallery ảnh với chức năng điều hướng bằng nút mũi tên.

### Tính năng

- Hiển thị ảnh chính với kích thước lớn
- Nút mũi tên trái/phải để điều hướng ảnh
- Thumbnail grid bên dưới để chọn ảnh nhanh
- Điều hướng bằng phím mũi tên (Arrow keys)
- Hiển thị số thứ tự ảnh hiện tại
- Xử lý lỗi khi ảnh không tải được
- Responsive design

### Cách sử dụng

```jsx
import ImageGallery from '../components/house/ImageGallery';

// Trong component
<ImageGallery 
  images={images} // Array các URL ảnh
  title="Tên nhà" // Tên nhà để hiển thị trong alt text
/>
```

### Props

- `images` (Array): Danh sách URL ảnh
- `title` (String): Tên nhà để hiển thị trong alt text

### Ví dụ

```jsx
const images = [
  'http://localhost:8080/api/files/house-image/image1.jpg',
  'http://localhost:8080/api/files/house-image/image2.jpg',
  'http://localhost:8080/api/files/house-image/image3.jpg'
];

<ImageGallery 
  images={images}
  title="Nhà cho thuê tại Hà Nội"
/>
```

### Tính năng đặc biệt

1. **Navigation bằng nút mũi tên**: Click vào nút trái/phải để chuyển ảnh
2. **Navigation bằng phím**: Sử dụng phím Arrow Left/Right để chuyển ảnh
3. **Thumbnail navigation**: Click vào thumbnail để chuyển nhanh đến ảnh đó
4. **Auto-loop**: Khi đến ảnh cuối, click next sẽ quay về ảnh đầu
5. **Error handling**: Hiển thị placeholder khi ảnh không tải được
6. **Responsive**: Tự động điều chỉnh layout trên mobile

### Styling

Component sử dụng styled-components với:
- Border radius: 0.75rem
- Shadow effects
- Hover animations
- Smooth transitions
- Mobile-friendly design
