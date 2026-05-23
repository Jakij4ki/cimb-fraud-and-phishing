import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import MessageInput from '../components/analysis/MessageInput';
import ScanAnimation from '../components/analysis/ScanAnimation';
import RiskResult from '../components/analysis/RiskResult';
import Modal from '../components/ui/Modal';
import ReportForm from '../components/report/ReportForm';
import Button from '../components/ui/Button';
import { useAnalyze } from '../hooks/useAnalyze';
import { useToastStore } from '../components/ui/Toast';
import { useAnalysisStore } from '../store/analysisStore';

const Analyze = () => {
  const { status, result, error, analyze, reset } = useAnalyze();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const addToast = useToastStore(state => state.addToast);

  // Scroll to top when result is ready
  useEffect(() => {
    if (status === 'result' || status === 'error') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [status]);

  const handleAnalyze = (text, type) => {
    analyze(text, type);
  };

  const handleReportSuccess = (ticketId) => {
    setIsReportModalOpen(false);
    addToast({
      type: 'success',
      message: `Laporan berhasil dikirim. ID Tiket: ${ticketId}`
    });
    // In a real app, we might redirect to the tracker page or show a link
  };

  const handleRetry = () => {
    const { inputText, messageType } = useAnalysisStore.getState();
    if (!inputText || inputText.trim() === '') {
      reset();
      return;
    }
    analyze(inputText, messageType);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header section - visible only when idle or scanning */}
      {(status === 'idle' || status === 'scanning') && (
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Cek Pesan Anda</h1>
          <p className="text-lg text-muted">
            Paste pesan mencurigakan dan sistem AI kami akan menganalisis potensi penipuan dalam hitungan detik.
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full flex justify-center">
        {status === 'idle' && (
          <div className="w-full max-w-4xl">
            <MessageInput onAnalyze={handleAnalyze} />
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
              <Shield size={16} className="text-emerald-500" />
              <span>Privasi Anda terjaga — pesan tidak disimpan kecuali Anda memilih untuk melaporkan.</span>
            </div>
          </div>
        )}

        {status === 'scanning' && (
          <div className="w-full bg-white rounded-xl shadow-lg border border-border p-12 min-h-[400px] flex items-center justify-center">
            <ScanAnimation />
          </div>
        )}

        {status === 'result' && result && (
          <div className="w-full">
            <RiskResult 
              result={result} 
              onReset={reset} 
              onReport={() => setIsReportModalOpen(true)} 
            />
          </div>
        )}

        {status === 'error' && (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow border border-red-200 p-8 text-center animate-fade-in">
            <div className="inline-flex w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-6">
              <AlertCircle size={32} className="text-danger" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-3">Analisis Gagal</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {error || "Maaf, terjadi gangguan saat menganalisis pesan Anda. Silakan coba beberapa saat lagi."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" onClick={reset}>Kembali</Button>
              <Button onClick={handleRetry}>
                Coba Lagi
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Modal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)}
        title="Laporkan Pesan"
        size="md"
      >
        <ReportForm 
          analysisResult={result}
          onSuccess={handleReportSuccess}
          onCancel={() => setIsReportModalOpen(false)}
        />
      </Modal>

    </div>
  );
};

export default Analyze;
