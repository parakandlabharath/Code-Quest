import type { UserProfile } from '../types';

export function awardChallengeReward(profile: UserProfile, challengeId: string, xpReward: number, coinReward: number): UserProfile {
  if (!challengeId.trim()) throw new Error('Challenge ID is required.');
  if (!Number.isFinite(xpReward) || xpReward < 0) throw new Error('XP reward must be a non-negative number.');
  if (!Number.isFinite(coinReward) || coinReward < 0) throw new Error('Coin reward must be a non-negative number.');
  if (profile.solvedIds.includes(challengeId)) return profile;
  const xp = profile.xp + xpReward;
  return { ...profile, solvedIds: [...profile.solvedIds, challengeId], xp, byteCoins: profile.byteCoins + coinReward, level: Math.floor(xp / 300) + 1 };
}

export function awardLessonReward(profile: UserProfile, lessonId: string, badgeName: string, xpReward: number): UserProfile {
  if (!lessonId.trim()) throw new Error('Lesson ID is required.');
  if (!badgeName.trim()) throw new Error('Badge name is required.');
  if (!Number.isFinite(xpReward) || xpReward < 0) throw new Error('XP reward must be a non-negative number.');
  const completedLessonIds = profile.completedLessonIds ?? [];
  if (completedLessonIds.includes(lessonId)) return profile;
  const xp = profile.xp + xpReward;
  const alreadyHasBadge = profile.unlockedBadges.includes(badgeName);
  return {
    ...profile,
    completedLessonIds: [...completedLessonIds, lessonId],
    unlockedBadges: alreadyHasBadge ? profile.unlockedBadges : [...profile.unlockedBadges, badgeName],
    xp,
    byteCoins: profile.byteCoins + 50,
    level: Math.floor(xp / 300) + 1,
  };
}

export function spendCoins(profile: UserProfile, amount: number): UserProfile | null {
  if (!Number.isFinite(amount) || amount < 0) throw new Error('Coin cost must be a non-negative number.');
  if (profile.byteCoins < amount) return null;
  return { ...profile, byteCoins: profile.byteCoins - amount };
}
