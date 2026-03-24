---
title: Development Guide
slug: dev-guide-en
language: EN
category: guide
---

# Glowmi Development Guide

## Project Overview

- **Frontend**: React 18 + Vite 6 (build target: esnext)
- **Icons**: Lucide React (tree-shaking, vendor-lucide chunk splitting)
- **Layout**: Mobile tab nav / Desktop (768px+) sidebar nav
- **App Store**: Capacitor (iOS/Android build ready)
- **Deployment**: Cloudflare Pages (auto-deploy: GitHub main branch push)
- **Auth**: Supabase Auth (Google OAuth)
- **DB**: Supabase (analysis results, skin diary, routines)
- **AI Analysis**: Google Gemini 2.5 Flash (API key: VITE_GEMINI_API_KEY)
- **Fallback**: Gemini failure → automatic switch to MediaPipe local analysis
- **Notifications**: Discord Webhook (new signup alerts, Cloudflare Function)

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key (AI analysis) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public key |
| `VITE_LAMBDA_GEMINI_URL` | AWS Lambda Gemini proxy URL (uses Lambda instead of Cloudflare proxy when set) |
| `DISCORD_WEBHOOK_URL` | Discord signup notification webhook (used by Cloudflare Function) |

- Local dev: Set in `.env` file (see `.env.example`)
- Production: Cloudflare Pages Settings > Variables and Secrets (Type: Text)

---

## Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#8B7EC8` | Soft Lavender — main brand color |
| Secondary | `#6C5FA7` | Deep Lavender — darker variant |
| Accent | `#E8A0BF` | Rose Pink — highlight/accent |
| Light BG | `#F5F0FF` | Light purple background |
| Dark BG | `#1A1028` | Deep purple (dark mode) |
| Gradient | `linear-gradient(135deg, #8B7EC8 0%, #6C5FA7 100%)` | Brand gradient |

Color history: `#ff6b9d` (Original Pink) → `#F4A698` (Peach, v2.0.14) → `#CF8BA9` (Dusty Rose, v2.0.16) → `#8B7EC8` (Soft Lavender, v2.5.0)

---

## Version Management

- Version is synced across 3 files: `package.json`, `Header.jsx` (logo-version), `ReleaseNotesModal.jsx` (APP_VERSION)
- Every push must bump the patch version (+1)
- Release notes written in bilingual EN/KO

---

## Pre-Push Checklist

1. Bump patch version (+1) in all 3 locations
2. `npm run build` — verify no build errors
3. No hardcoded API keys in source code
4. Valid JSON-LD in index.html (FAQPage, Blog, BreadcrumbList, etc.)
5. robots.txt AI bot distinction maintained (search bots Allow, training bots Disallow)
6. llms.txt updated for new features/pages
7. UX copy included for new features (empty states, descriptions, tooltips — both EN/KO)
8. Pre-push hook runs automatically on `git push` (blocks push on failure)

---

## State Management (React Context)

| Context | Role | Storage |
|---------|------|---------|
| `AuthContext` | Login/logout (Google OAuth) | Supabase Auth |
| `ThemeContext` | Light/dark mode | localStorage (`glowmi_theme`) |
| `LanguageContext` | EN/KO switching + `t(en, ko)` function | localStorage (`glowmi_lang`) |

---

## Accessibility Rules

