# Trendboard — Financial News Dashboard

## Overview
Trendboard fetches financial news (via RSS/selected APIs), summarizes articles using OpenAI, and stores them in Firestore. The frontend displays summaries in a responsive dashboard with search and filters.

## Stack
- Frontend: React (Vite)
- Backend: Firebase Cloud Functions (Node 18)
- Database: Firestore
- AI: OpenAI (chat completions) for summarization
- Hosting: Firebase Hosting or Vercel + Firebase Functions

## Setup (local)
1. Clone repo:
git clone <repo-url>
cd trendboard

markdown
Copy code

2. Functions:
cd functions
npm install

copy .env.example -> .env and fill OPENAI_API_KEY, FINNHUB_API_KEY
deploy functions with: firebase deploy --only functions
markdown
Copy code

3. Frontend:
cd frontend
npm install

add firebase config in src/services/firebase.js
set VITE_FUNCTION_URL in .env
npm run dev

bash
Copy code

## Deploy
- Deploy functions to Firebase:
firebase deploy --only functions

markdown
Copy code
- Deploy frontend to Firebase Hosting (optional) or Vercel:
- For Firebase Hosting, configure hosting and run:
  ```
  firebase deploy --only hosting
  ```

## Firestore structure
- `articles` collection:
- `title`: string
- `link`: string
- `summary`: string
- `source`: string
- `publishedAt`: timestamp
- `createdAt`: timestamp
- `tags`: array
- `severity`: string

## Firebase Rules
See `firebase.rules` for example rules. Ensure writes to `articles` are limited to trusted server accounts or admins.

## AI usage and prompts (documenting use)
- Summarization prompt used in Cloud Function:
Summarize the following article in 2-3 short sentences suitable for a news card UI. Be concise and neutral.

<ARTICLE TEXT> ``` - If you used AI for UI copy or assets, list the prompts and show how you edited output (required by assessment).
Deliverables for submission
GitHub repo with commit history

Live hosted link

README (this file)

Demo video (5–8 mins) demoing how ingest works, UI, filters, and highlighting Firestore rules

Screenshots (mobile + desktop)

yaml
Copy code

---

## 5) Deployment & Demo checklist (what to include for Spacenos submission)
- [ ] GitHub repo with meaningful commits (e.g., `init project`, `add cloud function`, `add frontend dashboard`, `firestore rules`, `README`).
- [ ] Live hosted frontend (Vercel or Firebase Hosting).
- [ ] Cloud Function deployed and working; set `OPENAI_API_KEY` as a secret variable in Firebase environment.
- [ ] README that documents architecture, AI prompt(s), and how AI was edited/validated.
- [ ] Demo video (5–8 mins): show ingestion trigger, new summarized article appearing, search, and responsive views.
- [ ] Screenshots (mobile and desktop).
- [ ] Firebase Rules snippets (in repo and in the form submission).

---

## 6) A few practical tips and constraints
- **OpenAI model choice**: pick a model available to your account. If you do not have access to GPT-4, use `gpt-3.5-turbo` with adjusted tokens.
- **Rate limits & costs**: summarization of many articles may consume tokens quickly; consider summarizing only top N articles per run.
- **RSS sources**: pick permissive public RSS feeds (Reuters, Financial Times may have restrictions). Finnhub is cleaner but requires API key.
- **Security**: never commit `OPENAI_API_KEY` or Firebase private keys. Use environment variables and Firebase functions config (`firebase functions:config:set openai.key="..."`).
- **Firestore Rules**: restrict write access; only allow Cloud Functions to write to `articles` by checking `request.auth` or using Admin SDK on server side (recommended).

---
