import { UserProgressState, ReaderSettings, BookSummary } from '../types';
import { SYSTEM_ACHIEVEMENTS } from '../data/achievements';
import confetti from 'canvas-confetti';

const PROGRESS_STORAGE_KEY = 'bookpulse_user_progress_v2';
const SETTINGS_STORAGE_KEY = 'auraread_reader_settings_v1';
const OFFLINE_BOOKS_KEY = 'auraread_offline_books_v1';

export const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'dark',
  font: 'lora',
  fontSize: 'md',
  lineHeight: 'normal',
  language: 'en',
  speechRate: 1.0,
  speechPitch: 1.0,
};

export const INITIAL_PROGRESS: UserProgressState = {
  readBookIds: [],
  readHistory: [],
  favoriteBookIds: [],
  savedOfflineIds: [],
  currentStreak: 0,
  bestStreak: 0,
  lastReadDate: null,
  yearlyGoal: 100,
  totalMinutesRead: 0,
  unlockedAchievementIds: [],
  customCreatedSummaries: [],
};

export function loadProgress(): UserProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(progress: UserProgressState): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function loadReaderSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveReaderSettings(settings: ReaderSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadOfflineBooks(): Record<string, BookSummary> {
  try {
    const raw = localStorage.getItem(OFFLINE_BOOKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load offline books', e);
    return {};
  }
}

export function saveBookOffline(book: BookSummary): void {
  try {
    const books = loadOfflineBooks();
    books[book.id] = { ...book, savedOffline: true };
    localStorage.setItem(OFFLINE_BOOKS_KEY, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to cache book offline', e);
  }
}

export function removeBookOffline(bookId: string): void {
  try {
    const books = loadOfflineBooks();
    delete books[bookId];
    localStorage.setItem(OFFLINE_BOOKS_KEY, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to remove book offline', e);
  }
}

export function triggerCelebrationConfetti(): void {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#10b981', '#ec4899'],
    });
  } catch (e) {
    // Ignore if not supported in environment
  }
}

export function markBookCompleted(
  book: BookSummary,
  currentProgress: UserProgressState
): { updatedProgress: UserProgressState; newlyUnlocked: string[] } {
  const isAlreadyRead = currentProgress.readBookIds.includes(book.id);
  if (isAlreadyRead) {
    return { updatedProgress: currentProgress, newlyUnlocked: [] };
  }
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const newlyUnlocked: string[] = [];

  // Streak logic
  let newStreak = currentProgress.currentStreak;
  const lastReadDate = currentProgress.lastReadDate;
  if (!lastReadDate) {
    newStreak = 1;
  } else {
    const last = new Date(lastReadDate);
    const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  const bestStreak = Math.max(newStreak, currentProgress.bestStreak);

  const updatedReadBookIds = isAlreadyRead
    ? currentProgress.readBookIds
    : [...currentProgress.readBookIds, book.id];

  const updatedHistory = isAlreadyRead
    ? currentProgress.readHistory
    : [
        ...currentProgress.readHistory,
        {
          bookId: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          readAt: now.toISOString(),
        },
      ];

  const totalMinutes = currentProgress.totalMinutesRead + (book.readTimeMinutes || 7);

  // Check achievements
  const existingUnlocked = new Set(currentProgress.unlockedAchievementIds);

  SYSTEM_ACHIEVEMENTS.forEach((ach) => {
    if (existingUnlocked.has(ach.id)) return;

    if (ach.category === 'books' && updatedReadBookIds.length >= ach.milestoneTarget) {
      newlyUnlocked.push(ach.id);
      existingUnlocked.add(ach.id);
    } else if (ach.category === 'streak' && newStreak >= ach.milestoneTarget) {
      newlyUnlocked.push(ach.id);
      existingUnlocked.add(ach.id);
    }
  });

  if (newlyUnlocked.length > 0) {
    triggerCelebrationConfetti();
  }

  const updatedProgress: UserProgressState = {
    ...currentProgress,
    readBookIds: updatedReadBookIds,
    readHistory: updatedHistory,
    currentStreak: newStreak,
    bestStreak,
    lastReadDate: todayStr,
    totalMinutesRead: totalMinutes,
    unlockedAchievementIds: Array.from(existingUnlocked),
  };

  saveProgress(updatedProgress);
  return { updatedProgress, newlyUnlocked };
}
