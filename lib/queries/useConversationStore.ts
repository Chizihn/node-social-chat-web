import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { axiosErrorHandler } from "@/utils/error";
import { Conversation } from "@/types/message";
import { useState } from "react";
import { queryClient } from "../queryClient";
import api from "../api";

export const useConversations = (options = {}) => {
  const {
    data: conversations,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        const response = await api.get(`/messages/conversations`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch conversations");
        }

        return response.data.data as Conversation[];
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch conversations");
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    ...options,
  });

  return {
    conversations,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

export const useConversation = (recipientId: string, options = {}) => {
  const {
    data: conversation,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<Conversation | null>({
    queryKey: ["conversation", recipientId],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/messages/conversations/${recipientId}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch conversation");
        }

        return response.data.data as Conversation;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch conversation");
      }
    },
    enabled: !!recipientId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    ...options,
  });

  return {
    conversation,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

export const useCreateConversation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createConversationMutation = useMutation({
    mutationFn: async (recipientId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Changed from POST to GET, based on backend implementation
        const response = await api.get(
          `/messages/conversations/${recipientId}/`
        );

        return response.data; // Assuming this is the response format
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw new Error(
            err.response.data.error ||
              "Failed to retrieve or create conversation"
          );
        }
        throw new Error("Failed to retrieve or create conversation");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch queries related to conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const createConversation = async (recipientId: string) => {
    return createConversationMutation.mutateAsync(recipientId);
  };

  return {
    createConversation,
    isLoading: isLoading || createConversationMutation.isPending,
    error,
    isSuccess: createConversationMutation.isSuccess,
  };
};
