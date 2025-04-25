// hooks/usePosts.ts
import { API_URL } from "@/constants";
import { CreatePost, Posts } from "@/types/post";
import { axiosErrorHandler } from "@/utils/error";
import { token } from "@/utils/session";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { queryClient } from "../queryClient";

//Get all posts
export const usePosts = (options = {}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["posts", page, limit], // Fixed typo + added pagination params to key
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/posts`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch posts");
        }

        return (
          response.data || { data: [], page: 1, totalPages: 1, totalPosts: 0 }
        );
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch posts");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  // Handling page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handling limit changes
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1 when changing limit
  };

  return {
    posts: (data?.data as Posts) || [],
    page: data?.page || page,
    totalPages: data?.totalPages || 1,
    totalPosts: data?.totalPosts || 0,
    isLoading,
    error,
    refetch,
    handlePageChange,
    handleLimitChange,
    currentPage: page,
    currentLimit: limit,
  };
};

export const usePostsForYou = (options = {}) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["foryou", page, limit], // Fixed typo + added pagination params to key
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/posts`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch posts");
        }

        return (
          response.data || { data: [], page: 1, totalPages: 1, totalPosts: 0 }
        );
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch posts");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  // Handling page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handling limit changes
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1 when changing limit
  };

  return {
    posts: (data?.data as Posts) || [],
    page: data?.page || page,
    totalPages: data?.totalPages || 1,
    totalPosts: data?.totalPosts || 0,
    isLoading,
    error,
    refetch,
    handlePageChange,
    handleLimitChange,
    currentPage: page,
    currentLimit: limit,
  };
};

export const useGetUserPosts = (username: string) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userPosts", username, page, limit], // Fixed typo + added pagination params to key
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/user/${username}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch user posts");
        }

        return (
          response.data || { data: [], page: 1, totalPages: 1, totalPosts: 0 }
        );
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch user posts");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
  });

  // Handling page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handling limit changes
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1 when changing limit
  };

  return {
    posts: (data?.data as Posts) || [],
    page: data?.page || page,
    totalPages: data?.totalPages || 1,
    totalPosts: data?.totalPosts || 0,
    isLoading,
    error,
    refetch,
    handlePageChange,
    handleLimitChange,
    currentPage: page,
    currentLimit: limit,
  };
};

export const usePostById = (postId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/${postId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch posts");
        }

        return response.data.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch posts");
      }
    },
  });
  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

//User creaeting post
export const useCreatePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPostMutation = useMutation({
    mutationFn: async (postData: CreatePost) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(`${API_URL}/posts`, postData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        return response.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw new Error(err.response.data.error || "Failed to create post");
        }
        throw new Error("Failed to create post");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch posts queries when a new post is created
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const createPost = async (postData: CreatePost) => {
    return createPostMutation.mutateAsync(postData);
  };

  return {
    createPost,
    isLoading: isLoading || createPostMutation.isPending,
    error,
    isSuccess: createPostMutation.isSuccess,
  };
};
