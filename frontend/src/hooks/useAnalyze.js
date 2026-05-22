import { useState } from 'react';
import { useAnalysisStore } from '../store/analysisStore';
import { analyzeService } from '../services/analyzeService';
import { useToastStore } from '../components/ui/Toast';

export const useAnalyze = () => {
  const { status, result, errorMsg, setScanning, setResult, setError, reset } = useAnalysisStore();
  const addToast = useToastStore(state => state.addToast);

  const analyze = async (text, type) => {
    setScanning();
    try {
      const data = await analyzeService.analyze(text, type);
      setResult(data);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Terjadi kesalahan saat menganalisis pesan.';
      setError(msg);
      addToast({
        type: 'error',
        message: msg
      });
    }
  };

  return {
    status,
    result,
    error: errorMsg,
    analyze,
    reset
  };
};
