// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { createJSONStorage } from "zustand/middleware";
import { SigninResponse, SignupResponse } from "@/types/auth";
import { User } from "@/types/user";
import {
  ResetPasswordType,
  SigninType,
  SignupType,
  VerifyEmailType,
} from "@/validators/auth";
import { axiosErrorHandler } from "@/utils/error";
import { API_URL } from "@/constants";
import { cookieStorage, token } from "@/utils/session";
import { toast } from "sonner";

export interface PersistAuth {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthState extends PersistAuth {
  signin: (data: SigninType) => Promise<SigninResponse>;
  signup: (data: SignupType) => Promise<SignupResponse>;
  verifyEmail: (data: VerifyEmailType) => Promise<boolean>;
  resendVerifyEmail: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordType) => Promise<void>;
  logout: () => void;
  setUser: (user: Partial<User> | null) => void;
  setAuth?: (auth: PersistAuth) => void;
  fetchUserByToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signin: async (data) => {
        set({ isLoading: true, error: null });
        try {
          console.log(`${API_URL}/auth/signin`);

          const res = await axios.post<SigninResponse>(
            `${API_URL}/auth/signin`,
            data
          );

          const { token, user } = res.data;
          cookieStorage.setItem("token", token);

          toast.success("Signed in successfully!");
          console.log("Signin successful:", res.data);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return res.data;
        } catch (error) {
          const errorMessage = axiosErrorHandler(error);
          console.error("Signin error:", errorMessage);

          toast.error(errorMessage || "Signin failed");
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post<SignupResponse>(
            `${API_URL}/auth/signup`,
            data
          );

          const { user, token } = res.data;
          toast.success("Signup successful! Please verify your email.");

          cookieStorage.setItem("token", token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log("Signup successful:", res.data);
          return res.data;
        } catch (error) {
          const errorMessage = axiosErrorHandler(error);
          console.error("Signup error:", errorMessage);
          toast.error(errorMessage || "Signup failed");
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      verifyEmail: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${API_URL}/auth/verify-email`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { message } = response.data;

          toast.success(message);
          console.log("Email verification successful");
          return true;
        } catch (error) {
          const errorMessage = axiosErrorHandler(error);
          console.error("Email verification error:", errorMessage);
          toast.error(errorMessage || "Email verification failed");
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      resendVerifyEmail: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${API_URL}/auth/resend-verification`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success(
            response.data.message || "Verification email sent successfully!"
          );
          console.log("Verification email resent successfully");
          return true;
        } catch (error) {
          const errorMessage = axiosErrorHandler(error);
          console.error("Resend verification error:", errorMessage);
          toast.error(errorMessage || "Failed to resend verification email");
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(`${API_URL}/auth/forgot-password`, { email });
          toast.success("Password reset link sent to your email.");
          console.log("Forgot password email sent to:", email);
        } catch (error) {
          const errorMessage = axiosErrorHandler(error);
          console.error("Forgot password error:", errorMessage);
          toast.error(errorMessage || "Failed to send reset link");
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(`${API_URL}/auth/reset-password`, data);
          toast.success("Password reset successful. You can now sign in.");
          console.log("Password reset successful");
        } catch (error) {
          const errorMessage = axiosErrorHandler(error);
          console.error("Password reset error:", errorMessage);
          toast.error(errorMessage || "Password reset failed");
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        toast.success("Logged out successfully.");
        console.log("User logged out");
        cookieStorage.removeItem("chat-auth");
      },

      setUser: (user) => {
        set((state) => ({
          user: { ...state.user, ...user } as User,
        }));
        console.log("User updated:", user);
      },

      setAuth: (auth) => {
        set(auth);
        console.log("Auth state restored from storage:", auth);
      },

      fetchUserByToken: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const res = await axios.get<User>(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set({
            user: res.data,
            isAuthenticated: true,
            isLoading: false,
          });
          console.log("Fetched user from token:", res.data);
        } catch (error) {
          const errorMessage = axiosErrorHandler(error);
          console.error("Fetch user by token error:", errorMessage);
          toast.error("Session expired or unauthorized.");
          set({ isLoading: false, error: errorMessage });
        }
      },
    }),
    {
      name: "chat-auth",
      storage: createJSONStorage(() => cookieStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.token;
          console.log("Auth store rehydrated:", state);
        }
      },
      partialize: (state) =>
        ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        } as PersistAuth),
    }
  )
);
