import { API_URL } from "@/constants";
import { axiosErrorHandler } from "@/utils/error";
import { token } from "@/utils/session";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type LikedItem = {
  _id: string;
  type: "Post" | "Comment";
  likedAt: string;
  targetId: string;
};

type LikedItemsResponse = {
  data: LikedItem[];
  pagination: {
    limit: number;
    skip: number;
    count: number;
  };
  success: boolean;
};

type LikedItemsQueryParams = {
  type?: "Post" | "Comment";
  limit?: number;
  skip?: number;
};

export const useLikedItems = (
  params: LikedItemsQueryParams = {},
  options = {}
) => {
  const { data, isLoading, error, isFetching, refetch } =
    useQuery<LikedItemsResponse>({
      queryKey: ["likes", params],
      queryFn: async () => {
        const queryString = new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        ).toString();

        try {
          const response = await axios.get(`${API_URL}/likes?${queryString}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          return response.data as LikedItemsResponse;
        } catch (error) {
          const err = axiosErrorHandler(error);
          throw new Error(err || `Failed to fetch liked items`);
        }
      },
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
      ...options,
    });

  return {
    likedItems: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};
