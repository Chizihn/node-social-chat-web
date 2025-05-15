import { axiosErrorHandler } from "../error";
import api from "@/lib/api";

// Function to mark a notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await api.patch(
      `/notifications/${notificationId}/read`,
      {}
    );
    return response.data;
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Mark notification as read error:", error);
    throw new Error(err || "Failed to mark notification as read");
  }
};

// Function to mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.patch(`/notifications/read-all`, {});
    return response.data;
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Mark all notifications as read error:", error);
    throw new Error(err || "Failed to mark all notifications as read");
  }
};

// Function to delete a notification
export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Delete notification error:", error);
    throw new Error(err || "Failed to delete notification");
  }
};

// Function to get all notifications
export const getNotifications = async () => {
  try {
    const response = await api.get(`/notifications`);
    return {
      notifications: response.data.data || [],
      unreadCount: response.data.unreadCount || 0,
    };
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Get notifications error:", error);
    throw new Error(err || "Failed to get notifications");
  }
};
