// src/api/houseApi.jsx (Đã sửa)
import { publicApiClient, privateApiClient } from "./apiClient.jsx";

// --- PUBLIC APIs ---
export const getHouses = (params) => publicApiClient.get("/houses", { params });
export const searchHouses = (query) =>
  publicApiClient.get(`/houses/search`, { params: { q: query } });
export const getHouseById = (id) => publicApiClient.get(`/houses/${id}`);

// --- ADMIN APIs ---
// Export từng hàm để component có thể import trực tiếp
export const adminGetHouses = (params) =>
  privateApiClient.get("/houses", { params });
export const adminGetHouseById = (id) => privateApiClient.get(`/houses/${id}`);
export const adminCreateHouse = (formData) =>
  privateApiClient.post("/houses", formData);
export const adminUpdateHouse = (id, houseData) =>
  privateApiClient.put(`/houses/${id}`, houseData);
export const adminDeleteHouse = (id) =>
  privateApiClient.delete(`/houses/${id}`);
export const adminUpdateHouseStatus = (id, status) =>
  privateApiClient.patch(`/houses/${id}/status`, { status });
