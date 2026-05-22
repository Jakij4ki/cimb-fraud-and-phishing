import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

const ExplainCard = ({ explanation, riskLevel }) => {
  const configs = {
    safe: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: ShieldCheck,
      iconColor: 'text-emerald-500',
      title: 'Pesan Ini Aman',
      titleColor: 'text-emerald-800'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      title: 'Perlu Diwaspadai',
      titleColor: 'text-amber-800'
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: ShieldAlert,
      iconColor: 'text-red-500',
      title: 'Berbahaya!',
      titleColor: 'text-red-800'
    }
  };

  const config = configs[riskLevel] || configs.safe;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 ${config.bg} ${config.border}`}>
      <div className={`p-3 rounded-full bg-white shadow-sm flex-shrink-0 ${config.iconColor}`}>
        <Icon size={32} />
      </div>
      <div>
        <h3 className={`text-xl font-bold mb-2 ${config.titleColor}`}>
          {config.title}
        </h3>
        <p className="text-slate-700 text-[15px] sm:text-[17px] leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
};

export default ExplainCard;
