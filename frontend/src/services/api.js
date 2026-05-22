import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const sanitizePayload = (obj) => {
  if (typeof obj === 'string') {
    // Basic sanitization
    return obj.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  if (obj !== null && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      obj[key] = sanitizePayload(obj[key]);
    });
  }
  return obj;
};

api.interceptors.request.use((config) => {
  if (config.data) {
    config.data = sanitizePayload(config.data);
  }

  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 401) {
      useAuthStore.getState().clearAuth();
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    } else if (status === 429) {
      console.warn("Rate limit exceeded.");
    } else if (status === 500) {
      console.error("Internal server error.");
    }
  }
  return Promise.reject(error);
});

export default api;
