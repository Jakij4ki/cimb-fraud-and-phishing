import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
        <Icon size={40} className="text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
      <p className="text-slate-500 mb-8 max-w-sm">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
