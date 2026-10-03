import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import {
  getCommunityStats,
  recordVisit,
  getBookCommunity,
  toggleBookLike,
  addBookComment,
  toggleCommentLike,
  getRecentComments,
  upsertReaderProfile,
  getReaderProfile,
  getReaderSummary,
  markReaderBookCompleted,
  cloudPersistenceEnabled,
} from './communityService';

dotenv.config();

const ROOT_DIR = process.cwd();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!apiKey });
});

// Endpoint: Generate custom book summary of user's choice
app.post('/api/generate-summary', async (req, res) => {
  try {
    const { title, author, depth = 'detailed' } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Book title is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured. Please check GEMINI_API_KEY in secrets.',
      });
    }

    const cleanTitle = title.trim();
    const cleanAuthor = author ? author.trim() : 'Unknown';

    const prompt = `You are an expert reading mentor and literary researcher.
Generate a motivating, crystal-clear, and 100% book-specific summary for:
Title: "${cleanTitle}"
Author: "${cleanAuthor}"
Depth requested: "${depth}"

STRICT GROUNDING & ZERO CONTENT MIXING RULES (CRITICAL):
1. 100% BOOK-SPECIFICITY:
- Every concept, takeaway, real-life story, quote, and habit MUST be strictly and authentically from "${cleanTitle}" by "${cleanAuthor}".
- Absolutely NEVER borrow, mix, or blend stories, studies, or examples from other popular books!
- Specifically:
  * Do NOT use the British Cycling team / Dave Brailsford unless the book is specifically "Atomic Habits".
  * Do NOT use Ronald Read the janitor unless the book is specifically "The Psychology of Money".
  * Do NOT use J.K. Rowling writing in a hotel unless the book is specifically "Deep Work".
  * Do NOT use Viktor Frankl in a concentration camp unless the book is specifically "Man's Search for Meaning".
  * Do NOT use Navy SEAL / 40% rule / 100-mile race unless the book is specifically "Can't Hurt Me".
  * Do NOT use Steve Jobs or generic corporate boardroom stories unless specifically the central subject of this exact book.
- Use the actual trademark terms, proprietary frameworks, and coined concepts from "${cleanTitle}" (e.g. for Thinking Fast & Slow: System 1 & 2, availability heuristic; for 7 Habits: Circle of Influence, Paradigm Shift; for Start With Why: The Golden Circle; for Zero to One: 0 to 1 vs 1 to n, Definite Optimism; for Grit: Grit Scale, deliberate practice).

2. REAL-LIFE EXAMPLE REQUIREMENTS:
- Must be an authentic, real-life experiment, historical event, biographical story, or case study ACTUALLY featured in or famous for "${cleanTitle}".
- title: A specific headline naming the actual person, study, or event (e.g. "Daniel Kahneman's Flight Instructor Feedback Study", "The Wright Brothers vs. Samuel Langley's $50,000 Budget", "Stephen Covey's Subway Carriage Paradigm Shift").
- story: A detailed, step-by-step narrative describing the real context, dilemma, what happened, and how it proves the core thesis.
- takeawayLesson: A clear, simple explanation of the practical moral of this exact story.

3. MEMORABLE QUOTE REQUIREMENTS:
- quote: An authentic, verifiable famous quote genuinely written or spoken by ${cleanAuthor} in "${cleanTitle}".
- context: The specific chapter, section, or concept in the book where this quote appears.

4. LANGUAGE & SIMPLICITY:
- Use simple, everyday, friendly English (Grade 6-8 level).
- Explain deep concepts so clearly that anyone, including a beginner or non-native English speaker, can instantly understand and apply them today.

5. CATEGORY:
- Choose the single best fit from: "Mindset", "Productivity", "Resilience & Stoicism", "Wealth & Mastery", "Leadership", "Habits", "High Performance".`;

    let response: any = null;
    let lastError: any = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING },
                category: { type: Type.STRING },
                readTimeMinutes: { type: Type.INTEGER },
                hook: { type: Type.STRING },
                coreThesis: { type: Type.STRING },
                keyTakeaways: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      insight: { type: Type.STRING },
                      practicalDrill: { type: Type.STRING },
                    },
                    required: ['title', 'insight', 'practicalDrill'],
                  },
                },
                realLifeExample: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    story: { type: Type.STRING },
                    takeawayLesson: { type: Type.STRING },
                  },
                  required: ['title', 'story', 'takeawayLesson'],
                },
                dailyMicroHabit: { type: Type.STRING },
                memorableQuote: {
                  type: Type.OBJECT,
                  properties: {
                    quote: { type: Type.STRING },
                    context: { type: Type.STRING },
                  },
                  required: ['quote', 'context'],
                },
                visualContextPrompt: { type: Type.STRING },
                actionChecklist: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'title',
                'author',
                'category',
                'readTimeMinutes',
                'hook',
                'coreThesis',
                'keyTakeaways',
                'realLifeExample',
                'dailyMicroHabit',
                'memorableQuote',
                'actionChecklist',
              ],
            },
          },
        });
        if (response && response.text) break;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        if (attempt < 2 && (msg.includes('503') || msg.includes('429') || msg.includes('high demand') || msg.includes('UNAVAILABLE'))) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          continue;
        }
        throw err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('Empty response from model');
    }

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, summary: parsedData });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate book summary' });
  }
});

