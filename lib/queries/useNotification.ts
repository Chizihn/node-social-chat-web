import { axiosErrorHandler } from "@/utils/error";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../queryClient";
import { NotificationResponse } from "@/types/notification";
import api from "../api";

export const useNotifications = (options = {}) => {
  const {
    data: notificationData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<NotificationResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await api.get(`/notifications`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch notifications");
        }

        return {
          notifications: response.data.data || [],
          unreadCount: response.data.unreadCount || 0,
        };
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch notifications");
      }
    },
    // Caching and optimization settings
    staleTime: 1 * 60 * 1000, // 1 minute before data is considered stale
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch on component mount
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  return {
    notifications: notificationData?.notifications || [],
    unreadCount: notificationData?.unreadCount || 0,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

export const useMarkNotificationAsRead = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.patch(
          `/notifications/${notificationId}/read`,
          {}
        );
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to mark notification as read");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const markAsRead = async (notificationId: string) => {
    return markAsReadMutation.mutateAsync(notificationId);
  };

  return {
    markAsRead,
    isLoading: isLoading || markAsReadMutation.isPending,
    error,
    isSuccess: markAsReadMutation.isSuccess,
  };
};

export const useMarkAllNotificationsAsRead = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.patch(`/notifications/read-all`, {});
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to mark all notifications as read");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const markAllAsRead = async () => {
    return markAllAsReadMutation.mutateAsync();
  };

  return {
    markAllAsRead,
    isLoading: isLoading || markAllAsReadMutation.isPending,
    error,
    isSuccess: markAllAsReadMutation.isSuccess,
  };
};

export const useDeleteNotification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to delete notification");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const deleteNotification = async (notificationId: string) => {
    return deleteNotificationMutation.mutateAsync(notificationId);
  };

  return {
    deleteNotification,
    isLoading: isLoading || deleteNotificationMutation.isPending,
    error,
    isSuccess: deleteNotificationMutation.isSuccess,
  };
};
