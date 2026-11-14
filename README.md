# Code Quest — Gamified Coding Practice

Code Quest (the recovered application branding currently says **CodeJester**) is a browser-based coding-practice playground. It combines coding challenges, short interactive lessons, a learner profile, a leaderboard, and optional AI-generated hints.

> **Project status: in development.** The UI and learning flows are present. Secure execution of submitted code is intentionally disabled until an isolated server-side judge is implemented. Do not describe the code runner as working yet.

## What is currently in the source

- Browse beginner, intermediate, and advanced JavaScript challenges.
- Read interactive lessons and track earned profile rewards.
- Store the learner profile and custom challenges in browser local storage, with validated JSON export/import backups.
- View a leaderboard endpoint backed by in-memory server state.
- Request optional AI hints, code feedback, and challenge generation when a Gemini API key is configured.
- Run unit tests for challenge rewards, one-time lesson rewards, coin spending, and backup validation.

## Technology

- React 19 + TypeScript
- Vite 6
- Express 4
- Node.js 22
- Optional Google Gemini API integration

The application is **not currently a Java/Spring Boot task-management application**. The recovered source is a JavaScript coding-practice product; this README describes the actual source tree.

## Run locally

Prerequisites: Node.js 22 and npm.

```bash
git clone https://github.com/parakandlabharath/Code-Quest.git
cd Code-Quest/recovered-source
npm install
npm run dev
```

Open the local address printed in the terminal (normally `http://localhost:3000`).

Optional AI features require a Gemini API key. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`. Do not commit `.env` or API keys.

## Validate changes

```bash
npm run lint
npm test
npm run build
```

GitHub Actions runs the type-check, unit tests, and production build for changes under `recovered-source/`.

## Data and known limitations

| Area | Current behavior | Limitation |
| --- | --- | --- |
| Learner profile | Browser local storage plus JSON export/import | Manual backup is required to move data between devices |
| Custom challenges | Browser local storage plus JSON export/import | Keep exported backup files outside the device |
| Leaderboard | Express in-memory array | Resets when the server restarts; not a durable multi-user leaderboard |
| Code submissions | Fail-closed response | No isolated execution service; arbitrary submitted code is not run |
| AI endpoints | Gemini when configured, otherwise fallback responses | AI output is advisory and must be reviewed |

Never use `eval()` or `new Function()` to enable the editor. A future code judge must run submissions in an isolated process/container with strict time, memory, filesystem, and network limits.

## Architecture

```text
Browser (React)
  ├── Challenges and lessons
  ├── Profile and reward state (localStorage)
  └── Express API calls
        ├── Leaderboard (in-memory)
        └── Optional Gemini AI endpoints
```

## Completion checklist

- [x] Source tree recovered and separated under `recovered-source/`
- [x] Type-check and production build workflow
- [x] Unit tests for challenge rewards, lesson reward idempotency, coin spending, and backup validation
- [x] Validated export/import for learner profile and custom challenges
- [x] Reward logic extracted into a small testable module
- [ ] Secure isolated code execution and end-to-end challenge tests
- [ ] Durable server-side profile and leaderboard storage
- [ ] Validate all legacy browser profile data and AI response payloads
- [ ] Capture screenshots from the locally running application and add them under `screenshots/`
- [ ] Verify a clean-clone setup and record a real demo

## Interview explanation

The React application owns the learning experience and stores an individual learner profile in local storage. It calls an Express API for leaderboard and AI-assisted features. The reward rule is isolated in a pure TypeScript function so that duplicate challenge completion and XP/coin calculations can be tested independently. The most important unfinished engineering task is a secure, isolated code execution service; the current application deliberately refuses to execute arbitrary code.
