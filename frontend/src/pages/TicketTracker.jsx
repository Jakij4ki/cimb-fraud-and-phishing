import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, AlertCircle, FileSearch } from 'lucide-react';
import Button from '../components/ui/Button';
import TicketStatus from '../components/report/TicketStatus';
import { useTicket } from '../hooks/useTicket';

const TicketTracker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState(id || '');
  const { ticketData, loading, error, checkTicket } = useTicket();

  // If ID is provided in URL, automatically check it
  useEffect(() => {
    if (id) {
      checkTicket(id.trim());
    }
  }, [id]);

  const handleInputChange = (e) => {
    let val = e.target.value.toUpperCase();
    // Auto-format basic PG-2026-
    if (val.length === 2 && !val.includes('-')) val = val + '-';
    if (val.length === 7 && val.indexOf('-', 3) === -1) val = val.substring(0, 7) + '-' + val.substring(7);
    
    setTicketId(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanId = ticketId.trim();
    if (cleanId) {
      // Update URL without page reload
      navigate(`/ticket/${cleanId}`, { replace: true });
      checkTicket(cleanId);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-[calc(100vh-200px)]">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Cek Status Laporan</h1>
        <p className="text-lg text-muted">
          Masukkan nomor tiket yang Anda terima saat melaporkan pesan mencurigakan untuk melacak perkembangannya.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-12">
        <form onSubmit={handleSubmit} className="flex gap-3 relative">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={ticketId}
              onChange={handleInputChange}
              placeholder="Contoh: PG-2026-00123"
              className="block w-full pl-11 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg font-mono focus:ring-0 focus:border-secondary transition-colors uppercase placeholder:normal-case placeholder:font-sans"
              maxLength={15}
            />
          </div>
          <Button 
            type="submit" 
            size="lg" 
            disabled={!ticketId.trim() || loading}
            loading={loading}
            className="rounded-xl px-8"
          >
            Cek Status
          </Button>
        </form>
      </div>

      <div className="animate-fade-in">
        {error && (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileSearch className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">Tiket Tidak Ditemukan</h3>
            <p className="text-slate-600 text-sm">
              {error} Pastikan format nomor tiket sudah benar (contoh: PG-2026-XXXXX).
            </p>
          </div>
        )}

        {!loading && !error && ticketData && (
          <TicketStatus ticketData={ticketData} />
        )}

        {!loading && !error && !ticketData && !id && (
           <div className="max-w-md mx-auto text-center opacity-50 flex flex-col items-center pt-8">
             <FileSearch className="text-slate-300 mb-4" size={48} />
             <p className="text-sm text-slate-500">Masukkan ID Tiket untuk melihat detail laporan</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default TicketTracker;
