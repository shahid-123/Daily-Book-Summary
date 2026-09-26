import React, { useState, useEffect, useMemo } from 'react';
import { BookSummary } from './types';
import { getBookForDate, CURATED_BOOKS } from './data/dailyBooks';
import {
  loadProgress,
  saveProgress,
  loadOfflineBooks,
  saveBookOffline,
  removeBookOffline,
  markBookCompleted,
  triggerCelebrationConfetti,
} from './utils/storage';
import { ReaderView } from './components/ReaderView';
import { GoalProgressTracker } from './components/GoalProgressTracker';
import { CustomSummaryGenerator } from './components/CustomSummaryGenerator';
import { PersonalizedRecommendations } from './components/PersonalizedRecommendations';
import { LibraryView } from './components/LibraryView';
import { DailyDateNavigator } from './components/DailyDateNavigator';
import { SneakPeekCard } from './components/SneakPeekCard';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { exportSummaryToPdf } from './utils/pdfExport';
import {
  BookOpen,
  Sparkles,
  Trophy,
  Flame,
  Bookmark,
  BookmarkCheck,
  Search,
  CheckCircle2,
  FileDown,
  Compass,
  ArrowRight,
  HardDriveDownload,
  HardDrive,
  Clock,
  Layers,
  Wand2,
  Library,
  ChevronRight,
  Calendar,
  Volume2,
} from 'lucide-react';

