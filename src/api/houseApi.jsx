// src/api/houseApi.js
import axios from "axios";
import { mockHouses } from "./mockData"; // <-- 1. Import dữ liệu giả

const USE_MOCK_DATA = true; // <-- 2. Tạo một biến cờ để dễ dàng chuyển đổi

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Lấy danh sách nhà.
 * Sẽ trả về dữ liệu giả nếu USE_MOCK_DATA = true.
 */
export const getHouses = (params) => {
  if (USE_MOCK_DATA) {
    console.log("ĐANG SỬ DỤNG DỮ LIỆU GIẢ (MOCK DATA)");
    // 3. Trả về một Promise để giả lập việc gọi API bất đồng bộ
    return new Promise((resolve) => {
      // Giả lập độ trễ mạng là 0.8 giây để thấy được LoadingSpinner
      setTimeout(() => {
        // Axios trả về dữ liệu trong một object có key là 'data'
        // Chúng ta cũng làm vậy để component không cần thay đổi
        resolve({ data: mockHouses });
      }, 800);
    });
  }

  // --- PHẦN GỌI API THẬT (sẽ được dùng khi USE_MOCK_DATA = false) ---
  return apiClient.get("/houses", { params });
};

/**
 * Tìm kiếm nhà.
 * Hiện tại cũng trả về toàn bộ dữ liệu giả.
 */
export const searchHouses = (query) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Lọc dữ liệu giả để kết quả tìm kiếm trông thật hơn
        const results = mockHouses.filter(
          (house) =>
            house.name.toLowerCase().includes(query.toLowerCase()) ||
            house.address.toLowerCase().includes(query.toLowerCase())
        );
        resolve({ data: results });
      }, 500);
    });
  }

  return apiClient.get(`/houses/search?q=${query}`);
};
