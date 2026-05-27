import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),

      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage-admin',
    }
  )
);

export const useIsLoggedIn = () => useAuthStore((state) => !!state.token);

export const useIsAdmin = () => useAuthStore((state) => {
  const roleName = typeof state.user?.role === 'object' ? state.user?.role?.name : state.user?.role;
  return roleName === 'admin';
});

export default useAuthStore;
