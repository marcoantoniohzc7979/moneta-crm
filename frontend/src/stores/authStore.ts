import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import api from '../utils/api';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('moneta_token', data.token);
        set({ user: data.user, token: data.token });
      },
      logout: () => {
        localStorage.removeItem('moneta_token');
        set({ user: null, token: null });
      },
      setUser: (user) => set({ user })
    }),
    { name: 'moneta-auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
