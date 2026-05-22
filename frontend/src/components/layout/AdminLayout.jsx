import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, ShieldCheck, BarChart2, LogOut, Menu, X } from 'lucide-react';
import logoWhite from '../../assets/logo-white.svg';
import { useAuthStore } from '../../store/authStore';

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Laporan', path: '/admin/reports', icon: FileText },
    { name: 'Whitelist', path: '/admin/whitelist', icon: ShieldCheck },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-primary text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-slate-700">
          <img src={logoWhite} alt="SafeCheck Admin" className="h-8" />
          <p className="text-xs text-slate-400 mt-1 ml-1">Admin Panel</p>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive ? 'bg-secondary text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                  `}
                >
                  <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 -ml-2 mr-2 text-muted hover:text-primary focus:outline-none"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-primary">{title}</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-slate-500 mr-4">Hai, <span className="font-semibold text-primary">{adminUser?.username || 'Admin'}</span></span>
              <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
