export const sanitizeInput = (text) => {
  if (!text) return '';
  // Strip HTML
  const div = document.createElement('div');
  div.textContent = text;
  let sanitized = div.innerHTML;
  
  // Limit 5000 chars
  if (sanitized.length > 5000) {
    sanitized = sanitized.substring(0, 5000);
  }
  return sanitized;
};

export const formatTicketId = (id) => {
  if (!id) return '';
  // Ensure format PG-2026-XXXXX
  if (id.startsWith('PG-2026-')) return id;
  const numPart = id.toString().padStart(5, '0');
  return `PG-2026-${numPart}`;
};

export const truncateText = (text, maxLen = 60) => {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

export const formatScore = (score) => {
  if (score === undefined || score === null) return '00';
  return score.toString().padStart(2, '0');
};
