import { hostApiClient } from "./apiClient.jsx";

// Lấy danh sách notification của user
export const getUserNotifications = async (userId) => {
  try {
    const response = await hostApiClient.get(`/notifications/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    throw error;
  }
};

// Đánh dấu notification đã đọc
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await hostApiClient.put(`/notifications/${notificationId}/read`);
    return response.data.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Xóa notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await hostApiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Tạo notification mới
export const createNotification = async (notificationData) => {
  try {
    const response = await hostApiClient.post(`/notifications`, notificationData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}; 