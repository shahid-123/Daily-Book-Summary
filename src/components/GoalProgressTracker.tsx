import React from 'react';
import { UserProgressState, UserAchievement } from '../types';
import { SYSTEM_ACHIEVEMENTS } from '../data/achievements';
import {
  Trophy,
  Flame,
  Clock,
  Target,
  Sparkles,
  BookCheck,
  TrendingUp,
  Award,
  Calendar,
  Check,
  Zap,
} from 'lucide-react';

interface Props {
  progress: UserProgressState;
  onSelectBook?: (bookId: string) => void;
}

export const GoalProgressTracker: React.FC<Props> = ({ progress }) => {
  const booksReadCount = progress.readBookIds.length;
  const yearlyGoal = progress.yearlyGoal || 100;
  const percentage = Math.min(100, Math.round((booksReadCount / yearlyGoal) * 100));

  // Calculate day of the year and expected pace for 100 books
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysInYear = 365;
  const targetPacePerDay = yearlyGoal / daysInYear;
  const expectedBooksSoFar = Math.round(targetPacePerDay * dayOfYear);
  const paceDiff = booksReadCount - expectedBooksSoFar;

  // Category breakdown calculation
  const categoryCounts: Record<string, number> = {
    Habits: 0,
    'Resilience & Stoicism': 0,
    Productivity: 0,
    'High Performance': 0,
    'Wealth & Mastery': 0,
    Mindset: 0,
    Leadership: 0,
  };

  progress.readHistory.forEach((item) => {
    if (categoryCounts[item.category] !== undefined) {
      categoryCounts[item.category] += 1;
    } else {
      categoryCounts['Mindset'] += 1;
    }
  });

  const unlockedSet = new Set(progress.unlockedAchievementIds);

  // Milestone stages toward 100
  const milestoneMilestones = [
    { target: 10, label: 'Sparks', icon: '🌱' },
    { target: 25, label: 'Quarter', icon: '🥉' },
    { target: 50, label: 'Halfway', icon: '🥈' },
    { target: 75, label: 'Virtuoso', icon: '⭐' },
    { target: 100, label: 'Century Legend', icon: '👑' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 100-Book Milestone Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5" />
              Annual 100-Book Milestone Challenge
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
              You Have Read <span className="text-amber-400">{booksReadCount}</span> of {yearlyGoal} Summaries
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Every summary digested elevates your decision-making and mental models. You are {100 - percentage}% away from joining the elite 100-Book Century Club this year.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 border border-slate-700/80 text-xs">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>
                  <strong className="text-white font-bold">{progress.currentStreak} Day</strong> Streak (Best: {progress.bestStreak})
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 border border-slate-700/80 text-xs">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>
                  <strong className="text-white font-bold">{progress.totalMinutesRead}</strong> Minutes Learned
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 border border-slate-700/80 text-xs">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-medium">
                  {paceDiff >= 0 ? `Ahead by ${paceDiff} books!` : `Behind by ${Math.abs(paceDiff)} books`}
                </span>
              </div>
            </div>
          </div>

          {/* Radial Progress Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-44 h-44 -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="72"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="88"
                cy="88"
                r="72"
                stroke="url(#goldGradient)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={452}
                strokeDashoffset={452 - (452 * percentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white tracking-tight">{percentage}%</span>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest">
                Milestone
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">{100 - booksReadCount} left</span>
            </div>
          </div>
        </div>

        {/* Milestone Steps Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Milestone Ladder to 100</span>
            <span className="text-amber-400 font-bold">{booksReadCount} / 100 Completed</span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {milestoneMilestones.map((step) => {
              const reached = booksReadCount >= step.target;
              return (
                <div
                  key={step.target}
                  className={`rounded-xl border p-2 sm:p-3 text-center transition-all ${
                    reached
                      ? 'border-amber-500/50 bg-amber-500/15 text-amber-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-500'
                  }`}
                >
                  <div className="text-lg sm:text-xl mb-1">{step.icon}</div>
                  <div className="font-bold text-xs truncate text-white">{step.target} Books</div>
                  <div className="text-[10px] opacity-80 truncate">{step.label}</div>
                  {reached && (
                    <div className="mt-1 flex items-center justify-center">
                      <span className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-full bg-amber-500 text-slate-950">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Intuitive Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Knowledge Matrix */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl text-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold flex items-center gap-2 text-white">
              <Zap className="w-4 h-4 text-amber-400" />
              Category Mastery Distribution
            </h3>
            <span className="text-xs text-slate-400">7 Domains</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const maxVal = Math.max(1, ...Object.values(categoryCounts));
              const widthPct = Math.max(8, Math.round((count / maxVal) * 100));

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat}</span>
                    <span className="text-amber-400 font-bold">{count} read</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 12-Month Reading Velocity Overview */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl text-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-sky-400" />
                Annual Pace Rhythm
              </h3>
              <span className="text-xs text-sky-400 font-semibold">100 Target</span>
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Target cadence: ~8.3 books per month (~2 books weekly). Consistency compounds exponentially over 365 days.
            </p>

            {/* Monthly Bar Visualizer */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 items-end h-32 pt-4 border-b border-slate-800 pb-2">
              {[
                { m: 'Jan', count: 9 },
                { m: 'Feb', count: 8 },
                { m: 'Mar', count: 9 },
                { m: 'Apr', count: 8 },
                { m: 'May', count: 9 },
                { m: 'Jun', count: 8 },
                { m: 'Jul', count: 9 },
                { m: 'Aug', count: 8 },
                { m: 'Sep', count: Math.max(progress.readBookIds.length, 6) },
                { m: 'Oct', count: 8 },
                { m: 'Nov', count: 9 },
                { m: 'Dec', count: 9 },
              ].map((month, i) => {
                const isCurrentMonth = i === now.getMonth();
                const barHeight = Math.min(100, Math.round((month.count / 12) * 100));

                return (
                  <div key={month.m} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        isCurrentMonth
                          ? 'bg-amber-400 shadow-md shadow-amber-500/30'
                          : i < now.getMonth()
                          ? 'bg-slate-700 hover:bg-slate-600'
                          : 'bg-slate-800/40'
                      }`}
                      style={{ height: `${barHeight}%` }}
                      title={`${month.m}: ${month.count} books`}
                    />
                    <span
                      className={`text-[9px] font-mono ${
                        isCurrentMonth ? 'text-amber-400 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {month.m}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Current Month
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-700" /> Completed Months
            </span>
          </div>
        </div>
      </div>

      {/* Gamified Achievements Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 text-white font-serif">
              <Award className="w-5 h-5 text-amber-500" />
              Achievements & Reading Badges
            </h3>
            <p className="text-xs text-slate-400">
              {progress.unlockedAchievementIds.length} of {SYSTEM_ACHIEVEMENTS.length} Badges Unlocked
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYSTEM_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedSet.has(ach.id);

            return (
              <div
                key={ach.id}
                className={`rounded-2xl border p-4 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 text-slate-100 shadow-lg'
                    : 'border-slate-800/80 bg-slate-900/40 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-inner ${
                    isUnlocked ? 'bg-amber-500/20 ring-1 ring-amber-500/40' : 'bg-slate-800'
                  }`}
                >
                  {ach.badgeIcon}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`text-sm font-bold truncate ${
                        isUnlocked ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      {ach.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
