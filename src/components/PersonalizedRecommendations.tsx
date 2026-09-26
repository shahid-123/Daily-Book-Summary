import React, { useState, useEffect } from 'react';
import { RecommendationItem, UserProgressState, BookSummary } from '../types';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Compass,
  RefreshCw,
  Loader2,
  Bookmark,
  CheckCircle,
} from 'lucide-react';

interface Props {
  progress: UserProgressState;
  onSelectRecommendedBook: (title: string, author: string) => void;
}

const DEFAULT_RECOMMENDATIONS: RecommendationItem[] = [
  {
    title: 'Essentialism: The Disciplined Pursuit of Less',
    author: 'Greg McKeown',
    category: 'Productivity',
    reason: 'Since you enjoy building good habits, this book teaches you how to say "no" to unimportant tasks so you can focus on what matters most.',
    keyLesson: 'If you do not prioritize your life, someone else will.',
    estimatedMinutes: 7,
  },
  {
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    category: 'Wealth & Mastery',
    reason: 'A simple guide to building wealth and finding peace of mind by working smart instead of just working long hours.',
    keyLesson: 'Seek real wealth and peace of mind, not just flashy status.',
    estimatedMinutes: 8,
  },
  {
    title: 'Grit: The Power of Passion and Perseverance',
    author: 'Angela Duckworth',
    category: 'High Performance',
    reason: 'Shows why staying dedicated to a goal over time matters way more than being born with natural talent.',
    keyLesson: 'Starting with excitement is easy. Sticking with it when it gets tough is what leads to success.',
    estimatedMinutes: 8,
  },
  {
    title: 'Start With Why',
    author: 'Simon Sinek',
    category: 'Leadership',
    reason: 'Explains why the best leaders and teams always focus on their core purpose before talking about what they sell.',
    keyLesson: 'People do not buy what you do; they buy why you do it.',
    estimatedMinutes: 7,
  },
];

export const PersonalizedRecommendations: React.FC<Props> = ({
  progress,
  onSelectRecommendedBook,
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(DEFAULT_RECOMMENDATIONS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const readBooks = progress.readHistory.map((h) => ({
        title: h.title,
        author: h.author,
        category: h.category,
      }));

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          readBooks,
          favoriteCategories: Array.from(new Set(progress.readHistory.map((h) => h.category))),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
        }
      }
    } catch (e) {
      console.warn('Using intelligent default recommendations', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (progress.readHistory.length > 1) {
      fetchRecommendations();
    }
  }, [progress.readHistory.length]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Algorithmic Curator
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            Personalized For Your Intellectual Appetite
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Grounded in your {progress.readBookIds.length} read summaries and reading trajectory.
          </p>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 active:scale-95 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh Tailored Picks</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((item, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-6 shadow-xl text-slate-100 flex flex-col justify-between transition-all hover:border-amber-500/40 hover:shadow-amber-500/5 group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ~{item.estimatedMinutes} min read
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">by {item.author}</p>
              </div>

              <div className="rounded-2xl bg-slate-800/40 p-3.5 border border-slate-700/50 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-amber-300 block mb-1">
                  Why you'll love this:
                </span>
                <p>{item.reason}</p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                <span className="font-bold text-emerald-400 block mb-0.5">
                  Core Life Breakthrough:
                </span>
                <p className="italic">"{item.keyLesson}"</p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Picks for your 100-Book Goal</span>
              <button
                onClick={() => onSelectRecommendedBook(item.title, item.author)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Summary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
