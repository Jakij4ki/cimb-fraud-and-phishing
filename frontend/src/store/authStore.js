import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  token: null,
  adminUser: null,
  isAuthenticated: false,
  
  setAuth: (token, user) => set({ 
    token, 
    adminUser: user, 
    isAuthenticated: true 
  }),
  
  clearAuth: () => set({ 
    token: null, 
    adminUser: null, 
    isAuthenticated: false 
  }),
  
  isTokenValid: () => {
    const token = get().token;
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  }
}));
