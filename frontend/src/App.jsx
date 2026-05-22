import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import { ToastContainer } from './components/ui/Toast';
import { useAuthStore } from './store/authStore';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Analyze = React.lazy(() => import('./pages/Analyze'));
const TicketTracker = React.lazy(() => import('./pages/TicketTracker'));
const Education = React.lazy(() => import('./pages/Education'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Reports = React.lazy(() => import('./pages/admin/Reports'));
const Whitelist = React.lazy(() => import('./pages/admin/Whitelist'));
const Analytics = React.lazy(() => import('./pages/admin/Analytics'));

const PageWrapper = ({ children, title }) => {
  useEffect(() => {
    document.title = title ? `${title} — SafeCheck` : 'SafeCheck — Lindungi Diri dari Penipuan Digital';
  }, [title]);
  return children;
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Suspense fallback={<LoadingFallback />}><PageWrapper title="Beranda"><main className="min-h-screen pt-16"><Home /></main></PageWrapper></Suspense><Footer /></>} />
        <Route path="/analyze" element={<><Navbar /><Suspense fallback={<LoadingFallback />}><PageWrapper title="Cek Pesan"><main className="min-h-screen pt-16 bg-slate-50"><Analyze /></main></PageWrapper></Suspense><Footer /></>} />
        <Route path="/ticket/:id?" element={<><Navbar /><Suspense fallback={<LoadingFallback />}><PageWrapper title="Lacak Tiket"><main className="min-h-screen pt-16 bg-slate-50"><TicketTracker /></main></PageWrapper></Suspense><Footer /></>} />
        <Route path="/education" element={<><Navbar /><Suspense fallback={<LoadingFallback />}><PageWrapper title="Edukasi Keamanan"><main className="min-h-screen pt-16"><Education /></main></PageWrapper></Suspense><Footer /></>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Suspense fallback={<LoadingFallback />}><PageWrapper title="Admin Login"><AdminLogin /></PageWrapper></Suspense>} />

        {/* Admin Protected Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="dashboard" element={<PageWrapper title="Admin Dashboard"><AdminLayout title="Dashboard"><Dashboard /></AdminLayout></PageWrapper>} />
                <Route path="reports" element={<PageWrapper title="Manajemen Laporan"><AdminLayout title="Manajemen Laporan"><Reports /></AdminLayout></PageWrapper>} />
                <Route path="whitelist" element={<PageWrapper title="Kelola Whitelist"><AdminLayout title="Kelola Whitelist"><Whitelist /></AdminLayout></PageWrapper>} />
                <Route path="analytics" element={<PageWrapper title="Analytics"><AdminLayout title="Analytics & Intelligence"><Analytics /></AdminLayout></PageWrapper>} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </Suspense>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
