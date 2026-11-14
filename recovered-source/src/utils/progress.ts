import type { UserProfile } from '../types';

export function awardChallengeReward(
  profile: UserProfile,
  challengeId: string,
  xpReward: number,
  coinReward: number,
): UserProfile {
  if (!challengeId.trim()) throw new Error('Challenge ID is required.');
  if (!Number.isFinite(xpReward) || xpReward < 0) throw new Error('XP reward must be a non-negative number.');
  if (!Number.isFinite(coinReward) || coinReward < 0) throw new Error('Coin reward must be a non-negative number.');

  if (profile.solvedIds.includes(challengeId)) return profile;

  const xp = profile.xp + xpReward;
  return {
    ...profile,
    solvedIds: [...profile.solvedIds, challengeId],
    xp,
    byteCoins: profile.byteCoins + coinReward,
    level: Math.floor(xp / 300) + 1,
  };
}
