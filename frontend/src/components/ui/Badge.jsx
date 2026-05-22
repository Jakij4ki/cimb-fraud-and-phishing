import React from 'react';
import { Clock, Eye, AlertCircle, XCircle, Shield, CheckCircle, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { STATUS_COLORS, RISK_COLORS } from '../../constants/colors';

const Badge = ({ status, size = 'md' }) => {
  let config = {};
  let Icon = null;
  let label = status;

  switch (status) {
    case 'submitted':
      config = STATUS_COLORS.submitted;
      Icon = Clock;
      label = 'Diterima';
      break;
    case 'in_review':
      config = STATUS_COLORS.in_review;
      Icon = Eye;
      label = 'Ditinjau';
      break;
    case 'confirmed':
      config = STATUS_COLORS.confirmed;
      Icon = AlertCircle;
      label = 'Dikonfirmasi';
      break;
    case 'false_positive':
      config = STATUS_COLORS.false_positive;
      Icon = XCircle;
      label = 'Bukan Penipuan';
      break;
    case 'mitigated':
      config = STATUS_COLORS.mitigated;
      Icon = Shield;
      label = 'Dimitigasi';
      break;
    case 'closed':
      config = STATUS_COLORS.closed;
      Icon = CheckCircle;
      label = 'Selesai';
      break;
    case 'safe':
      config = RISK_COLORS.safe;
      Icon = ShieldCheck;
      label = 'Aman';
      break;
    case 'warning':
      config = RISK_COLORS.warning;
      Icon = AlertTriangle;
      label = 'Waspada';
      break;
    case 'danger':
      config = RISK_COLORS.danger;
      Icon = ShieldAlert;
      label = 'Bahaya';
      break;
    default:
      config = STATUS_COLORS.false_positive;
      Icon = AlertCircle;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses}`}
      style={{ backgroundColor: config.bg, color: config.text, borderColor: config.border }}
    >
      <Icon size={iconSize} />
      {label}
    </span>
  );
};

export default Badge;
