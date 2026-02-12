# Glowmi SEO & GEO (Generative Engine Optimization) 가이드

> 최종 업데이트: 2026-02-12 (v2.0.3)

## 현재 적용된 SEO 전략

### 구조화 데이터 (JSON-LD) — index.html

| 스키마 타입 | 목적 | 비고 |
|------------|------|------|
| WebSite + SearchAction | 사이트 검색 박스 | Google 검색결과에 사이트 내 검색 표시 |
| Organization | 브랜드 엔티티 인식 | sameAs 필드: 소셜 프로필 추가 시 여기에 반영 |
| WebApplication | 앱 정보 리치 결과 | featureList에 주요 기능 나열 |
| FAQPage | AI 인용 + 리치 결과 | 9개 Q&A (한/영). AI Overview 노출 3.2x 증가 효과 |
| HowTo | 단계별 가이드 | 퍼스널컬러 분석 방법 3단계 |
| BreadcrumbList | 사이트 계층 구조 | Home → Blog 2단계 (SPA이므로 해시 URL 미사용) |
| Blog + BlogPosting | 블로그 리치 결과 | dateModified, author, description, image 포함 필수 |

### robots.txt — AI봇 관리 전략

**핵심 원칙: 검색 인용은 허용, 무단 학습은 차단**

| 봇 | 회사 | 용도 | 정책 |
|----|------|------|------|
| Googlebot | Google | 검색 인덱싱 | Allow |
| Bingbot | Microsoft | 검색 인덱싱 | Allow |
| AdsBot-Google | Google | AdSense 품질 검사 | Allow (필수) |
| OAI-SearchBot | OpenAI | ChatGPT 검색 결과 | Allow (인용 트래픽) |
| ChatGPT-User | OpenAI | 사용자 브라우징 | Allow (인용 트래픽) |
| PerplexityBot | Perplexity | AI 검색 | Allow (인용 트래픽) |
| Applebot | Apple | Apple 검색/AI | Allow |
| GPTBot | OpenAI | 모델 학습 데이터 | **Disallow** |
| Google-Extended | Google | Gemini 학습 | **Disallow** (Search 인덱싱에 무영향) |
| CCBot | Common Crawl | 공개 학습 데이터셋 | **Disallow** |
| meta-externalagent | Meta | LLM 학습 | **Disallow** |
| Bytespider | ByteDance | AI 데이터 수집 | **Disallow** |
| cohere-ai | Cohere | LLM 학습 | **Disallow** |

### llms.txt — AI 크롤러 가이드

- 위치: `public/llms.txt` → `glowmi.org/llms.txt`
- 형식: 마크다운 (llmstxt.org 사양)
- 목적: AI 에이전트가 사이트를 빠르게 이해하도록 핵심 기능/콘텐츠 요약 제공
- 업데이트 시점: 새 기능/페이지 추가 시

### noscript 콘텐츠 — SPA 크롤링 보완

- 위치: `index.html` `<noscript>` 태그 내
- 전략: AI 인용률 +30~40% 효과가 있는 **구체적 통계 수치** 포함
  - "10 personal color types", "468 facial landmarks", "5 skin metrics"
  - "7-question quiz", "15+ procedures", "50-70% cheaper than US"
  - "over 50 common skincare ingredients"

### 제3자 스크립트 관리

| 스크립트 | 로딩 방식 | 이유 |
|----------|-----------|------|
| AdSense | requestIdleCallback 지연 | LCP 보호. 페이지 로드 후 로딩 |
| gtag (Analytics) | requestIdleCallback 지연 | LCP 보호. 페이지 로드 후 로딩 |
| Clarity | async (즉시) | 사용자 행동 추적, 가벼움 |

### 성능 최적화 (Core Web Vitals)

| 지표 | 목표 | 적용된 최적화 |
|------|------|--------------|
| LCP | < 2.5s | React.lazy 탭 분리, 제3자 스크립트 지연, vendor chunk 분리, esnext target |
| CLS | < 0.1 | weather-card min-height, scrollbar-gutter: stable, img width/height, modal overflowY |
| INP | < 200ms | 이미 양호 (200ms) |

---

## 미적용 / 향후 검토 항목

### 1. SPA Prerendering (높은 임팩트, 높은 리스크)

- **현재 미적용 이유**: puppeteer 기반으로 빌드 파이프라인/Cloudflare Pages 배포에 영향 가능
- **대안으로 적용 중**: noscript 풍부한 콘텐츠 + llms.txt + 전체 구조화 데이터
- **향후 검토**: `@prerenderer/rollup-plugin` 또는 Cloudflare Workers SSR을 별도 브랜치에서 테스트

### 2. react-helmet-async (중간 임팩트)

- SPA이지만 단일 페이지이므로 현재 정적 meta 태그로 충분
- 멀티 라우트 추가 시 검토 필요

### 3. 소셜 미디어 프로필 연동

- Organization 스키마의 `sameAs` 필드
- 소셜 미디어 계정 생성 시 URL 추가

---

## GEO 리서치 핵심 데이터 (2025-2026)

### Princeton GEO 연구 — AI 인용률 높이는 방법

| 방법 | 효과 | 적용 여부 |
|------|------|-----------|
| 출처 인용 (Cite Sources) | +30~40% | 부분 적용 (FAQ에 구체적 출처) |
| 통계 수치 (Statistics) | +30~40% | 적용 (noscript, FAQ에 수치 포함) |
| 전문가 인용문 (Quotations) | +30~40% | 미적용 (블로그 콘텐츠에서 적용 가능) |
| 키워드 스터핑 | **무효** | meta keywords 제거 완료 |

### AI 크롤러 트렌드

- GPTBot 크롤 점유율: 5% → 30% (2024.5 → 2025.5, Cloudflare 데이터)
- 560K+ 사이트가 AI봇 robots.txt 규칙 운영 중
- ChatGPT 인용의 87%가 Bing 검색 결과 기반

### 주요 출처

- [Princeton GEO 논문](https://arxiv.org/pdf/2311.09735)
- [llmstxt.org 사양](https://llmstxt.org/)
- [Google 구조화 데이터 문서](https://developers.google.com/search/docs/appearance/structured-data)
- [Momentic AI 크롤러 목록](https://momenticmarketing.com/blog/ai-search-crawlers-bots)
- [Cloudflare AI 크롤러 리포트](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/)
