import { create } from 'zustand';

export const useAnalysisStore = create((set) => ({
  status: 'idle', // 'idle' | 'scanning' | 'result' | 'error'
  result: null,
  inputText: '',
  messageType: 'SMS',
  errorMsg: null,

  setInput: (text, type) => set({ inputText: text, messageType: type }),
  setScanning: () => set({ status: 'scanning', errorMsg: null }),
  setResult: (data) => set({ status: 'result', result: data }),
  setError: (msg) => set({ status: 'error', errorMsg: msg }),
  reset: () => set({ status: 'idle', result: null, inputText: '', errorMsg: null, messageType: 'SMS' })
}));
