import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, RefreshCcw, AlertTriangle, ShieldCheck, Clock, X } from 'lucide-react';
import TriageTable from '../../components/admin/TriageTable';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import AuditLog from '../../components/admin/AuditLog';
import Badge from '../../components/ui/Badge';
import { useToastStore } from '../../components/ui/Toast';

const Reports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const detailId = queryParams.get('id');

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState({
    status: '',
    risk_level: '',
    dateFrom: '',
    dateTo: ''
  });

  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    notes: ''
  });

  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  useEffect(() => {
    if (detailId && reports.length > 0) {
      const rep = reports.find(r => r.id === detailId);
      if (rep) {
        openDetailModal(rep);
      }
    }
  }, [detailId, reports]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Mock data
      setReports([
        { id: 'PG-2026-01234', message_text: 'Yth Nasabah, rek anda diblokir. Klik s.id/cimb-update', risk_score: 95, risk_level: 'danger', status: 'submitted', created_at: new Date().toISOString(), reporter_name: 'Budi', reporter_contact: '08123456789' },
        { id: 'PG-2026-01233', message_text: 'Selamat! Nomor Anda terpilih memenangkan undian 100jt', risk_score: 85, risk_level: 'danger', status: 'in_review', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 'PG-2026-01232', message_text: 'Mohon info alamat pengiriman paket J&T yg tertunda', risk_score: 65, risk_level: 'warning', status: 'confirmed', created_at: new Date(Date.now() - 7200000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (report) => {
    setSelectedReport(report);
    setUpdateForm({ status: report.status, notes: '' });
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReport(null);
    navigate('/admin/reports', { replace: true });
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (['confirmed', 'false_positive', 'mitigated', 'closed'].includes(updateForm.status)) {
      setIsConfirmModalOpen(true);
    } else {
      submitUpdate();
    }
  };

  const submitUpdate = async () => {
    try {
      setIsConfirmModalOpen(false);
      // await adminService.updateReport(selectedReport.id, updateForm);
      await new Promise(res => setTimeout(res, 500));
      
      addToast({ type: 'success', message: 'Status laporan berhasil diperbarui' });
      fetchReports();
      closeDetailModal();
    } catch (err) {
      addToast({ type: 'error', message: 'Gagal memperbarui status laporan' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Manajemen Laporan</h2>
          <p className="text-muted text-sm mt-1">Total {reports.length} laporan ditemukan</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select 
            className="w-full sm:w-auto border-slate-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary"
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
          >
            <option value="">Semua Status</option>
            <option value="submitted">Diterima</option>
            <option value="in_review">Ditinjau</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="false_positive">Bukan Penipuan</option>
            <option value="closed">Selesai</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Tingkat Risiko</label>
          <select 
            className="w-full sm:w-auto border-slate-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary"
            value={filter.risk_level}
            onChange={(e) => setFilter({...filter, risk_level: e.target.value})}
          >
            <option value="">Semua Tingkat</option>
            <option value="danger">Bahaya</option>
            <option value="warning">Waspada</option>
            <option value="safe">Aman</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Dari Tanggal</label>
          <input 
            type="date" 
            className="w-full sm:w-auto border-slate-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary"
            value={filter.dateFrom}
            onChange={(e) => setFilter({...filter, dateFrom: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Sampai Tanggal</label>
          <input 
            type="date" 
            className="w-full sm:w-auto border-slate-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary"
            value={filter.dateTo}
            onChange={(e) => setFilter({...filter, dateTo: e.target.value})}
          />
        </div>
        <Button 
          variant="ghost" 
          onClick={() => setFilter({status: '', risk_level: '', dateFrom: '', dateTo: ''})}
          icon={RefreshCcw}
          className="text-sm"
        >
          Reset
        </Button>
      </div>

      <TriageTable 
        reports={reports} 
        loading={loading} 
        onViewDetail={(id) => navigate(`/admin/reports?id=${id}`)}
      />

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal} title={`Detail Laporan: ${selectedReport?.id}`} size="lg">
        {selectedReport && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-slate-500 mb-2 uppercase tracking-wider">Teks Pesan Asli</h4>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 break-words whitespace-pre-wrap font-mono text-sm max-h-48 overflow-y-auto">
                    {selectedReport.message_text}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-slate-500 mb-2 uppercase tracking-wider">Analisis Risiko</h4>
                  <div className="bg-white border rounded-lg p-4 flex gap-6">
                    <div className="text-center border-r pr-6">
                      <div className="text-4xl font-bold mb-1" style={{ color: selectedReport.risk_level === 'danger' ? '#ef4444' : selectedReport.risk_level === 'warning' ? '#f59e0b' : '#10b981' }}>
                        {selectedReport.risk_score}
                      </div>
                      <Badge status={selectedReport.risk_level} size="sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">Terdeteksi kata urgensi (diblokir) dan tautan yang dicurigai sebagai typosquatting.</p>
                      {selectedReport.risk_level === 'danger' && (
                        <div className="mt-3 bg-red-50 text-red-700 text-xs p-2 rounded flex gap-2">
                          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                          <span>Link s.id/cimb-update adalah pemendek URL yang menyembunyikan tujuan asli, sering digunakan penipu.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                   <h4 className="font-semibold text-sm text-slate-800 mb-4 flex gap-2 items-center"><Clock size={16}/> Riwayat Tindakan</h4>
                   <AuditLog actions={[
                     { admin_username: 'Sistem', timestamp: selectedReport.created_at, action_type: 'create', new_status: 'submitted', notes: 'Laporan diterima otomatis' },
                     ...(selectedReport.status !== 'submitted' ? [{ admin_username: 'admin1', timestamp: new Date(Date.now() - 1000000).toISOString(), action_type: 'update', new_status: selectedReport.status, notes: 'Meninjau laporan' }] : [])
                   ]} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-sm text-slate-500 mb-3 uppercase tracking-wider">Info Pelapor</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-500">Nama:</span> {selectedReport.reporter_name || '-'}</p>
                    <p><span className="text-slate-500">Kontak:</span> {selectedReport.reporter_contact || '-'}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h4 className="font-semibold text-sm text-slate-800 mb-3 border-b pb-2">Tindakan Admin</h4>
                  <form onSubmit={handleUpdateStatus} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Ubah Status</label>
                      <select 
                        className="w-full border-slate-300 rounded-md text-sm focus:ring-secondary focus:border-secondary"
                        value={updateForm.status}
                        onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                      >
                        <option value="submitted">Diterima</option>
                        <option value="in_review">Sedang Ditinjau</option>
                        <option value="confirmed">Dikonfirmasi Penipuan</option>
                        <option value="false_positive">Bukan Penipuan (Aman)</option>
                        <option value="mitigated">Telah Dimitigasi</option>
                        <option value="closed">Tiket Ditutup</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Catatan Admin (opsional)</label>
                      <textarea 
                        className="w-full border-slate-300 rounded-md text-sm focus:ring-secondary focus:border-secondary"
                        rows="3"
                        placeholder="Tambahkan alasan atau langkah yang telah diambil..."
                        value={updateForm.notes}
                        onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="w-full">Update Status</Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Konfirmasi Tindakan" size="sm">
        <div className="py-4">
          <div className="flex items-center gap-3 text-amber-600 mb-4 bg-amber-50 p-3 rounded-lg">
            <AlertTriangle size={24} className="flex-shrink-0" />
            <p className="text-sm font-medium">Anda akan mengubah status menjadi status akhir ({updateForm.status}).</p>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Apakah Anda yakin? Pelapor dapat melihat perubahan ini di halaman Cek Tiket.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>Batal</Button>
            <Button variant="danger" onClick={submitUpdate}>Ya, Lanjutkan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;
