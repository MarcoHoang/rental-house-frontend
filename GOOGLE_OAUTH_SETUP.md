# Cấu hình Google OAuth cho Rental House System

## Lỗi hiện tại
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

## Cách khắc phục

### 1. Truy cập Google Cloud Console
- Vào https://console.cloud.google.com/
- Chọn project: `rental-house-system` (hoặc tạo project mới)

### 2. Cấu hình OAuth 2.0 Client ID
- Vào **APIs & Services** > **Credentials**
- Tìm OAuth 2.0 Client ID hiện tại hoặc tạo mới
- Click vào client ID để chỉnh sửa

### 3. Thêm Authorized JavaScript origins
Thêm các URL sau vào **Authorized JavaScript origins**:
```
http://localhost:5173
http://localhost:3000
http://127.0.0.1:5173
http://127.0.0.1:3000
```

### 4. Thêm Authorized redirect URIs (nếu cần)
```
http://localhost:5173
http://localhost:5173/login
http://localhost:5173/callback
```

### 5. Cập nhật Client ID trong code
Tạo file `.env.local` trong thư mục `rental-house-frontend`:
```env
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

### 6. Restart development server
```bash
npm run dev
```

## Lưu ý
- Đảm bảo domain `localhost:5173` được thêm vào authorized origins
- Client ID phải khớp với project Google Cloud
- Nếu deploy production, nhớ thêm domain thực tế vào authorized origins

## Troubleshooting
1. **Lỗi vẫn xuất hiện**: Kiểm tra lại client ID và authorized origins
2. **Không load được Google button**: Kiểm tra network và CORS settings
3. **Lỗi 403**: Kiểm tra API quotas và billing 