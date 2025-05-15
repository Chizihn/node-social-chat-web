import { API_URL } from "@/constants";
import { axiosErrorHandler } from "@/utils/error";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../queryClient";
import { Friends } from "@/types/friend";
import { User } from "@/types/user";
import api from "../api";

export const useFriends = (options = {}) => {
  const {
    data: friends, // Rename users back to friends
    isLoading: friendsLoading, // Rename usersLoading back to friendsLoading
    error: friendsError, // Rename usersError back to friendsError
    refetch: refetchFriends, // Rename refetchUsers back to refetchFriends
    isFetching: friendsFetching, // Rename usersFetching back to friendsFetching
  } = useQuery<User[]>({
    queryKey: ["friends"], // Keep the query key as "friends"
    queryFn: async () => {
      try {
        const response = await api.get(`${API_URL}/friends`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch friends");
        }

        console.log("data", response.data);

        return response.data.data || []; // Assuming the response is in { data: User[] }
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch friends");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    ...options, // Allow overriding any options from component
  });

  return {
    friends, // The list of friends (which are User objects)
    friendsLoading, // Loading state for friends data
    friendsError, // Error state for fetching friends
    refetchFriends, // Function to refetch the friends data
    friendsFetching, // Whether the data is currently being fetched
  };
};

export const useFriendRequests = (options = {}) => {
  const {
    data: friendRequests,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<Friends>({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      try {
        const response = await api.get(`/friend-requests`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch friend requests");
        }

        return response.data.data || [];
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch friend requests");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale

    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  return {
    friendRequests,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

export const useSentRequests = (options = {}) => {
  const {
    data: sentRequests,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<Friends>({
    queryKey: ["sentRequests"],
    queryFn: async () => {
      try {
        const response = await api.get(`/requests`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch sent requests");
        }
        console.log("req", response.data.data);

        return response.data.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch sent requests");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale

    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  return {
    sentRequests,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

export const useFindFriends = (options = {}) => {
  const {
    data: friendSugestions,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["friendSugestions"],
    queryFn: async () => {
      try {
        const response = await api.get(`/find`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch potential friends ");
        }

        console.log("potential friends", response.data.data);

        return response.data.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch potential friends");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale

    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  return {
    friendSugestions,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

export const useAddFriend = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addFriendMutation = useMutation({
    mutationFn: async (userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post(`/request`, { recipientId: userId });

        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to add friend");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends", "friendRequests"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const addFriend = async (userId: string) => {
    return addFriendMutation.mutateAsync(userId);
  };

  return {
    addFriend,
    isLoading: isLoading || addFriendMutation.isPending,
    error,
    isSuccess: addFriendMutation.isSuccess,
  };
};

export const useAcceptFriendRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptMutation = useMutation({
    mutationFn: async (requestId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post(`/request/accept`, { requestId });
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to accept friend request");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends", "friendRequests"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const acceptFriendRequest = async (requestId: string) => {
    return acceptMutation.mutateAsync(requestId);
  };

  return {
    acceptFriendRequest,
    isLoading: isLoading || acceptMutation.isPending,
    error,
    isSuccess: acceptMutation.isSuccess,
  };
};

export const useRejectFriendRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectMutation = useMutation({
    mutationFn: async (requestId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post(`/request/reject`, { requestId });
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to reject friend request");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends", "friendRequests"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const rejectFriendRequest = async (requestId: string) => {
    return rejectMutation.mutateAsync(requestId);
  };

  return {
    rejectFriendRequest,
    isLoading: isLoading || rejectMutation.isPending,
    error,
    isSuccess: rejectMutation.isSuccess,
  };
};

export const useRemoveFriend = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeMutation = useMutation({
    mutationFn: async (friendId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post(`/friends/remove`, { friendId });
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to remove friend");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const removeFriend = async (friendId: string) => {
    return removeMutation.mutateAsync(friendId);
  };

  return {
    removeFriend,
    isLoading: isLoading || removeMutation.isPending,
    error,
    isSuccess: removeMutation.isSuccess,
  };
};
