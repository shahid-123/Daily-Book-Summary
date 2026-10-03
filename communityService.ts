import fs from 'fs';
import path from 'path';

export interface StoredComment {
  id: string;
  bookId: string;
  bookTitle?: string;
  readerId: string;
  author: string;
  country?: string;
  state?: string;
  avatarColor: string;
  content: string;
  rating: number;
  tag: 'Key Takeaway' | 'Action Plan' | 'Book Review' | 'Daily Practice' | 'Question';
  likesCount: number;
  createdAt: string;
  userLikes: string[];
}

export interface ReaderProfile {
  id: string;
  displayName: string;
  country: string;
  state: string;
  yearlyGoal: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReaderBook {
  bookId: string;
  title: string;
  author: string;
  category: string;
  readAt: string;
  minutes: number;
}

interface CommunityData {
  totalVisits: number;
  todayVisits: number;
  lastDateStr: string;
  bookVisits: Record<string, number>;
  bookLikes: Record<string, number>;
  userBookLikes: Record<string, string[]>;
  comments: StoredComment[];
  readers: Record<string, ReaderProfile>;
  readerBooks: Record<string, ReaderBook[]>;
}

const ROOT_DIR = process.cwd();
const DATA_FILE = path.resolve(ROOT_DIR, 'community-data.json');
const AVATAR_COLORS = ['bg-amber-500','bg-blue-500','bg-emerald-500','bg-purple-500','bg-rose-500','bg-indigo-500','bg-teal-500','bg-orange-500'];
const INITIAL_DATA: CommunityData = {
  totalVisits: 0, todayVisits: 0, lastDateStr: new Date().toISOString().split('T')[0],
  bookVisits: {}, bookLikes: {}, userBookLikes: {}, comments: [], readers: {}, readerBooks: {},
};

let localData: CommunityData = loadLocalData();

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const cloudPersistenceEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

function loadLocalData(): CommunityData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      return {
        ...INITIAL_DATA,
        ...parsed,
        bookVisits: parsed.bookVisits || {}, bookLikes: parsed.bookLikes || {}, userBookLikes: parsed.userBookLikes || {},
        comments: Array.isArray(parsed.comments) ? parsed.comments : [],
        readers: parsed.readers || {}, readerBooks: parsed.readerBooks || {},
      };
    }
  } catch (err) { console.error('Error loading local community data:', err); }
  return { ...INITIAL_DATA };
}

function saveLocalData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(localData, null, 2), 'utf-8');
}

function checkDailyRollover() {
  const today = new Date().toISOString().split('T')[0];
  if (localData.lastDateStr !== today) {
    localData.todayVisits = 0;
    localData.lastDateStr = today;
  }
}

