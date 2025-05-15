import { axiosErrorHandler } from "../error";
import api from "@/lib/api";

// Function to follow a user
export const followUser = async (userIdToFollow: string) => {
  try {
    const response = await api.post(`/follow`, { userIdToFollow });
    return response.data;
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Follow user error:", error);
    throw new Error(err || "Failed to follow user");
  }
};

// Function to unfollow a user
export const unfollowUser = async (userIdToUnfollow: string) => {
  try {
    const response = await api.post(`/unfollow`, { userIdToUnfollow });
    return response.data;
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Unfollow user error:", error);
    throw new Error(err || "Failed to unfollow user");
  }
};
