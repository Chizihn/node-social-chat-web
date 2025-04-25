// src/lib/queries/useFollow.ts

import { API_URL } from "@/constants";
import { token } from "@/utils/session";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";

export const useFollow = () => {
  const { user, setUser } = useAuthStore();

  const followMutation = useMutation({
    mutationFn: async (userIdToFollow: string) => {
      const response = await axios.post(
        `${API_URL}/follow`,
        { userIdToFollow },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_data, userIdToFollow) => {
      if (user) {
        setUser({
          ...user,
          following: [...(user.following || []), userIdToFollow],
        });
      }
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (userIdToUnfollow: string) => {
      const response = await axios.post(
        `${API_URL}/unfollow`,
        { userIdToUnfollow },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_data, userIdToUnfollow) => {
      if (user) {
        setUser({
          ...user,
          following: (user.following || []).filter(
            (id) => id !== userIdToUnfollow
          ),
        });
      }
    },
  });

  return {
    followUser: followMutation.mutateAsync,
    unfollowUser: unfollowMutation.mutateAsync,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
    isFollowing: (targetUserId: string) =>
      Boolean(user?.following?.includes(targetUserId)),
  };
};