type ActiveTab = 'daily' | 'reader' | 'goal' | 'custom' | 'recommendations' | 'library';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [progress, setProgress] = useState(loadProgress());
  const [offlineCache, setOfflineCache] = useState<Record<string, BookSummary>>(loadOfflineBooks());
  const [activeBookForReader, setActiveBookForReader] = useState<BookSummary | null>(null);

  // Compute today's daily book based on selected calendar date
  const dailyBook = useMemo(() => {
    return getBookForDate(currentDate);
  }, [currentDate]);

  // Combine curated books with user's custom generated books and offline books
  const allAvailableBooks = useMemo(() => {
    const map = new Map<string, BookSummary>();
    CURATED_BOOKS.forEach((b) => map.set(b.id, b));
    progress.customCreatedSummaries.forEach((b) => map.set(b.id, b));
    Object.values(offlineCache).forEach((b) => map.set(b.id, b));
    return Array.from(map.values());
  }, [progress.customCreatedSummaries, offlineCache]);

  // Daily auto-refresh check when day changes at midnight
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate() && activeTab === 'daily') {
        setCurrentDate(new Date());
      }
    }, 60000);
    return () => clearInterval(checkMidnight);
  }, [currentDate, activeTab]);

  // Handle Mark Book Completed
  const handleMarkRead = (book: BookSummary) => {
    const { updatedProgress, newlyUnlocked } = markBookCompleted(book, progress);
    setProgress(updatedProgress);

    if (newlyUnlocked.length > 0) {
      triggerCelebrationConfetti();
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (bookId: string) => {
    const isFav = progress.favoriteBookIds.includes(bookId);
    const updatedFavs = isFav
      ? progress.favoriteBookIds.filter((id) => id !== bookId)
      : [...progress.favoriteBookIds, bookId];

    const updated = { ...progress, favoriteBookIds: updatedFavs };
    setProgress(updated);
    saveProgress(updated);
  };

  // Toggle Offline Save
  const handleToggleSaveOffline = (book: BookSummary) => {
    const isSaved = !!offlineCache[book.id];
    if (isSaved) {
      removeBookOffline(book.id);
      const updatedCache = { ...offlineCache };
      delete updatedCache[book.id];
      setOfflineCache(updatedCache);

      const updatedProgress = {
        ...progress,
        savedOfflineIds: progress.savedOfflineIds.filter((id) => id !== book.id),
      };
      setProgress(updatedProgress);
      saveProgress(updatedProgress);
    } else {
      saveBookOffline(book);
      setOfflineCache({ ...offlineCache, [book.id]: { ...book, savedOffline: true } });

      const updatedOfflineIds = Array.from(new Set([...progress.savedOfflineIds, book.id]));
      let newUnlocked = [...progress.unlockedAchievementIds];
      if (!newUnlocked.includes('offline-master')) {
        newUnlocked.push('offline-master');
        triggerCelebrationConfetti();
      }

      const updatedProgress = {
        ...progress,
        savedOfflineIds: updatedOfflineIds,
        unlockedAchievementIds: newUnlocked,
      };
      setProgress(updatedProgress);
      saveProgress(updatedProgress);
    }
  };

  // Open Full Reading Experience
  const handleOpenReader = (book: BookSummary) => {
    setActiveBookForReader(book);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Custom Summary Created
  const handleCustomSummaryGenerated = (newSummary: BookSummary) => {
    const updatedCustomList = [
      newSummary,
      ...progress.customCreatedSummaries.filter((b) => b.id !== newSummary.id),
    ];
    let newUnlocked = [...progress.unlockedAchievementIds];
    if (!newUnlocked.includes('custom-creator')) {
      newUnlocked.push('custom-creator');
      triggerCelebrationConfetti();
    }

    const updated = {
      ...progress,
      customCreatedSummaries: updatedCustomList,
      unlockedAchievementIds: newUnlocked,
    };
    setProgress(updated);
    saveProgress(updated);
  };

  // Select Recommended Book
  const handleSelectRecommendedBook = (bookTitle: string, bookAuthor: string) => {
    const existing = allAvailableBooks.find(
      (b) => b.title.toLowerCase() === bookTitle.toLowerCase()
    );
    if (existing) {
      handleOpenReader(existing);
    } else {
      setActiveTab('custom');
    }
  };

  // Render Reader View if requested
  if (activeTab === 'reader' && activeBookForReader) {
    return (
      <>
        <ReaderView
          book={activeBookForReader}
          isRead={progress.readBookIds.includes(activeBookForReader.id)}
          isFavorite={progress.favoriteBookIds.includes(activeBookForReader.id)}
          isSavedOffline={!!offlineCache[activeBookForReader.id]}
          onMarkRead={handleMarkRead}
          onToggleFavorite={handleToggleFavorite}
          onToggleSaveOffline={handleToggleSaveOffline}
          onBack={() => setActiveTab('daily')}
          onPreviewTomorrow={() => {
            const nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);
            setCurrentDate(nextDate);
            const nextBook = getBookForDate(nextDate);
            setActiveBookForReader(nextBook);
          }}
        />
        <OfflineIndicator />
      </>
    );
  }

  const isDailyBookRead = progress.readBookIds.includes(dailyBook.id);
  const isDailyBookFavorite = progress.favoriteBookIds.includes(dailyBook.id);
  const isDailyBookOffline = !!offlineCache[dailyBook.id];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('daily')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black tracking-tight text-lg text-white">
                  Shahid's <span className="text-amber-400">BookPulse</span>
                </span>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-400 uppercase tracking-widest hidden sm:inline">
                  Daily
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
                Daily Motivation • 100-Book Milestone
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 rounded-2xl bg-slate-900/90 border border-slate-800 p-1 text-xs">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-medium transition-all ${
                activeTab === 'daily'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Today's Daily</span>
            </button>

            <button
              onClick={() => setActiveTab('goal')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-medium transition-all ${
                activeTab === 'goal'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>100-Book Goal</span>
              <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-amber-400 font-bold">
                {progress.readBookIds.length}/100
              </span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-medium transition-all ${
                activeTab === 'custom'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Produce Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-medium transition-all ${
                activeTab === 'recommendations'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>For You</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-medium transition-all ${
                activeTab === 'library'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Library className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vault</span>
            </button>
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter Badge */}
            <div
              onClick={() => setActiveTab('goal')}
              className="flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-2.5 py-1.5 text-xs font-bold text-orange-400 cursor-pointer hover:bg-orange-500/20 transition-all"
              title={`${progress.currentStreak} Day Streak!`}
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 animate-pulse" />
              <span>{progress.currentStreak}</span>
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="mx-auto max-w-[1600px] w-full flex-1 px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12">
        {/* TAB 1: DAILY MOTIVATIONAL SUMMARY */}
        {activeTab === 'daily' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Date Changer Ribbon */}
            <DailyDateNavigator
              currentDate={currentDate}
              onDateChange={(d) => setCurrentDate(d)}
              onToday={() => setCurrentDate(new Date())}
            />

            {/* Hero Daily Book Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-10 shadow-2xl">
              {/* Background Glow */}
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Book Details Column */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 font-bold text-amber-400 uppercase tracking-wider">
                      {dailyBook.category}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {dailyBook.readTimeMinutes} Min Read
                    </span>
                    {dailyBook.year && (
                      <span className="text-slate-500">• Published {dailyBook.year}</span>
                    )}
                    {isDailyBookRead && (
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 font-semibold text-emerald-400 text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Read Today
                      </span>
                    )}
                  </div>

                  <div>
                    <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight leading-tight">
                      {dailyBook.title}
                    </h1>
                    <p className="text-lg sm:text-xl font-medium text-slate-300 mt-1">
                      by <span className="text-amber-400 font-semibold">{dailyBook.author}</span>
                    </p>
                  </div>

                  {/* Motivational Hook */}
                  <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 p-5 shadow-inner">
                    <p className="text-base sm:text-lg font-serif italic text-amber-200 leading-relaxed">
                      "{dailyBook.hook}"
                    </p>
                  </div>

                  {/* Micro Habit Teaser */}
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 p-4 text-xs sm:text-sm text-slate-300">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
                      🌱
                    </div>
                    <div>
                      <strong className="text-emerald-400 font-semibold block">
                        60-Second Daily Action:
                      </strong>
                      <span>{dailyBook.dailyMicroHabit}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => handleOpenReader(dailyBook)}
                      className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all group"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Summary & Audio</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => exportSummaryToPdf(dailyBook)}
                      className="flex items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-3.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
                      title="Download PDF Summary"
                    >
                      <FileDown className="w-4 h-4 text-amber-400" />
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={() => handleToggleSaveOffline(dailyBook)}
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all active:scale-95 ${
                        isDailyBookOffline
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                          : 'border-slate-700 bg-slate-800/90 text-slate-400 hover:text-white'
                      }`}
                      title={isDailyBookOffline ? 'Available Offline' : 'Save for Offline Access'}
                    >
                      {isDailyBookOffline ? (
                        <HardDrive className="w-4 h-4" />
                      ) : (
                        <HardDriveDownload className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleFavorite(dailyBook.id)}
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all active:scale-95 ${
                        isDailyBookFavorite
                          ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                          : 'border-slate-700 bg-slate-800/90 text-slate-400 hover:text-white'
                      }`}
                      title={isDailyBookFavorite ? 'In Favorites' : 'Add to Favorites'}
                    >
                      {isDailyBookFavorite ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Conceptual Artwork & Visual Metaphor Column */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div
                    onClick={() => handleOpenReader(dailyBook)}
                    className="cursor-pointer group relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 transition-all hover:scale-[1.02]"
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: dailyBook.contextImage }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Compass className="w-3.5 h-3.5 text-amber-400" />
                        AI Context Artwork
                      </span>
                      <span className="font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 3 Key Takeaways Sneak Peek Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyBook.keyTakeaways.slice(0, 3).map((takeaway, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenReader(dailyBook)}
                  className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2 hover:border-amber-500/40 hover:bg-slate-900 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-500 font-mono">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 group-hover:text-amber-300 transition-colors">
                      Core Lesson
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {takeaway.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {takeaway.insight}
                  </p>
                </div>
              ))}
            </div>

            {/* Sneak Peek to Tomorrow's Summary with Countdown */}
            {dailyBook.nextDaySneakPeek && (
              <div className="pt-2">
                <SneakPeekCard
                  sneakPeek={dailyBook.nextDaySneakPeek}
                  onPreviewTomorrow={() => {
                    const nextDate = new Date(currentDate);
                    nextDate.setDate(nextDate.getDate() + 1);
                    setCurrentDate(nextDate);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: 100-BOOK GOAL & INTUITIVE CHARTS */}
        {activeTab === 'goal' && (
          <GoalProgressTracker
            progress={progress}
            onSelectBook={(id) => {
              const book = allAvailableBooks.find((b) => b.id === id);
              if (book) handleOpenReader(book);
            }}
          />
        )}

        {/* TAB 3: CUSTOM BOOK SUMMARY ON-DEMAND */}
        {activeTab === 'custom' && (
          <CustomSummaryGenerator
            onSummaryGenerated={handleCustomSummaryGenerated}
            onOpenReader={handleOpenReader}
          />
        )}

        {/* TAB 4: PERSONALIZED RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <PersonalizedRecommendations
            progress={progress}
            onSelectRecommendedBook={handleSelectRecommendedBook}
          />
        )}

        {/* TAB 5: LIBRARY & OFFLINE VAULT */}
        {activeTab === 'library' && (
          <LibraryView
            allBooks={allAvailableBooks}
            readBookIds={progress.readBookIds}
            favoriteBookIds={progress.favoriteBookIds}
            offlineBookIds={progress.savedOfflineIds}
            onSelectBook={handleOpenReader}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/90 backdrop-blur-xl px-2 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'daily' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px]">Daily</span>
          </button>

          <button
            onClick={() => setActiveTab('goal')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'goal' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px]">100 Goal</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'custom' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span className="text-[10px]">Custom</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'recommendations' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px]">For You</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'library' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Library className="w-4 h-4" />
            <span className="text-[10px]">Vault</span>
          </button>
        </div>
      </footer>

      {/* Offline Alert Badge */}
      <OfflineIndicator />
    </div>
  );
}