- All buttons must have `:focus-visible` styles (keyboard users)
- Icon-only buttons require `aria-label` (theme toggle, language toggle, close buttons, etc.)
- Modals: `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + ESC to close
- Tab buttons: `role="tab"` + `aria-selected` + `aria-controls`
- Touch targets minimum 44x44px (use `::after` for touch area even if visually smaller)

---

## Performance Optimization

- Tab components: React.lazy + Suspense (AiBeautyTab, ProductsTab, ProceduresTab, WellnessTab, MyPageTab)
- Vendor chunk splitting: vendor-react, vendor-supabase, vendor-tesseract (vite.config.js)
- CLS prevention: weather-card min-height 56px, body scrollbar-gutter: stable, img width/height required
- Third-party scripts: AdSense/gtag → requestIdleCallback deferred, Clarity stays async

---

## Component Structure

```
src/
├── App.jsx                    — Tab routing, lazy import, onboarding/release notes
├── main.jsx                   — React entry point
├── index.css                  — Global styles (CSS variables, accessibility, CLS prevention)
│
├── components/
│   ├── ai/                    — AI Beauty Analysis
│   │   ├── AiBeautyTab.jsx    — Tab container
│   │   ├── PersonalColorAnalysis.jsx — Personal color (10 types)
│   │   ├── FaceShapeDetector.jsx     — Face shape (7 types, 468 landmarks)
│   │   ├── SkinAnalyzer.jsx          — Skin condition (5 metrics)
│   │   ├── SkinChat.jsx              — AI Beauty Chat
│   │   └── analysis/                 — Analysis logic files
│   │
│   ├── products/              — K-Beauty Products/Ingredients
│   │   ├── ProductsTab.jsx
│   │   ├── ProductBrowser.jsx        — Product search/filter
│   │   ├── IngredientAnalyzer.jsx    — Ingredient analysis (OCR support)
│   │   └── CompatibilityChecker.jsx  — Ingredient compatibility check
│   │
│   ├── procedures/            — Procedure Guide
│   │   └── ProceduresTab.jsx         — 15+ procedures, clinic finder
│   │
│   ├── wellness/              — Wellness
│   │   ├── WellnessTab.jsx
│   │   ├── NutrientRecs.jsx          — Personalized nutrients
│   │   ├── KTrends.jsx               — K-Beauty trends
│   │   └── KYoutubers.jsx            — Popular YouTubers
│   │
│   ├── mypage/                — My Page (login required)
│   │   ├── MyPageTab.jsx
│   │   ├── AnalysisHistory.jsx       — Analysis history
│   │   ├── SkinProgress.jsx          — Skin change tracking (graph)
│   │   ├── SkinDiary.jsx             — Skin diary
│   │   ├── MyRoutine.jsx             — AM/PM routine management
│   │   └── ProductShelf.jsx          — Product shelf
│   │
│   ├── common/                — Shared Components
│   │   ├── WeatherTips.jsx           — Weather-based skincare tips
│   │   ├── OnboardingModal.jsx       — First visit tutorial
│   │   ├── ReleaseNotesModal.jsx     — Update notification
│   │   ├── ShareCard.jsx             — Instagram share card (dispatcher)
│   │   ├── shareCards/               — Card canvas drawing
│   │   │   ├── drawSkinCard.js       — Skin analysis card
│   │   │   ├── drawPCCard.js         — Personal color card
│   │   │   └── drawFSCard.js         — Face shape card
│   │   ├── GatedContent.jsx          — Non-member blur gate
│   │   ├── StartBenefitsCard.jsx     — Signup benefits card
│   │   ├── IllustrationPlaceholder.jsx — Illustration placeholder (lavender gradient)
│   │   └── CameraView.jsx           — Webcam capture
│   │
│   └── layout/                — Layout
│       ├── Header.jsx                — Logo, version, theme/language toggle
│       ├── TabNav.jsx                — Bottom tab navigation
│       └── Footer.jsx                — Footer links
│
├── constants/                 — Shared constants
│   └── aiMessages.js                — AI analysis messages, CONFETTI_DURATION
├── context/                   — React Context (see table above)
├── data/                      — Static data (product DB, ingredients, quiz, etc.)
├── lib/                       — Utilities (Gemini API, Supabase, storage)
│   ├── canvasHelpers.js             — Canvas utility functions (roundRect, drawCircle, etc.)
│   └── classNames.js                — Conditional className combiner
└── hooks/                     — Custom hooks
    ├── useCamera.js                 — Webcam/photo upload
    └── useResultPersistence.js      — OAuth redirect result preservation
```

---

## Key File Locations

| File | Role |
|------|------|
| `index.html` | Meta tags, structured data (7 JSON-LD types), noscript, third-party scripts |
| `public/robots.txt` | Crawler access control (search engines + AI bots) |
| `public/llms.txt` | AI crawler site summary |
| `public/sitemap.xml` | Sitemap (including blog) |
| `public/_headers` | Cloudflare cache headers |
| `public/_redirects` | Blog trailing-slash + SPA routing |
| `public/manifest.json` | PWA settings (app name, icons, theme color) |
| `vite.config.js` | Build config (esnext target, chunk splitting) |
| `tailwind.config.js` | Tailwind config (brand colors, responsive breakpoints) |
| `scripts/pre-push-check.js` | Pre-push validation (7 sections, 28 checks) |
| `functions/api/notify-signup.js` | Cloudflare Function — Discord signup alert |
| `src/lib/gemini.js` | Google Gemini API integration |
| `src/lib/db.js` | Supabase DB queries (results, diary, routines) |
| `docs/en/rag-architecture.md` | AI architecture documentation |
| `docs/en/seo-geo-guide.md` | SEO strategy documentation |
