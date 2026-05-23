import React, { useState } from 'react';
import Button from '../ui/Button';
import { truncateText } from '../../utils/sanitize';
import { reportService } from '../../services/reportService';

const ReportForm = ({ analysisResult, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    reporter_name: '',
    reporter_contact: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const payload = {
        message_text: analysisResult?.original_text || analysisResult?.message_text || analysisResult?.input_text || '',
        message_type: analysisResult?.message_type || 'SMS',
        risk_score: analysisResult?.risk_score || analysisResult?.score || 0,
        risk_level: analysisResult?.risk_level || 'warning',
        explanation_text: analysisResult?.explanation || analysisResult?.explanation_text || '',
        extracted_urls: analysisResult?.extracted_urls || analysisResult?.components?.urls || [],
        extracted_phones: analysisResult?.extracted_phones || analysisResult?.components?.phones || [],
        extracted_emails: analysisResult?.extracted_emails || analysisResult?.components?.emails || [],
        breakdown: analysisResult?.breakdown || [],
        typosquatting_alerts: analysisResult?.typosquatting_alerts || [],
        reporter_name: formData.reporter_name || null,
        reporter_email: formData.reporter_contact || null,
        admin_notes: formData.notes || null
      };

      const response = await reportService.submitReport(payload);
      const ticketId = response.ticket_id || response.data?.ticket_id;
      
      if (ticketId) {
        onSuccess(ticketId);
      } else {
        throw new Error("Invalid ticket ID received");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Laporan gagal dikirim. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto">
      <h3 className="text-xl font-bold text-primary mb-4">Laporkan Pesan Mencurigakan</h3>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {errorMsg}
        </div>
      )}

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
