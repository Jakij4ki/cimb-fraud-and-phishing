import api from './api';

export const adminService = {
  login: async (username, password) => {
    const response = await api.post('/admin/auth/login', {
      username,
      password
    });
    return response.data;
  },
  getReports: async (params) => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },
  getReportDetail: async (id) => {
    const response = await api.get(`/admin/reports/${id}`);
    return response.data;
  },
  updateReport: async (id, data) => {
    const response = await api.patch(`/admin/reports/${id}`, data);
    return response.data;
  },
  getWhitelist: async () => {
    const response = await api.get('/admin/whitelist');
    return response.data;
  },
  addWhitelist: async (data) => {
    const response = await api.post('/admin/whitelist', data);
    return response.data;
  },
  deleteWhitelist: async (id, type) => {
    const response = await api.delete(`/admin/whitelist/${id}`, { params: { type } });
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getEducationContent: async () => {
    const response = await api.get('/education/content');
    return response.data;
  },
  submitQuiz: async (data) => {
    const response = await api.post('/education/quiz/submit', data);
    return response.data;
  }
};
