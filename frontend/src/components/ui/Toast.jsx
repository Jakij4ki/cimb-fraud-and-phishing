import React, { useEffect } from 'react';
import { create } from 'zustand';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({ 
    toasts: [...state.toasts, { id: Date.now(), ...toast }] 
  })),
  removeToast: (id) => set((state) => ({ 
    toasts: state.toasts.filter((t) => t.id !== id) 
  }))
}));

const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const variants = {
    success: { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', iconColor: 'text-emerald-500' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconColor: 'text-amber-500' },
    error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconColor: 'text-red-500' },
    info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconColor: 'text-blue-500' },
  };

  const style = variants[toast.type || 'info'];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-start w-full max-w-sm p-4 mb-3 border rounded-lg shadow-lg ${style.bg} ${style.border}`}
      role="alert"
    >
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${style.bg} ${style.iconColor}`}>
        <Icon size={20} />
      </div>
      <div className={`ml-3 text-sm font-medium ${style.text}`}>
        {toast.message}
      </div>
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-black/5 focus:ring-2 focus:ring-black/10 ${style.text}`}
        aria-label="Close"
        onClick={() => onRemove(toast.id)}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
