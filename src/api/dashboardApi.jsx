import { privateApiClient } from "./apiClient";

export const dashboardApi = {
  getStats: () => privateApiClient.get(`/dashboard/stats`),
  getRecentHouses: () => privateApiClient.get(`/dashboard/recent-houses`),
  getRevenueChart: (period) =>
    privateApiClient.get(`/dashboard/revenue`, { params: { period } }),
};
