---
title: Environment Setup
slug: env-setup-en
language: EN
category: guide
---

# Glowmi Environment Setup

## Environment Variables

| Variable | Required | Purpose | Where to Get |
|----------|----------|---------|--------------|
| `VITE_GEMINI_API_KEY` | Local dev only | Google Gemini API key for AI beauty analysis | [Google AI Studio](https://aistudio.google.com/apikey) |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL | Supabase Dashboard > Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase public (anon) key | Supabase Dashboard > Settings > API |
| `VITE_LAMBDA_GEMINI_URL` | Production only | AWS Lambda Gemini proxy URL | AWS Lambda console — your function's API Gateway URL |
| `DISCORD_WEBHOOK_URL` | Optional | Discord webhook for new signup notifications | Discord Server Settings > Integrations > Webhooks |

---

## Local Development Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the values in `.env`:
   ```
   VITE_GEMINI_API_KEY=your-gemini-api-key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Install dependencies and start dev server:
   ```bash
   npm install
   npm run dev
   ```

---

## Production Setup (Cloudflare Pages)

1. Go to Cloudflare Dashboard > Pages > your project > Settings
2. Navigate to **Variables and Secrets**
3. Add each variable with Type: **Text**

### API Key Priority (gemini.js)

```
Priority 1: AWS Lambda (VITE_LAMBDA_GEMINI_URL is set)
  → All Gemini calls routed through Lambda
  → API key stored in Lambda environment variables
  → CloudWatch monitors all calls

Priority 2: Cloudflare Functions (no Lambda URL)
  → Calls go to /api/gemini Cloudflare Function
  → API key stored as Cloudflare Secret

Priority 3: Direct API call (local dev only)
  → Uses VITE_GEMINI_API_KEY from .env
  → API key exposed in browser (dev only!)
```

---

## Security Notes

- **Never** hardcode API keys in source code
- `.env` is in `.gitignore` — never committed
- Production keys live in Cloudflare Secrets or Lambda env vars
- `VITE_` prefix variables are exposed to the browser — only use for public keys (Supabase anon key)
- `DISCORD_WEBHOOK_URL` has no `VITE_` prefix — only accessible server-side (Cloudflare Function)
