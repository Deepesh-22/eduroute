import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock3, Flame, LayoutGrid, Play, ShieldCheck, Sparkles, Star, Target, Trophy, Zap } from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Course } from '../types';
import { getCurrentUser, getDisplayFirstName } from '../utils/userProfile';

type Concept = 'focus' | 'discover';

export const Dashboard = () => {
  const [concept, setConcept] = useState<Concept>('focus');
  const currentUser = getCurrentUser();
  const enrolledCourses = COURSES.filter((course) => currentUser.enrolledCourses.includes(course.id));
  const recommendedCourses = COURSES.filter((course) => !currentUser.enrolledCourses.includes(course.id));

  return (
    <div className="min-h-full flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-500">Dashboard concepts</p>
            <h1 className="mt-1 text-xl font-black text-[var(--text-primary)]">Choose a direction for EduRoute</h1>
          </div>
          <div className="flex rounded-2xl bg-[var(--bg-secondary)] p-1">
            <button type="button" onClick={() => setConcept('focus')} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${concept === 'focus' ? 'bg-[var(--surface-nav)] text-indigo-600 shadow-sm' : 'text-[var(--text-secondary)]'}`}><Target className="h-4 w-4" /> Focus cockpit</button>
            <button type="button" onClick={() => setConcept('discover')} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${concept === 'discover' ? 'bg-[var(--surface-nav)] text-indigo-600 shadow-sm' : 'text-[var(--text-secondary)]'}`}><LayoutGrid className="h-4 w-4" /> Discovery hub</button>
          </div>
        </div>
        {concept === 'focus' ? <FocusConcept enrolledCourses={enrolledCourses} recommendedCourses={recommendedCourses} /> : <DiscoverConcept enrolledCourses={enrolledCourses} recommendedCourses={recommendedCourses} />}
      </div>
    </div>
  );
};

const FocusConcept = ({ enrolledCourses, recommendedCourses }: { enrolledCourses: Course[]; recommendedCourses: Course[] }) => {
  const navigate = useNavigate();
  return <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div><div className="mb-3 flex items-center gap-2 text-sm font-bold text-indigo-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Your learning plan is on track</div><h2 className="text-4xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl">Welcome back,<br /><span className="text-gradient">{getDisplayFirstName()}.</span></h2><p className="mt-4 max-w-xl text-base font-medium text-[var(--text-secondary)]">Keep your momentum going. You&apos;re 45% through your current path and only 3 lessons away from your next milestone.</p></div>
      <Link to="/verify-college" className="flex items-center gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-sm dark:bg-amber-950/30 dark:text-amber-100"><div className="rounded-2xl bg-amber-100 p-3 text-amber-600"><ShieldCheck className="h-6 w-6" /></div><div><p className="text-sm font-black">Verify College ID</p><p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Unlock 50% certification discount</p></div><ArrowRight className="ml-3 h-5 w-5" /></Link>
    </header>
    <div className="grid gap-5 md:grid-cols-3"><Stat icon={Flame} label="Day streak" value="12 days" tone="orange" /><Stat icon={BookOpen} label="Learning time" value="8h 24m" tone="blue" /><Stat icon={Trophy} label="Weekly points" value="340 / 500" tone="purple" /></div>
    <section><SectionHeading title="Pick up where you left off" link="View all" href="/courses" /><div className="grid gap-5 lg:grid-cols-2">{enrolledCourses.map((course) => <FocusCourse key={course.id} course={course} />)}</div></section>
    <section><SectionHeading title="Recommended next steps" link="Explore courses" href="/browse" /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{recommendedCourses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} />)}</div></section>
    <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-indigo-600 p-7 text-white shadow-xl shadow-indigo-200 md:flex-row md:items-center"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">Next milestone</p><h3 className="mt-2 text-2xl font-black">Complete your React pathway</h3><p className="mt-1 text-sm text-indigo-100">2 of 5 modules completed</p></div><button type="button" onClick={() => navigate('/roadmaps')} className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-indigo-600">Open roadmap <ArrowRight className="h-4 w-4" /></button></div>
  </motion.div>;
};

