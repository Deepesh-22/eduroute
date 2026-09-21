import { Briefcase, Code2, Lightbulb, Map, UserRound } from 'lucide-react';
import type { BuddyLanguage } from '../../types/buddy';

export const QUICK_PROMPTS = [
  { label: 'Explain a DSA topic', prompt: 'Explain a core DSA topic step by step for a beginner.', icon: Code2 },
  { label: 'Plan my study roadmap', prompt: 'Create a practical study roadmap based on my goals and skill gaps.', icon: Map },
  { label: 'Help with project ideas', prompt: 'Suggest project ideas that will strengthen my portfolio for internships.', icon: Lightbulb },
  { label: 'Interview preparation tips', prompt: 'Share practical interview preparation tips for software roles.', icon: UserRound },
  { label: 'Career guidance', prompt: 'Give me career guidance for landing an SDE or related role.', icon: Briefcase },
] as const;

export const LANGUAGE_OPTIONS: { value: BuddyLanguage; label: string; short: string }[] = [
  { value: 'english', label: 'English', short: 'EN' },
  { value: 'hindi', label: 'Hindi', short: 'HI' },
  { value: 'hinglish', label: 'Hinglish', short: 'HN' },
];
