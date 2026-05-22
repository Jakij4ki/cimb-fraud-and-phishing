import { useState } from 'react';
import { reportService } from '../services/reportService';

export const useTicket = () => {
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkTicket = async (ticketId) => {
    if (!ticketId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getTicketStatus(ticketId);
      setTicketData(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Tiket tidak ditemukan atau terjadi kesalahan server.');
      setTicketData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    ticketData,
    loading,
    error,
    checkTicket
  };
};
