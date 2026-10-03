import { BookCommunityData, CommentItem, CommunityOverviewStats, CommentTag, ReaderProfile, ReaderBook } from '../types';

const USER_ID_KEY = 'pulse_reader_user_id';
const USER_NAME_KEY = 'pulse_reader_display_name';
const USER_PROFILE_KEY = 'pulse_reader_profile_v1';
const VISITED_SESSION_KEY = 'pulse_visited_session';
const STATS_CACHE_KEY = 'pulse_community_stats_cache';

export function getUserId(): string {
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = 'reader_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch { return 'reader_guest'; }
}

export function getUserName(): string {
  try { return localStorage.getItem(USER_NAME_KEY) || ''; } catch { return ''; }
}

export function setUserName(name: string): void {
  try { localStorage.setItem(USER_NAME_KEY, name.trim()); } catch { /* ignore */ }
}

export function getLocalReaderProfile(): ReaderProfile | null {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveLocalReaderProfile(profile: ReaderProfile) {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    setUserName(profile.displayName);
  } catch { /* ignore */ }
}

export async function fetchReaderProfile(): Promise<ReaderProfile | null> {
  const local = getLocalReaderProfile();
  try {
    const res = await fetch(`/api/readers/${encodeURIComponent(getUserId())}`);
    if (res.ok) {
      const data = await res.json();
      if (data.profile) saveLocalReaderProfile(data.profile);
      return data.profile || null;
    }
  } catch (err) { console.warn('Failed to fetch reader profile', err); }
  return local;
}

