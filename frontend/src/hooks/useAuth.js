import { useAuthStore } from '../store/authStore';
import { adminService } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { isAuthenticated, adminUser, setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const data = await adminService.login(username, password);
      // data should contain access_token
      setAuth(data.access_token, { username });
      navigate('/admin/dashboard');
      return true;
    } catch (err) {
      throw new Error('Login gagal. Periksa kembali username dan password Anda.');
    }
  };

  const logout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  return {
    isAuthenticated,
    adminUser,
    login,
    logout
  };
};
