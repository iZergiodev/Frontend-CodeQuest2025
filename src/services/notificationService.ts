import apiClient from "../lib/api-client";
import type { Notification, NotificationStreamMessage } from "../types/blog";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5110";

export class NotificationService {
  private eventSource: EventSource | null = null;
  private listeners: Set<(message: NotificationStreamMessage) => void> =
    new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Connect to SSE stream
  connect(userId: number) {
    if (this.eventSource) {
      this.disconnect();
    }

    const url = `${API_BASE_URL}/api/Notifications/user/${userId}/stream`;
    console.log("Connecting to SSE:", url);
    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      try {
        // Skip heartbeat messages
        if (event.data.startsWith(": heartbeat")) {
          return;
        }

        const data = JSON.parse(event.data);
        console.log("SSE data received:", data);
        this.notifyListeners(data);
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay =
          this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(
          `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );

        setTimeout(() => {
          if (this.eventSource?.readyState === EventSource.CLOSED) {
            this.connect(userId);
          }
        }, delay);
      } else {
        console.error(
          "Max reconnection attempts reached. SSE connection failed."
        );
      }
    };

    this.eventSource.onopen = () => {
      console.log("SSE connection established");
      this.reconnectAttempts = 0; // Reset reconnection attempts on successful connection
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

  // Check if SSE connection is active
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  // Get connection status
  getConnectionStatus(): string {
    if (!this.eventSource) return "disconnected";

    switch (this.eventSource.readyState) {
      case EventSource.CONNECTING:
        return "connecting";
      case EventSource.OPEN:
        return "connected";
      case EventSource.CLOSED:
        return "closed";
      default:
        return "unknown";
    }
  }

  // Get notifications for user
  async getNotifications(
    userId: number,
    page = 1,
    pageSize = 20
  ): Promise<{ notifications: Notification[]; totalCount: number }> {
    try {
      const response = await apiClient.get(
        `/api/Notifications/user/${userId}?page=${page}&pageSize=${pageSize}`
      );
      const notifications = Array.isArray(response.data) ? response.data : [];

      return {
        notifications,
        totalCount: notifications.length,
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<void> {
    await apiClient.put(`/api/Notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  async markAllAsRead(userId: number): Promise<void> {
    await apiClient.put(`/api/Notifications/user/${userId}/read-all`);
  }

  // Delete notification
  async deleteNotification(notificationId: number): Promise<void> {
    await apiClient.delete(`/api/Notifications/${notificationId}`);
  }

  // Get unread count
  async getUnreadCount(userId: number): Promise<number> {
    try {
      const response = await apiClient.get(
        `/api/Notifications/user/${userId}/unread/count`
      );
      return response.data.count;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
