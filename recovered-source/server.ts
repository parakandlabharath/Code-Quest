import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_LEADERBOARD } from './src/data/leaderboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory Leaderboard store
let leaderboardStore = [...INITIAL_LEADERBOARD];

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// API: Get Leaderboard
app.get('/api/leaderboard', (req, res) => {
  res.json({ success: true, leaderboard: leaderboardStore });
});

// API: Submit Score to Leaderboard
app.post('/api/leaderboard', (req, res) => {
  const { username, avatar, titleBadge, xp, level, solvedPuzzles, streakDays, funnyBio } = req.body;
  
  if (!username) {
    return res.status(400).json({ success: false, error: 'Username is required' });
  }

  const existingIdx = leaderboardStore.findIndex(
    (e) => e.username.toLowerCase() === username.toLowerCase()
  );

  const newEntry = {
    id: existingIdx >= 0 ? leaderboardStore[existingIdx].id : 'user_' + Date.now(),
    username,
    avatar: avatar || '🚀',
    titleBadge: titleBadge || 'Keyboard Warrior',
    xp: xp || 100,
    level: level || 1,
    solvedPuzzles: solvedPuzzles || 1,
    streakDays: streakDays || 1,
    funnyBio: funnyBio || 'Ready to fix bugs & eat pizza!',
    rank: 0
  };

  if (existingIdx >= 0) {
    leaderboardStore[existingIdx] = { ...leaderboardStore[existingIdx], ...newEntry };
  } else {
    leaderboardStore.push(newEntry);
  }

  // Sort by XP descending and re-rank
  leaderboardStore.sort((a, b) => b.xp - a.xp);
  leaderboardStore = leaderboardStore.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));

  res.json({ success: true, leaderboard: leaderboardStore, userEntry: newEntry });
});

