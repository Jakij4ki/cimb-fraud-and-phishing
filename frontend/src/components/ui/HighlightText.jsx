import React from 'react';
import { getHighlightedSegments } from '../../utils/highlightWords';

const HighlightText = ({ text, riskWords = [] }) => {
  const segments = getHighlightedSegments(text, riskWords);

  const getHighlightClass = (category) => {
    switch (category) {
      case 'URGENSI': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'ANCAMAN': return 'bg-red-100 text-red-900 border-red-200';
      case 'DATA_SENSITIF': return 'bg-rose-200 text-rose-900 border-rose-300 font-semibold';
      case 'IMING_IMING': return 'bg-blue-100 text-blue-900 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-900 border-yellow-200';
    }
  };

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {segments.map((segment, idx) => {
        if (!segment.isRisky) {
          return <span key={idx}>{segment.text}</span>;
        }

        return (
          <span
            key={idx}
            className={`relative group inline-block border-b-2 rounded px-1 animate-pulse mx-0.5 cursor-help ${getHighlightClass(segment.category)}`}
            aria-label={`Highlighted risk word: ${segment.text}, category: ${segment.category}`}
          >
            {segment.text}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10 shadow-lg">
              Kategori: {segment.category}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export default HighlightText;
