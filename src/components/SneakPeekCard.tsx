import React, { useState, useEffect } from 'react';
import { SneakPeek } from '../types';
import { Sparkles, Clock, ArrowRight, Lock, BookOpen } from 'lucide-react';

interface Props {
  sneakPeek?: SneakPeek;
  onPreviewTomorrow?: () => void;
}

export const SneakPeekCard: React.FC<Props> = ({ sneakPeek, onPreviewTomorrow }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeUntilMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeUntilMidnight();
    const interval = setInterval(calculateTimeUntilMidnight, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!sneakPeek) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-xl text-slate-100">
      {/* Background Decorative Glow */}
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Next Day Sneak Peek
            </span>
            <span className="text-xs font-medium text-slate-400">
              Unlocks in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
              <span>{sneakPeek.title}</span>
            </h3>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              by <span className="text-slate-200">{sneakPeek.author}</span> • <span className="text-amber-400">{sneakPeek.category}</span>
            </p>
          </div>

          <p className="text-sm text-slate-300 italic line-clamp-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
            "{sneakPeek.teaser}"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 border border-slate-700 text-xs font-mono text-amber-300 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          {onPreviewTomorrow && (
            <button
              onClick={onPreviewTomorrow}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-300 border border-amber-500/40 px-4 py-2 text-xs font-semibold transition-all group"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Preview Tomorrow</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
