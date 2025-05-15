import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/message";
import { axiosErrorHandler } from "@/utils/error";
import api from "../api";

interface SendMessageRequest {
  recipientId: string;
  text: string;
  attachments?: File[];
}

export const useMessages = (
  conversationId: string,
  page = 1,
  limit = 20,
  options = {}
) => {
  const {
    data: messages,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<Message[]>({
    queryKey: ["messages", conversationId, page],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/messages/${conversationId}?page=${page}&limit=${limit}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch messages");
        }

        return response.data.data as Message[];
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch messages");
      }
    },
    enabled: !!conversationId, // Only run query if conversationId exists
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    ...options,
  });

  return {
    messages,
    isLoading,
    error,
    refetch,
    isFetching,
  };
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recipientId,
      text,
      attachments,
    }: SendMessageRequest) => {
      // For file uploads, we need FormData
      if (attachments && attachments.length > 0) {
        const formData = new FormData();
        formData.append("text", text);
        formData.append("recipientId", recipientId); // Added recipientId
        attachments.forEach((file) => {
          formData.append("attachments", file);
        });
        const response = await api.post(`/messages`, formData);
        if (response.status !== 201) {
          throw new Error("Failed to send message");
        }
        return response.data.data;
      } else {
        // For text-only messages
        const response = await api.post(`/messages`, { text, recipientId });
        if (response.status !== 201) {
          throw new Error("Failed to send message");
        }
        return response.data.data;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the conversation query
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversation", variables.recipientId], // Changed from conversationId to recipientId
      });
      // Also update the conversations list
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
