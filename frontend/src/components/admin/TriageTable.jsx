import React, { useState } from 'react';
import Badge from '../ui/Badge';
import { formatDate, formatTicketId, truncateText } from '../../utils/sanitize';
import { Search, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';

const TriageTable = ({ reports, onViewDetail, onUpdateStatus, loading }) => {
  const [filterStatus, setFilterStatus] = useState('');

  if (loading) {
    return <div className="p-8 text-center text-muted animate-pulse">Memuat data...</div>;
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-border p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Search className="text-slate-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-primary">Tidak ada laporan</h3>
        <p className="text-muted mt-1">Belum ada laporan yang sesuai dengan kriteria.</p>
      </div>
    );
  }

  const filteredReports = filterStatus 
    ? reports.filter(r => r.status === filterStatus)
    : reports;

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-primary">Daftar Laporan Masuk</h3>
        <div className="flex gap-2">
          <select 
            className="text-sm border border-border rounded-md px-3 py-1.5 focus:ring-secondary focus:border-secondary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="submitted">Diterima</option>
            <option value="in_review">Ditinjau</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="false_positive">Bukan Penipuan</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
              <th className="p-4 font-medium">Ticket ID</th>
              <th className="p-4 font-medium">Preview Pesan</th>
              <th className="p-4 font-medium">Risk Score</th>
              <th className="p-4 font-medium">Risk Level</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Tanggal</th>
              <th className="p-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4">
                  <span className="font-mono text-sm font-medium text-secondary">{formatTicketId(report.id)}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-slate-700" title={report.message_text}>
                    {truncateText(report.message_text, 60)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${report.risk_score >= 70 ? 'bg-red-100 text-red-700' : 
                        report.risk_score >= 30 ? 'bg-amber-100 text-amber-700' : 
                        'bg-emerald-100 text-emerald-700'}`}
                    >
                      {report.risk_score}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge status={report.risk_level} size="sm" />
                </td>
                <td className="p-4">
                  <Badge status={report.status} size="sm" />
                </td>
                <td className="p-4 text-sm text-slate-500 whitespace-nowrap">
                  {formatDate(report.created_at)}
                </td>
                <td className="p-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewDetail(report.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Detail <ExternalLink size={14} className="ml-1" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t flex justify-between items-center text-sm text-slate-500">
        <span>Menampilkan {filteredReports.length} laporan</span>
        {/* Pagination placeholder */}
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" disabled>Sebelumnnya</Button>
          <Button variant="ghost" size="sm">Selanjutnya</Button>
        </div>
      </div>
    </div>
  );
};

export default TriageTable;
