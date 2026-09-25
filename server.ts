import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    if (!title) {
      return res.status(400).json({ error: 'Book title is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured. Please check GEMINI_API_KEY in secrets.',
      });
    }

    const prompt = `You are a helpful, inspiring reading mentor.
Generate a motivating, clear, and practical book summary for:
Title: "${title}"
Author: "${author || 'Unknown'}"
Depth requested: "${depth}"

CRITICAL LANGUAGE REQUIREMENT:
- Use simple, everyday, friendly English (Grade 6-8 level).
- Do NOT use fancy, complex, or sophisticated words (avoid words like "transcendental", "dichotomy", "heuristics", "quintessential", "asymmetric leverage", "monastic", etc.).
- Explain ideas so clearly that anyone, including a beginner or non-native English speaker, can instantly understand and put them into practice today.

Create an actionable breakdown in JSON format.
Include:
1. title: Exact official title
2. author: Author name
3. category: Choose one from: "Mindset", "Productivity", "Resilience & Stoicism", "Wealth & Finance", "Leadership", "Habits", "Health & Energy"
4. readTimeMinutes: estimated reading time (5 to 10 minutes)
5. hook: A punchy 1-2 sentence hook in plain words explaining why this book matters
6. coreThesis: Clear explanation of the main lesson in simple everyday words (2 easy-to-read paragraphs)
7. keyTakeaways: Array of 4 items, each with:
   - title: Clear, simple concept name
   - insight: Simple, helpful explanation without jargon
   - practicalDrill: A practical 1-minute exercise the reader can do today
8. realLifeExample: A true story or clear example showing how someone used this idea in real life to solve a problem.
9. dailyMicroHabit: A specific 60-second micro-habit based on the book to start today
10. memorableQuote: The most famous or helpful quote from the book
11. visualContextPrompt: A simple, visual description of an image showing the main lesson
12. actionChecklist: Array of 3 simple, bulleted action steps.`;

    const response = await ai.models.generateContent({
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
            realLifeExample: { type: Type.STRING },
            dailyMicroHabit: { type: Type.STRING },
            memorableQuote: { type: Type.STRING },
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
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
