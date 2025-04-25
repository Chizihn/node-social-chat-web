import Cookies from "js-cookie";

// Custom storage object for cookies
export const cookieStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = Cookies.get(name);
      return value || null;
    } catch (error) {
      console.warn(`Error reading cookie ${name}:`, error);
      return null;
    }
  },
  setItem: (name: string, value: string, options = {}): void => {
    try {
      Cookies.set(name, value, {
        ...options,
        expires: 7,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    } catch (error) {
      console.error(`Error setting cookie ${name}:`, error);
    }
  },
  removeItem: (name: string): void => {
    Cookies.remove(name, { path: "/" });
  },
};

export const token = cookieStorage.getItem("token") as string;
