import React, { useEffect, useState } from 'react';
import { getRiskLevel } from '../../utils/riskLevel';

const RiskMeter = ({ score = 0, animated = true, size = 'md' }) => {
  const [currentScore, setCurrentScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentScore(score);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [score, animated]);

  const riskInfo = getRiskLevel(currentScore);
  const radius = size === 'large' ? 120 : size === 'compact' ? 60 : 80;
  const strokeWidth = size === 'large' ? 24 : size === 'compact' ? 12 : 16;
  const cx = size === 'large' ? 140 : size === 'compact' ? 70 : 100;
  const cy = size === 'large' ? 140 : size === 'compact' ? 70 : 100;

  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;
  
  // Rotation for the needle
  const rotation = (currentScore / 100) * 180 - 90;

  const getColor = (s) => {
    if (s < 30) return '#10B981';
    if (s < 70) return '#F59E0B';
    return '#EF4444';
  };

  const currentColor = getColor(currentScore);

  return (
    <div className={`relative flex flex-col items-center justify-center ${size === 'large' ? 'w-[280px]' : size === 'compact' ? 'w-[140px]' : 'w-[200px]'}`} aria-label={`Risk score: ${score}`} aria-valuenow={score}>
      <svg width={cx * 2} height={cy + strokeWidth} viewBox={`0 0 ${cx * 2} ${cy + strokeWidth}`}>
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        
        {/* Background Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="url(#riskGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />

        {/* Needle */}
        <g transform={`rotate(${rotation} ${cx} ${cy})`} className="transition-all duration-1000 ease-out">
          <circle cx={cx} cy={cy} r={strokeWidth/2} fill="#0F172A" />
          <polygon points={`${cx - 4},${cy} ${cx + 4},${cy} ${cx},${cy - radius + strokeWidth + 4}`} fill="#0F172A" />
        </g>
      </svg>
      
      <div className="absolute bottom-0 flex flex-col items-center translate-y-full pt-4">
        <span className={`font-bold ${size === 'large' ? 'text-5xl' : size === 'compact' ? 'text-2xl' : 'text-3xl'}`} style={{ color: currentColor }}>
          {currentScore}
        </span>
        <span className={`font-medium ${size === 'large' ? 'text-xl' : size === 'compact' ? 'text-sm' : 'text-base'}`} style={{ color: currentColor }}>
          {riskInfo.label}
        </span>
      </div>
    </div>
  );
};

export default RiskMeter;
