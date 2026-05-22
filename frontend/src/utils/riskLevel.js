import { RISK_COLORS } from '../constants/colors';

export function getRiskLevel(score) {
  if (score < 30) {
    return {
      level: 'safe',
      label: 'Aman',
      labelEn: 'safe',
      color: RISK_COLORS.safe.text,
      bgColor: RISK_COLORS.safe.bg,
      borderColor: RISK_COLORS.safe.border,
      icon: 'shield-check',
      description: 'Pesan ini tidak terdeteksi memiliki indikasi penipuan atau ancaman. Namun, selalu waspada jika meminta informasi pribadi.'
    };
  } else if (score < 70) {
    return {
      level: 'warning',
      label: 'Waspada',
      labelEn: 'warning',
      color: RISK_COLORS.warning.text,
      bgColor: RISK_COLORS.warning.bg,
      borderColor: RISK_COLORS.warning.border,
      icon: 'alert-triangle',
      description: 'Pesan ini memiliki beberapa indikasi mencurigakan. Jangan klik tautan sembarangan atau membagikan data pribadi Anda.'
    };
  } else {
    return {
      level: 'danger',
      label: 'Bahaya',
      labelEn: 'danger',
      color: RISK_COLORS.danger.text,
      bgColor: RISK_COLORS.danger.bg,
      borderColor: RISK_COLORS.danger.border,
      icon: 'shield-alert',
      description: 'Pesan ini sangat berpotensi penipuan (phishing). Jangan klik tautan apa pun dan segera hapus pesan tersebut.'
    };
  }
}

export function getRiskColor(score) {
  if (score < 30) return RISK_COLORS.safe.text;
  if (score < 70) return RISK_COLORS.warning.text;
  return RISK_COLORS.danger.text;
}

export function getRiskBgClass(level) {
  if (level === 'safe') return 'bg-emerald-50';
  if (level === 'warning') return 'bg-amber-50';
  if (level === 'danger') return 'bg-red-50';
  return 'bg-slate-50';
}

export function getRiskTextClass(level) {
  if (level === 'safe') return 'text-emerald-800';
  if (level === 'warning') return 'text-amber-800';
  if (level === 'danger') return 'text-red-800';
  return 'text-slate-800';
}
