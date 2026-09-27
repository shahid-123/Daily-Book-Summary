import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, 'community-data.json');

export interface StoredComment {
  id: string;
  bookId: string;
  bookTitle?: string;
  author: string;
  avatarColor: string;
  content: string;
  rating: number;
  tag: 'Key Takeaway' | 'Action Plan' | 'Book Review' | 'Daily Practice' | 'Question';
  likesCount: number;
  createdAt: string;
  userLikes: string[];
}

export interface CommunityData {
  totalVisits: number;
  todayVisits: number;
  lastDateStr: string;
  bookVisits: Record<string, number>;
  bookLikes: Record<string, number>;
  userBookLikes: Record<string, string[]>;
  comments: StoredComment[];
}

const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
];

const INITIAL_DATA: CommunityData = {
  totalVisits: 0,
  todayVisits: 0,
  lastDateStr: new Date().toISOString().split('T')[0],
  bookVisits: {},
  bookLikes: {},
  userBookLikes: {},
  comments: [],
};

let communityData: CommunityData = loadData();

function loadData(): CommunityData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_DATA,
        ...parsed,
        bookVisits: parsed.bookVisits || {},
        bookLikes: parsed.bookLikes || {},
        userBookLikes: parsed.userBookLikes || {},
        comments: Array.isArray(parsed.comments) ? parsed.comments : [],
      };
    }
  } catch (err) {
    console.error('Error loading community data from disk, using defaults', err);
  }
  return { ...INITIAL_DATA };
}

function saveData(): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(communityData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving community data to disk', err);
  }
}

// Reset today visits on a new calendar day
function checkDailyRollover(): void {
  const todayStr = new Date().toISOString().split('T')[0];
  if (communityData.lastDateStr !== todayStr) {
    communityData.lastDateStr = todayStr;
    communityData.todayVisits = 0;
    saveData();
  }
}

// Global stats - 100% genuine
export function getCommunityStats() {
  checkDailyRollover();
  const totalLikes = Object.values(communityData.bookLikes).reduce((a, b) => a + b, 0);
  const totalComments = communityData.comments.length;
  const activeReadersCount = communityData.todayVisits;

  return {
    totalVisits: communityData.totalVisits,
    todayVisits: communityData.todayVisits,
    totalLikes,
    totalComments,
    activeReadersCount,
  };
}

// Record visit - 100% genuine
export function recordVisit(bookId?: string, isNewSession = false) {
  checkDailyRollover();
  communityData.totalVisits += 1;
  if (isNewSession) {
    communityData.todayVisits += 1;
  }

  if (bookId) {
    communityData.bookVisits[bookId] = (communityData.bookVisits[bookId] || 0) + 1;
  }

  saveData();
  return {
    totalVisits: communityData.totalVisits,
    todayVisits: communityData.todayVisits,
    bookVisits: bookId ? communityData.bookVisits[bookId] : undefined,
  };
}

// Get book community stats and comments - 100% genuine
export function getBookCommunity(bookId: string, userId?: string) {
  const visits = communityData.bookVisits[bookId] || 0;
  const likes = communityData.bookLikes[bookId] || 0;
  const likedUsers = communityData.userBookLikes[bookId] || [];
  const userLiked = userId ? likedUsers.includes(userId) : false;

  const comments = communityData.comments
    .filter((c) => c.bookId === bookId)
    .map((c) => ({
      ...c,
      userLiked: userId ? c.userLikes.includes(userId) : false,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    bookId,
    visitsCount: visits,
    likesCount: likes,
    commentsCount: comments.length,
    userLiked,
    comments,
  };
}

// Toggle book like - 100% genuine
export function toggleBookLike(bookId: string, userId: string, bookTitle?: string) {
  if (!communityData.bookLikes[bookId]) {
    communityData.bookLikes[bookId] = 0;
  }
  if (!communityData.userBookLikes[bookId]) {
    communityData.userBookLikes[bookId] = [];
  }

  const userList = communityData.userBookLikes[bookId];
  const idx = userList.indexOf(userId);
  let userLiked = false;

  if (idx >= 0) {
    userList.splice(idx, 1);
    communityData.bookLikes[bookId] = Math.max(0, communityData.bookLikes[bookId] - 1);
    userLiked = false;
  } else {
    userList.push(userId);
    communityData.bookLikes[bookId] += 1;
    userLiked = true;
  }

  saveData();
  return {
    bookId,
    likesCount: communityData.bookLikes[bookId],
    userLiked,
  };
}

// Add comment to book - 100% genuine user submitted
export function addBookComment(
  bookId: string,
  data: {
    author: string;
    content: string;
    rating: number;
    tag?: string;
    userId: string;
    bookTitle?: string;
  }
) {
  const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  const newComment: StoredComment = {
    id: 'cmt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    bookId,
    bookTitle: data.bookTitle,
    author: data.author.trim() || 'Reader',
    avatarColor: color,
    content: data.content.trim(),
    rating: Math.min(5, Math.max(1, data.rating || 5)),
    tag: (data.tag as any) || 'Key Takeaway',
    likesCount: 0,
    createdAt: new Date().toISOString(),
    userLikes: [],
  };

  communityData.comments.unshift(newComment);
  saveData();

  return {
    ...newComment,
    userLiked: false,
  };
}

// Toggle like on a comment - 100% genuine
export function toggleCommentLike(commentId: string, userId: string) {
  const comment = communityData.comments.find((c) => c.id === commentId);
  if (!comment) {
    return { likesCount: 0, userLiked: false };
  }

  const idx = comment.userLikes.indexOf(userId);
  let userLiked = false;
  if (idx >= 0) {
    comment.userLikes.splice(idx, 1);
    comment.likesCount = Math.max(0, comment.likesCount - 1);
    userLiked = false;
  } else {
    comment.userLikes.push(userId);
    comment.likesCount += 1;
    userLiked = true;
  }

  saveData();
  return {
    commentId,
    likesCount: comment.likesCount,
    userLiked,
  };
}

// Get recent comments across the whole app - only genuine user comments
export function getRecentComments(limit = 25, userId?: string) {
  return communityData.comments
    .slice(0, limit)
    .map((c) => ({
      ...c,
      userLiked: userId ? c.userLikes.includes(userId) : false,
    }));
}
