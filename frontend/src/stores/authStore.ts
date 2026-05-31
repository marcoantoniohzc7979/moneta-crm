import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  localLogin: (userData: { email: string; name: string; role: UserRole }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      localLogin: (userData) => {
        const user: User = { id: 'demo', ...userData };
        const token = 'demo-session';
        localStorage.setItem('moneta_token', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('moneta_token');
        set({ user: null, token: null });
      },
    }),
    { name: 'moneta-auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
