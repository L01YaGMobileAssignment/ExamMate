import { create } from "zustand";
import { UserType } from "../types/user";

interface AuthState {
  user: UserType | null;
  isLoading: boolean;
  setUser: (user: UserType | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoading: false,
  setUser: user => set({ user }),
  setLoading: loading => set({ isLoading: loading }),
  logout: () => set({ user: null }),
}));
