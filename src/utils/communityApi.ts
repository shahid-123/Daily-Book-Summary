import { BookCommunityData, CommentItem, CommunityOverviewStats, CommentTag } from '../types';

const USER_ID_KEY = 'pulse_reader_user_id';
const USER_NAME_KEY = 'pulse_reader_display_name';
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
  } catch {
    return 'reader_guest';
  }
}

export function getUserName(): string {
  try {
    return localStorage.getItem(USER_NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function setUserName(name: string): void {
  try {
    localStorage.setItem(USER_NAME_KEY, name.trim());
  } catch {
    // ignore
  }
}

export function getLocalCommunityStats(): CommunityOverviewStats {
  try {
    const raw = localStorage.getItem(STATS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.totalVisits === 'number' && parsed.totalVisits > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {
    totalVisits: 1,
    todayVisits: 1,
    totalLikes: 0,
    totalComments: 0,
    activeReadersCount: 1,
  };
}

export function saveLocalCommunityStats(stats: CommunityOverviewStats): void {
  try {
    localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

// Global community stats
export async function fetchCommunityStats(): Promise<CommunityOverviewStats> {
  try {
    const res = await fetch('/api/community/stats');
    if (res.ok) {
      const data = await res.json();
      saveLocalCommunityStats(data);
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch community stats from server, using fallback', err);
  }

  return getLocalCommunityStats();
}

// Record a page or book visit
export async function recordVisit(bookId?: string): Promise<CommunityOverviewStats & { bookVisits?: number }> {
  const isNewSession = !sessionStorage.getItem(VISITED_SESSION_KEY);
  if (isNewSession) {
    sessionStorage.setItem(VISITED_SESSION_KEY, 'true');
  }

  try {
    const res = await fetch('/api/community/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId,
        isNewSession,
        userId: getUserId(),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const updated: CommunityOverviewStats = {
        totalVisits: typeof data.totalVisits === 'number' ? data.totalVisits : 1,
        todayVisits: typeof data.todayVisits === 'number' ? data.todayVisits : 1,
        totalLikes: data.totalLikes ?? 0,
        totalComments: data.totalComments ?? 0,
        activeReadersCount: data.activeReadersCount ?? data.todayVisits ?? 1,
      };
      saveLocalCommunityStats(updated);
      return { ...updated, bookVisits: data.bookVisits };
    }
  } catch (err) {
    console.warn('Failed to record visit on server, using local fallback', err);
  }

  const local = getLocalCommunityStats();
  const next: CommunityOverviewStats = {
    ...local,
    totalVisits: Math.max(1, local.totalVisits + (isNewSession ? 1 : 0)),
    todayVisits: Math.max(1, local.todayVisits + (isNewSession ? 1 : 0)),
    activeReadersCount: Math.max(1, local.activeReadersCount),
  };
  saveLocalCommunityStats(next);
  return next;
}

// Fetch community data for a specific book
export async function fetchBookCommunityData(bookId: string): Promise<BookCommunityData> {
  const userId = getUserId();
  try {
    const res = await fetch(`/api/books/${encodeURIComponent(bookId)}/community?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch book community data', err);
  }

  // Fallback data
  return {
    bookId,
    likesCount: 0,
    visitsCount: 0,
    commentsCount: 0,
    userLiked: false,
    comments: [],
  };
}

// Toggle book like
export async function toggleBookLike(
  bookId: string,
  bookTitle?: string
): Promise<{ likesCount: number; userLiked: boolean }> {
  const userId = getUserId();
  try {
    const res = await fetch(`/api/books/${encodeURIComponent(bookId)}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, bookTitle }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to toggle like', err);
  }

  return { likesCount: 0, userLiked: false };
}

// Add a new comment
export async function postBookComment(
  bookId: string,
  bookTitle: string,
  comment: {
    author: string;
    content: string;
    rating: number;
    tag?: CommentTag;
  }
): Promise<{ success: boolean; comment: CommentItem; totalComments: number }> {
  const userId = getUserId();
  if (comment.author) {
    setUserName(comment.author);
  }

  try {
    const res = await fetch(`/api/books/${encodeURIComponent(bookId)}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...comment,
        userId,
        bookTitle,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to post comment', err);
  }

  // Fallback optimistic comment
  const fallbackComment: CommentItem = {
    id: 'local_' + Date.now(),
    bookId,
    bookTitle,
    author: comment.author || 'Avid Reader',
    content: comment.content,
    rating: comment.rating || 5,
    tag: comment.tag || 'Key Takeaway',
    likesCount: 1,
    createdAt: new Date().toISOString(),
    userLiked: true,
  };

  return {
    success: true,
    comment: fallbackComment,
    totalComments: 1,
  };
}

// Toggle like on a comment
export async function toggleCommentLike(
  commentId: string
): Promise<{ likesCount: number; userLiked: boolean }> {
  const userId = getUserId();
  try {
    const res = await fetch(`/api/comments/${encodeURIComponent(commentId)}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to toggle comment like', err);
  }

  return { likesCount: 1, userLiked: true };
}

// Get recent comments across the community
export async function fetchRecentComments(): Promise<CommentItem[]> {
  const userId = getUserId();
  try {
    const res = await fetch(`/api/community/comments/recent?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      return data.comments || [];
    }
  } catch (err) {
    console.warn('Failed to fetch recent comments', err);
  }
  return [];
}
