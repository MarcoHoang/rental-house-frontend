// src/api/authApi.js
import { privateApiClient } from "./apiClient";

// Chúng ta cần một client riêng cho login vì nó không có prefix /admin
// Hoặc chúng ta có thể gọi thẳng endpoint
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";
const authApiClient = axios.create({ baseURL: `${API_BASE_URL}${API_PREFIX}` });

export const adminAuth = {
  // Login không dùng privateApiClient vì chưa có token
  login: (credentials) => authApiClient.post(`/admin/login`, credentials),

  // Các hàm sau dùng privateApiClient vì đã có token
  logout: () => privateApiClient.post(`/logout`), // Giả sử endpoint là /admin/logout
  getProfile: () => privateApiClient.get(`/profile`), // Giả sử là /admin/profile
  changePassword: (passwordData) =>
    privateApiClient.put(`/change-password`, passwordData), // Giả sử là /admin/change-password
};
