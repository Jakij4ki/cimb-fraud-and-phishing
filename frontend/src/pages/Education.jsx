import React, { useState, useEffect } from 'react';
import BadgeDisplay from '../components/education/BadgeDisplay';
import LearningCard from '../components/education/LearningCard';
import QuizWidget from '../components/education/QuizWidget';
import Button from '../components/ui/Button';
import { Filter, Inbox } from 'lucide-react';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { educationContent as fallbackEdu } from '../data/educationContent';
import { quizQuestions as fallbackQuiz } from '../data/quizQuestions';

const Education = () => {
  const [filter, setFilter] = useState('Semua');
  const [showQuiz, setShowQuiz] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState(['novice']);
  const [eduContent, setEduContent] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle streak logic in localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('safecheck_last_visit');
    const storedStreak = parseInt(localStorage.getItem('safecheck_streak') || '0', 10);
    let newStreak = storedStreak;

    if (lastVisit !== today) {
      if (lastVisit) {
        const lastVisitDate = new Date(lastVisit);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastVisitDate.toDateString() === yesterday.toDateString()) {
          // Visited yesterday, increment streak
          newStreak += 1;
        } else {
          // Missed a day, reset streak to 1
          newStreak = 1;
        }
      } else {
        // First visit
        newStreak = 1;
      }
      
      localStorage.setItem('safecheck_last_visit', today);
      localStorage.setItem('safecheck_streak', newStreak.toString());
      setStreakCount(newStreak);
    } else {
      setStreakCount(storedStreak);
    }

    // Award badges based on streak
    const badges = [...earnedBadges];
    if (newStreak >= 3 && !badges.includes('streak_3')) badges.push('streak_3');
    if (newStreak >= 7 && !badges.includes('streak_7')) badges.push('streak_7');
    setEarnedBadges(badges);

    // Fetch data with fallback
    const fetchData = async () => {
      setLoading(true);
      try {
        // simulate API delay
        await new Promise(r => setTimeout(r, 800));
        setEduContent(fallbackEdu);
        setQuizQuestions(fallbackQuiz);
      } catch (err) {
        setEduContent(fallbackEdu);
        setQuizQuestions(fallbackQuiz);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredContent = filter === 'Semua' 
    ? eduContent 
    : eduContent.filter(c => c.difficulty === filter);

  const handleQuizComplete = (result) => {
    if (result.score === result.total) {
      if (!earnedBadges.includes('expert')) {
        setEarnedBadges([...earnedBadges, 'expert']);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="bg-primary text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Pelajari Cara Melindungi Diri</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Tingkatkan kewaspadaan digital Anda dengan materi singkat yang mudah dipahami.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        
        {/* Streak & Badge Section */}
        <section>
          <BadgeDisplay badges={earnedBadges} streakCount={streakCount} />
          {streakCount > 0 && (
             <p className="text-center mt-4 font-medium text-amber-600 bg-amber-50 py-2 rounded-lg border border-amber-100 max-w-md mx-auto">
               Kamu sudah belajar {streakCount} hari berturut-turut! Pertahankan! 🔥
             </p>
          )}
        </section>

        {/* Materi Edukasi */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-primary">Modul Pembelajaran</h2>
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <Filter size={16} className="text-slate-400 ml-2" />
              {['Semua', 'Mudah', 'Sedang', 'Sulit'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filter === f ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
               <LoadingSkeleton variant="card" count={6} />
            ) : filteredContent.length > 0 ? (
              filteredContent.map(content => (
                <LearningCard key={content.id} content={{
                  id: content.id,
                  title: content.title,
                  description: content.content_body?.summary,
                  difficulty: content.difficulty,
                  read_time: content.read_time,
                  is_read: false,
                  type: content.type
                }} />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <EmptyState 
                  icon={Inbox} 
                  title="Belum Ada Materi" 
                  description="Materi untuk kategori ini belum tersedia saat ini." 
                />
              </div>
            )}
          </div>
        </section>

        {/* Quiz Section */}
        <section className="bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary mb-4">Uji Pengetahuanmu</h2>
              <p className="text-muted max-w-xl mx-auto mb-8">
                Sudah mempelajari materi di atas? Buktikan bahwa Anda bisa mengenali penipuan dengan mengikuti kuis singkat ini.
              </p>
              {!showQuiz && (
                <Button size="lg" onClick={() => setShowQuiz(true)}>
                  Mulai Kuis Sekarang
                </Button>
              )}
            </div>

            {showQuiz && (
              <div id="quiz-container" className="scroll-mt-24">
                <QuizWidget questions={quizQuestions} onComplete={handleQuizComplete} />
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Education;
