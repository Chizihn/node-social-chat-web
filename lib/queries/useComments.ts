import { API_URL } from "@/constants";
import { Comments, CreateComment } from "@/types/post";
import { axiosErrorHandler } from "@/utils/error";
import { token } from "@/utils/session";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../queryClient";
import { useState } from "react";

export const useCommentsByPost = (postId: string, options = {}) => {
  const {
    data: comments,
    isLoading,
    error,
    refetch, // The function to refetch the data
    isFetching, // A boolean that indicates if the query is currently fetching
  } = useQuery<Comments>({
    queryKey: ["comments", postId], // Define the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/comments/${postId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use token for authentication
          },
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch comments for ${postId}`);
        }

        console.log("data", response.data);

        return response.data.data as Comments;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || `Failed to fetch comments for ${postId}`);
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
    comments, // The list of users
    isLoading, // The loading state
    error, // The error, if any
    refetch, // Function to refetch the users
    isFetching, // Whether the query is currently fetching
  };
};

export const useAddComment = (postId: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addCommentMutation = useMutation({
    mutationFn: async (data: CreateComment) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `${API_URL}/comments/${postId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to add comment");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const addComment = async (data: CreateComment) => {
    return addCommentMutation.mutateAsync(data);
  };

  return {
    addComment,
    isLoading: isLoading || addCommentMutation.isPending,
    error,
    isSuccess: addCommentMutation.isSuccess,
  };
};


