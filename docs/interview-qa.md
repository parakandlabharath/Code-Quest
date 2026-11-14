# Interview preparation — Code Quest

## 60-second project pitch

“Code Quest is a gamified coding-practice web application built with React and TypeScript, with an Express server. It presents coding challenges and interactive lessons, tracks learner rewards such as XP and coins, and includes optional AI-assisted hints and challenge creation. I separated reward calculations into utility functions so that duplicate completions and coin spending can be tested without rendering the UI. Learner progress is stored in browser local storage and can be exported as a validated JSON backup. Secure code execution and permanent server-side learner accounts are not implemented yet.”

## How it works — about two minutes

1. The browser loads the React application and displays challenges, lessons and learner information.
2. The learner interacts with a challenge or lesson. The application uses utility functions to calculate reward changes.
3. Reward functions return updated profile objects instead of mutating the existing profile. A completed challenge is checked against `solvedIds` to avoid awarding the same reward twice.
4. The profile and custom challenges are stored in browser local storage.
5. The backup utility serialises the profile and custom challenges to JSON. During import it validates the version, profile fields, challenge fields and collection size before returning data.
6. The frontend can call the Express API for leaderboard and optional Gemini-backed assistance.
7. The leaderboard currently lives in server memory and resets when the server restarts.
8. The code runner deliberately refuses to execute submitted JavaScript until a genuinely isolated execution service exists.

## 15 fresher-level questions

1. **What is Code Quest?** A gamified coding-practice web application with lessons, challenges and learner rewards.
2. **Why React?** It lets the UI be divided into reusable components.
3. **What is TypeScript?** JavaScript with a static type system that helps catch type mistakes during development.
4. **What is a React component?** A reusable function that returns UI.
5. **Why extract reward logic into utility functions?** It makes business rules easier to reuse and test independently of the UI.
6. **What is immutability?** Creating a new object or array instead of changing the existing one.
7. **How do you prevent duplicate challenge rewards?** Check whether the challenge ID already exists in `solvedIds`.
8. **What does `Array.includes()` do?** It checks whether an array contains a value.
9. **What is local storage?** Browser storage for string values scoped to that browser profile.
10. **Why validate imported JSON?** A valid JSON string can still contain invalid or unsafe application data.
11. **What is a type guard?** A function that checks a value and narrows its TypeScript type.
12. **What is Express?** A Node.js web framework used here to define API routes.
13. **What is the difference between local storage and server memory?** Local storage remains in a browser; server memory is lost when the server process restarts.
14. **Why is arbitrary code execution dangerous?** Untrusted code could access resources or data if it runs in the application's environment.
15. **What would you improve next?** Add a properly isolated code judge and durable learner/leaderboard persistence, with integration tests.

## Interview honesty checklist

- Code submissions are not executed by the current code runner.
- Leaderboard storage is in memory, not a database.
- Learner progress is browser-local and requires backup to move between devices.
- Gemini assistance is optional and depends on configuration.
