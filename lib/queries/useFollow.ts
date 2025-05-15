// src/lib/queries/useFollow.ts

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import api from "../api";

export const useFollow = () => {
  const { user, setUser } = useAuthStore();

  const followMutation = useMutation({
    mutationFn: async (userIdToFollow: string) => {
      const response = await api.post(`/follow`, { userIdToFollow });
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
      const response = await api.post(`/unfollow`, { userIdToUnfollow });
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
