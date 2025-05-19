import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/message";
import { axiosErrorHandler } from "@/utils/error";
import api from "../api";

interface SendMessageRequest {
  recipientId: string;
  text: string;
  attachments?: string[]; // ✅ Now using string[] for attachments
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
    enabled: !!conversationId,
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
      const response = await api.post(`/messages`, {
        text,
        recipientId,
        attachments, // ✅ Directly pass string[] attachments
      });

      if (response.status !== 201) {
        throw new Error("Failed to send message");
      }

      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversation", variables.recipientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
