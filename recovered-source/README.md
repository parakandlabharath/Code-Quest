# Code Quest application source

This folder contains the React + TypeScript frontend and Express server for Code Quest.

For the project overview, verified feature list, setup commands, limitations and architecture, see the [repository README](../README.md).

## Run locally

Requirements: Node.js 22 and npm.

```bash
npm install
npm run dev
```

## Validate

```bash
npm run lint
npm test
npm run build
```

Optional Gemini features read `GEMINI_API_KEY` from the environment. Keep your local `.env` file private.

**Security note:** `src/utils/codeRunner.ts` currently fails closed. It does not execute submitted JavaScript. Do not enable arbitrary code execution in the browser page context.
