import { useMemo, useState } from 'react';
import {
  Users,
  Image as ImageIcon,
  Link2,
  BarChart3,
  Send,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Flame,
  Crown,
  ExternalLink,
  Hash,
} from 'lucide-react';
import {
  CATEGORY_TABS,
  COMMUNITY_POSTS,
  DISCORD_INVITE_URL,
  FEATURED,
  TOP_COMMUNITIES,
  TOP_CONTRIBUTORS,
  TRENDING_TOPICS,
  type CommunityCategory,
  type CommunityPost,
} from './communityData';

function Avatar({ name, color, size = 'md' }: { name: string; color: string; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'h-11 w-11 text-base' : size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm';
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${color} ${dim}`}
      aria-hidden
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

function PostCard({ post }: { post: CommunityPost }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [upvotes, setUpvotes] = useState(post.upvotes);

  return (
    <article className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-start gap-3">
        <Avatar name={post.author} color={post.avatarColor} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[var(--text-primary)]">{post.author}</span>
            {post.isMentor && (
              <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                Mentor
              </span>
            )}
            {post.role && <span className="text-xs text-[var(--text-muted)]">{post.role}</span>}
          </div>
          {post.college && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{post.college}</p>}
        </div>
        <button type="button" className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--accent-soft)]" aria-label="More">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <h3 className="mt-3 text-base font-bold leading-snug text-[var(--text-primary)] sm:text-lg">{post.title}</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--text-secondary)]">
        {post.body.length > 420 ? `${post.body.slice(0, 420)}…` : post.body}
      </p>

      {post.imageLabel && (
        <div className="mt-3 flex items-center gap-3 overflow-hidden rounded-xl border border-[var(--border-default)] bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-4 dark:from-indigo-500/20 dark:via-violet-500/15 dark:to-fuchsia-500/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--bg-card)] text-2xl shadow-sm">{post.imageEmoji || '📘'}</div>
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">{post.imageLabel}</p>
            <p className="text-xs text-[var(--text-muted)]">Guide · Community pick</p>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span key={t} className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1 border-t border-[var(--border-default)] pt-3 text-[var(--text-muted)]">
        <button
          type="button"
          onClick={() => {
            setLiked((v) => !v);
            setUpvotes((n) => (liked ? n - 1 : n + 1));
          }}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition hover:bg-[var(--accent-soft)] ${liked ? 'text-[var(--accent)]' : ''}`}
        >
          <ThumbsUp className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />
          {upvotes}
        </button>
        <button type="button" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium hover:bg-[var(--accent-soft)]">
          <MessageCircle className="h-3.5 w-3.5" />
          {post.comments}
        </button>
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium hover:bg-[var(--accent-soft)] ${saved ? 'text-[var(--accent)]' : ''}`}
          aria-label="Save"
        >
          <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </article>
  );
}

export function Community() {
  const [tab, setTab] = useState<CommunityCategory>('all');
  const [composer, setComposer] = useState('');
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);

  const filtered = useMemo(() => {
    if (tab === 'all') return localPosts;
    return localPosts.filter((p) => p.category === tab);
  }, [tab, localPosts]);

  const handlePost = () => {
    const text = composer.trim();
    if (!text) return;
    const title = text.length > 80 ? `${text.slice(0, 77)}…` : text;
    const next: CommunityPost = {
      id: `local-${Date.now()}`,
      author: 'You',
      college: 'Just now',
      avatarColor: 'bg-[var(--accent)]',
      title,
      body: text,
      tags: ['discussion'],
      upvotes: 0,
      comments: 0,
      timeAgo: 'Just now',
      category: 'discussions',
    };
    setLocalPosts((prev) => [next, ...prev]);
    setComposer('');
  };

  return (
    <div className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-5 lg:px-6 lg:py-6">
        <section className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-gradient-to-r from-sky-100 via-indigo-50 to-violet-100 dark:from-slate-900 dark:via-indigo-950/80 dark:to-violet-950/60">
          <div className="relative z-10 grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Community</h1>
              <p className="mt-1 text-base font-semibold text-indigo-700 dark:text-indigo-300 sm:text-lg">
                Real People. Real Questions. Better Career Decisions.
              </p>
              <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
                Connect with fellow students, get advice from mentors, share your journey and grow together.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
              >
                <Users className="h-4 w-4" />
                Join Community
              </button>
            </div>
            <div className="relative hidden min-h-[140px] lg:block">
              <div className="absolute inset-0 rounded-2xl bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80')] bg-cover bg-center opacity-90 dark:opacity-70" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-l from-transparent via-transparent to-sky-100/80 dark:to-slate-900/80" />
              <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 shadow dark:bg-slate-900/90 dark:text-indigo-300">
                Better Together →
              </span>
            </div>
          </div>
        </section>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {CATEGORY_TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  active
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--accent-soft)]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_280px] xl:grid-cols-[260px_minmax(0,1fr)_300px]">
          <aside className="order-2 space-y-4 lg:order-1">
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Top Communities</h2>
                <button type="button" className="text-xs font-semibold text-[var(--accent)] hover:underline">View All →</button>
              </div>
              <ul className="space-y-1">
                {TOP_COMMUNITIES.map((c) => (
                  <li key={c.id}>
                    <button type="button" className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-[var(--accent-soft)]">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-[10px] font-bold text-white`}>{c.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-[var(--text-primary)]">{c.name}</span>
                        <span className="text-[11px] text-[var(--text-muted)]">{c.members}</span>
                      </span>
                      <span className="text-[var(--text-muted)]">›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Trending Topics</h2>
                <button type="button" className="text-xs font-semibold text-[var(--accent)] hover:underline">View All →</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-primary)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <Hash className="h-3 w-3" />
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950 p-5 text-white shadow-lg">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/30 text-xl">💬</span>
                <div>
                  <p className="text-sm font-bold">Join EduRoute Discord Server</p>
                  <p className="text-[11px] text-indigo-200">Real-time discussions, mentorship & more!</p>
                </div>
              </div>
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Join Now
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-2xl">👩‍💻</div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">Grow Together</p>
                  <p className="text-xs text-[var(--text-muted)]">Learn. Share. Build.</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="order-1 space-y-4 lg:order-2">
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-sm">
              <div className="flex gap-3">
                <Avatar name="You" color="bg-indigo-600" size="sm" />
                <textarea
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  rows={2}
                  placeholder="Share your thoughts, ask a question, or start a discussion…"
                  className="min-h-[48px] flex-1 resize-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--accent-soft)]">
                  <ImageIcon className="h-3.5 w-3.5" /> Add Image
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--accent-soft)]">
                  <Link2 className="h-3.5 w-3.5" /> Add Link
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--accent-soft)]">
                  <BarChart3 className="h-3.5 w-3.5" /> Poll
                </button>
                <button
                  type="button"
                  onClick={handlePost}
                  disabled={!composer.trim()}
                  className="ml-auto inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-40 hover:bg-indigo-500"
                >
                  <Send className="h-3.5 w-3.5" />
                  Post
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--bg-card)] p-10 text-center text-sm text-[var(--text-muted)]">
                No posts in this category yet. Be the first to start a discussion.
              </div>
            ) : (
              filtered.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>

          <aside className="order-3 space-y-4">
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--text-primary)]">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Featured Discussion
                </h2>
                <button type="button" className="text-xs font-semibold text-[var(--accent)] hover:underline">View All →</button>
              </div>
              <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] p-3">
                <div className="flex items-center gap-2">
                  <Avatar name={FEATURED.author} color={FEATURED.color} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{FEATURED.author}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{FEATURED.meta}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm font-bold leading-snug text-[var(--text-primary)]">{FEATURED.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{FEATURED.body}</p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" /> {FEATURED.upvotes} upvotes
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> {FEATURED.comments} comments
                  </span>
                  <span className="ml-auto rounded-full bg-[var(--accent-soft)] px-2 py-0.5 font-medium text-[var(--accent)]">{FEATURED.tag}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--text-primary)]">
                  <Crown className="h-4 w-4 text-amber-500" />
                  Top Contributors
                </h2>
                <button type="button" className="text-xs font-semibold text-[var(--accent)] hover:underline">View All →</button>
              </div>
              <ul className="space-y-2">
                {TOP_CONTRIBUTORS.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 rounded-xl px-1 py-1.5">
                    <Avatar name={c.name} color={c.color} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{c.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{c.role}</p>
                    </div>
                    {c.rank <= 3 && (
                      <span className="text-base" title={`Rank ${c.rank}`}>
                        {c.rank === 1 ? '🥇' : c.rank === 2 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-gradient-to-br from-emerald-50 to-sky-50 p-5 dark:from-emerald-950/40 dark:to-sky-950/40">
              <p className="text-sm font-medium italic leading-relaxed text-[var(--text-secondary)]">
                “The best way to predict your future is to create it.”
              </p>
              <p className="mt-3 text-right text-xs font-semibold text-[var(--accent)]">— EduRoute</p>
              <div className="mt-2 text-2xl opacity-60">🌱</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Community;
