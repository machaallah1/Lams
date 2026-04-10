import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: { 
    id: "moi", 
    tag: "@mon_style", 
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
  },
  isAuthenticated: true, // Fictif pour le prototypage afin d'accéder au dashboard
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
