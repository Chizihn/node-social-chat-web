import { useQuery } from "@tanstack/react-query";
import { axiosErrorHandler } from "@/utils/error";
import { User } from "@/types/user";
import api from "../api";

// Hook for searching all users
export const useSearch = (query: string, options = {}) => {
  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<User[]>({
    queryKey: ["search", query],
    queryFn: async () => {
      try {
        // Don't fetch if query is empty
        if (!query || query.trim() === "") {
          return [];
        }

        const response = await api.get(
          `/users/search?query=${encodeURIComponent(query)}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to search users");
        }

        return response.data || [];
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to search users");
      }
    },
    enabled: !!query && query.trim() !== "", // Only run query if search term exists
    staleTime: 1 * 60 * 1000, // 1 minute before data is considered stale
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });

  return {
    searchResults,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

// Hook for searching friends only
export const useFriendSearch = (query: string, options = {}) => {
  const {
    data: friendSearchResults,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<User[]>({
    queryKey: ["friendSearch", query],
    queryFn: async () => {
      try {
        // Don't fetch if query is empty
        if (!query || query.trim() === "") {
          return [];
        }

        const response = await api.get(
          `/friends/search?query=${encodeURIComponent(query)}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to search friends");
        }

        // Handle the case where the API returns a message instead of an array
        if (response.data.message && !Array.isArray(response.data)) {
          return [];
        }

        return response.data || [];
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to search friends");
      }
    },
    enabled: !!query && query.trim() !== "", // Only run query if search term exists
    staleTime: 1 * 60 * 1000, // 1 minute before data is considered stale
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });

  return {
    friendSearchResults,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};
