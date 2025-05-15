"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { token } from "@/utils/session";
import Loading from "@/components/Loading";
import { User } from "@/types/user";
import { useUsers } from "@/lib/queries/useUsers";
import { useLikedItems } from "@/lib/queries/useLike";
import api from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useUsers();
  useLikedItems();
  const { setUser } = useAuthStore();
  const { isLoading, error } = useQuery<User>({
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

        setUser(response.data.user);
        return response.data; // Return the data
      } catch (error) {
        console.error("Error auth", error);
        // Return a default response or throw the error
        return { user: null };
        // Alternatively: throw error; (if you want to trigger the error state)
      }
    },
  });

  if (isLoading) return <Loading />;

  if (error)
    return (
      <div>
        <p>Error: {error.message || "An unexpected error occured."}</p>
      </div>
    );
  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full overflow-hidden">
          <div className="w-full h-full max-w-7xl mx-auto overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
