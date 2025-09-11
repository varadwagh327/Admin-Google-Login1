import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string | null }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isHydrated = true;

      if (typeof window !== "undefined") {
        if (action.payload.token) localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isHydrated = true;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    hydrate: (state, action: PayloadAction<{ user: User | null; token: string | null }>) => {
      if (!state.isHydrated) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = !!(action.payload.user && action.payload.token);
        state.isHydrated = true;
      }
    },
  },
});

export const { login, logout, hydrate } = authSlice.actions;
export default authSlice.reducer;
