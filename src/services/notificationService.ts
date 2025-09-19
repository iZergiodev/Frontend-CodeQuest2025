import apiClient from "../lib/api-client";
import type { Notification, NotificationStreamMessage } from "../types/blog";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5110/api";

export class NotificationService {
  private eventSource: EventSource | null = null;
  private listeners: Set<(message: NotificationStreamMessage) => void> =
    new Set();

  // Connect to SSE stream
  connect(userId: number) {
    if (this.eventSource) {
      this.disconnect();
    }

    const url = `${API_BASE_URL}/Notifications/user/${userId}/stream`;
    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyListeners(data);
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.connect(userId);
        }
      }, 5000);
    };

    this.eventSource.onopen = () => {
      console.log("SSE connection established");
    };
  }

  // Disconnect from SSE stream
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Add listener for SSE messages
  addListener(listener: (message: NotificationStreamMessage) => void) {
    this.listeners.add(listener);
  }

  // Remove listener
  removeListener(listener: (message: NotificationStreamMessage) => void) {
    this.listeners.delete(listener);
  }

  // Notify all listeners
  private notifyListeners(message: NotificationStreamMessage) {
    this.listeners.forEach((listener) => listener(message));
  }

  // Get notifications for user
  async getNotifications(
    userId: number,
    page = 1,
    pageSize = 20
  ): Promise<{ notifications: Notification[]; totalCount: number }> {
    const response = await apiClient.get(
      `/Notifications/user/${userId}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  }

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<void> {
    await apiClient.put(`/Notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  async markAllAsRead(userId: number): Promise<void> {
    await apiClient.put(`/Notifications/user/${userId}/read-all`);
  }

  // Delete notification
  async deleteNotification(notificationId: number): Promise<void> {
    await apiClient.delete(`/Notifications/${notificationId}`);
  }

  // Get unread count
  async getUnreadCount(userId: number): Promise<number> {
    const response = await apiClient.get(
      `/Notifications/user/${userId}/unread-count`
    );
    return response.data.count;
  }
}

export const notificationService = new NotificationService();
