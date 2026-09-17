import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Star, Users, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Course } from '../types';
import { getCurrentUser, getDisplayFirstName } from '../utils/userProfile';
import { getAuthUser } from '../utils/rbacAuth';

export const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const authUser = getAuthUser();
  const verificationStatus = (authUser?.verificationStatus || '').toLowerCase();
  const needsCollegeVerify =
    !verificationStatus ||
    verificationStatus === 'pending' ||
    verificationStatus === 'none' ||
    verificationStatus === 'rejected';

  const enrolledCourses = COURSES.filter((course) => currentUser.enrolledCourses.includes(course.id));
  const recommendedCourses = COURSES.filter((course) => !currentUser.enrolledCourses.includes(course.id));

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Welcome back, {getDisplayFirstName()}!
          </h1>
          <p className="mt-2 font-medium text-slate-500 dark:text-slate-300">
            You've completed 45% of your current path. Keep it up!
          </p>
        </div>

        {needsCollegeVerify && (
          <div className="flex flex-col gap-3 rounded-[28px] border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center dark:border-amber-800/60 dark:bg-amber-950/40">
            <div className="flex items-start gap-4 flex-1">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-black text-amber-900 dark:text-amber-100">Verify College ID</div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300/90">
                  Upload your college ID to unlock discounts and premium student features
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/verify-college')}
              className="shrink-0 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-amber-200 hover:bg-amber-700 dark:shadow-none"
            >
              Verify ID
            </button>
          </div>
        )}

        {!needsCollegeVerify && (
          <div className="flex items-center gap-3 rounded-[28px] border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-800 dark:bg-emerald-950/40">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">College ID verified</span>
          </div>
        )}
      </header>

      <section className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Continue Learning</h2>
          <Link to="/courses" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enrolledCourses.map((course) => (
            <ContinueLearningCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recommended for You</h2>
          <Link to="/browse" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
            Explore
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <DSABeginnerCard onOpen={() => navigate('/dsa-sheet')} />
          {recommendedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section>
        <div className="rounded-[40px] bg-indigo-600 p-10 text-white shadow-2xl shadow-indigo-200">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="space-y-6">
              <h2 className="text-3xl font-black">Weekly Goal Progress</h2>
              <div className="flex gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest opacity-80">Points earned</div>
                  <div className="text-3xl font-black">340 / 500</div>
                </div>
              </div>
              <div className="h-3 w-full max-w-sm rounded-full bg-white/20">
                <div className="h-full w-[68%] rounded-full bg-white" />
              </div>
            </div>
            <Link
              to="/assessments"
              className="flex items-center gap-3 rounded-3xl bg-white px-10 py-5 font-black text-indigo-600 shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              Set New Goal <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const ContinueLearningCard = ({ course }: { course: Course }) => {
  const content = (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl sm:w-56">
        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <PlayCircle className="h-12 w-12 text-white" />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center py-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
          {course.category} <span className="mx-2 text-slate-300">•</span> 40% Done
        </div>
        <h3 className="mt-6 text-xl font-bold text-slate-900">{course.title}</h3>
        <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
          <div className="h-full w-[40%] rounded-full bg-indigo-500" />
        </div>
      </div>
    </>
  );
  const className =
    'group flex flex-col gap-7 overflow-hidden rounded-4xl border border-slate-100 bg-white p-6 transition-all hover:shadow-xl sm:flex-row';
  return course.link ? (
    <motion.a href={course.link} target="_blank" rel="noreferrer" whileHover={{ y: -4 }} className={className}>
      {content}
    </motion.a>
  ) : (
    <motion.div whileHover={{ y: -4 }} className={className}>
      <Link to={`/course/${course.id}`} className="contents">
        {content}
      </Link>
    </motion.div>
  );
};

const DSABeginnerCard = ({ onOpen }: { onOpen: () => void }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="group overflow-hidden rounded-4xl border border-slate-100 bg-white transition-all hover:shadow-2xl"
  >
    <div className="relative aspect-16/10 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?q=80&w=1170&auto=format&fit=crop"
        alt="DSA Beginner Sheet"
        className="h-full w-full object-cover"
      />
      <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-1.5 text-[10px] font-black text-emerald-700">
        FREE
      </div>
    </div>
    <div className="p-8">
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" /> 4 HOURS
        </span>
        <span>
          <Star className="inline h-4 w-4 fill-yellow-400 text-yellow-400" /> 4.9
        </span>
      </div>
      <h3 className="mt-4 text-xl font-bold text-slate-900">DSA Beginner Sheet</h3>
      <p className="mt-4 text-sm font-medium text-slate-500">
        Start your DSA journey with structured problems and guided practice.
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-white"
      >
        Open Sheet <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </motion.div>
);

const CourseCard = ({ course }: { course: Course }) => {
  const content = (
    <>
      <div className="relative aspect-16/10 overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-1.5 text-[10px] font-black text-slate-900">
          {course.level.toUpperCase()}
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {course.duration}
          </span>
          <span>
            <Star className="inline h-4 w-4 fill-yellow-400 text-yellow-400" /> {course.rating}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">{course.title}</h3>
        <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-6">
          <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Users className="h-4 w-4" /> {course.students.toLocaleString()} students
          </span>
          <span className="text-2xl font-black text-slate-900">₹{course.price}</span>
        </div>
      </div>
    </>
  );
  const className = 'group overflow-hidden rounded-4xl border border-slate-100 bg-white transition-all hover:shadow-2xl';
  return course.link ? (
    <motion.a href={course.link} target="_blank" rel="noreferrer" whileHover={{ y: -8 }} className={className}>
      {content}
    </motion.a>
  ) : (
    <motion.div whileHover={{ y: -8 }} className={className}>
      <Link to={`/course/${course.id}`} className="contents">
        {content}
      </Link>
    </motion.div>
  );
};
