# Learning notes — Code Quest

These notes describe the current TypeScript/React application, not a Java or Spring Boot project.

## 1. React components
- **Meaning:** Components are reusable functions that return UI.
- **Used here:** `recovered-source/src/App.tsx` and files under `src/components/`.
- **Tiny example:** `function Header() { return <header>Code Quest</header>; }`
- **Common mistake:** Putting unrelated screens and state into one very large component.

## 2. TypeScript types and interfaces
- **Meaning:** Types describe the shape of values and help catch mistakes before runtime.
- **Used here:** `recovered-source/src/types.ts`, `src/utils/backup.ts`.
- **Tiny example:** `interface TestResult { passed: boolean; }`
- **Common mistake:** Using `any` for untrusted input instead of starting with `unknown` and validating it.

## 3. State updates and immutability
- **Meaning:** React state should be updated by creating new objects/arrays rather than mutating existing state.
- **Used here:** `recovered-source/src/utils/progress.ts`.
- **Tiny example:** `return { ...profile, xp: profile.xp + reward };`
- **Common mistake:** Mutating a profile object and expecting React to detect every change.

## 4. Business rules as pure functions
- **Meaning:** A pure function calculates a result from its inputs without changing outside state.
- **Used here:** `src/utils/progress.ts` with `awardChallengeReward`, `awardLessonReward` and `spendCoins`.
- **Tiny example:** `const updated = awardChallengeReward(profile, id, 20, 5);`
- **Common mistake:** Duplicating reward calculations in multiple UI components.

## 5. Collections and array methods
- **Meaning:** Arrays hold ordered values; methods such as `map`, `filter` and `includes` process them.
- **Used here:** `src/utils/progress.ts` and `src/utils/backup.ts`.
- **Tiny example:** `profile.solvedIds.includes(challengeId)`
- **Common mistake:** Forgetting that `map` returns a new array and does not mutate the original.

## 6. Input validation and type guards
- **Meaning:** A type guard checks unknown runtime data before treating it as a trusted type.
- **Used here:** `src/utils/backup.ts`.
- **Tiny example:** `function isRecord(v: unknown): v is Record<string, unknown> { return typeof v === 'object' && v !== null && !Array.isArray(v); }`
- **Common mistake:** Trusting parsed JSON just because `JSON.parse` succeeded.

## 7. Browser local storage
- **Meaning:** Local storage keeps string values in one browser profile between page visits.
- **Used here:** learner profile and custom challenge flows in the React application; backup parsing is in `src/utils/backup.ts`.
- **Tiny example:** `localStorage.setItem('profile', JSON.stringify(profile));`
- **Common mistake:** Assuming local storage syncs automatically between users or devices.

## 8. JSON backup and restore
- **Meaning:** JSON serialises data into text that can be saved and parsed later.
- **Used here:** `src/utils/backup.ts`.
- **Tiny example:** `JSON.stringify(backup, null, 2)`
- **Common mistake:** Replacing live data before validating every imported record.

## 9. Node.js and Express
- **Meaning:** Node.js runs JavaScript on the server; Express maps HTTP routes to handlers.
- **Used here:** `recovered-source/server.ts`.
- **Tiny example:** `app.get('/api/leaderboard', handler)`
- **Common mistake:** Assuming in-memory variables are permanent storage.

## 10. Automated tests
- **Meaning:** Tests check expected results for known inputs.
- **Used here:** `src/utils/progress.test.ts` and `src/utils/backup.test.ts`.
- **Tiny example:** Test that completing the same challenge twice does not award XP twice.
- **Common mistake:** Testing only normal data and not malformed imports or duplicate actions.

## Important boundary
The current code runner returns a disabled result rather than executing user code. The leaderboard is held in server memory. Do not claim secure sandbox execution or durable multi-user progress storage.
