import React, { useState, useEffect } from 'react';
import { BookSummary, CommentItem, CommentTag, ReaderTheme } from '../types';
import {
  fetchBookCommunityData,
  toggleBookLike,
  postBookComment,
  toggleCommentLike,
  getUserName,
  setUserName,
} from '../utils/communityApi';
import {
  Heart,
  MessageSquare,
  Eye,
  Star,
  Send,
  Sparkles,
  ThumbsUp,
  Share2,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  Filter,
} from 'lucide-react';

interface Props {
  book: BookSummary;
  theme: ReaderTheme;
  onShare?: () => void;
}

const TAG_OPTIONS: { label: CommentTag; icon: string }[] = [
  { label: 'Key Takeaway', icon: '💡' },
  { label: 'Action Plan', icon: '🎯' },
  { label: 'Book Review', icon: '⭐' },
  { label: 'Daily Practice', icon: '⚡' },
  { label: 'Question', icon: '💬' },
];

export const ReaderInteractions: React.FC<Props> = ({ book, theme, onShare }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [visitsCount, setVisitsCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [authorName, setAuthorName] = useState(getUserName());
  const [commentContent, setCommentContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [selectedTag, setSelectedTag] = useState<CommentTag>('Key Takeaway');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'helpful' | 'newest'>('helpful');
  const [showReactionEffect, setShowReactionEffect] = useState(false);
  const [recentActionNotice, setRecentActionNotice] = useState<string | null>(null);

  // Load community data on mount / book change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchBookCommunityData(book.id).then((data) => {
      if (isMounted) {
        setLikesCount(data.likesCount);
        setVisitsCount(data.visitsCount);
        setUserLiked(data.userLiked);
        setComments(data.comments);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [book.id]);

  // Handle Like Toggle
  const handleLike = async () => {
    // Optimistic UI update
    const nextLiked = !userLiked;
    setUserLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    if (nextLiked) {
      setShowReactionEffect(true);
      setTimeout(() => setShowReactionEffect(false), 1200);
      setRecentActionNotice('Thanks for loving this summary! ❤️');
      setTimeout(() => setRecentActionNotice(null), 3500);
    }

    const res = await toggleBookLike(book.id, book.title);
    setLikesCount(res.likesCount);
    setUserLiked(res.userLiked);
  };

  // Handle Comment Submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || isSubmitting) return;

    const trimmedAuthor = authorName.trim() || 'Avid Reader';
    setUserName(trimmedAuthor);
    setIsSubmitting(true);

    const res = await postBookComment(book.id, book.title, {
      author: trimmedAuthor,
      content: commentContent.trim(),
      rating,
      tag: selectedTag,
    });

    setIsSubmitting(false);

    if (res.success && res.comment) {
      setComments((prev) => [res.comment, ...prev]);
      setCommentContent('');
      setRecentActionNotice('Your reflection has been posted! 🌟');
      setTimeout(() => setRecentActionNotice(null), 4000);
    } else {
      setRecentActionNotice('We could not save your reflection. Please try again.');
      setTimeout(() => setRecentActionNotice(null), 4500);
    }
  };

  // Handle Comment Upvote / Like
  const handleCommentLike = async (commentId: string) => {
    // Optimistic update
    setComments((prev) =>
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
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likesCount: res.likesCount, userLiked: res.userLiked } : c))
    );
  };

  // Sorted comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'helpful') {
      return b.likesCount - a.likesCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Calculate average rating
  const averageRating = comments.length > 0
    ? (comments.reduce((acc, c) => acc + (c.rating || 5), 0) / comments.length).toFixed(1)
    : null;

  // Theme-aware styles
  const isLight = theme === 'light';
  const isSepia = theme === 'sepia';
  const cardBg = isLight
    ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
    : isSepia
    ? 'bg-[#f4ebd0] border-[#deb887] text-[#433422] shadow-sm'
    : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl';

  const inputBg = isLight
    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500'
    : isSepia
    ? 'bg-[#fbf5e6] border-[#deb887] text-[#433422] placeholder:text-[#8a7256] focus:border-[#a0522d]'
    : 'bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:bg-slate-950 focus:border-amber-500';

  const secondaryText = isLight ? 'text-slate-500' : isSepia ? 'text-[#8a7256]' : 'text-slate-400';

  return (
    <section className={`rounded-3xl border p-5 sm:p-8 mt-10 transition-all ${cardBg}`}>
      {/* 1. Header with Stats & Visitor Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500 font-bold text-sm">
              💬
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Likes & Reader Reflections
            </h2>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${secondaryText}`}>
            Finished reading? Share your takeaways, key lessons, or review with fellow readers.
          </p>
        </div>

        {/* Live Visitor & Community Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Visitor Count Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700'
                : isSepia
                ? 'bg-[#e8dcba] border-[#d8caa0] text-[#55412b]'
                : 'bg-slate-800/80 border-slate-700 text-slate-200'
            }`}
            title="Total readers who explored this summary"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              <strong className="font-bold">{visitsCount.toLocaleString()}</strong> Readers Visited
            </span>
          </div>

          {/* Average Rating Badge */}
          {comments.length > 0 && averageRating ? (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                isLight
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : isSepia
                  ? 'bg-[#eed7a1] border-[#d3be85] text-[#55412b]'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>
                <strong>{averageRating}</strong> ({comments.length} review{comments.length > 1 ? 's' : ''})
              </span>
            </div>
          ) : (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-600'
                  : isSepia
                  ? 'bg-[#e8dcba] border-[#d8caa0] text-[#55412b]'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Be first to review</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive Like & Reaction Section */}
      <div className="py-6 border-b border-slate-700/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Big Like Button */}
            <button
              onClick={handleLike}
              className={`relative group flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all transform active:scale-95 shadow-md ${
                userLiked
                  ? 'bg-rose-500 text-white shadow-rose-500/30 hover:bg-rose-600'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                  : isSepia
                  ? 'bg-[#e6d8b5] hover:bg-[#ded0ab] text-[#433422] border border-[#cfbe94]'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <Heart
                className={`w-5 h-5 transition-transform group-hover:scale-125 ${
                  userLiked ? 'fill-white stroke-white animate-bounce' : 'text-rose-400'
                }`}
              />
              <span>{userLiked ? 'Liked this Summary!' : 'Like this Summary'}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  userLiked
                    ? 'bg-white/20 text-white'
                    : isLight
                    ? 'bg-slate-200 text-slate-700'
                    : isSepia
                    ? 'bg-[#d8c79e] text-[#433422]'
                    : 'bg-slate-900 text-rose-300'
                }`}
              >
                {likesCount.toLocaleString()}
              </span>

              {/* Floating Hearts Particle Effect when user clicks like */}
              {showReactionEffect && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none animate-out fade-out slide-out-to-top-4 duration-1000">
                  <span className="text-xl">❤️</span>
                  <span className="text-2xl">🔥</span>
                  <span className="text-xl">✨</span>
                </div>
              )}
            </button>

            {/* Quick Share action if provided */}
            {onShare && (
              <button
                onClick={onShare}
                className={`hidden sm:flex items-center gap-1.5 px-3.5 py-3 rounded-2xl text-xs font-semibold border transition-all ${
                  isLight
                    ? 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    : isSepia
                    ? 'border-[#cfbe94] hover:bg-[#e6d8b5] text-[#433422]'
                    : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Book</span>
              </button>
            )}
          </div>

          {/* Genuine Reader Engagement Note */}
          <div className="text-xs text-center sm:text-right">
            <span className="font-semibold block text-amber-500">
              {likesCount > 0
                ? `${likesCount} reader${likesCount > 1 ? 's' : ''} loved this summary`
                : 'Be the first to like this summary!'}
            </span>
            <span className={secondaryText}>
              Share your genuine feedback to help fellow readers
            </span>
          </div>
        </div>

        {recentActionNotice && (
          <div className="mt-3 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{recentActionNotice}</span>
          </div>
        )}
      </div>

      {/* 3. Leave a Comment / Reflection Form */}
      <div className="py-6 border-b border-slate-700/20">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Leave Your Comment or Takeaway</span>
            </h3>

            {/* Rating Stars Input */}
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium mr-1 ${secondaryText}`}>Your Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-0.5 hover:scale-125 transition-transform"
                  title={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : isLight
                        ? 'text-slate-300'
                        : isSepia
                        ? 'text-[#cca573]'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Author Name */}
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${secondaryText}`}>
                Your Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Alex M. or Reader"
                maxLength={40}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${inputBg}`}
              />
            </div>

            {/* Reflection Tag Category */}
            <div className="sm:col-span-2">
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${secondaryText}`}>
                Tag Your Reflection
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    type="button"
                    key={tag.label}
                    onClick={() => setSelectedTag(tag.label)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                      selectedTag === tag.label
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                        : isSepia
                        ? 'bg-[#e8dcba] hover:bg-[#ded0ab] border-[#cfbe94] text-[#433422]'
                        : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div>
            <textarea
              rows={3}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="What was your biggest takeaway from this book? How will you put it into practice today?"
              maxLength={800}
              className={`w-full px-3.5 py-3 rounded-2xl border text-xs sm:text-sm leading-relaxed outline-none transition-all ${inputBg}`}
              required
            />
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className={secondaryText}>
                Be motivating and respectful. Help others learn from your experience!
              </span>
              <span className={secondaryText}>{commentContent.length}/800</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentContent.trim() || isSubmitting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSubmitting
                  ? 'bg-slate-700 text-slate-400'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Post Reflection'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Comments & Reviews List */}
      <div className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold">Community Thoughts</h3>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                isLight ? 'bg-slate-200 text-slate-700' : isSepia ? 'bg-[#d8c79e] text-[#433422]' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {comments.length}
            </span>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className={`w-3.5 h-3.5 ${secondaryText}`} />
            <button
              onClick={() => setSortBy('helpful')}
              className={`px-2 py-1 rounded-md transition-all ${
                sortBy === 'helpful' ? 'font-bold text-amber-500' : secondaryText
              }`}
            >
              Top Upvoted
            </button>
            <span className={secondaryText}>•</span>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2 py-1 rounded-md transition-all ${
                sortBy === 'newest' ? 'font-bold text-amber-500' : secondaryText
              }`}
            >
              Newest
            </button>
          </div>
        </div>

        {/* Empty State */}
        {sortedComments.length === 0 && !isLoading && (
          <div className="py-8 text-center space-y-2">
            <div className="text-3xl">💡</div>
            <h4 className="font-bold text-sm">Be the first reader to share a reflection!</h4>
            <p className={`text-xs max-w-sm mx-auto ${secondaryText}`}>
              How did "{book.title}" resonate with you? Share your favorite takeaway above.
            </p>
          </div>
        )}

        {/* Comment Items */}
        <div className="space-y-3">
          {sortedComments.map((cmt) => {
            const dateStr = formatTimeAgo(cmt.createdAt);
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
                className={`p-4 rounded-2xl border transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : isSepia
                    ? 'bg-[#eee3c6] border-[#dac99f]'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm ${
                        cmt.avatarColor || 'bg-amber-600'
                      }`}
                    >
                      {initials}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm">{cmt.author}</span>{(cmt.country || cmt.state) && <span className="text-[10px] text-slate-500 ml-1">• {cmt.country}{cmt.state ? ` · ${cmt.state}` : ""}</span>}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold border ${
                            isLight
                              ? 'bg-amber-100 border-amber-200 text-amber-800'
                              : isSepia
                              ? 'bg-[#e2cfa4] border-[#cfbe94] text-[#433422]'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          Verified Reader
                        </span>

                        {cmt.tag && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              isLight
                                ? 'bg-slate-200 text-slate-700'
                                : isSepia
                                ? 'bg-[#ded0ab] text-[#433422]'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {cmt.tag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        {/* Rating Stars */}
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: cmt.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className={`text-[10px] ${secondaryText}`}>{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comment Upvote / Like Button */}
                  <button
                    onClick={() => handleCommentLike(cmt.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                      cmt.userLiked
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                        : isLight
                        ? 'border-slate-200 hover:bg-slate-100 text-slate-600'
                        : isSepia
                        ? 'border-[#cfbe94] hover:bg-[#e4d6b1] text-[#433422]'
                        : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                    }`}
                    title="Helpful reflection"
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${cmt.userLiked ? 'fill-rose-400 text-rose-400' : ''}`}
                    />
                    <span>{cmt.likesCount}</span>
                  </button>
                </div>

                {/* Comment Content */}
                <p className="mt-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line opacity-90 pl-1">
                  {cmt.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Helper: friendly time ago formatter
function formatTimeAgo(isoDate: string): string {
  try {
    const diffSec = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return new Date(isoDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}
