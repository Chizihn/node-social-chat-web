"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "./ui/sonner";
import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";

interface Props {
  children: React.ReactNode;
}

const Provider: React.FC<Props> = ({ children }) => {
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    connectSocket();
    console.log("runnin");

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" closeButton={true} />
        {children}
      </QueryClientProvider>
    </>
  );
};

export default Provider;
