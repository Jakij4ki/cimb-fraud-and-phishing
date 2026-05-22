import React, { useEffect, useState } from 'react';
import { Search, Shield, Cpu, CheckCircle } from 'lucide-react';

const ScanAnimation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1500);
    const timer2 = setTimeout(() => setStep(2), 3000);
    const timer3 = setTimeout(() => setStep(3), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const steps = [
    { icon: Search, text: "Mengidentifikasi link dan nomor telepon..." },
    { icon: Shield, text: "Memeriksa daftar resmi bank..." },
    { icon: Cpu, text: "Menganalisis pola bahasa pesan..." }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-xl mx-auto w-full">
      <div className="relative w-24 h-24 mb-8">
        {/* Pulsing circles */}
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
        <div className="absolute inset-2 bg-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute inset-4 bg-secondary rounded-full flex items-center justify-center shadow-lg z-10">
          {step < 3 ? (
            <Search className="text-white animate-bounce" size={32} />
          ) : (
            <CheckCircle className="text-white" size={32} />
          )}
        </div>
      </div>

      <div className="w-full space-y-6">
        {steps.map((s, index) => {
          const isActive = step === index;
          const isDone = step > index;
          const Icon = s.icon;

          return (
            <div 
              key={index} 
              className={`flex items-center gap-4 transition-all duration-500 ${
                isActive ? 'opacity-100 translate-x-0' : 
                isDone ? 'opacity-50 translate-x-0' : 
                'opacity-0 translate-x-4'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 
                ${isDone ? 'bg-success border-success text-white' : 
                  isActive ? 'border-secondary text-secondary bg-blue-50' : 
                  'border-slate-200 text-slate-300'}`}
              >
                {isDone ? <CheckCircle size={20} /> : <Icon size={20} />}
              </div>
              <p className={`font-medium ${isActive ? 'text-primary' : 'text-slate-500'}`}>
                {s.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full mt-10 overflow-hidden">
        <div 
          className="h-full bg-secondary transition-all duration-[1500ms] ease-linear"
          style={{ width: `${Math.min((step / 2.5) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ScanAnimation;
