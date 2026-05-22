import api from './api';

export const reportService = {
  submitReport: async (data) => {
    const response = await api.post('/report/', data);
    return response.data;
  },
  
  getTicketStatus: async (ticketId) => {
    const response = await api.get(`/report/ticket/${ticketId}`);
    return response.data;
  }
};
