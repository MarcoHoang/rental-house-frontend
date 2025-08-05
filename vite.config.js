// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Chuỗi '/api' là tiền tố bạn muốn chuyển tiếp
      "/api": {
        target: "http://localhost:8080", // Địa chỉ server backend của bạn
        changeOrigin: true,
        // (Tùy chọn) Xóa '/api' khỏi đường dẫn khi gửi request
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
