import React from 'react';
import { CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/sanitize';

const AuditLog = ({ actions = [] }) => {
  if (!actions || actions.length === 0) {
    return <div className="text-slate-500 text-sm italic py-4">Belum ada riwayat aktivitas.</div>;
  }

  const getActionConfig = (type) => {
    switch (type) {
      case 'confirm': return { icon: CheckCircle, color: 'text-red-500', bg: 'bg-red-50' }; // confirm phishing
      case 'reject': return { icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-50' }; // mark false positive
      case 'close': return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'update': return { icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50' };
      default: return { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' };
    }
  };

  return (
    <div className="relative border-l-2 border-slate-200 ml-4 pl-6 py-2 space-y-6">
      {actions.map((action, idx) => {
        const config = getActionConfig(action.action_type);
        const Icon = config.icon;

        return (
          <div key={idx} className="relative">
            <div className={`absolute -left-[35px] w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${config.bg} ${config.color}`}>
              <Icon size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-primary">{action.admin_username}</span>
                <span className="text-xs text-muted font-mono">{formatDate(action.timestamp)}</span>
              </div>
              <p className="text-sm text-slate-700">
                Mengubah status menjadi <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded">{action.new_status}</span>
              </p>
              {action.notes && (
                <div className="mt-2 bg-slate-50 p-3 rounded border border-slate-200 text-sm text-slate-600 italic">
                  "{action.notes}"
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AuditLog;
