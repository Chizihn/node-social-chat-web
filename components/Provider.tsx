"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "./ui/sonner";

interface Props {
  children: React.ReactNode;
}

const Provider: React.FC<Props> = ({ children }) => {
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
