import type { Challenge, UserProfile } from '../types';

export interface CodeQuestBackup {
  version: 1;
  exportedAt: string;
  profile: UserProfile;
  customChallenges: Challenge[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
function isValidProfile(value: unknown): value is UserProfile {
  if (!isRecord(value)) return false;
  return typeof value.username === 'string' && value.username.trim().length > 0 &&
    typeof value.avatar === 'string' && typeof value.titleBadge === 'string' &&
    Number.isFinite(value.xp) && (value.xp as number) >= 0 &&
    Number.isFinite(value.level) && (value.level as number) >= 1 &&
    Number.isFinite(value.byteCoins) && (value.byteCoins as number) >= 0 &&
    Number.isFinite(value.streakDays) && (value.streakDays as number) >= 0 &&
    isStringArray(value.solvedIds) &&
    (value.completedLessonIds === undefined || isStringArray(value.completedLessonIds)) &&
    isStringArray(value.unlockedBadges) && isStringArray(value.purchasedThemes) &&
    ['light', 'dark', 'cyberpunk', 'retro', 'cozy'].includes(String(value.activeTheme));
}
function isValidChallenge(value: unknown): value is Challenge {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && (value.id.startsWith('gen_') || value.id.startsWith('ai_')) &&
    typeof value.title === 'string' && value.title.trim().length > 0 &&
    typeof value.description === 'string' &&
    ['beginner', 'intermediate', 'advanced'].includes(String(value.difficulty)) &&
    Array.isArray(value.testCases) && Array.isArray(value.hints) &&
    typeof value.initialCode === 'string' && typeof value.solutionCode === 'string' &&
    Number.isFinite(value.xpReward) && Number.isFinite(value.coinReward);
}

export function createCodeQuestBackup(profile: UserProfile, customChallenges: Challenge[]): string {
  const backup: CodeQuestBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    customChallenges,
  };
  return JSON.stringify(backup, null, 2);
}

export function parseCodeQuestBackup(value: unknown): CodeQuestBackup {
  if (!isRecord(value) || value.version !== 1 || !isValidProfile(value.profile) ||
      !Array.isArray(value.customChallenges) || value.customChallenges.length > 200 ||
      !value.customChallenges.every(isValidChallenge)) {
    throw new Error('This is not a valid Code Quest backup file.');
  }
  return {
    version: 1,
    exportedAt: typeof value.exportedAt === 'string' ? value.exportedAt : new Date().toISOString(),
    profile: {
      ...value.profile,
      completedLessonIds: value.profile.completedLessonIds ?? [],
    },
    customChallenges: value.customChallenges,
  };
}

/** Safely restore a profile from the application's existing localStorage key. */
export function parseStoredProfile(value: unknown): UserProfile | null {
  if (!isValidProfile(value)) return null;
  return { ...value, completedLessonIds: value.completedLessonIds ?? [] };
}

/** Ignore malformed custom challenge records instead of crashing the challenge list. */
export function parseStoredChallenges(value: unknown): Challenge[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isValidChallenge).slice(0, 200);
}
