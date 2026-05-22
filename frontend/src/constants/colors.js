export const COLORS = {
  primary: {
    DEFAULT: '#0A2540',
    light: '#1a3a5c',
    dark: '#061828'
  },
  secondary: {
    DEFAULT: '#1B6EF3',
    light: '#4d91f5',
    dark: '#1558d6'
  },
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  surface: '#FFFFFF',
  background: '#F8FAFC',
  border: '#E2E8F0',
  muted: '#64748B',
  darkText: '#0F172A'
};

export const RISK_COLORS = {
  safe: {
    bg: '#ecfdf5', // emerald-50
    text: '#065f46', // emerald-800
    border: '#10B981', // success
    icon: '#10B981', // success
  },
  warning: {
    bg: '#fffbeb', // amber-50
    text: '#92400e', // amber-800
    border: '#F59E0B', // warning
    icon: '#F59E0B', // warning
  },
  danger: {
    bg: '#fef2f2', // red-50
    text: '#991b1b', // red-800
    border: '#EF4444', // danger
    icon: '#EF4444', // danger
  }
};

export const STATUS_COLORS = {
  submitted: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', icon: '#3b82f6' }, // blue
  in_review: { bg: '#fffbeb', text: '#92400e', border: '#fde68a', icon: '#f59e0b' }, // amber
  confirmed: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', icon: '#ef4444' }, // red
  false_positive: { bg: '#f8fafc', text: '#475569', border: '#e2e8f0', icon: '#64748b' }, // slate
  mitigated: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0', icon: '#10b981' }, // emerald
  closed: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', icon: '#22c55e' } // green
};
