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
  AlertCircle
} from 'lucide-react';
import { useUISound } from '../../contexts/SoundContext';

const ASSESSMENTS = [
  { id: '1', title: 'React Performance optimization', category: 'Frontend', questions: 20, time: '30m', timeSeconds: 30 * 60, level: 'Intermediate', points: 200 },
  { id: '2', title: 'Node.js Security Patterns', category: 'Backend', questions: 5, time: '5m', timeSeconds: 5 * 60, level: 'Advanced', points: 300 },
  { id: '3', title: 'UI/UX Fundamentals', category: 'Design', questions: 25, time: '40m', timeSeconds: 40 * 60, level: 'Beginner', points: 150 },
];

export { ASSESSMENTS };

// NOTE: Full quiz data kept in Assessments.tsx body below via re-fetch - temporary thin mount
export const Assessments = () => {
  return (
    <div className="relative flex-1 overflow-hidden">
      <StarfieldBackground />
      <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-8">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-6 dark:text-white">Skill Assessments</h1>
          <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed dark:text-slate-300">
            Validate your knowledge, earn points, and unlock exclusive rewards.
          </p>
        </header>
        <p className="text-slate-500 dark:text-slate-400">Loading assessments…</p>
      </div>
    </div>
  );
};

export default Assessments;
