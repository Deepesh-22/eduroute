import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StarfieldBackground } from '../../components/StarfieldBackground';
import {
  Trophy,
  Timer,
  HelpCircle,
  ChevronRight,
  BarChart2,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useUISound } from '../../contexts/SoundContext';
import { ASSESSMENTS, QUIZ_QUESTIONS_BY_ASSESSMENT } from './assessmentsData';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const buildQuestionSet = (
  availableQuestions: Array<{ id: string; question: string; options: string[]; correctAnswer: string }>,
  requestedCount: number
) => {
  const safeCount = Math.max(0, Math.min(requestedCount, availableQuestions.length));
  return availableQuestions.slice(0, safeCount);
};

export const Assessments = () => {
  const [view, setView] = useState<'list' | 'quiz' | 'results'>('list');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('1');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerRecords, setAnswerRecords] = useState<
    Array<{ questionId: string; selectedAnswer: string; correctAnswer: string }>
  >([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ASSESSMENTS[0].timeSeconds);
  const { playAchievement } = useUISound();

  const activeAssessment = ASSESSMENTS.find((test) => test.id === selectedAssessmentId) ?? ASSESSMENTS[0];
  const activeQuizQuestions = buildQuestionSet(
    QUIZ_QUESTIONS_BY_ASSESSMENT[selectedAssessmentId] ?? QUIZ_QUESTIONS_BY_ASSESSMENT['1'],
    activeAssessment.questions
  );
  const currentQuestion = activeQuizQuestions[currentQuestionIndex];
  const totalQuestions = activeQuizQuestions.length;

  const resetQuiz = (testId: string) => {
    const nextAssessment = ASSESSMENTS.find((test) => test.id === testId) ?? ASSESSMENTS[0];
    setSelectedAssessmentId(testId);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerRecords([]);
    setCorrectAnswers(0);
    setTimeLeft(nextAssessment.timeSeconds);
    setView('quiz');
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswerRecords((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
      },
    ]);
    setCorrectAnswers((prevCount) => prevCount + (isCorrect ? 1 : 0));
    if (currentQuestionIndex === totalQuestions - 1) {
      setView('results');
      return;
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswer(null);
  };

  useEffect(() => {
    if (view === 'results') playAchievement();
  }, [view, playAchievement]);

  useEffect(() => {
    if (view !== 'quiz') return;
    setTimeLeft(activeAssessment.timeSeconds);
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setView('results');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [view]);

  /** All cards start neutral. Blue background only while hovered (moves with pointer). */
  const stats = [
    {
      id: 'points',
      value: '1,250',
      label: 'Total Points',
      Icon: Trophy,
      idleIcon: 'text-indigo-600 dark:text-indigo-300',
    },
    {
      id: 'accuracy',
      value: '84%',
      label: 'Avg. Accuracy',
      Icon: BarChart2,
      idleIcon: 'text-emerald-500',
    },
    {
      id: 'tests',
      value: '12',
      label: 'Tests Completed',
      Icon: Clock,
      idleIcon: 'text-amber-500',
    },
  ] as const;

  return (
    <div className="relative flex-1 overflow-hidden">
      <StarfieldBackground />
      <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-8">
        {view === 'list' && (
          <>
            <header className="mb-16">
              <h1 className="text-5xl font-black text-slate-900 mb-6 dark:text-white">Skill Assessments</h1>
              <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed dark:text-slate-300">
                Validate your knowledge, earn points, and unlock exclusive rewards.
                Our tests are designed to find your learning gaps.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="group relative overflow-hidden rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-transparent hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-500/25 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-indigo-600 dark:hover:shadow-indigo-900/50"
                >
                  <div className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 rounded-full bg-indigo-400/0 blur-2xl transition-all duration-300 group-hover:bg-white/20" />
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition-all duration-300 group-hover:rotate-6 group-hover:bg-white/20 group-hover:text-white dark:bg-slate-800 ${stat.idleIcon}`}
                  >
                    <stat.Icon className="h-6 w-6" />
                  </div>
                  <div className="text-4xl font-black text-slate-900 transition-colors duration-300 group-hover:text-white dark:text-white">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors duration-300 group-hover:text-indigo-100 dark:text-slate-200">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 mb-8 dark:text-white">Weekly Challenges</h2>
              {ASSESSMENTS.map((test) => (
                <motion.div
                  key={test.id}
                  whileHover={{ scale: 1.01 }}
                  className="group flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-[40px] border border-slate-50 shadow-sm hover:shadow-2xl transition-all dark:bg-slate-900 dark:border-slate-700"
                >
                  <div className="flex items-center gap-8 mb-6 md:mb-0">
                    <div className="h-20 w-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm dark:bg-slate-800 dark:text-indigo-300">
                      <HelpCircle className="h-10 w-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{test.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-[11px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-300">
                        <span className="text-indigo-600 font-black">{test.category}</span>
                        <span className="h-1 w-1 bg-slate-200 rounded-full" />
                        <span>{test.questions} Questions</span>
                        <span className="h-1 w-1 bg-slate-200 rounded-full" />
                        <span>{test.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="hidden lg:flex flex-col items-end mr-6">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest dark:text-slate-400">Difficulty</span>
                      <span className="text-xs font-black text-slate-700 mt-1 dark:text-slate-200">{test.level.toUpperCase()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => resetQuiz(test.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
                    >
                      Take Test <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {view === 'quiz' && currentQuestion && (
          <div className="max-w-4xl mx-auto py-12">
            <div className="mb-12 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="p-4 hover:bg-white rounded-2xl border border-slate-100 transition-all text-slate-400 hover:text-slate-900 shadow-sm"
                >
                  <ChevronRight className="h-6 w-6 rotate-180" />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{activeAssessment.title}</h2>
                  <div className="h-2 w-48 bg-slate-100 rounded-full mt-2">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 text-amber-600 rounded-[20px] font-black text-lg border border-amber-100 shadow-sm">
                <Timer className="h-6 w-6" /> {formatTime(timeLeft)}
              </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-50 p-12 shadow-2xl dark:bg-slate-900 dark:border-slate-700">
              <div className="mb-12">
                <span className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">
                  Question {currentQuestionIndex + 1} / {totalQuestions}
                </span>
                <h3 className="text-3xl font-black text-slate-900 mt-4 leading-tight dark:text-white">
                  {currentQuestion.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = selectedAnswer === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedAnswer(opt)}
                      className={`group w-full text-left p-6 rounded-[28px] border-2 transition-all flex items-center ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-slate-800'
                          : 'border-slate-50 hover:border-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl mr-6 font-black transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-indigo-500'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isSelected
                            ? 'text-indigo-900 dark:text-indigo-200'
                            : 'text-slate-700 group-hover:text-indigo-900 dark:text-slate-200 dark:group-hover:text-indigo-200'
                        }`}
                      >
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-16 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (currentQuestionIndex === totalQuestions - 1) {
                      setView('results');
                      return;
                    }
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    setSelectedAnswer(null);
                  }}
                  className="px-8 py-4 text-slate-400 font-black uppercase tracking-widest text-sm hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-white"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {currentQuestionIndex === totalQuestions - 1 ? 'Submit Assessment' : 'Confirm & Next'}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'results' && (
          <div className="max-w-3xl mx-auto py-12 text-center">
            <div className="inline-flex items-center justify-center h-32 w-32 bg-green-50 rounded-[40px] text-green-600 mb-10 shadow-sm border border-green-100">
              <CheckCircle2 className="h-16 w-16" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6">Great Progress!</h2>
            <p className="text-slate-500 text-xl mb-16 font-medium leading-relaxed dark:text-slate-300">
              You've completed the assessment with an impressive score. Points have been added to your profile.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
                <div className="text-5xl font-black text-indigo-600">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4 dark:text-slate-400">
                  Correct Answers
                </div>
              </div>
              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
                <div className="text-5xl font-black text-amber-500">
                  +{Math.round((activeAssessment.points * correctAnswers) / totalQuestions)}
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4 dark:text-slate-400">
                  Points Gained
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-10 rounded-[40px] flex items-start gap-8 text-left mb-16 dark:bg-slate-800 dark:border-slate-700">
              <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-white">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-xl font-black text-indigo-900 mb-2 dark:text-indigo-200">Identify Your Gap</h4>
                <p className="text-indigo-700 font-medium leading-relaxed dark:text-indigo-300">
                  {correctAnswers >= Math.ceil(totalQuestions / 2)
                    ? `Nice work — you answered ${correctAnswers} out of ${totalQuestions} questions correctly. Keep going to strengthen your understanding.`
                    : 'You struggled with some key concepts. We have highlighted the most relevant topics in the roadmap so you can revisit them.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button
                type="button"
                onClick={() => setView('list')}
                className="flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200"
              >
                Back to Skill Center
              </button>
              <button
                type="button"
                className="flex-1 py-5 bg-white border border-slate-200 text-slate-900 rounded-[24px] font-black text-lg hover:bg-slate-50 transition-all"
              >
                Download Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;
