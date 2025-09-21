import { create } from "zustand";

interface User {
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (user: User, token: string | null) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  login: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: true,
      isHydrated: true,
    });

    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: true,
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  hydrate: () => {
    if (!get().isHydrated && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      let user: User | null = null;

      try {
        user = userString ? JSON.parse(userString) : null;
      } catch {
        user = null;
      }

      set({
        user,
        token,
        isAuthenticated: !!(user && token),
        isHydrated: true,
      });
    }
  },
}));