// Endpoint: Personalized book recommendations based on user reading history
app.post('/api/recommendations', async (req, res) => {
  try {
    const { readBooks = [], favoriteCategories = [] } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured.',
      });
    }

    const prompt = `You are a friendly personal reading guide.
User reading history:
- Finished Books: ${JSON.stringify(readBooks.map((b: any) => ({ title: b.title, author: b.author, category: b.category })))}
- Favorite Categories: ${JSON.stringify(favoriteCategories)}

Based on what they have read so far, recommend 4 great motivational books that will help them reach their 100-book reading goal this year.

LANGUAGE REQUIREMENT:
- Use simple, warm, everyday English. Do not use fancy or difficult words.
- Keep explanations clear, uplifting, and easy to read.

Return JSON array of 4 recommendations with:
1. title: Book title
2. author: Author name
3. category: Category
4. reason: A simple 2-sentence explanation of why they will enjoy it based on their past books ("Since you enjoyed...")
5. keyLesson: The main life lesson in simple words
6. estimatedMinutes: Reading time (minutes)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              category: { type: Type.STRING },
              reason: { type: Type.STRING },
              keyLesson: { type: Type.STRING },
              estimatedMinutes: { type: Type.INTEGER },
            },
            required: ['title', 'author', 'category', 'reason', 'keyLesson', 'estimatedMinutes'],
          },
        },
      },
    });

    const recommendations = JSON.parse(response.text || '[]');
    return res.json({ success: true, recommendations });
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    return res.status(500).json({ error: error.message || 'Failed to get recommendations' });
  }
});

// Endpoint: Multi-language translation of book summary
app.post('/api/translate-summary', async (req, res) => {
  try {
    const { summary, targetLanguage } = req.body;
    if (!summary || !targetLanguage) {
      return res.status(400).json({ error: 'Summary and targetLanguage are required' });
    }

    if (targetLanguage.toLowerCase() === 'english' || targetLanguage.toLowerCase() === 'en') {
      return res.json({ success: true, translatedSummary: summary });
    }

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API not configured' });
    }

    const prompt = `Translate this motivational book summary into ${targetLanguage}.
Use very simple, easy-to-understand, friendly everyday language (Grade 6-8 reading level).
Do not use complicated or difficult words. Make it crystal clear for any reader.
Translate every single field accurately into natural ${targetLanguage}:
- title
- hook
- coreThesis
- keyTakeaways (title, insight, practicalDrill for each item)
- realLifeExample (title, story, takeawayLesson)
- dailyMicroHabit
- memorableQuote (quote, context)
- actionChecklist (each item)

Original Summary:
${JSON.stringify(summary, null, 2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            coreThesis: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  insight: { type: Type.STRING },
                  practicalDrill: { type: Type.STRING },
                },
                required: ['title', 'insight', 'practicalDrill'],
              },
            },
            realLifeExample: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                story: { type: Type.STRING },
                takeawayLesson: { type: Type.STRING },
              },
              required: ['title', 'story', 'takeawayLesson'],
            },
            dailyMicroHabit: { type: Type.STRING },
            memorableQuote: {
              type: Type.OBJECT,
              properties: {
                quote: { type: Type.STRING },
                context: { type: Type.STRING },
              },
              required: ['quote', 'context'],
            },
            actionChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'title',
            'hook',
            'coreThesis',
            'keyTakeaways',
            'realLifeExample',
            'dailyMicroHabit',
            'memorableQuote',
            'actionChecklist',
          ],
        },
      },
    });

    const translatedFields = JSON.parse(response.text || '{}');
    const fullTranslated = {
      ...summary,
      ...translatedFields,
      language: targetLanguage,
    };

    return res.json({ success: true, translatedSummary: fullTranslated });
  } catch (error: any) {
    console.error('Error translating summary:', error);
    return res.status(500).json({ error: error.message || 'Translation failed' });
  }
});

