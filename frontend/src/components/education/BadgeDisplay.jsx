import React from 'react';
import { Shield, Flame, Star, Award, Zap, BookOpen } from 'lucide-react';

const BadgeDisplay = ({ badges = [], streakCount = 0 }) => {
  const allBadgeTypes = [
    { id: 'novice', name: 'Pemula', desc: 'Selesaikan modul edukasi pertama', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 'vigilant', name: 'Waspada', desc: 'Laporkan 5 pesan mencurigakan', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-100' },
    { id: 'expert', name: 'Ahli Deteksi', desc: 'Skor kuis 100% 3 kali', icon: Award, color: 'text-purple-500', bg: 'bg-purple-100' },
    { id: 'streak_3', name: 'Streak 3 Hari', desc: 'Aktif 3 hari berturut-turut', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100' },
    { id: 'streak_7', name: 'Streak 7 Hari', desc: 'Aktif 7 hari berturut-turut', icon: Zap, color: 'text-rose-500', bg: 'bg-rose-100' },
    { id: 'exemplary', name: 'Teladan', desc: 'Laporan Anda membantu memblokir penipuan baru', icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      <div className="flex justify-between items-end mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Pencapaian Anda</h2>
          <p className="text-sm text-muted">Kumpulkan lencana dengan aktif belajar dan melaporkan.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center text-orange-500 font-bold text-xl gap-1">
            <Flame className="fill-orange-500" />
            <span>{streakCount}</span>
          </div>
          <span className="text-xs text-muted font-medium uppercase tracking-wider">Hari Streak</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {allBadgeTypes.map(badge => {
          const isEarned = badges.includes(badge.id);
          const Icon = badge.icon;
          
          return (
            <div key={badge.id} className="relative group flex flex-col items-center p-4 rounded-xl border border-transparent hover:bg-slate-50 transition-colors">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-sm transition-all
                ${isEarned ? badge.bg : 'bg-slate-100 grayscale opacity-60'}`}
              >
                <Icon size={32} className={isEarned ? badge.color : 'text-slate-400'} />
              </div>
              <span className={`font-semibold text-sm text-center ${isEarned ? 'text-slate-800' : 'text-slate-400'}`}>
                {badge.name}
              </span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center shadow-lg">
                <p className="font-bold mb-1">{badge.name}</p>
                <p className="text-slate-300">{badge.desc}</p>
                {!isEarned && <p className="mt-2 text-orange-300 italic">Belum diraih</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeDisplay;