const DiscoverConcept = ({ enrolledCourses, recommendedCourses }: { enrolledCourses: Course[]; recommendedCourses: Course[] }) => <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
  <header className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl md:p-10"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-indigo-200"><Sparkles className="h-3.5 w-3.5" /> Personalised for you</div><h2 className="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">Build the career<br /><span className="text-indigo-400">you want.</span></h2><p className="mt-4 max-w-lg text-sm font-medium leading-6 text-slate-300">Discover curated paths, practice real skills, and get closer to your next opportunity every day.</p></div><div className="grid grid-cols-2 gap-3"><MiniMetric value="45%" label="Path complete" /><MiniMetric value="12" label="Day streak" /></div></div></header>
  <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]"><section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6"><SectionHeading title="Continue learning" link="See all" href="/courses" /> <div className="mt-5 flex flex-col gap-4">{enrolledCourses.map((course) => <DiscoverCourse key={course.id} course={course} />)}</div></section><aside className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6"><div className="flex items-center justify-between"><h3 className="text-lg font-black text-[var(--text-primary)]">Your activity</h3><Zap className="h-5 w-5 text-amber-500" /></div><div className="mt-6 flex items-end gap-1.5">{[30, 48, 36, 72, 56, 84, 66].map((height, index) => <div key={index} className="flex-1 rounded-t-lg bg-indigo-100 dark:bg-indigo-950" style={{ height: `${height}px` }}><div className="h-1/2 rounded-t-lg bg-indigo-500" /></div>)}</div><div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]"><span>Mon</span><span>Today</span><span>Sun</span></div><p className="mt-6 text-sm font-semibold text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">8h 24m</strong> learning time this week</p></aside></div>
  <section><SectionHeading title="Explore your next skill" link="Browse all" href="/browse" /><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{recommendedCourses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} />)}</div></section>
</motion.div>;

const SectionHeading = ({ title, link, href }: { title: string; link: string; href: string }) => <div className="flex items-center justify-between"><h3 className="text-2xl font-black text-[var(--text-primary)]">{title}</h3><Link to={href} className="text-sm font-black text-indigo-600">{link} <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div>;
const Stat = ({ icon: Icon, label, value, tone }: { icon: typeof Flame; label: string; value: string; tone: 'orange' | 'blue' | 'purple' }) => <div className="flex items-center gap-4 rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5"><div className={`rounded-2xl p-3 ${tone === 'orange' ? 'bg-orange-100 text-orange-600' : tone === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}><Icon className="h-5 w-5" /></div><div><p className="text-xs font-bold text-[var(--text-secondary)]">{label}</p><p className="text-lg font-black text-[var(--text-primary)]">{value}</p></div></div>;
const MiniMetric = ({ value, label }: { value: string; label: string }) => <div className="rounded-2xl bg-white/10 px-5 py-4"><p className="text-2xl font-black">{value}</p><p className="mt-1 text-xs font-bold text-slate-400">{label}</p></div>;
const FocusCourse = ({ course }: { course: Course }) => <Link to={`/course/${course.id}`} className="group flex flex-col gap-5 rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] p-4 transition hover:-translate-y-1 hover:shadow-xl sm:flex-row"><img src={course.thumbnail} alt={course.title} className="h-44 w-full rounded-2xl object-cover sm:h-32 sm:w-48" /><div className="flex flex-1 flex-col justify-center"><div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-indigo-600"><span>{course.category}</span><span>40%</span></div><h4 className="mt-3 text-xl font-black text-[var(--text-primary)]">{course.title}</h4><div className="mt-5 h-2 rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full w-[40%] rounded-full bg-indigo-500" /></div><p className="mt-2 text-xs font-semibold text-[var(--text-secondary)]">Continue lesson <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></p></div></Link>;
const DiscoverCourse = ({ course }: { course: Course }) => <Link to={`/course/${course.id}`} className="flex items-center gap-4 rounded-2xl border border-[var(--border-default)] p-3 transition hover:bg-indigo-50 dark:hover:bg-indigo-950/30"><img src={course.thumbnail} alt={course.title} className="h-20 w-28 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-wider text-indigo-600">{course.category}</p><h4 className="truncate text-base font-black text-[var(--text-primary)]">{course.title}</h4><div className="mt-2 flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> 40% complete</div></div><Play className="h-5 w-5 text-indigo-500" /></Link>;
const CourseCard = ({ course }: { course: Course }) => <Link to={`/course/${course.id}`} className="group overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface-card)] transition hover:-translate-y-1 hover:shadow-xl"><div className="relative"><img src={course.thumbnail} alt={course.title} className="aspect-[16/9] w-full object-cover" /><span className="absolute left-4 top-4 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase text-slate-900">{course.level}</span></div><div className="p-5"><div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]"><span><Clock3 className="mr-1 inline h-3.5 w-3.5" /> {course.duration}</span><span><Star className="mr-1 inline h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {course.rating}</span></div><h4 className="mt-3 text-lg font-black text-[var(--text-primary)]">{course.title}</h4><p className="mt-4 flex items-center gap-1 text-sm font-bold text-indigo-600">Explore course <ArrowRight className="h-4 w-4" /></p></div></Link>;

export default Dashboard;