// API: AI Coach Funny Hint Generator
app.post('/api/ai/hint', async (req, res) => {
  try {
    const { challengeTitle, challengeDescription, currentCode, persona, difficulty } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Friendly fallback if GEMINI_API_KEY is not yet configured
      return res.json({
        success: true,
        hintTitle: '💡 Friendly Hint',
        hintText: 'Check your syntax! Make sure you convert inputs into numbers using Number() or parseInt() and verify boundary conditions.',
        funnyQuote: 'Even the greatest coders started with a single semicolon error!'
      });
    }

    const personaPrompts: Record<string, string> = {
      meme_cat: 'You are "Barnaby the Meme Cat", a funny cat coding coach. Use cat analogies, meows, and playful humor.',
      grumpy_compiler: 'You are "Grumpy Compiler", a sarcastic but hilarious compiler. Roast the user\'s mistake gently while giving the exact key trick.',
      cozy_grandma: 'You are "Grandma Grace", a sweet grandma offering warm baking analogies for coding concepts.',
      sarcastic_bot: 'You are "Bot 9000", a humorous sci-fi AI who finds human code bugs amusing.'
    };

    const prompt = `
Context: You are helping a user solve a coding challenge on a gamified, friendly platform.
Persona: ${personaPrompts[persona] || personaPrompts.meme_cat}
Challenge Title: "${challengeTitle}"
Challenge Description: "${challengeDescription}"
User Difficulty: ${difficulty || 'beginner'}
User's Current Code:
\`\`\`javascript
${currentCode || '// empty code'}
\`\`\`

Instructions:
Provide a hilarious, encouraging, but concise response in valid JSON format:
{
  "hintTitle": "Short witty title",
  "hintText": "Step-by-step helpful nudge without giving away the full copy-paste solution directly",
  "funnyQuote": "A funny relatable quote or joke about this coding bug",
  "suggestedSnippet": "Optional 1-2 line code snippet pattern if helpful"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      hintTitle: parsed.hintTitle || '💡 AI Hint',
      hintText: parsed.hintText || 'Double check your return statement and logic flow!',
      funnyQuote: parsed.funnyQuote || 'Keep going! Syntax errors build character.',
      suggestedSnippet: parsed.suggestedSnippet || ''
    });
  } catch (error: any) {
    console.error('Error generating AI hint:', error);
    res.json({
      success: true,
      hintTitle: '💡 Friendly AI Coach',
      hintText: 'Check your return value, ensure variable types match test requirements, and test with sample inputs!',
      funnyQuote: 'My circuits hiccuped, but your code is almost there!'
    });
  }
});

// API: AI Code Roast & Praise
app.post('/api/ai/roast', async (req, res) => {
  try {
    const { challengeTitle, userCode } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        score: 88,
        titleGrade: '🍝 Delicious Spaghetti Masterpiece',
        funnyRoast: 'Your code runs smoothly! It has a few extra variables, but it gets the job done delightfully.',
        praisePoints: ['Clean function signature', 'Passes all test cases', 'Zero infinite loops!'],
        funnyTip: 'Try using array methods like .map() or .filter() to look like a senior dev!'
      });
    }

    const prompt = `
Analyze this user solution for the challenge "${challengeTitle}":
\`\`\`javascript
${userCode}
\`\`\`

Return a JSON object with:
{
  "score": number (0-100 score based on elegance & humor),
  "titleGrade": "Funny title grade like 'Semicolon Ninja', 'Spaghetti Masterpiece', 'Copy-Paste Prodigy'",
  "funnyRoast": "Humorous lighthearted review of their code style",
  "praisePoints": ["Array of 2-3 genuinely good things about their solution"],
  "funnyTip": "1 practical funny tip to optimize or clean up the code"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      score: parsed.score || 85,
      titleGrade: parsed.titleGrade || '✨ Code Wizard',
      funnyRoast: parsed.funnyRoast || 'Your solution is clean and gets the job done without setting off the compiler alarm!',
      praisePoints: parsed.praisePoints || ['Great logic flow', 'Clean syntax'],
      funnyTip: parsed.funnyTip || 'Keep up the awesome work!'
    });
  } catch (error) {
    res.json({
      success: true,
      score: 90,
      titleGrade: '🌟 Bug Hunter Extraordinaire',
      funnyRoast: 'Awesome work solving this challenge!',
      praisePoints: ['Passed all test cases', 'Solid logic'],
      funnyTip: 'Reward yourself with a slice of pizza!'
    });
  }
});

// API: AI Custom Challenge Generator
app.post('/api/ai/generate-challenge', async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        challenge: {
          id: 'ai_generated_' + Date.now(),
          title: '🍩 The Donut Counter Glitch',
          funnyIntro: 'A donut robot misplaced the glaze counter!',
          description: 'Write a function `countGlazedDonuts(donuts)` that returns the number of donuts with property `glazed: true`.',
          difficulty: difficulty || 'beginner',
          category: 'basics',
          tags: ['AI Generated', 'Objects', 'Loops'],
          xpReward: 150,
          coinReward: 35,
          initialCode: `function countGlazedDonuts(donuts) {\n  // Count glazed donuts\n  return 0;\n}`,
          testCases: [
            { id: 't1', inputDescription: 'countGlazedDonuts([{glazed: true}, {glazed: false}])', expectedOutput: '1', expectedType: 'number' }
          ],
          hints: ['Use .filter() or a simple loop checking donut.glazed'],
          solutionCode: `function countGlazedDonuts(donuts) { return donuts.filter(d => d.glazed).length; }`
        }
      });
    }

    const prompt = `
Generate a new, funny, gamified coding challenge on the topic "${topic || 'arrays and strings'}" at difficulty "${difficulty || 'beginner'}".
Return a JSON object conforming to this exact structure:
{
  "id": "gen_${Date.now()}",
  "title": "Creative funny title with emoji",
  "funnyIntro": "Hilarious backstory narrative",
  "description": "Clear functional requirements for the function to implement",
  "difficulty": "${difficulty || 'beginner'}",
  "category": "funny_bugs",
  "tags": ["AI Generated", "Fun", "${topic || 'JavaScript'}"],
  "xpReward": 180,
  "coinReward": 40,
  "initialCode": "function solveChallenge(input) {\\n  // Fix here\\n  return input;\\n}",
  "testCases": [
    {
      "id": "tc1",
      "inputDescription": "solveChallenge('sample')",
      "expectedOutput": "'sample'",
      "expectedType": "string"
    }
  ],
  "hints": ["Hint 1", "Hint 2"],
  "solutionCode": "function solveChallenge(input) { return input; }"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const challenge = JSON.parse(response.text || '{}');
    res.json({ success: true, challenge });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate AI challenge' });
  }
});

// Vite Development or Static Production Server Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CodeJester Server running at http://localhost:${PORT}`);
  });
}

startServer();
