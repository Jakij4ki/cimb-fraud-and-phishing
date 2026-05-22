import React, { useState } from 'react';
import Button from '../ui/Button';
import { truncateText } from '../../utils/sanitize';

const ReportForm = ({ analysisResult, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    reporter_name: '',
    reporter_contact: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // simulate API call delay
      await new Promise(res => setTimeout(res, 1500));
      // In real implementation, you would call reportService.submitReport
      const mockTicketId = `PG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      onSuccess(mockTicketId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto">
      <h3 className="text-xl font-bold text-primary mb-4">Laporkan Pesan Mencurigakan</h3>
      
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6">
        <p className="text-sm font-medium text-slate-500 mb-1">Pesan yang dilaporkan:</p>
        <p className="text-sm text-slate-800 break-words italic">
          "{truncateText(analysisResult?.original_text || '', 100)}"
        </p>
        <div className="mt-2 text-xs font-semibold text-danger">
          Risk Score: {analysisResult?.risk_score}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reporter_name" className="block text-sm font-medium text-slate-700 mb-1">
            Nama (Opsional)
          </label>
          <input
            type="text"
            id="reporter_name"
            name="reporter_name"
            value={formData.reporter_name}
            onChange={handleChange}
            placeholder="Nama Anda"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
          />
        </div>

        <div>
          <label htmlFor="reporter_contact" className="block text-sm font-medium text-slate-700 mb-1">
            Email / No. HP (Opsional)
          </label>
          <input
            type="text"
            id="reporter_contact"
            name="reporter_contact"
            value={formData.reporter_contact}
            onChange={handleChange}
            placeholder="Untuk menerima update status"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            placeholder="Contoh: Saya menerima pesan ini dari nomor tidak dikenal..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary resize-none"
          />
        </div>

        <p className="text-xs text-slate-500 my-4 text-center">
          Pesan ini akan digunakan untuk meningkatkan sistem keamanan. Data Anda dijaga kerahasiaannya.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Kirim Laporan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
