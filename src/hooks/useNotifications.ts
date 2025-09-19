import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { notificationService } from "../services/notificationService";
import type { Notification, NotificationStreamMessage } from "../types/blog";

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await notificationService.getNotifications(user.id);
      setNotifications(result.notifications);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (err) {
      console.error("Error loading unread count:", err);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err as Error);
    }
  }, [user]);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: number) => {
      try {
        await notificationService.deleteNotification(notificationId);
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
        // Update unread count if the deleted notification was unread
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (err) {
        setError(err as Error);
      }
    },
    [notifications]
  );

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await Promise.all([loadNotifications(), loadUnreadCount()]);
  }, [loadNotifications, loadUnreadCount]);

  // Handle SSE messages
  const handleSSEMessage = useCallback((message: NotificationStreamMessage) => {
    if (message.type === "notification" && message.data) {
      setNotifications((prev) => [message.data!, ...prev]);
      if (!message.data.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    } else if (
      message.type === "unreadCount" &&
      typeof message.count === "number"
    ) {
      setUnreadCount(message.count);
    }
  }, []);

  // Initialize
  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();

      // Connect to SSE
      notificationService.connect(user.id);
      notificationService.addListener(handleSSEMessage);

      return () => {
        notificationService.removeListener(handleSSEMessage);
        notificationService.disconnect();
      };
    }
  }, [user, loadNotifications, loadUnreadCount, handleSSEMessage]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  };
}