async function supabaseRequest<T = any>(table: string, init: RequestInit = {}, query = ''): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body.slice(0, 500)}`);
  }
  if (response.status === 204) return {} as T;
  return response.json();
}

function countFromContentRange(value: string | null): number {
  if (!value) return 0;
  const match = value.match(/\/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

async function cloudCount(table: string, filter = ''): Promise<number> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id${filter}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Range: '0-0',
      Prefer: 'count=exact',
    },
  });
  if (!response.ok) throw new Error(`Supabase count ${response.status}`);
  return countFromContentRange(response.headers.get('content-range'));
}

function localStats() {
  return {
    totalVisits: localData.totalVisits,
    todayVisits: localData.todayVisits,
    totalLikes: Object.values(localData.bookLikes).reduce((a, b) => a + b, 0),
    totalComments: localData.comments.length,
    activeReadersCount: localData.todayVisits,
  };
}

export async function getCommunityStats() {
  if (!cloudPersistenceEnabled) return localStats();
  const [visits, comments, likes] = await Promise.all([
    cloudCount('community_visits'),
    cloudCount('comments'),
    cloudCount('book_likes'),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const todayVisits = await cloudCount('community_visits', `&created_at=gte.${today}T00:00:00.000Z`);
  return { totalVisits: visits, todayVisits, totalLikes: likes, totalComments: comments, activeReadersCount: todayVisits };
}

export async function recordVisit(bookId?: string, isNewSession = false, userId?: string) {
  if (!cloudPersistenceEnabled) {
    checkDailyRollover();
    localData.totalVisits += 1;
    if (isNewSession || localData.todayVisits === 0) localData.todayVisits += 1;
    if (bookId) localData.bookVisits[bookId] = (localData.bookVisits[bookId] || 0) + 1;
    saveLocalData();
    return { ...localStats(), bookVisits: bookId ? localData.bookVisits[bookId] : undefined };
  }

  await supabaseRequest('community_visits', {
    method: 'POST',
    body: JSON.stringify({ reader_id: userId || null, book_id: bookId || null, is_new_session: !!isNewSession }),
    headers: { Prefer: 'return=minimal' },
  });

  // Keep the initial page load light: aggregate counters are fetched by the Community page.
  const cachedStats = { totalVisits: 0, todayVisits: 0, totalLikes: 0, totalComments: 0, activeReadersCount: 0 };
  if (bookId) {
    const bookVisits = await cloudCount('community_visits', `&book_id=eq.${encodeURIComponent(bookId)}`);
    return { ...cachedStats, bookVisits };
  }
  return cachedStats;
}

export async function getBookCommunity(bookId: string, userId?: string) {
  if (!cloudPersistenceEnabled) {
    const visits = localData.bookVisits[bookId] || 0;
    const likes = localData.bookLikes[bookId] || 0;
    const likedUsers = localData.userBookLikes[bookId] || [];
    const comments = localData.comments.filter(c => c.bookId === bookId).map(c => ({ ...c, userLiked: !!userId && c.userLikes.includes(userId) })).sort((a,b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return { bookId, visitsCount: visits, likesCount: likes, commentsCount: comments.length, userLiked: !!userId && likedUsers.includes(userId), comments };
  }

  const [visits, likesRows, comments] = await Promise.all([
    cloudCount('community_visits', `&book_id=eq.${encodeURIComponent(bookId)}`),
    supabaseRequest<any[]>('book_likes', {}, `?select=reader_id&book_id=eq.${encodeURIComponent(bookId)}`),
    supabaseRequest<any[]>('comments', {}, `?select=id,book_id,book_title,reader_id,author,country,state,avatar_color,content,rating,tag,likes_count,created_at&book_id=eq.${encodeURIComponent(bookId)}&order=created_at.desc&limit=50`),
  ]);

  const commentIds = comments.map(c => c.id);
  let likedCommentIds = new Set<string>();
  if (userId && commentIds.length) {
    const rows = await supabaseRequest<any[]>('comment_likes', {}, `?select=comment_id&reader_id=eq.${encodeURIComponent(userId)}&comment_id=in.(${commentIds.map(id => encodeURIComponent(id)).join(',')})`);
    likedCommentIds = new Set(rows.map(r => r.comment_id));
  }

  return {
    bookId,
    visitsCount: visits,
    likesCount: likesRows.length,
    commentsCount: comments.length,
    userLiked: !!userId && likesRows.some(r => r.reader_id === userId),
    comments: comments.map(c => ({
      id: c.id, bookId: c.book_id, bookTitle: c.book_title, readerId: c.reader_id, author: c.author,
      country: c.country, state: c.state, avatarColor: c.avatar_color, content: c.content, rating: c.rating,
      tag: c.tag, likesCount: c.likes_count || 0, createdAt: c.created_at, userLiked: likedCommentIds.has(c.id),
    })),
  };
}

export async function toggleBookLike(bookId: string, userId: string, bookTitle?: string) {
  if (!cloudPersistenceEnabled) {
    localData.bookLikes[bookId] = localData.bookLikes[bookId] || 0;
    localData.userBookLikes[bookId] = localData.userBookLikes[bookId] || [];
    const users = localData.userBookLikes[bookId];
    const idx = users.indexOf(userId);
    const userLiked = idx < 0;
    if (userLiked) { users.push(userId); localData.bookLikes[bookId] += 1; }
    else { users.splice(idx, 1); localData.bookLikes[bookId] = Math.max(0, localData.bookLikes[bookId] - 1); }
    saveLocalData();
    return { bookId, likesCount: localData.bookLikes[bookId], userLiked };
  }

  const existing = await supabaseRequest<any[]>('book_likes', {}, `?select=reader_id&book_id=eq.${encodeURIComponent(bookId)}&reader_id=eq.${encodeURIComponent(userId)}&limit=1`);
  if (existing.length) {
    await supabaseRequest('book_likes', { method: 'DELETE' }, `?book_id=eq.${encodeURIComponent(bookId)}&reader_id=eq.${encodeURIComponent(userId)}`);
  } else {
    await supabaseRequest('book_likes', { method: 'POST', body: JSON.stringify({ book_id: bookId, reader_id: userId, book_title: bookTitle || null }), headers: { Prefer: 'return=minimal' } });
  }
  const likesCount = await cloudCount('book_likes', `&book_id=eq.${encodeURIComponent(bookId)}`);
  return { bookId, likesCount, userLiked: !existing.length };
}

export async function addBookComment(bookId: string, data: { author: string; content: string; rating: number; tag?: string; userId: string; bookTitle?: string; country?: string; state?: string; }) {
  const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  const id = 'cmt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  const base = { id, book_id: bookId, book_title: data.bookTitle || null, reader_id: data.userId, author: data.author.trim() || 'Reader', country: data.country || null, state: data.state || null, avatar_color: color, content: data.content.trim(), rating: Math.min(5, Math.max(1, data.rating || 5)), tag: data.tag || 'Key Takeaway', likes_count: 0, created_at: new Date().toISOString() };

  if (!cloudPersistenceEnabled) {
    const comment: StoredComment = { id, bookId, bookTitle: data.bookTitle, readerId: data.userId, author: base.author, country: data.country, state: data.state, avatarColor: color, content: base.content, rating: base.rating, tag: base.tag as any, likesCount: 0, createdAt: base.created_at, userLikes: [] };
    localData.comments.unshift(comment); saveLocalData(); return { ...comment, userLiked: false };
  }

  await supabaseRequest('comments', { method: 'POST', body: JSON.stringify(base), headers: { Prefer: 'return=minimal' } });
  return { id, bookId, bookTitle: data.bookTitle, author: base.author, country: data.country, state: data.state, avatarColor: color, content: base.content, rating: base.rating, tag: base.tag, likesCount: 0, createdAt: base.created_at, userLiked: false };
}

export async function toggleCommentLike(commentId: string, userId: string) {
  if (!cloudPersistenceEnabled) {
    const comment = localData.comments.find(c => c.id === commentId);
    if (!comment) return { likesCount: 0, userLiked: false };
    const idx = comment.userLikes.indexOf(userId);
    const userLiked = idx < 0;
    if (userLiked) { comment.userLikes.push(userId); comment.likesCount += 1; }
    else { comment.userLikes.splice(idx, 1); comment.likesCount = Math.max(0, comment.likesCount - 1); }
    saveLocalData(); return { commentId, likesCount: comment.likesCount, userLiked };
  }

  const existing = await supabaseRequest<any[]>('comment_likes', {}, `?select=reader_id&comment_id=eq.${encodeURIComponent(commentId)}&reader_id=eq.${encodeURIComponent(userId)}&limit=1`);
  if (existing.length) {
    await supabaseRequest('comment_likes', { method: 'DELETE' }, `?comment_id=eq.${encodeURIComponent(commentId)}&reader_id=eq.${encodeURIComponent(userId)}`);
  } else {
    await supabaseRequest('comment_likes', { method: 'POST', body: JSON.stringify({ comment_id: commentId, reader_id: userId }), headers: { Prefer: 'return=minimal' } });
  }
  const likesCount = await cloudCount('comment_likes', `&comment_id=eq.${encodeURIComponent(commentId)}`);
  await supabaseRequest('comments', { method: 'PATCH', body: JSON.stringify({ likes_count: likesCount }) }, `?id=eq.${encodeURIComponent(commentId)}`);
  return { commentId, likesCount, userLiked: !existing.length };
}

export async function getRecentComments(limit = 25, userId?: string) {
  if (!cloudPersistenceEnabled) return localData.comments.slice(0, limit).map(c => ({ ...c, userLiked: !!userId && c.userLikes.includes(userId) }));
  const comments = await supabaseRequest<any[]>('comments', {}, `?select=id,book_id,book_title,reader_id,author,country,state,avatar_color,content,rating,tag,likes_count,created_at&order=created_at.desc&limit=${Math.min(100, limit)}`);
  let liked = new Set<string>();
  if (userId && comments.length) {
    const ids = comments.map(c => c.id);
    const rows = await supabaseRequest<any[]>('comment_likes', {}, `?select=comment_id&reader_id=eq.${encodeURIComponent(userId)}&comment_id=in.(${ids.map(id => encodeURIComponent(id)).join(',')})`);
    liked = new Set(rows.map(r => r.comment_id));
  }
  return comments.map(c => ({
    id: c.id, bookId: c.book_id, bookTitle: c.book_title, readerId: c.reader_id, author: c.author,
    country: c.country, state: c.state, avatarColor: c.avatar_color, content: c.content, rating: c.rating,
    tag: c.tag, likesCount: c.likes_count || 0, createdAt: c.created_at, userLiked: liked.has(c.id),
  }));
}

export async function upsertReaderProfile(profile: ReaderProfile) {
  if (!cloudPersistenceEnabled) { localData.readers[profile.id] = profile; saveLocalData(); return profile; }
  await supabaseRequest('readers', { method: 'POST', body: JSON.stringify({ id: profile.id, display_name: profile.displayName, country: profile.country, state: profile.state, yearly_goal: profile.yearlyGoal, created_at: profile.createdAt, updated_at: profile.updatedAt }), headers: { Prefer: 'resolution=merge-duplicates,return=minimal' } }, '?on_conflict=id');
  return profile;
}

export async function getReaderProfile(readerId: string): Promise<ReaderProfile | null> {
  if (!cloudPersistenceEnabled) return localData.readers[readerId] || null;
  const rows = await supabaseRequest<any[]>('readers', {}, `?select=id,display_name,country,state,yearly_goal,created_at,updated_at&id=eq.${encodeURIComponent(readerId)}&limit=1`);
  if (!rows.length) return null;
  const r = rows[0];
  return { id: r.id, displayName: r.display_name, country: r.country, state: r.state, yearlyGoal: r.yearly_goal, createdAt: r.created_at, updatedAt: r.updated_at };
}

export async function getReaderBooks(readerId: string): Promise<ReaderBook[]> {
  if (!cloudPersistenceEnabled) return localData.readerBooks[readerId] || [];
  const rows = await supabaseRequest<any[]>('reader_books', {}, `?select=book_id,title,author,category,read_at,minutes&reader_id=eq.${encodeURIComponent(readerId)}&order=read_at.desc`);
  return rows.map(r => ({ bookId: r.book_id, title: r.title, author: r.author, category: r.category, readAt: r.read_at, minutes: r.minutes || 0 }));
}

export async function markReaderBookCompleted(readerId: string, book: { bookId: string; title: string; author: string; category: string; minutes: number }) {
  const readAt = new Date().toISOString();
  if (!cloudPersistenceEnabled) {
    const existing = localData.readerBooks[readerId] || [];
    if (!existing.some(b => b.bookId === book.bookId)) {
      localData.readerBooks[readerId] = [{ ...book, readAt }, ...existing];
      saveLocalData();
    }
    return { success: true, alreadyRead: existing.some(b => b.bookId === book.bookId), readAt };
  }
  const existing = await supabaseRequest<any[]>('reader_books', {}, `?select=book_id&reader_id=eq.${encodeURIComponent(readerId)}&book_id=eq.${encodeURIComponent(book.bookId)}&limit=1`);
  if (!existing.length) {
    await supabaseRequest('reader_books', { method: 'POST', body: JSON.stringify({ reader_id: readerId, book_id: book.bookId, title: book.title, author: book.author, category: book.category, read_at: readAt, minutes: book.minutes }), headers: { Prefer: 'return=minimal' } });
  }
  return { success: true, alreadyRead: !!existing.length, readAt };
}

export async function getReaderSummary(readerId: string) {
  const profile = await getReaderProfile(readerId);
  const books = await getReaderBooks(readerId);
  return { profile, books, booksReadCount: books.length };
}
