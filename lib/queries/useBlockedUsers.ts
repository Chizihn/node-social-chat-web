import { axiosErrorHandler } from "@/utils/error";
import { useQuery } from "@tanstack/react-query";
import api from "../api";

// Hook to get list of blocked users
export const useBlockedUsers = (options = {}) => {
  const {
    data: blockedUsersIds,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<string[]>({
    queryKey: ["blockedUsers"],
    queryFn: async () => {
      try {
        const response = await api.get(`/users/blocked`);
        return response.data?.blockedUserIds;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch blocked users");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });

  return {
    blockedUsersIds,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};
