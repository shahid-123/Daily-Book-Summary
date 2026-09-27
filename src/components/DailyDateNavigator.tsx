import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onToday: () => void;
}

export const DailyDateNavigator: React.FC<Props> = ({
  currentDate,
  onDateChange,
  onToday,
}) => {
  const isToday =
    currentDate.toDateString() === new Date().toDateString();

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const formattedDate = currentDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-2.5 sm:px-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevDay}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
          title="Previous Day Book"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 px-1">
          <CalendarIcon className="h-4 w-4 text-amber-500" />
          <span className="text-xs sm:text-sm font-semibold text-slate-200">
            {formattedDate}
          </span>
          {isToday && (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
              Today's Daily
            </span>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
          title="Next Day Book"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {!isToday && (
        <button
          onClick={onToday}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Return to Today</span>
        </button>
      )}
    </div>
  );
};
