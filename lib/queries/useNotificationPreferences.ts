import { axiosErrorHandler } from "@/utils/error";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../queryClient";
import api from "../api";

// Types for notification preferences
export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  emailMessages: boolean;
  pauseAll: boolean;
  pauseStart?: string; // Time in format "HH:MM"
  pauseEnd?: string; // Time in format "HH:MM"
}

// Hook to get notification preferences
export const useNotificationPreferences = (options = {}) => {
  const {
    data: preferencesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notificationPreferences"],
    queryFn: async () => {
      try {
        const response = await api.get(`/notifications/preferences`);
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch notification preferences");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });

  return {
    preferences: preferencesData,
    isLoading,
    error,
    refetch,
  };
};

// Hook to update notification preferences
export const useUpdateNotificationPreferences = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: Partial<NotificationPreferences>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.put(
          `/notifications/preferences`,
          preferences
        );
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to update notification preferences");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notificationPreferences"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const updatePreferences = async (
    preferences: Partial<NotificationPreferences>
  ) => {
    return updatePreferencesMutation.mutateAsync(preferences);
  };

  return {
    updatePreferences,
    isLoading: isLoading || updatePreferencesMutation.isPending,
    error,
    isSuccess: updatePreferencesMutation.isSuccess,
  };
};

// Hook to toggle push notifications
export const useTogglePushNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePushMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.put(`/notifications/preferences`, {
          pushEnabled: enabled,
        });
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to toggle push notifications");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notificationPreferences"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const togglePushNotifications = async (enabled: boolean) => {
    return togglePushMutation.mutateAsync(enabled);
  };

  return {
    togglePushNotifications,
    isLoading: isLoading || togglePushMutation.isPending,
    error,
    isSuccess: togglePushMutation.isSuccess,
  };
};

// Hook to toggle email notifications
export const useToggleEmailNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleEmailMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.put(`/notifications/preferences`, {
          emailEnabled: enabled,
        });
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to toggle email notifications");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notificationPreferences"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const toggleEmailNotifications = async (enabled: boolean) => {
    return toggleEmailMutation.mutateAsync(enabled);
  };

  return {
    toggleEmailNotifications,
    isLoading: isLoading || toggleEmailMutation.isPending,
    error,
    isSuccess: toggleEmailMutation.isSuccess,
  };
};
