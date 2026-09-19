import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Sparkles } from 'lucide-react';

const EVENTS = [
  {
    id: '1',
    title: 'National Hackathon 2026',
    date: 'Mar 15 – 17',
    location: 'IIT Jodhpur · Hybrid',
    attendees: 1200,
    tag: 'Hackathon',
    color: 'bg-violet-500',
  },
  {
    id: '2',
    title: 'Industry Mentorship Meetup',
    date: 'Apr 2',
    location: 'Online',
    attendees: 450,
    tag: 'Meetup',
    color: 'bg-emerald-500',
  },
  {
    id: '3',
    title: 'Resume & Portfolio Workshop',
    date: 'Apr 12',
    location: 'Campus · Seminar Hall',
    attendees: 200,
    tag: 'Workshop',
    color: 'bg-blue-500',
  },
  {
    id: '4',
    title: 'Open Source Sprint',
    date: 'May 1 – 5',
    location: 'Online',
    attendees: 800,
    tag: 'Sprint',
    color: 'bg-orange-500',
  },
];

export const Events = () => {
  const [joined, setJoined] = useState<string[]>([]);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold mb-4">
          <Sparkles className="h-6 w-6" />
          <span className="uppercase tracking-widest text-sm">Growth · Events</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Upcoming Events</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          Hackathons, workshops, and meetups to grow your network and skills.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EVENTS.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl dark:shadow-black/30 transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${event.color}`}>
                {event.tag}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Users className="h-3.5 w-3.5" /> {event.attendees}
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{event.title}</h3>
            <ul className="space-y-2 mb-8 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-500" /> {event.date}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-violet-500" /> {event.location}
              </li>
            </ul>
            <button
              type="button"
              onClick={() =>
                setJoined((current) =>
                  current.includes(event.id) ? current.filter((id) => id !== event.id) : [...current, event.id]
                )
              }
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                joined.includes(event.id)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-indigo-600 group-hover:text-white'
              }`}
            >
              {joined.includes(event.id) ? 'Joined' : 'Join Event'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
