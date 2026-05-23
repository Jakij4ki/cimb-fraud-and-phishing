import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import Button from '../ui/Button';

const QuizWidget = ({ questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  if (!questions || questions.length === 0) return null;

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === questions[currentIdx].correctIndex;
    setIsCorrect(correct);
    
    const newAnswers = { ...userAnswers, [questions[currentIdx].id || currentIdx]: index };
    setUserAnswers(newAnswers);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
        if (onComplete) onComplete({ 
            score: score + (correct ? 1 : 0), 
            total: questions.length,
            answers: newAnswers
        });
      }
    }, 1500);
  };

  const currentQ = questions[currentIdx];
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-border p-6 max-w-2xl mx-auto overflow-hidden">
      {!showResult ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-secondary">Kuis Edukasi</span>
            <span className="text-sm font-medium text-muted">
              Pertanyaan {currentIdx + 1} dari {questions.length}
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full mb-8">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
            />
          </div>

          <h3 className="text-xl font-semibold text-primary mb-6 min-h-[60px]">
            {currentQ.text}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
              
              if (selectedAnswer === null) {
                btnClass += "border-slate-200 hover:border-secondary hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-secondary";
              } else if (idx === currentQ.correctIndex) {
                btnClass += "border-success bg-emerald-50";
              } else if (selectedAnswer === idx) {
                btnClass += "border-danger bg-red-50";
              } else {
                btnClass += "border-slate-200 opacity-50";
              }

              return (
                <button
                  key={idx}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">{opt}</span>
                    {selectedAnswer !== null && idx === currentQ.correctIndex && <CheckCircle className="text-success" size={20} />}
                    {selectedAnswer === idx && idx !== currentQ.correctIndex && <XCircle className="text-danger" size={20} />}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6">
            <Award className={percentage >= 80 ? "text-amber-500" : "text-secondary"} size={40} />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">Kuis Selesai!</h3>
          <p className="text-muted mb-6">Skor Anda:</p>
          <div className={`text-5xl font-black mb-8 ${percentage >= 80 ? 'text-success' : percentage >= 50 ? 'text-amber-500' : 'text-danger'}`}>
            {percentage}%
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => {
              setCurrentIdx(0);
              setScore(0);
              setShowResult(false);
              setSelectedAnswer(null);
              setUserAnswers({});
            }}>
              Coba Lagi
            </Button>
            <Button onClick={() => window.location.reload()}>
              Lanjut Belajar
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuizWidget;
