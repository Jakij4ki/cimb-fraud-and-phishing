import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, ShieldAlert, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import StatsChart from '../../components/admin/StatsChart';
import TriageTable from '../../components/admin/TriageTable';
import ThreatMap from '../../components/admin/ThreatMap';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';

const StatCardItem = ({ title, value, change, trend, icon: Icon, colorClass, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-border p-6 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      {loading ? (
        <div className="h-8 w-24 bg-slate-200 animate-pulse rounded mt-1 mb-2"></div>
      ) : (
        <h3 className="text-3xl font-bold text-primary mb-2">{value}</h3>
      )}
      {!loading && (
        <div className="flex items-center text-xs">
          {trend === 'up' ? (
            <TrendingUp size={14} className={change > 0 && colorClass.includes('red') ? 'text-danger' : 'text-success'} />
          ) : trend === 'down' ? (
            <TrendingDown size={14} className={change < 0 && colorClass.includes('red') ? 'text-success' : 'text-danger'} />
          ) : null}
          <span className={`ml-1 font-medium ${trend === 'up' && colorClass.includes('red') ? 'text-danger' : trend === 'down' && !colorClass.includes('red') ? 'text-danger' : 'text-success'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-slate-400 ml-1">vs minggu lalu</span>
        </div>
      )}
    </div>
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
      <Icon size={24} className={colorClass.replace('bg-', 'text-').replace('-50', '-500')} />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsResponse = await adminService.getDashboardStats();
      const reportsResponse = await adminService.getReports({ limit: 5, sort_by: 'created_at', order: 'desc' });
      
      setStats({
        total: statsResponse?.total_reports || 0,
        totalChange: 0,
        pending: statsResponse?.pending_triage || 0,
        pendingChange: 0,
        dangerToday: statsResponse?.today_danger_count || 0,
        dangerChange: 0,
        resolvedWeek: statsResponse?.resolved_this_week || 0,
        resolvedChange: 0,
        trend: statsResponse?.trend_weekly,
        distribution: statsResponse?.by_risk_level ? [
          { name: 'Aman', value: statsResponse.by_risk_level.safe || 0, color: '#10b981' },
          { name: 'Waspada', value: statsResponse.by_risk_level.warning || 0, color: '#f59e0b' },
          { name: 'Bahaya', value: statsResponse.by_risk_level.danger || 0, color: '#ef4444' }
        ] : undefined
      });

      if (reportsResponse && reportsResponse.data) {
        setRecentReports(reportsResponse.data);
      } else {
        setRecentReports([]);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Gagal memuat dashboard. Periksa koneksi backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-sm text-center">
        <ShieldAlert size={32} className="mx-auto mb-3" />
        <h3 className="text-lg font-bold">Error</h3>
        <p>{error}</p>
        <Button onClick={fetchData} className="mt-4" variant="outline">Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardItem 
          title="Total Laporan" 
          value={stats?.total || 0} 
          change={stats?.totalChange || 0} 
          trend="up" 
          icon={FileText} 
          colorClass="bg-blue-50 text-blue-500" 
          loading={loading} 
        />
        <StatCardItem 
          title="Menunggu Triage" 
          value={stats?.pending || 0} 
          change={stats?.pendingChange || 0} 
          trend="down" 
          icon={Clock} 
          colorClass="bg-amber-50 text-amber-500" 
          loading={loading} 
        />
        <StatCardItem 
          title="Bahaya Hari Ini" 
          value={stats?.dangerToday || 0} 
          change={stats?.dangerChange || 0} 
          trend="up" 
          icon={ShieldAlert} 
          colorClass="bg-red-50 text-red-500" 
          loading={loading} 
        />
        <StatCardItem 
          title="Selesai (Minggu)" 
          value={stats?.resolvedWeek || 0} 
          change={stats?.resolvedChange || 0} 
          trend="up" 
          icon={CheckCircle} 
          colorClass="bg-emerald-50 text-emerald-500" 
          loading={loading} 
        />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="bg-slate-100 animate-pulse h-96 rounded-xl lg:col-span-2"></div>
           <div className="bg-slate-100 animate-pulse h-96 rounded-xl lg:col-span-1"></div>
        </div>
      ) : (
        <StatsChart data={stats} />
      )}

      {/* Recent Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <h3 className="font-semibold text-lg text-primary">Laporan Terbaru</h3>
          <Button variant="ghost" onClick={() => navigate('/admin/reports')}>
            Lihat Semua Laporan
          </Button>
        </div>
        <TriageTable 
          reports={recentReports} 
          loading={loading} 
          onViewDetail={(id) => navigate(`/admin/reports?id=${id}`)}
        />
      </div>

      {/* Threat Map */}
      <div className="w-full">
        <ThreatMap />
      </div>
    </div>
  );
};

export default Dashboard;
