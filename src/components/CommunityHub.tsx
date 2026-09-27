import React, { useState, useEffect } from 'react';
import { BookSummary, CommentItem, CommunityOverviewStats } from '../types';
import {
  fetchCommunityStats,
  fetchRecentComments,
  toggleCommentLike,
  getUserName,
  setUserName,
  postBookComment,
  getLocalCommunityStats,
} from '../utils/communityApi';
import { CURATED_BOOKS } from '../data/dailyBooks';
import {
  Users,
  Eye,
  Heart,
  MessageSquare,
  Sparkles,
  Trophy,
  Star,
  BookOpen,
  ArrowRight,
  Flame,
  ThumbsUp,
  Share2,
  CheckCircle2,
  Send,
  Compass,
} from 'lucide-react';

interface Props {
  onOpenBook: (book: BookSummary) => void;
}

export const CommunityHub: React.FC<Props> = ({ onOpenBook }) => {
  const [stats, setStats] = useState<CommunityOverviewStats>(() => getLocalCommunityStats());
  const [recentComments, setRecentComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Quick Reflection Form
  const [authorName, setAuthorName] = useState(getUserName());
  const [selectedBookId, setSelectedBookId] = useState(CURATED_BOOKS[0]?.id || 'atomic-habits');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchCommunityStats(), fetchRecentComments()]).then(([s, c]) => {
      if (isMounted) {
        setStats(s);
        setRecentComments(c);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCommentLike = async (commentId: string) => {
    setRecentComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const nextLiked = !c.userLiked;
          return {
            ...c,
            userLiked: nextLiked,
            likesCount: nextLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
          };
        }
        return c;
      })
    );

    const res = await toggleCommentLike(commentId);
    setRecentComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likesCount: res.likesCount, userLiked: res.userLiked } : c))
    );
  };

  const handleSubmitPledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    const trimmedAuthor = authorName.trim() || 'Reader';
    setUserName(trimmedAuthor);
    setIsSubmitting(true);

    const targetBook = CURATED_BOOKS.find((b) => b.id === selectedBookId) || CURATED_BOOKS[0];

    const res = await postBookComment(targetBook.id, targetBook.title, {
      author: trimmedAuthor,
      content: commentText.trim(),
      rating,
      tag: 'Key Takeaway',
    });

    setIsSubmitting(false);

    if (res.success && res.comment) {
      setRecentComments((prev) => [res.comment, ...prev]);
      setCommentText('');
      setPostSuccess(true);
      setStats((prev) => ({
        ...prev,
        totalComments: prev.totalComments + 1,
      }));
      setTimeout(() => setPostSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Shahid's BookPulse Reader Community</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-black text-white tracking-tight">
            Read Together, <span className="text-amber-400">Grow Together</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Join thousands of daily readers sharing practical life lessons, book ratings, and actionable habits to conquer their 100-book milestone.
          </p>
        </div>
      </div>

      {/* 2. Key Live Metrics Cards (Including Visitor Count!) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Total Visits */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Page Visits</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {stats.totalVisits.toLocaleString()}
            </span>
            <span className="flex items-center text-[11px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
              Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total page impressions</p>
        </div>

        {/* Metric 2: Today's Active Readers */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Today</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
              {stats.todayVisits.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400">sessions</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Readers on the app today</p>
        </div>

        {/* Metric 3: Total Reader Likes */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reader Likes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <Heart className="w-4 h-4 fill-rose-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
              {stats.totalLikes.toLocaleString()}
            </span>
            <span className="text-[11px] text-rose-300/80">❤️</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Summary reactions given</p>
        </div>

        {/* Metric 4: Community Reflections */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reflections</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-400 tracking-tight">
              {stats.totalComments.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400">shared</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Comments and takeaways</p>
        </div>
      </div>

      {/* 3. Main Content Split: Recent Reflections & Community Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Community Reflections Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Recent Reader Reflections</h2>
            </div>
            <span className="text-xs text-slate-400">Real thoughts from fellow learners</span>
          </div>

          {recentComments.length === 0 ? (
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mx-auto text-xl">
                💬
              </div>
              <h3 className="text-base font-bold text-white">No reader reflections shared yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                As readers complete their daily book summaries, their genuine takeaways and reviews will appear here. Be the first to read today's summary and share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComments.map((cmt) => {
                const matchedBook = CURATED_BOOKS.find((b) => b.id === cmt.bookId);
                const initials = cmt.author
                  ? cmt.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()
                  : 'R';

                return (
                  <div
                    key={cmt.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm ${
                            cmt.avatarColor || 'bg-amber-600'
                          }`}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-white">{cmt.author}</span>
                            {cmt.tag && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                {cmt.tag}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <div className="flex text-amber-400">
                              {Array.from({ length: cmt.rating || 5 }).map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{formatTimeAgo(cmt.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Upvote Button */}
                      <button
                        onClick={() => handleCommentLike(cmt.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                          cmt.userLiked
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                            : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${cmt.userLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                        <span>{cmt.likesCount}</span>
                      </button>
                    </div>

                    {/* Comment Body */}
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-1 whitespace-pre-line">
                      "{cmt.content}"
                    </p>

                    {/* Book Citation & Direct Link */}
                    {matchedBook && (
                      <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-medium text-slate-300">{matchedBook.title}</span>
                          <span className="hidden sm:inline">by {matchedBook.author}</span>
                        </div>
                        <button
                          onClick={() => onOpenBook(matchedBook)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <span>Read Summary</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Share a Reflection & Top Liked Summaries */}
        <div className="lg:col-span-5 space-y-6">
          {/* Form Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Share Your Reading Takeaway</h3>
            </div>
            <p className="text-xs text-slate-400">
              Finished a book or put an idea to practice today? Inspire the Shahid's BookPulse community!
            </p>

            {postSuccess && (
              <div className="py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Your reflection was shared to the community! 🚀</span>
              </div>
            )}

            <form onSubmit={handleSubmitPledge} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Alex M."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Select Book Summary
                </label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-amber-500 transition-colors"
                >
                  {CURATED_BOOKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} — {b.author}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Your Reflection or Practical Takeaway
                </label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="How did you use this lesson? What changed in your daily habit or mindset?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs outline-none focus:border-amber-500 transition-colors leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Posting...' : 'Share with Community'}</span>
              </button>
            </form>
          </div>

          {/* Featured Curated Summaries Widget */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Featured Daily Books</span>
              </h3>
              <span className="text-[11px] text-slate-400">Curated</span>
            </div>

            <div className="space-y-3">
              {CURATED_BOOKS.slice(0, 4).map((book, idx) => (
                <div
                  key={book.id}
                  onClick={() => onOpenBook(book)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-amber-500/40 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-xs font-black text-amber-400">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">{book.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[11px] text-slate-400">{book.readTimeMinutes} min</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatTimeAgo(isoDate: string): string {
  try {
    const diffSec = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}
