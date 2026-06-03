import { create } from 'zustand';
import { useSocialStore } from './socialStore';

// Vérifier si on a un token en mémoire
const initialToken = localStorage.getItem('style_token') || null;

export const useAuthStore = create((set) => ({
  user: null, // Plus d'utilisateur mocké au départ
  isAuthenticated: !!initialToken,
  isAuthModalOpen: false,
  authModalAction: "",

  openAuthModal: (actionName = "effectuer cette action") => set({ isAuthModalOpen: true, authModalAction: actionName }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  
  // Fonction locale pour réinitialiser le state
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  
  logout: () => {
    localStorage.removeItem('style_token');
    set({ user: null, isAuthenticated: false });
    try {
      useSocialStore.getState().disconnectSocket();
    } catch(e) { console.error(e); }
  },
  
  updateUser: (newData) => set((state) => ({ user: { ...state.user, ...newData } })),

  fetchCurrentUser: async () => {
    const token = localStorage.getItem('style_token');
    if(!token) return null;
    try {
      const res = await fetch('http://localhost:5000/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) {
        const data = await res.json();
        if (!data || !data.id) {
          localStorage.removeItem('style_token');
          set({ user: null, isAuthenticated: false });
          return null;
        }
        const userData = { 
          id: data.id, 
          tag: data.tag, 
          email: data.email, 
          avatar: data.avatar, 
          isMentor: data.isMentor, 
          kycStatus: data.kycStatus, 
          coachingRate: data.coachingRate 
        };
        set({ user: userData, isAuthenticated: true });
        return userData;
      } else {
        localStorage.removeItem('style_token');
        set({ user: null, isAuthenticated: false });
        return null;
      }
    } catch(e) {
      console.error(e);
      return null;
    }
  },

  // Connexion API Réelle
  loginAPI: async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if(res.ok) {
      localStorage.setItem('style_token', data.token);
      set({ user: data.user, isAuthenticated: true });
      return true;
    } else {
      throw new Error(data.error || "Erreur de connexion");
    }
  },

  // Inscription API Réelle
  registerAPI: async (pseudo, email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag: pseudo, email, password })
    });
    const data = await res.json();
    if(res.ok) {
      localStorage.setItem('style_token', data.token);
      set({ user: data.user, isAuthenticated: true });
      return true;
    } else {
      throw new Error(data.error || "Erreur d'inscription");
    }
  }
}));
