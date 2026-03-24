---
title: SEO & GEO Guide
slug: seo-geo-guide-en
language: EN
category: strategy
---

# Glowmi SEO & GEO (Generative Engine Optimization) Guide

> Last updated: 2026-02-12 (v2.0.3)

## Current SEO Strategy

### Structured Data (JSON-LD) — index.html

| Schema Type | Purpose | Notes |
|------------|------|------|
| WebSite + SearchAction | Site search box | Shows in-site search in Google results |
| Organization | Brand entity recognition | sameAs field: add social profiles here |
| WebApplication | App info rich result | featureList lists key features |
| FAQPage | AI citation + rich result | 9 Q&As (EN/KO). 3.2x increase in AI Overview exposure |
| HowTo | Step-by-step guide | Personal color analysis in 3 steps |
| BreadcrumbList | Site hierarchy | Home → Blog (2 levels only, SPA — no hash URLs) |
| Blog + BlogPosting | Blog rich results | Must include dateModified, author, description, image |

### robots.txt — AI Bot Management Strategy

**Core principle: Allow search citations, block unauthorized training**

| Bot | Company | Purpose | Policy |
|----|------|------|------|
| Googlebot | Google | Search indexing | Allow |
| Bingbot | Microsoft | Search indexing | Allow |
| AdsBot-Google | Google | AdSense quality check | Allow (required) |
| OAI-SearchBot | OpenAI | ChatGPT search results | Allow (citation traffic) |
| ChatGPT-User | OpenAI | User browsing | Allow (citation traffic) |
| PerplexityBot | Perplexity | AI search | Allow (citation traffic) |
| Applebot | Apple | Apple Search/AI | Allow |
| GPTBot | OpenAI | Model training data | **Disallow** |
| Google-Extended | Google | Gemini training | **Disallow** (no impact on Search indexing) |
| CCBot | Common Crawl | Public training dataset | **Disallow** |
| meta-externalagent | Meta | LLM training | **Disallow** |
| Bytespider | ByteDance | AI data collection | **Disallow** |
| cohere-ai | Cohere | LLM training | **Disallow** |

### llms.txt — AI Crawler Guide

- Location: `public/llms.txt` → `glowmi.org/llms.txt`
- Format: Markdown (llmstxt.org spec)
- Purpose: Provide a concise summary of key features/content so AI agents can quickly understand the site
- Update trigger: When new features/pages are added

### noscript Content — SPA Crawling Enhancement

- Location: `index.html` `<noscript>` tag
- Strategy: Include **specific statistics** for +30~40% AI citation effect
  - "10 personal color types", "468 facial landmarks", "5 skin metrics"
  - "7-question quiz", "15+ procedures", "50-70% cheaper than US"
  - "over 50 common skincare ingredients"

### Third-Party Script Management

| Script | Loading Method | Reason |
|----------|-----------|------|
| AdSense | requestIdleCallback deferred | LCP protection. Load after page |
| gtag (Analytics) | requestIdleCallback deferred | LCP protection. Load after page |
| Clarity | async (immediate) | User behavior tracking, lightweight |

### Performance Optimization (Core Web Vitals)

| Metric | Target | Applied Optimization |
|------|------|--------------|
| LCP | < 2.5s | React.lazy tab splitting, third-party script deferral, vendor chunk splitting, esnext target |
| CLS | < 0.1 | weather-card min-height, scrollbar-gutter: stable, img width/height, modal overflowY |
| INP | < 200ms | Already good (200ms) |

---

## Not Applied / Future Considerations

### 1. SPA Prerendering (High Impact, High Risk)

- **Why not applied**: puppeteer-based, could affect build pipeline/Cloudflare Pages deployment
- **Alternative in use**: Rich noscript content + llms.txt + full structured data
- **Future plan**: Test `@prerenderer/rollup-plugin` or Cloudflare Workers SSR on a separate branch

### 2. react-helmet-async (Medium Impact)

- SPA with single page — static meta tags are sufficient for now
- Re-evaluate when adding multi-route support

### 3. Social Media Profile Integration

- Organization schema `sameAs` field
- Add URLs when social media accounts are created

---

## GEO Research Key Data (2025-2026)

### Princeton GEO Study — How to Increase AI Citation Rate

| Method | Effect | Applied? |
|------|------|-----------|
| Cite Sources | +30~40% | Partially (specific sources in FAQ) |
| Statistics | +30~40% | Applied (numbers in noscript, FAQ) |
| Expert Quotations | +30~40% | Not yet (can apply in blog content) |
| Keyword Stuffing | **No effect** | meta keywords removed |

### AI Crawler Trends

- GPTBot crawl share: 5% → 30% (2024.5 → 2025.5, Cloudflare data)
- 560K+ sites running AI bot robots.txt rules
- 87% of ChatGPT citations are based on Bing search results

### Key Sources

- [Princeton GEO Paper](https://arxiv.org/pdf/2311.09735)
- [llmstxt.org Spec](https://llmstxt.org/)
- [Google Structured Data Docs](https://developers.google.com/search/docs/appearance/structured-data)
- [Momentic AI Crawler List](https://momenticmarketing.com/blog/ai-search-crawlers-bots)
- [Cloudflare AI Crawler Report](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/)
