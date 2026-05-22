import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, ShieldAlert, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import StatsChart from '../../components/admin/StatsChart';
import TriageTable from '../../components/admin/TriageTable';
import ThreatMap from '../../components/admin/ThreatMap';
import Button from '../../components/ui/Button';

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
  const [statsData, setStatsData] = useState(null);
  const [recentReports, setRecentReports] = useState([]);

  const fetchData = async () => {
    try {
      // Mock API call to getDashboardStats and getReports
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatsData({
        total: 1245,
        totalChange: 12,
        pending: 45,
        pendingChange: -5,
        dangerToday: 18,
        dangerChange: 20, // up, bad
        resolvedWeek: 312,
        resolvedChange: 8,
        // Chart data uses defaults in StatsChart if not provided
      });

      setRecentReports([
        { id: 'PG-2026-01234', message_text: 'Yth Nasabah, rek anda diblokir. Klik s.id/cimb-update', risk_score: 95, risk_level: 'danger', status: 'submitted', created_at: new Date().toISOString() },
        { id: 'PG-2026-01233', message_text: 'Selamat! Nomor Anda terpilih memenangkan undian 100jt', risk_score: 85, risk_level: 'danger', status: 'in_review', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 'PG-2026-01232', message_text: 'Mohon info alamat pengiriman paket J&T yg tertunda', risk_score: 65, risk_level: 'warning', status: 'confirmed', created_at: new Date(Date.now() - 7200000).toISOString() },
        { id: 'PG-2026-01231', message_text: 'Paket anda belum diambil, cek detail apk', risk_score: 88, risk_level: 'danger', status: 'mitigated', created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 'PG-2026-01230', message_text: 'Promo diskon 50% di merchant partner', risk_score: 15, risk_level: 'safe', status: 'false_positive', created_at: new Date(Date.now() - 172800000).toISOString() },
      ]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardItem 
          title="Total Laporan" 
          value={statsData?.total || 0} 
          change={statsData?.totalChange || 0} 
          trend="up" 
          icon={FileText} 
          colorClass="bg-blue-50 text-blue-500" 
          loading={loading} 
        />
        <StatCardItem 
          title="Menunggu Triage" 
          value={statsData?.pending || 0} 
          change={statsData?.pendingChange || 0} 
          trend="down" 
          icon={Clock} 
          colorClass="bg-amber-50 text-amber-500" 
          loading={loading} 
        />
        <StatCardItem 
          title="Bahaya Hari Ini" 
          value={statsData?.dangerToday || 0} 
          change={statsData?.dangerChange || 0} 
          trend="up" 
          icon={ShieldAlert} 
          colorClass="bg-red-50 text-red-500" 
          loading={loading} 
        />
        <StatCardItem 
          title="Selesai (Minggu)" 
          value={statsData?.resolvedWeek || 0} 
          change={statsData?.resolvedChange || 0} 
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
        <StatsChart data={statsData} />
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
