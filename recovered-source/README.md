<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5263a609-9e31-4ff5-846e-a486e0dd7c6e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Security note

The current challenge runner evaluates submitted JavaScript in the browser page context. It is suitable only for local experimentation with trusted code, not for a public multi-user coding platform. Do not deploy this feature publicly until code execution is moved into a properly isolated sandbox with strict resource limits and network restrictions. The leaderboard is currently in-memory and resets when the server restarts.
