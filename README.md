# Learning Assistant

A React + TypeScript frontend exploring image-based and spoken-question assistance with the Gemini API. The interface includes camera capture, speech input/output, solution rendering and theme settings.

## Project layout

- `src/App.tsx` — main interface and component composition
- `src/comps/` — camera, speech, input, history and solution components
- `src/utils/gemini.ts` — Gemini request helpers
- `src/utils/speech.ts` — browser speech features
- `testImg/` — test images

## Run locally

```bash
git clone https://github.com/DevyanshMalhotra/Learning-assistant.git
cd Learning-assistant
npm install
npm run dev
```

The project uses Vite; its dev server normally starts on http://localhost:5173.

### Configuration and security

The existing `src/utils/gemini.ts` reads `process.env.REACT_APP_GEMINI_API_KEY`, which is **not Vite's default client environment-variable convention**. The code also calls Gemini directly from the browser. Before exposing the application, migrate model requests to a small backend/proxy that stores the Gemini key on the server, adds request validation and rate limits, and uses a currently supported model identifier.

**Do not place private production API keys into browser-side environment variables.** The original deployment may not work until configuration and model availability are updated.

## Current status

This repository demonstrates the UI and API integration flow, but its live deployment is not guaranteed functional. Camera and speech behavior depend on browser permissions and compatibility; generated answers may be inaccurate. No production uptime or accuracy claim is made.
