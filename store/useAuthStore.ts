// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import { SigninResponse, SignupResponse } from "@/types/auth";
import { User } from "@/types/user";
import { SigninType, SignupType, VerifyEmailType } from "@/validators/auth";
import { axiosErrorHandler } from "@/utils/error";
import { API_URL } from "@/constants";
import { cookieStorage } from "@/utils/session";
import { toast } from "sonner";
import api from "@/lib/api";

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
          console.log(`/auth/signin`);

          const res = await api.post<SigninResponse>(
            `${API_URL}/auth/signin`,
            data
          );

          const { token, user } = res.data;
          cookieStorage.setItem("token", token);

          // toast.success("Signed in successfully!");
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
          const res = await api.post<SignupResponse>(`/auth/signup`, data);

          const { user, token } = res.data;
          // toast.success("Signup successful! Please verify your email.");

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
          const response = await api.post(`/auth/verify-email`, data);

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
          const res = await api.get<User>(`/auth/me`);
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
      // onRehydrateStorage: () => (state) => {
      //   if (state) {
      //     state.isAuthenticated = !!state.token;
      //     console.log("Auth store rehydrated:", state);
      //   }
      // },
      partialize: (state) =>
        ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        } as PersistAuth),
    }
  )
);
