import React from 'react';
import { Check, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/sanitize';

const TicketStatus = ({ ticketData }) => {
  if (!ticketData) return null;

  const steps = [
    { id: 'submitted', label: 'Diterima' },
    { id: 'in_review', label: 'Ditinjau' },
    { id: 'confirmed', label: 'Dikonfirmasi' },
    { id: 'closed', label: 'Selesai' }
  ];

  // Helper to determine if a step is completed based on current status
  const getStepStatus = (stepId, currentStatus) => {
    const statusOrder = ['submitted', 'in_review', 'confirmed', 'mitigated', 'closed', 'false_positive'];
    let effectiveCurrent = currentStatus;
    
    // Map alternative end states to closed for the progress bar
    if (['mitigated', 'false_positive'].includes(currentStatus)) {
      effectiveCurrent = 'closed';
    }

    const currentIndex = statusOrder.indexOf(effectiveCurrent);
    const stepIndex = statusOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-border p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Status Laporan</h2>
          <p className="text-sm text-muted font-mono mt-1">{ticketData.id}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted mb-1">Tanggal Masuk</p>
          <p className="text-sm font-medium">{formatDate(ticketData.created_at)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mt-8 mb-12">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
          <div style={{ width: '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-transparent"></div>
        </div>
        
        <div className="flex justify-between w-full absolute top-1/2 -translate-y-1/2">
          {steps.map((step, idx) => {
            const status = getStepStatus(step.id, ticketData.status);
            
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10 w-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white transition-colors
                  ${status === 'completed' ? 'border-success bg-success text-white' : 
                    status === 'current' ? 'border-secondary text-secondary shadow-[0_0_0_4px_rgba(27,110,243,0.1)]' : 
                    'border-slate-200 text-slate-300'}
                `}>
                  {status === 'completed' ? <Check size={16} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>
                <div className="absolute top-10 w-24 text-center -ml-8">
                  <span className={`text-xs font-medium ${status === 'current' ? 'text-secondary' : status === 'completed' ? 'text-slate-700' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Connecting lines */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-slate-200 -z-10 px-4">
           {/* Active line could go here, calculated based on current status index */}
        </div>
      </div>

      <div className="mt-16 bg-slate-50 rounded-lg p-4 border border-slate-200">
        <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
          <ShieldCheck className="text-secondary" size={18} />
          Hasil Analisis Admin
        </h4>
        {ticketData.admin_notes ? (
          <p className="text-sm text-slate-700">{ticketData.admin_notes}</p>
        ) : (
          <p className="text-sm text-slate-500 italic flex items-center gap-2">
            <Clock size={14} /> Menunggu peninjauan admin...
          </p>
        )}
      </div>
    </div>
  );
};

export default TicketStatus;
