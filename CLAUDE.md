# Glowmi — Claude Code 가이드

## 사용자 소통 규칙
- **친구처럼 편하게 대화** — 딱딱한 존댓말보다 친근한 톤으로. 친구한테 설명해주듯이
- **한국어로 답변** — 사용자는 한국어를 선호함. 항상 한국어로 대화할 것
- **외부 서비스 안내는 영어 기준** — Cloudflare, GitHub 등 사용자가 쓰는 사이트/도구는 모두 영어 설정이므로 메뉴명, 버튼명은 영어 그대로 안내할 것
- **작업 후 반드시 브리핑** — 뭘 했는지, 뭐가 바뀌었는지, 문제는 없는지 매번 정리해서 알려줄 것
- 사용자는 코딩/IT 비전문가. 기술 용어를 최대한 피하고, 쓸 경우 반드시 쉬운 말로 풀어서 설명할 것
- 설명은 항상 친절하고, 심플하고, 차근차근 단계별로
- "CDN 캐시 퍼지" 같은 말 대신 "Cloudflare에서 저장된 옛날 파일 지우기" 식으로 풀어쓰기
- 작업 결과 브리핑 시에도 핵심만 간결하게, 전문 용어 남발 금지
- **Cloudflare 캐시 안내 시 주의** — "Purge Everything"은 사이트 전체가 느려질 수 있으니 반드시 "Custom URL"로 특정 파일만 지우는 방법을 먼저 안내할 것

## 푸시 전 체크리스트
1. **매 푸시마다 버전 올리기 (필수)** — patch 버전을 반드시 +1 (예: 1.3.2 → 1.3.3)
2. **3곳 동기화** — package.json `version`, Header.jsx `logo-version`, ReleaseNotesModal.jsx `APP_VERSION` 세 곳 모두 동일한 버전으로 업데이트
3. **npm run build** — 빌드 에러 없는지 확인
4. **.env 키가 코드에 하드코딩 안 됐는지** — API 키가 소스에 직접 들어가면 안 됨
5. **구조화 데이터 유효성** — index.html의 JSON-LD 블록이 유효한 JSON인지 확인 (FAQPage, Blog, BreadcrumbList 등)
6. **robots.txt AI봇 구분 유지** — 검색봇(OAI-SearchBot, PerplexityBot)은 Allow, 학습봇(GPTBot, CCBot)은 Disallow 구분 유지
7. **llms.txt 동기화** — 새 기능/페이지 추가 시 public/llms.txt에도 반영
8. **UX 안내 문구 확인** — 새 기능에 사용자 가이드 텍스트 포함 여부 확인 (빈 상태 메시지, 기능 설명, 범례/툴팁, 한/영 모두)
9. **자동 체크리스트 실행** — `npm run pre-push`로 위 항목들 자동 검증

## 버전 관리 규칙
- 버전은 Header.jsx, ReleaseNotesModal.jsx, package.json 3곳에서 동기화
- 릴리즈 노트는 사용자가 읽기 쉬운 한/영 설명으로 작성

## 프로젝트 구조
- 프론트엔드: React + Vite (build target: esnext)
- 배포: Cloudflare Pages
- 환경변수: Cloudflare Pages Settings > Variables and Secrets (Type: Text)
- AI 분석: Google Gemini 2.0 Flash (API 키: VITE_GEMINI_API_KEY)
- 폴백: Gemini 실패 시 MediaPipe 로컬 분석으로 자동 전환

## SEO / GEO 가이드라인
- **구조화 데이터 (index.html)**: WebSite, Organization, WebApplication, FAQPage, HowTo, BreadcrumbList, Blog+BlogPosting — 총 7종 JSON-LD
- **robots.txt 전략**: AI 검색봇 Allow (인용/트래픽) + AI 학습봇 Disallow (무단 학습 방지) 분리
- **llms.txt**: AI 크롤러를 위한 사이트 요약 마크다운 (public/llms.txt)
- **noscript**: SPA 크롤링 보완용 풍부한 HTML — 구체적 통계 수치 포함
- **BlogPosting에는 반드시 포함**: datePublished, dateModified, description, author, image
- **BreadcrumbList**: SPA이므로 Home → Blog 2단계만 (해시 URL은 사용하지 않음)
- **meta keywords 사용 금지**: Google이 2009년부터 무시. 절대 추가하지 말 것
- **제3자 스크립트**: AdSense, gtag는 requestIdleCallback으로 지연 로딩 (LCP 보호)

## 성능 최적화 규칙
- 탭 컴포넌트: React.lazy + Suspense (AiBeautyTab, ProductsTab, ProceduresTab, WellnessTab, MyPageTab)
- Vendor chunk 분리: vendor-react, vendor-supabase, vendor-tesseract (vite.config.js)
- CLS 방지: weather-card min-height 56px, body scrollbar-gutter: stable, img에 width/height 필수
- 제3자 스크립트: AdSense/gtag → requestIdleCallback 지연 로딩, Clarity는 async 유지

## 주요 파일 위치
| 파일 | 역할 |
|------|------|
| `index.html` | 메타태그, 구조화 데이터 (JSON-LD 7종), noscript, 제3자 스크립트 |
| `public/robots.txt` | 크롤러 접근 제어 (검색엔진 + AI봇) |
| `public/llms.txt` | AI 크롤러용 사이트 요약 |
| `public/sitemap.xml` | 사이트맵 (블로그 포함) |
| `public/_headers` | Cloudflare 캐시 헤더 |
| `vite.config.js` | 빌드 설정 (esnext target, 청크 분리) |
| `src/App.jsx` | 라우팅, lazy import, Suspense |
| `src/index.css` | 전역 스타일 (CLS 방지 포함) |
