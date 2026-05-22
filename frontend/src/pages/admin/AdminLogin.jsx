import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import logoWhite from '../../assets/logo-white.svg';
import { useAuth } from '../../hooks/useAuth';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (attempts >= 5) {
      setError('Terlalu banyak percobaan. Coba lagi nanti.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await login(username, password);
      // login hook handles setAuth and redirect to /admin/dashboard
    } catch (err) {
      setAttempts(prev => prev + 1);
      setError('Username atau password tidak valid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <img src={logoWhite} alt="SafeCheck" className="h-12 w-auto" />
      </div>
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 transform transition-all">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary">Admin SafeCheck</h2>
          <p className="text-slate-500 text-sm mt-2">Masuk ke panel manajemen sistem</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-secondary focus:border-secondary transition-colors bg-slate-50 focus:bg-white"
                placeholder="Masukkan username"
                required
                disabled={attempts >= 5}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-secondary focus:border-secondary transition-colors bg-slate-50 focus:bg-white"
                placeholder="Masukkan password"
                required
                disabled={attempts >= 5}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                disabled={attempts >= 5}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-3 text-lg" 
            loading={loading}
            disabled={!username || !password || attempts >= 5}
          >
            Masuk
          </Button>
        </form>
      </div>

      <p className="text-white/60 text-sm mt-8 text-center max-w-sm">
        Akses ini terbatas hanya untuk administrator sistem SafeCheck.
      </p>
    </div>
  );
};

export default AdminLogin;
