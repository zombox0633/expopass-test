import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionUser } from "@/types/users";

// token จริงอยู่ใน httpOnly cookie (JS อ่านไม่ได้) — store นี้เก็บแค่
type AuthState = {
  user: SessionUser | null;
  setUser: (user: SessionUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "auth" },
  ),
);
