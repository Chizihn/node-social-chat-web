import { useQuery } from "@tanstack/react-query";
import { axiosErrorHandler } from "@/utils/error";
import { User, Users } from "@/types/user";
import api from "../api";

export const useUsers = (options = {}) => {
  const {
    data: users, // The list of users that will be returned
    isLoading, // Loading state for fetching
    error, // The error returned from the request
    refetch, // The function to refetch the users data
    isFetching, // A boolean that indicates if the query is currently fetching
  } = useQuery<Users>({
    queryKey: ["users"], // Define the query key
    queryFn: async () => {
      try {
        const response = await api.get(`/users`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch users");
        }

        console.log("data", response.data);

        return response.data.data as Users; // Return users list (assuming it's inside `data` in response)
      } catch (error) {
        const err = axiosErrorHandler(error); // Handle error with a custom function
        throw new Error(err || "Failed to fetch users");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // Data considered stale after 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  return {
    users, // The list of users
    isLoading, // The loading state
    error, // The error, if any
    refetch, // Function to refetch the users
    isFetching, // Whether the query is currently fetching
  };
};

export const useUser = (userId: string, options = {}) => {
  const {
    data: user, // The specific user data
    isLoading, // Loading state for fetching
    error, // The error, if any
    refetch, // Function to refetch the user data
    isFetching, // Whether the query is currently fetching
  } = useQuery<User | null>({
    queryKey: ["user", userId], // Unique key for this query
    queryFn: async () => {
      try {
        const response = await api.get(`/users/id/${userId}`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch user");
        }

        return response.data.data as User; // Return the specific user data
      } catch (error) {
        const err = axiosErrorHandler(error); // Handle error with a custom function
        throw new Error(err || "Failed to fetch user");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // Data considered stale after 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  return {
    user, // The specific user data
    isLoading, // The loading state
    error, // The error, if any
    refetch, // Function to refetch the user
    isFetching, // Whether the query is currently fetching
  };
};

export const useUserByUsername = (username: string, options = {}) => {
  const {
    data: user, // The specific user data
    isLoading, // Loading state for fetching
    error, // The error, if any
    refetch, // Function to refetch the user data
    isFetching, // Whether the query is currently fetching
  } = useQuery<User | null>({
    queryKey: ["user", username], // Unique key for this query
    queryFn: async () => {
      try {
        const response = await api.get(`/users/username/${username}`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch user");
        }

        console.log("uuser pro", response.data);

        return response.data as User; // Return the specific user data
      } catch (error) {
        const err = axiosErrorHandler(error); // Handle error with a custom function
        throw new Error(err || "Failed to fetch user");
      }
    },
    // Caching and optimization settings
    staleTime: 5 * 60 * 1000, // Data considered stale after 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 2, // Retry failed requests twice
    ...options, // Allow overriding any options from component
  });

  return {
    user, // The specific user data
    isLoading, // The loading state
    error, // The error, if any
    refetch, // Function to refetch the user
    isFetching, // Whether the query is currently fetching
  };
};
