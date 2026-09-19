import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Lock,
  Play,
  BookOpen,
  Target,
} from 'lucide-react';

/** Theme-aware roadmap detail — restored after placeholder; light + dark */
const DEMO: Record<
  string,
  {
    title: string;
    progress: number;
    modules: number;
    hours: number;
    levels: {
      name: string;
      status: 'locked' | 'active' | 'done';
      modules: {
        title: string;
        lessons: { id: string; title: string; duration: string }[];
      }[];
    }[];
  }
> = {
  frontend: {
    title: 'Frontend Developer',
    progress: 34,
    modules: 12,
    hours: 48,
    levels: [
      {
        name: 'Beginner',
        status: 'done',
        modules: [
          {
            title: 'HTML & CSS Foundations',
            lessons: [
              { id: '1', title: 'Semantic HTML', duration: '25m' },
              { id: '2', title: 'Flexbox & Grid', duration: '40m' },
            ],
          },
        ],
      },
      {
        name: 'Intermediate',
        status: 'active',
        modules: [
          {
            title: 'React Essentials',
            lessons: [
              { id: '3', title: 'Components & Props', duration: '35m' },
              { id: '4', title: 'Hooks & State', duration: '45m' },
              { id: '5', title: 'Routing', duration: '30m' },
            ],
          },
        ],
      },
      {
        name: 'Advanced',
        status: 'locked',
        modules: [
          {
            title: 'Performance & Architecture',
            lessons: [
              { id: '6', title: 'Code splitting', duration: '40m' },
              { id: '7', title: 'Testing', duration: '50m' },
            ],
          },
        ],
      },
    ],
  },
};

export const RoadmapDetail = () => {
  const { id = 'frontend' } = useParams();
  const data = DEMO[id] ?? DEMO.frontend;
  const [openModule, setOpenModule] = useState<string | null>(data.levels[1]?.modules[0]?.title ?? null);
  const [completed, setCompleted] = useState<Set<string>>(new Set(['1', '2']));

  useEffect(() => {
    setOpenModule(data.levels.find((l) => l.status === 'active')?.modules[0]?.title ?? null);
  }, [id, data]);

  const totalLessons = useMemo(
    () => data.levels.reduce((n, l) => n + l.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0),
    [data]
  );

  return (
    <div className="flex-1 max-w-5xl mx-auto">
      <div className="border-b border-slate-200 bg-slate-100 py-12 px-4 md:px-8 dark:border-white/10 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4">
            <Target className="h-4 w-4" /> Career Path
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">{data.title} Roadmap</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl">
            Structured modules from beginner to advanced. Track progress and complete lessons at your pace.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg">
            <div className="text-center p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="text-2xl font-black text-slate-900 dark:text-white">{data.progress}%</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Progress</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="text-2xl font-black text-slate-900 dark:text-white">{data.modules}</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Modules</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm col-span-2 sm:col-span-1">
              <div className="text-2xl font-black text-slate-900 dark:text-white">{data.hours}h</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Est. time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-10">
        {data.levels.map((level) => (
          <div key={level.name}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{level.name} Path</h2>
              {level.status === 'locked' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 uppercase">
                  <Lock className="h-3.5 w-3.5" /> Locked
                </span>
              )}
              {level.status === 'done' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                </span>
              )}
            </div>

            <div className="space-y-4">
              {level.modules.map((mod) => {
                const isOpen = openModule === mod.title;
                return (
                  <div
                    key={mod.title}
                    className={`rounded-3xl border p-5 transition-colors ${
                      level.status === 'locked'
                        ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 opacity-70'
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    <button
                      type="button"
                      disabled={level.status === 'locked'}
                      onClick={() => setOpenModule(isOpen ? null : mod.title)}
                      className="w-full flex items-center justify-between gap-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{mod.title}</h3>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      )}
                    </button>

                    {isOpen && level.status !== 'locked' && (
                      <ul className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                        {mod.lessons.map((lesson) => {
                          const done = completed.has(lesson.id);
                          return (
                            <li key={lesson.id}>
                              <button
                                type="button"
                                onClick={() =>
                                  setCompleted((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(lesson.id)) next.delete(lesson.id);
                                    else next.add(lesson.id);
                                    return next;
                                  })
                                }
                                className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${
                                  done
                                    ? 'bg-green-50 dark:bg-green-950/40 hover:bg-green-100 dark:hover:bg-green-900/40'
                                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {done ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                                  )}
                                  <span className="text-sm font-bold text-slate-900 dark:text-white">{lesson.title}</span>
                                </div>
                                <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                  <Clock className="h-3.5 w-3.5" /> {lesson.duration}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p className="text-center text-xs text-slate-400">
          {completed.size} / {totalLessons} lessons marked complete
        </p>
      </div>
    </div>
  );
};

export default RoadmapDetail;
