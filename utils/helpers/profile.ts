import { User } from "@/types/user";
import { axiosErrorHandler } from "../error";
import api from "@/lib/api";

// Function to get user profile
export const getProfile = async () => {
  try {
    const response = await api.get(`/profile`);
    return response.data;
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Get profile error:", error);
    throw new Error(err || "Failed to get profile");
  }
};

// Function to update profile information
export const updateProfile = async (profileData: Partial<User>) => {
  try {
    const response = await api.put(`/profile/update`, profileData);
    return response.data;
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Update profile error:", error);
    throw new Error(err || "Failed to update profile");
  }
};

// Function to update profile avatar
export const updateAvatar = async (avatarFile: File) => {
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
    console.error("Update avatar error:", error);
    throw new Error(err || "Failed to update avatar");
  }
};

// Function to toggle profile privacy
export const togglePrivacy = async () => {
  try {
    const response = await api.put(`/profile/privacy`, {});
    return response.data;
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Toggle privacy error:", error);
    throw new Error(err || "Failed to toggle profile privacy");
  }
};

// Function to update profile cover image
export const updateCoverImage = async (coverImageFile: File) => {
  try {
    const formData = new FormData();
    formData.append("coverImage", coverImageFile);

    const response = await api.put(`/profile/update-cover-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Update cover image error:", error);
    throw new Error(err || "Failed to update cover image");
  }
};
