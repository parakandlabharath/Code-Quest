import test from 'node:test';
import assert from 'node:assert/strict';
import { awardChallengeReward } from './progress';

const profile = {
  username: 'TestCoder', avatar: '🚀', titleBadge: 'Beginner', xp: 250,
  level: 1, byteCoins: 20, streakDays: 0, solvedIds: [],
  unlockedBadges: [], purchasedThemes: ['dark'], activeTheme: 'dark' as const,
};

test('awards XP, coins and updates level for a new challenge', () => {
  const result = awardChallengeReward(profile, 'challenge-1', 100, 25);
  assert.equal(result.xp, 350);
  assert.equal(result.byteCoins, 45);
  assert.equal(result.level, 2);
  assert.deepEqual(result.solvedIds, ['challenge-1']);
});

test('does not award a challenge twice', () => {
  const completed = { ...profile, solvedIds: ['challenge-1'] };
  assert.equal(awardChallengeReward(completed, 'challenge-1', 100, 25), completed);
});

test('rejects invalid rewards and empty challenge IDs', () => {
  assert.throws(() => awardChallengeReward(profile, '', 10, 10), /Challenge ID/);
  assert.throws(() => awardChallengeReward(profile, 'x', -1, 10), /XP reward/);
  assert.throws(() => awardChallengeReward(profile, 'x', 1, Number.NaN), /Coin reward/);
});
