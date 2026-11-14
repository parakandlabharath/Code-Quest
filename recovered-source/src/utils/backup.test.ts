import test from 'node:test';
import assert from 'node:assert/strict';
import { createCodeQuestBackup, parseCodeQuestBackup, parseStoredProfile, parseStoredChallenges } from './backup';

const profile = {
  username: 'Bharath', avatar: '🚀', titleBadge: 'Beginner', xp: 250,
  level: 1, byteCoins: 20, streakDays: 0, solvedIds: ['challenge-1'],
  unlockedBadges: ['Beginner'], purchasedThemes: ['dark'], activeTheme: 'dark' as const,
};
const challenge = {
  id: 'ai_custom-1', title: 'Custom challenge', description: 'A test',
  funnyIntro: 'Test', difficulty: 'beginner' as const, category: 'basics' as const,
  initialCode: 'const answer = 42;', testCases: [], hints: [], solutionCode: 'const answer = 42;',
  xpReward: 10, coinReward: 5, tags: ['test']
};

test('exports and restores profile and custom challenges', () => {
  const json = createCodeQuestBackup(profile, [challenge]);
  const restored = parseCodeQuestBackup(JSON.parse(json));
  assert.equal(restored.profile.username, 'Bharath');
  assert.deepEqual(restored.profile.solvedIds, ['challenge-1']);
  assert.equal(restored.customChallenges[0].id, 'ai_custom-1');
});

test('rejects malformed backup data', () => {
  assert.throws(() => parseCodeQuestBackup({}), /valid Code Quest backup/);
  assert.throws(() => parseCodeQuestBackup({ version: 1, profile: { ...profile, xp: -10 }, customChallenges: [] }), /valid Code Quest backup/);
  assert.throws(() => parseCodeQuestBackup({ version: 1, profile, customChallenges: [{ id: 'evil' }] }), /valid Code Quest backup/);
});

test('safely restores valid legacy local storage and rejects malformed values', () => {
  assert.equal(parseStoredProfile(profile)?.username, 'Bharath');
  assert.equal(parseStoredProfile({ ...profile, byteCoins: -1 }), null);
  assert.deepEqual(parseStoredChallenges([challenge, { id: 'bad' }]), [challenge]);
  assert.deepEqual(parseStoredChallenges({}), []);
});
