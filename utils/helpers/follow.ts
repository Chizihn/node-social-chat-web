import axios from "axios";
import { token } from "../session";
import { axiosErrorHandler } from "../error";
import { API_URL } from "@/constants";

// Function to follow a user
export const followUser = async (userIdToFollow: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/follow`,
      { userIdToFollow },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
    const response = await axios.post(
      `${API_URL}/unfollow`,
      { userIdToUnfollow },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const err = axiosErrorHandler(error);
    console.error("Unfollow user error:", error);
    throw new Error(err || "Failed to unfollow user");
  }
};
