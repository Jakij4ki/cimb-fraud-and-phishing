import React from 'react';

const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  const elements = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <>
        {elements.map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
            </div>
            <div className="w-3/4 h-5 bg-slate-200 rounded mb-3"></div>
            <div className="w-full h-4 bg-slate-200 rounded mb-2"></div>
            <div className="w-5/6 h-4 bg-slate-200 rounded mb-6 flex-grow"></div>
            <div className="w-full flex justify-between mt-auto pt-4 border-t border-slate-100">
              <div className="w-24 h-4 bg-slate-200 rounded"></div>
              <div className="w-24 h-8 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'table-row') {
    return (
      <>
        {elements.map((_, i) => (
          <tr key={i} className="animate-pulse border-b border-slate-100">
            <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
            <td className="p-4"><div className="w-full max-w-xs h-4 bg-slate-200 rounded"></div></td>
            <td className="p-4"><div className="w-8 h-8 bg-slate-200 rounded-full"></div></td>
            <td className="p-4"><div className="w-20 h-6 bg-slate-200 rounded-full"></div></td>
            <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
          </tr>
        ))}
      </>
    );
  }

  if (variant === 'stats') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between animate-pulse">
        <div className="w-full">
          <div className="w-24 h-4 bg-slate-200 rounded mb-2"></div>
          <div className="w-16 h-8 bg-slate-200 rounded mb-2"></div>
          <div className="w-32 h-3 bg-slate-200 rounded"></div>
        </div>
        <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0"></div>
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    </div>
  );
};

export default LoadingSkeleton;
