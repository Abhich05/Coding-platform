import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  isAuthenticated: boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage', // Key in localStorage
    }
  )
);