// Community, Visits, Likes, and Comments Endpoints
app.get('/api/community/stats', async (req, res) => {
  try {
    const stats = await getCommunityStats();
    res.json(stats);
  } catch (err: any) {
    console.error('Error fetching community stats:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

app.post('/api/community/visit', async (req, res) => {
  try {
    const { bookId, isNewSession, userId } = req.body;
    const result = await recordVisit(bookId, !!isNewSession, userId);
    res.json(result);
  } catch (err: any) {
    console.error('Error recording visit:', err);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

app.get('/api/books/:bookId/community', async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.query.userId as string | undefined;
    const data = await getBookCommunity(bookId, userId);
    res.json(data);
  } catch (err: any) {
    console.error('Error fetching book community:', err);
    res.status(500).json({ error: 'Failed to fetch book community' });
  }
});

app.post('/api/books/:bookId/like', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId, bookTitle } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const result = await toggleBookLike(bookId, userId, bookTitle);
    res.json(result);
  } catch (err: any) {
    console.error('Error toggling book like:', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

app.post('/api/books/:bookId/comments', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { author, content, rating, tag, userId, bookTitle, country, state } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }
    const comment = await addBookComment(bookId, {
      author: author || 'Passionate Reader',
      content,
      rating: Number(rating) || 5,
      tag,
      userId: userId || 'anonymous',
      bookTitle,
      country,
      state,
    });
    res.json({ success: true, comment });
  } catch (err: any) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

app.post('/api/comments/:commentId/like', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const result = await toggleCommentLike(commentId, userId);
    res.json(result);
  } catch (err: any) {
    console.error('Error toggling comment like:', err);
    res.status(500).json({ error: 'Failed to toggle comment like' });
  }
});

app.get('/api/community/comments/recent', async (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    const limit = Number(req.query.limit) || 25;
    const comments = await getRecentComments(limit, userId);
    res.json({ comments });
  } catch (err: any) {
    console.error('Error fetching recent comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Reader profiles and personal reading journey
app.get('/api/readers/:readerId', async (req, res) => {
  try {
    const profile = await getReaderProfile(req.params.readerId);
    res.json({ profile, cloudPersistenceEnabled });
  } catch (err: any) {
    console.error('Error fetching reader profile:', err);
    res.status(500).json({ error: 'Failed to fetch reader profile' });
  }
});

app.post('/api/readers/:readerId', async (req, res) => {
  try {
    const { displayName, country, state, yearlyGoal } = req.body;
    if (req.params.readerId !== req.body.id) return res.status(400).json({ error: 'Reader ID mismatch' });
    if (!displayName?.trim() || !country?.trim() || !state?.trim()) return res.status(400).json({ error: 'Name, country and state are required' });
    const profile = await upsertReaderProfile({
      id: req.params.readerId,
      displayName: displayName.trim(),
      country: country.trim(),
      state: state.trim(),
      yearlyGoal: Math.min(1000, Math.max(1, Number(yearlyGoal) || 100)),
      createdAt: req.body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true, profile });
  } catch (err: any) {
    console.error('Error saving reader profile:', err);
    res.status(500).json({ error: 'Failed to save reader profile' });
  }
});

app.get('/api/readers/:readerId/summary', async (req, res) => {
  try {
    res.json(await getReaderSummary(req.params.readerId));
  } catch (err: any) {
    console.error('Error fetching reader summary:', err);
    res.status(500).json({ error: 'Failed to fetch reader summary' });
  }
});

app.post('/api/readers/:readerId/books', async (req, res) => {
  try {
    const { bookId, title, author, category, minutes } = req.body;
    if (!bookId || !title || !author) return res.status(400).json({ error: 'Book information is required' });
    const result = await markReaderBookCompleted(req.params.readerId, {
      bookId, title, author, category: category || 'Mindset', minutes: Number(minutes) || 0,
    });
    res.json(result);
  } catch (err: any) {
    console.error('Error saving completed book:', err);
    res.status(500).json({ error: 'Failed to save completed book' });
  }
});

// Setup Vite dev server or serve production build
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(ROOT_DIR, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

