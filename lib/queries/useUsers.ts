// lib/quereies/useUsers
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosErrorHandler } from "@/utils/error";
import { User, Users } from "@/types/user";
import api from "../api";
import { useState } from "react";
import axios from "axios";
import { queryClient } from "../queryClient";

export const useUsers = (options = {}) => {
  const {
    data: users, // The list of users that will be returned
    isLoading, // Loading state for fetching
    error, // The error returned from the request
    refetch, // The function to refetch the users data
    isFetching, // A boolean that indicates if the query is currently fetching
  } = useQuery<Users>({
    queryKey: ["users"], // Define the query key
    queryFn: async () => {
      try {
        const response = await api.get(`/users`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch users");
        }

        console.log("data", response.data);

        return response.data.data as Users; // Return users list (assuming it's inside `data` in response)
      } catch (error) {
        const err = axiosErrorHandler(error); // Handle error with a custom function
        throw new Error(err || "Failed to fetch users");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // Data considered stale after 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  return {
    users, // The list of users
    isLoading, // The loading state
    error, // The error, if any
    refetch, // Function to refetch the users
    isFetching, // Whether the query is currently fetching
  };
};

export const useUser = (userId: string, options = {}) => {
  const {
    data: user, // The specific user data
    isLoading, // Loading state for fetching
    error, // The error, if any
    refetch, // Function to refetch the user data
    isFetching, // Whether the query is currently fetching
  } = useQuery<User | null>({
    queryKey: ["user", userId], // Unique key for this query
    queryFn: async () => {
      try {
        const response = await api.get(`/users/id/${userId}`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch user");
        }

        return response.data.data as User; // Return the specific user data
      } catch (error) {
        const err = axiosErrorHandler(error); // Handle error with a custom function
        throw new Error(err || "Failed to fetch user");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // Data considered stale after 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  return {
    user, // The specific user data
    isLoading, // The loading state
    error, // The error, if any
    refetch, // Function to refetch the user
    isFetching, // Whether the query is currently fetching
  };
};

export const useUserByUsername = (username: string, options = {}) => {
  const {
    data: user, // The specific user data
    isLoading, // Loading state for fetching
    error, // The error, if any
    refetch, // Function to refetch the user data
    isFetching, // Whether the query is currently fetching
  } = useQuery<User | null>({
    queryKey: ["user", username], // Unique key for this query
    queryFn: async () => {
      try {
        const response = await api.get(`/users/username/${username}`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch user");
        }

        console.log("uuser pro", response.data);

        return response.data as User; // Return the specific user data
      } catch (error) {
        const err = axiosErrorHandler(error); // Handle error with a custom function
        throw new Error(err || "Failed to fetch user");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // Data considered stale after 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  return {
    user, // The specific user data
    isLoading, // The loading state
    error, // The error, if any
    refetch, // Function to refetch the user
    isFetching, // Whether the query is currently fetching
  };
};

// export const useBlockedUsers = (
//   userId: string,
//   page = 1,
//   limit = 10,
//   options = {}
// ) => {
//   return useQuery<string[]>({
//     queryKey: ["blockedUsers", userId, page, limit],
//     queryFn: async () => {
//       try {
//         const response = await api.get(`/users/blocked`, {
//           params: { userId, page, limit },
//         });

//         if (response.status !== 200) {
//           throw new Error("Failed to fetch blocked users");
//         }

//         return response.data; // Assuming response.data is the blocked user list
//       } catch (error) {
//         const err = axiosErrorHandler(error);
//         throw new Error(err || "Failed to fetch blocked users");
//       }
//     },
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     retry: 2,
//     ...options,
//   });
// };

export const useBlockUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blockUserMutation = useMutation({
    mutationFn: async (targetId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post(`/users/${targetId}/block`);
        return response.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw new Error(err.response.data.error || "Failed to block user");
        }
        throw new Error("Failed to block user");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const blockUser = async (targetId: string) => {
    return blockUserMutation.mutateAsync(targetId);
  };

  return {
    blockUser,
    isLoading: isLoading || blockUserMutation.isPending,
    error,
    isSuccess: blockUserMutation.isSuccess,
  };
};

export const useUnblockUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unblockUserMutation = useMutation({
    mutationFn: async (targetId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post(`/users/${targetId}/unblock`);
        return response.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw new Error(err.response.data.error || "Failed to unblock user");
        }
        throw new Error("Failed to unblock user");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const unblockUser = async (targetId: string) => {
    return unblockUserMutation.mutateAsync(targetId);
  };

  return {
    unblockUser,
    isLoading: isLoading || unblockUserMutation.isPending,
    error,
    isSuccess: unblockUserMutation.isSuccess,
  };
};
