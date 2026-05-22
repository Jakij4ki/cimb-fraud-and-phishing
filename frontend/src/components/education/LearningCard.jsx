import React from 'react';
import { BookOpen, Shield, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import Button from '../ui/Button';

const LearningCard = ({ content }) => {
  const { title, description, difficulty, read_time, is_read, type } = content;

  const difficultyColors = {
    'Mudah': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Sedang': 'bg-amber-100 text-amber-800 border-amber-200',
    'Sulit': 'bg-rose-100 text-rose-800 border-rose-200'
  };

  const getIcon = () => {
    switch(type) {
      case 'phishing': return <ShieldAlert className="text-rose-500" size={24} />;
      case 'security': return <Shield className="text-secondary" size={24} />;
      default: return <BookOpen className="text-primary" size={24} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow p-5 flex flex-col h-full relative">
      {is_read && (
        <div className="absolute -top-2 -right-2 bg-success text-white p-1 rounded-full shadow-sm" title="Sudah dibaca">
          <CheckCircle2 size={20} />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-lg">
          {getIcon()}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${difficultyColors[difficulty] || 'bg-slate-100 text-slate-800'}`}>
          {difficulty}
        </span>
      </div>

      <h3 className="font-bold text-lg text-primary mb-2 line-clamp-2">{title}</h3>
      <p className="text-sm text-muted mb-6 line-clamp-3 flex-grow">{description}</p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center text-xs font-medium text-slate-500 gap-1.5">
          <Clock size={14} />
          <span>{read_time} menit baca</span>
        </div>
        <Button variant={is_read ? "secondary" : "primary"} size="sm">
          {is_read ? 'Baca Lagi' : 'Baca Sekarang'}
        </Button>
      </div>
    </div>
  );
};

export default LearningCard;
