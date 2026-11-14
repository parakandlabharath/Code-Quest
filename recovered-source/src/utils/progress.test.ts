import test from 'node:test';
import assert from 'node:assert/strict';
import { awardChallengeReward, awardLessonReward, spendCoins } from './progress';

const profile = {
  username: 'TestCoder', avatar: '🚀', titleBadge: 'Beginner', xp: 250,
  level: 1, byteCoins: 120, streakDays: 0, solvedIds: [],
  unlockedBadges: [], purchasedThemes: ['dark'], activeTheme: 'dark' as const,
};

test('awards XP, coins and updates level for a new challenge', () => {
  const result = awardChallengeReward(profile, 'challenge-1', 100, 25);
  assert.equal(result.xp, 350);
  assert.equal(result.byteCoins, 145);
  assert.equal(result.level, 2);
  assert.deepEqual(result.solvedIds, ['challenge-1']);
});

test('does not award a challenge twice', () => {
  const completed = { ...profile, solvedIds: ['challenge-1'] };
  assert.equal(awardChallengeReward(completed, 'challenge-1', 100, 25), completed);
});

test('awards lesson rewards once per lesson ID, even when badge names overlap', () => {
  const first = awardLessonReward(profile, 'lesson-1', 'Java Basics', 100);
  assert.equal(first.xp, 350);
  assert.equal(first.byteCoins, 170);
  assert.deepEqual(first.completedLessonIds, ['lesson-1']);
  assert.equal(awardLessonReward(first, 'lesson-1', 'Java Basics', 100), first);
  const second = awardLessonReward(first, 'lesson-2', 'Java Basics', 100);
  assert.equal(second.xp, 450);
  assert.equal(second.byteCoins, 220);
  assert.equal(second.unlockedBadges.length, 1);
});

test('spends only available non-negative coin amounts', () => {
  assert.equal(spendCoins(profile, 30)?.byteCoins, 90);
  assert.equal(spendCoins(profile, 121), null);
  assert.throws(() => spendCoins(profile, -1), /non-negative/);
});

test('rejects invalid rewards and empty IDs', () => {
  assert.throws(() => awardChallengeReward(profile, '', 10, 10), /Challenge ID/);
  assert.throws(() => awardChallengeReward(profile, 'x', -1, 10), /XP reward/);
  assert.throws(() => awardChallengeReward(profile, 'x', 1, Number.NaN), /Coin reward/);
  assert.throws(() => awardLessonReward(profile, '', 'Badge', 10), /Lesson ID/);
});
