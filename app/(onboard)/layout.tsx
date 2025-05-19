"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { token } from "@/utils/session";
import Loading from "@/components/Loading";
import { User } from "@/types/user";
import { useUsers } from "@/lib/queries/useUsers";
import { useLikedItems } from "@/lib/queries/useLike";
import { toast } from "sonner";
import { axiosErrorHandler } from "@/utils/error";
import api from "@/lib/api";

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useUsers();
  useLikedItems();
  const { setUser } = useAuthStore();
  const { isLoading } = useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        // If no token exists, return a default response instead of undefined
        if (!token) {
          return { user: null };
        }

        const response = await api.get(`/me`, {});

        if (response.status !== 200) {
          throw new Error("Failed to fetch user data");
        }

        setUser(response.data.data);
        return response.data; // Return the data
      } catch (error) {
        const err = axiosErrorHandler(error);
        toast.error(err);
        console.error("Error auth", error);
        // Return a default response or throw the error

        // Alternatively: throw error; (if you want to trigger the error state)
      }
    },
  });

  if (isLoading) return <Loading />;

  return <>{children}</>;
}
