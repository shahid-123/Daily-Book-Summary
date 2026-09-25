export type BookCategory =
  | 'Mindset'
  | 'Productivity'
  | 'Resilience & Stoicism'
  | 'Wealth & Mastery'
  | 'Leadership'
  | 'Habits'
  | 'High Performance';

export interface KeyTakeaway {
  title: string;
  insight: string;
  practicalDrill: string;
}

export interface RealLifeExample {
  title: string;
  story: string;
  takeawayLesson: string;
}

export interface SneakPeek {
  title: string;
  author: string;
  teaser: string;
  category: BookCategory;
  dateStr: string;
}

export interface BookSummary {
  id: string;
  dayOfYear?: number;
  dateKey?: string; // YYYY-MM-DD
  title: string;
  author: string;
  year?: number;
  category: BookCategory;
  readTimeMinutes: number;
  hook: string;
  coverGradient: string;
  accentColor: string;
  contextImage: string; // SVG or image URL representing conceptual context
  visualContextPrompt?: string;
  coreThesis: string;
  keyTakeaways: KeyTakeaway[];
  realLifeExample: RealLifeExample;
  dailyMicroHabit: string;
  memorableQuote: {
    quote: string;
    context: string;
  };
  actionChecklist: string[];
  nextDaySneakPeek?: SneakPeek;
  isCustom?: boolean;
  savedOffline?: boolean;
  createdAt?: string;
}

export type ReaderTheme = 'sepia' | 'dark' | 'light';
export type ReaderFont = 'lora' | 'playfair' | 'jakarta' | 'mono';
export type ReaderFontSize = 'sm' | 'md' | 'lg' | 'xl';
export type ReaderLineHeight = 'snug' | 'normal' | 'relaxed';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechLocale: string;
}

export interface ReaderSettings {
  theme: ReaderTheme;
  font: ReaderFont;
  fontSize: ReaderFontSize;
  lineHeight: ReaderLineHeight;
  language: string;
  speechRate: number;
  speechPitch: number;
  selectedVoiceUri?: string;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  milestoneTarget: number;
  unlockedAt?: string;
  category: 'books' | 'streak' | 'languages' | 'custom' | 'offline';
}

export interface UserProgressState {
  readBookIds: string[];
  readHistory: { bookId: string; title: string; author: string; category: string; readAt: string }[];
  favoriteBookIds: string[];
  savedOfflineIds: string[];
  currentStreak: number;
  bestStreak: number;
  lastReadDate: string | null;
  yearlyGoal: number; // default 100
  totalMinutesRead: number;
  unlockedAchievementIds: string[];
  customCreatedSummaries: BookSummary[];
}

export interface RecommendationItem {
  title: string;
  author: string;
  category: BookCategory;
  reason: string;
  keyLesson: string;
  estimatedMinutes: number;
}