export async function saveReaderProfile(input: { displayName: string; country: string; state: string; yearlyGoal: number }): Promise<ReaderProfile> {
  const now = new Date().toISOString();
  const existing = getLocalReaderProfile();
  const profile: ReaderProfile = {
    id: getUserId(),
    displayName: input.displayName.trim(),
    country: input.country.trim(),
    state: input.state.trim(),
    yearlyGoal: Math.min(1000, Math.max(1, Number(input.yearlyGoal) || 100)),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  saveLocalReaderProfile(profile);
  try {
    const res = await fetch(`/api/readers/${encodeURIComponent(profile.id)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error(`Profile save failed (${res.status})`);
    const data = await res.json();
    if (data.profile) saveLocalReaderProfile(data.profile);
    return data.profile || profile;
  } catch (err) {
    console.warn('Profile saved locally; server sync will be retried later', err);
    return profile;
  }
}

export async function fetchReaderSummary(): Promise<{ profile: ReaderProfile | null; books: ReaderBook[]; booksReadCount: number }> {
  const local = getLocalReaderProfile();
  try {
    const res = await fetch(`/api/readers/${encodeURIComponent(getUserId())}/summary`);
    if (res.ok) return await res.json();
  } catch (err) { console.warn('Failed to fetch reader summary', err); }
  return { profile: local, books: [], booksReadCount: 0 };
}

export async function syncCompletedBook(book: { bookId: string; title: string; author: string; category: string; minutes: number }) {
  try {
    const res = await fetch(`/api/readers/${encodeURIComponent(getUserId())}/books`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(book),
    });
    if (res.ok) return await res.json();
  } catch (err) { console.warn('Failed to sync completed book', err); }
  return { success: false, alreadyRead: false };
}

export async function syncLocalReadingHistory(history: Array<{
  bookId: string;
  title: string;
  author: string;
  category: string;
  readAt?: string;
}>): Promise<void> {
  if (!history.length) return;

  // The server completion endpoint is idempotent, so syncing existing
  // local history again is safe and repairs older browser-only progress.
  await Promise.all(
    history.map((book) =>
      syncCompletedBook({
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        category: book.category || 'Mindset',
        minutes: 0,
      })
    )
  );
}

export function getLocalCommunityStats(): CommunityOverviewStats {
  try {
    const raw = localStorage.getItem(STATS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.totalVisits === 'number') return parsed;
    }
  } catch { /* ignore */ }
  return { totalVisits: 0, todayVisits: 0, totalLikes: 0, totalComments: 0, activeReadersCount: 0 };
}

export function saveLocalCommunityStats(stats: CommunityOverviewStats): void {
  try { localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(stats)); } catch { /* ignore */ }
}

export async function fetchCommunityStats(): Promise<CommunityOverviewStats> {
  try {
    const res = await fetch('/api/community/stats');
    if (res.ok) { const data = await res.json(); saveLocalCommunityStats(data); return data; }
  } catch (err) { console.warn('Failed to fetch community stats', err); }
  return getLocalCommunityStats();
}

export async function recordVisit(bookId?: string): Promise<CommunityOverviewStats & { bookVisits?: number }> {
  const isNewSession = !sessionStorage.getItem(VISITED_SESSION_KEY);
  if (isNewSession) sessionStorage.setItem(VISITED_SESSION_KEY, 'true');
  try {
    const res = await fetch('/api/community/visit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, isNewSession, userId: getUserId() }),
    });
    if (res.ok) {
      const data = await res.json();
      const cached = getLocalCommunityStats();
      const updated = {
        totalVisits: Number(data.totalVisits) || cached.totalVisits,
        todayVisits: Number(data.todayVisits) || cached.todayVisits,
        totalLikes: Number(data.totalLikes) || cached.totalLikes,
        totalComments: Number(data.totalComments) || cached.totalComments,
        activeReadersCount: Number(data.activeReadersCount) || cached.activeReadersCount,
      };
      saveLocalCommunityStats(updated);
      return { ...updated, bookVisits: data.bookVisits };
    }
  } catch (err) { console.warn('Failed to record visit', err); }
  return getLocalCommunityStats();
}

export async function fetchBookCommunityData(bookId: string): Promise<BookCommunityData> {
  try {
    const res = await fetch(`/api/books/${encodeURIComponent(bookId)}/community?userId=${encodeURIComponent(getUserId())}`);
    if (res.ok) return await res.json();
  } catch (err) { console.warn('Failed to fetch book community data', err); }
  return { bookId, likesCount: 0, visitsCount: 0, commentsCount: 0, userLiked: false, comments: [] };
}

export async function toggleBookLike(bookId: string, bookTitle?: string): Promise<{ likesCount: number; userLiked: boolean }> {
  try {
    const res = await fetch(`/api/books/${encodeURIComponent(bookId)}/like`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: getUserId(), bookTitle }),
    });
    if (res.ok) return await res.json();
  } catch (err) { console.warn('Failed to toggle like', err); }
  return { likesCount: 0, userLiked: false };
}

export async function postBookComment(bookId: string, bookTitle: string, comment: { author: string; content: string; rating: number; tag?: CommentTag }): Promise<{ success: boolean; comment: CommentItem; totalComments: number }> {
  const profile = getLocalReaderProfile();
  if (comment.author) setUserName(comment.author);
  try {
    const res = await fetch(`/api/books/${encodeURIComponent(bookId)}/comments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...comment, userId: getUserId(), bookTitle, country: profile?.country, state: profile?.state }),
    });
    if (res.ok) return await res.json();
    throw new Error(`Comment save failed (${res.status})`);
  } catch (err) {
    console.warn('Comment was not saved to the server', err);
    return { success: false, comment: {} as CommentItem, totalComments: 0 };
  }
}

export async function toggleCommentLike(commentId: string): Promise<{ likesCount: number; userLiked: boolean }> {
  try {
    const res = await fetch(`/api/comments/${encodeURIComponent(commentId)}/like`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: getUserId() }),
    });
    if (res.ok) return await res.json();
  } catch (err) { console.warn('Failed to toggle comment like', err); }
  return { likesCount: 0, userLiked: false };
}

export async function fetchRecentComments(): Promise<CommentItem[]> {
  try {
    const res = await fetch(`/api/community/comments/recent?userId=${encodeURIComponent(getUserId())}`);
    if (res.ok) { const data = await res.json(); return data.comments || []; }
  } catch (err) { console.warn('Failed to fetch recent comments', err); }
  return [];
}

