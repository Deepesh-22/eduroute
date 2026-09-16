import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Languages,
  Brain,
  Trophy,
  CalendarRange,
  BriefcaseBusiness,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';
import { fetchBuddyProgress, saveSkillGap, sendBuddyMessage } from '../../services/buddyApi';
import type { BuddyLanguage, BuddyMessage, BuddyProgress } from '../../types/buddy';

const DEFAULT_MESSAGE: BuddyMessage = {
  id: 1,
  role: 'ai',
  text: "Hey champ! I'm Buddy 👋\n\nAsk me anything — learning roadmaps, skill-gap analysis, internships, resume tips, hackathons, or weekly motivation.\n\nJust type below and hit send.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const SKILL_CHECK_QUESTIONS = [
  { key: 'html', text: 'Can you build a semantic responsive webpage using HTML/CSS?' },
  { key: 'js', text: 'Are you comfortable with JavaScript fundamentals (DOM, async/await, ES6)?' },
  { key: 'react', text: 'Can you create React apps with state management and API calls?' },
  { key: 'dsa', text: 'Do you solve DSA/coding problems at least 3 times per week?' },
];

const QUICK_PROMPTS = [
  'Create a Web Developer roadmap for beginner to pro',
  'Suggest internships for my current skill level',
  'How to prepare resume and portfolio for product companies?',
  'Recommend hackathons in Bengaluru this month',
];

const CURRENT_USER_ID = 'demo-student-101';

const toTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const BuddyChat = () => {
  const [messages, setMessages] = useState<BuddyMessage[]>([DEFAULT_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<BuddyLanguage>('english');
  const [progress, setProgress] = useState<BuddyProgress | null>(null);
  const [skillAnswers, setSkillAnswers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [showSkills, setShowSkills] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchBuddyProgress(CURRENT_USER_ID);
        setProgress(data.progress);
        setLanguage(data.progress.preferredLanguage || 'english');
        if (data.history?.length) {
          const restoredMessages = data.history.map((entry: { role: string; text: string }, index: number) => ({
            id: index + 2,
            role: (entry.role === 'assistant' ? 'ai' : 'user') as 'ai' | 'user',
            text: entry.text,
            timestamp: toTimestamp(),
          }));
          setMessages([DEFAULT_MESSAGE, ...restoredMessages]);
        }
      } catch (loadError) {
        console.error(loadError);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const missingSkills = useMemo(() => {
    return SKILL_CHECK_QUESTIONS.filter((q) => skillAnswers[q.key] === false).map((q) => q.key.toUpperCase());
  }, [skillAnswers]);

  const handleSend = async (presetMessage?: string) => {
    const messageToSend = (presetMessage ?? input).trim();
    if (!messageToSend || isTyping) return;

    const userText = messageToSend;
    const userMessage: BuddyMessage = {
      id: Date.now(),
      role: 'user',
      text: userText,
      timestamp: toTimestamp(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError('');
    setIsTyping(true);

    try {
      const response = await sendBuddyMessage({
        userId: CURRENT_USER_ID,
        message: userText,
        language,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          text: response.reply,
          timestamp: toTimestamp(),
          usedWebSearch: Boolean(response.usedWebSearch),
          sources: response.sources || [],
        },
      ]);

      setProgress((prev) => ({
        points: response.gamification?.points || prev?.points || 0,
        level: response.gamification?.level || prev?.level || 1,
        achievements: prev?.achievements || ['Welcome to Buddy 🚀'],
        weeklyChallenges: prev?.weeklyChallenges || ['Complete one skill challenge this week'],
        missingSkills: prev?.missingSkills || [],
        preferredLanguage: language,
      }));
    } catch (sendError: any) {
      setError(sendError?.message || 'Buddy is temporarily unavailable. Please try again.');
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const runSkillGapAnalyzer = async () => {
    try {
      const saved = await saveSkillGap({ userId: CURRENT_USER_ID, missingSkills });
      setProgress(saved.progress);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'ai',
          text: `Skill gap analysis done ✅\n\nMissing focus skills: ${
            missingSkills.length ? missingSkills.join(', ') : 'No critical gaps found. Keep leveling up!'
          }`,
          timestamp: toTimestamp(),
        },
      ]);
      setShowSkills(false);
    } catch (analysisError: any) {
      setError(analysisError?.message || 'Could not save skill-gap analysis.');
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
      <header className="shrink-0 bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">Buddy AI Mentor</h1>
            <p className="text-[11px] text-slate-500 font-medium">Ask anything • Roadmaps • Internships • Motivation</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            Lv. {progress?.level || 1}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            {progress?.points || 0} XP
          </div>
          <button
            type="button"
            onClick={() => setShowSkills((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Brain className="h-3.5 w-3.5" />
            Skill Gap
            {showSkills ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as BuddyLanguage)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white cursor-pointer"
            aria-label="Language"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </div>
      </header>

      <AnimatePresence>
        {showSkills && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden border-b border-slate-200 bg-white"
          >
            <div className="px-4 md:px-6 py-4 max-w-3xl mx-auto">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-indigo-600" /> Skill Gap Analyzer
              </h2>
              <div className="space-y-2">
                {SKILL_CHECK_QUESTIONS.map((question) => (
                  <div
                    key={question.key}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm border border-slate-100 rounded-xl px-3 py-2"
                  >
                    <span className="text-slate-700">{question.text}</span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSkillAnswers((prev) => ({ ...prev, [question.key]: true }))}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          skillAnswers[question.key] === true
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setSkillAnswers((prev) => ({ ...prev, [question.key]: false }))}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          skillAnswers[question.key] === false
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={runSkillGapAnalyzer}
                className="mt-3 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
              >
                Analyze My Skill Gap
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4"
        style={{ minHeight: 0 }}
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-white border border-slate-100 text-slate-800 rounded-bl-md'
                }`}
              >
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-2 text-[11px] font-bold text-indigo-600">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Buddy
                    {msg.usedWebSearch && (
                      <span className="ml-1 inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                        <Globe className="h-3 w-3" /> Live search
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sources</p>
                    {msg.sources.slice(0, 3).map((s) => (
                      <a
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-indigo-600 hover:underline cursor-pointer"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">{s.title || s.url}</span>
                      </a>
                    ))}
                  </div>
                )}
                <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  Buddy is thinking...
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-4 md:px-6 py-3 z-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={isTyping}
                onClick={() => handleSend(prompt)}
                className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200 px-3 py-1.5 rounded-full font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {prompt.length > 42 ? prompt.slice(0, 40) + '…' : prompt}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask Buddy anything… (Enter to send, Shift+Enter for new line)"
                rows={1}
                disabled={isTyping}
                className="w-full resize-none pl-4 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-400 text-sm text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed min-h-[48px] max-h-32"
              />
            </div>
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="shrink-0 h-12 w-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-2 text-[10px] text-slate-400 text-center">
            Buddy can use live web search for internships, events & latest info · Not a substitute for official career advice
          </p>
        </div>
      </div>
    </div>
  );
};
