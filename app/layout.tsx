import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/Provider";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export const metadata: Metadata = {
  title: "Your Social Media App",
  description: "Connect with friends and share your moments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loading />}>
          <Provider>{children}</Provider>
        </Suspense>{" "}
      </body>
    </html>
  );
}
