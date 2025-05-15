import { axiosErrorHandler } from "@/utils/error";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../queryClient";
import api from "../api";
import { User } from "@/types/user";

// Hook to get another user's profile by userId
export const useUserProfile = (userId: string, options = {}) => {
  const {
    data: userProfileData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      try {
        const response = await api.get(`/users/${userId}/profile`);
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch user profile");
      }
    },
    enabled: !!userId, // Only run the query if userId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });

  return {
    userProfile: userProfileData,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

// Hook to send friend request directly from profile
export const useSendFriendRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequestMutation = useMutation({
    mutationFn: async (userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post(`/request`, { recipientId: userId });
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to send friend request");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sentRequests"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const sendFriendRequest = async (userId: string) => {
    return sendRequestMutation.mutateAsync(userId);
  };

  return {
    sendFriendRequest,
    isLoading: isLoading || sendRequestMutation.isPending,
    error,
    isSuccess: sendRequestMutation.isSuccess,
  };
};

// Hook to block a user
export const useBlockUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blockUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post(`/users/${userId}/block`);
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to block user");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const blockUser = async (userId: string) => {
    return blockUserMutation.mutateAsync(userId);
  };

  return {
    blockUser,
    isLoading: isLoading || blockUserMutation.isPending,
    error,
    isSuccess: blockUserMutation.isSuccess,
  };
};

// Hook to unblock a user
export const useUnblockUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unblockUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.delete(`/users/${userId}/block`);
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to unblock user");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const unblockUser = async (userId: string) => {
    return unblockUserMutation.mutateAsync(userId);
  };

  return {
    unblockUser,
    isLoading: isLoading || unblockUserMutation.isPending,
    error,
    isSuccess: unblockUserMutation.isSuccess,
  };
};
