export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type ChallengeCategory = 
  | 'basics' 
  | 'funny_bugs' 
  | 'algorithms' 
  | 'async_magic' 
  | 'regex_madness' 
  | 'refactor_puzzles';

export interface TestCase {
  id: string;
  inputDescription: string;
  expectedOutput: string;
  expectedType?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  hidden?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  funnyIntro: string;
  difficulty: DifficultyLevel;
  category: ChallengeCategory;
  initialCode: string;
  testCases: TestCase[];
  hints: string[];
  solutionCode: string;
  xpReward: number;
  coinReward: number;
  tags: string[];
  type?: 'code' | 'bug_fix' | 'refactor';
}

export interface LessonStep {
  stepTitle: string;
  storyExplanation: string;
  codeSnippet?: string;
  interactivePrompt?: string;
  quizQuestion?: string;
  options?: string[];
  correctOptionIndex?: number;
  hint?: string;
}

export interface InteractiveLesson {
  id: string;
  title: string;
  funnyConcept: string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  steps: LessonStep[];
  badgeReward: {
    name: string;
    icon: string;
    description: string;
  };
  xpReward: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  titleBadge: string;
  xp: number;
  level: number;
  solvedPuzzles: number;
  streakDays: number;
  funnyBio: string;
  rank: number;
}

export interface UserProfile {
  username: string;
  avatar: string;
  titleBadge: string;
  xp: number;
  level: number;
  byteCoins: number;
  streakDays: number;
  solvedIds: string[];
  unlockedBadges: string[];
  purchasedThemes: string[];
  activeTheme: 'light' | 'dark' | 'cyberpunk' | 'retro' | 'cozy';
}

export type AIPersona = 'meme_cat' | 'grumpy_compiler' | 'cozy_grandma' | 'sarcastic_bot';

export interface AIHintResponse {
  persona: AIPersona;
  hintTitle: string;
  hintText: string;
  funnyQuote: string;
  suggestedSnippet?: string;
}

export interface AIRoastResponse {
  score: number; // 0 to 100
  titleGrade: string; // e.g. "Spaghetti Masterpiece", "Clean Semicolon Master"
  funnyRoast: string;
  praisePoints: string[];
  funnyTip: string;
}
