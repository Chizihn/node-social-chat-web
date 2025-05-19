import { axiosErrorHandler } from "@/utils/error";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import api from "../api";
import { useState } from "react";
import { User } from "@/types/user";

// Hook to get user profile
export const useProfile = (options = {}) => {
  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await api.get(`/profile`);
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to fetch profile");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
    refetchOnWindowFocus: true,
    retry: 1,
    ...options,
  });

  return {
    profile: profileData,
    isLoading,
    error,
    refetch,
  };
};

// Hook to update profile
export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.put(`/profile/update`, profileData);
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to update profile");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const updateProfile = async (profileData: Partial<User>) => {
    return updateProfileMutation.mutateAsync(profileData);
  };

  return {
    updateProfile,
    isLoading: isLoading || updateProfileMutation.isPending,
    error,
    isSuccess: updateProfileMutation.isSuccess,
  };
};

// Hook to update avatar
export const useUpdateAvatar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarFile: File) => {
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const response = await api.put(`/profile/update-avatar`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to update avatar");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const updateAvatar = async (avatarFile: File) => {
    return updateAvatarMutation.mutateAsync(avatarFile);
  };

  return {
    updateAvatar,
    isLoading: isLoading || updateAvatarMutation.isPending,
    error,
    isSuccess: updateAvatarMutation.isSuccess,
  };
};

// Hook to update cover image
export const useUpdateCoverImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCoverImageMutation = useMutation({
    mutationFn: async (coverImageFile: File) => {
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("coverImage", coverImageFile);

        const response = await api.put(
          `/profile/update-cover-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to update cover image");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const updateCoverImage = async (coverImageFile: File) => {
    return updateCoverImageMutation.mutateAsync(coverImageFile);
  };

  return {
    updateCoverImage,
    isLoading: isLoading || updateCoverImageMutation.isPending,
    error,
    isSuccess: updateCoverImageMutation.isSuccess,
  };
};

// Hook to toggle profile privacy
export const useTogglePrivacy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePrivacyMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.put(`/profile/privacy`, {});
        return response.data;
      } catch (error) {
        const err = axiosErrorHandler(error);
        throw new Error(err || "Failed to toggle profile privacy");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const togglePrivacy = async () => {
    return togglePrivacyMutation.mutateAsync();
  };

  return {
    togglePrivacy,
    isLoading: isLoading || togglePrivacyMutation.isPending,
    error,
    isSuccess: togglePrivacyMutation.isSuccess,
  };
};
