import api from './api';

export const analyzeService = {
  analyze: async (messageText, messageType = 'SMS') => {
    const response = await api.post('/analyze', {
      message_text: messageText,
      message_type: messageType
    });
    return response.data;
  }
};
