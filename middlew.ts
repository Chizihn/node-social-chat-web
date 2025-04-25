// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuth } from "./utils/checkAuth";

// Define protected routes
const PROTECTED_PATHS = [
  "/feed",
  "/feeds",
  "/friends",
  "/chat",
  "/messages",
  "/settings",
];

export function middleware(req: NextRequest) {
  const authState = checkAuth(req);
  const { token, isAuthenticated, user } = authState || {}; // Use optional chaining
  const pathname = req.nextUrl.pathname;

  // If user is trying to access a protected route
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected) {
    // If no token or not authenticated, redirect to signin
    if (!token || !isAuthenticated) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }

    // If user is authenticated but not verified, redirect to verify-email
    if (user && !user.isVerified && pathname !== "/verify-email") {
      const url = req.nextUrl.clone();
      url.pathname = "/verify-email";
      return NextResponse.redirect(url);
    }
  }
  console.log("All checks complete");

  return NextResponse.next();
}

// Middleware runs only on relevant routes
export const config = {
  matcher: [
    "/feed/:path*",
    "/friends/:path*",
    "/chat/:path*",
    "/messages/:path*",
    "/settings/:path*",
  ],
};
