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
9. **자동 체크리스트 실행** — `git push` 시 pre-push hook이 자동으로 `npm run pre-push` 실행 (실패 시 푸시 차단)

## 버전 관리 규칙
- 버전은 Header.jsx, ReleaseNotesModal.jsx, package.json 3곳에서 동기화
- 릴리즈 노트는 사용자가 읽기 쉬운 한/영 설명으로 작성

## 프로젝트 구조
- 프론트엔드: React 18 + Vite 6 (build target: esnext)
- 배포: Cloudflare Pages (자동 배포: GitHub main 브랜치 푸시 시)
- 인증: Supabase Auth (Google OAuth)
- DB: Supabase (분석 결과, 피부 일지, 루틴 저장)
- AI 분석: Google Gemini 2.0 Flash (API 키: VITE_GEMINI_API_KEY)
- 폴백: Gemini 실패 시 MediaPipe 로컬 분석으로 자동 전환
- 알림: Discord Webhook (신규 가입 알림, Cloudflare Function)

## 환경변수
- **VITE_GEMINI_API_KEY** — Google Gemini API 키 (AI 분석용)
- **VITE_SUPABASE_URL** — Supabase 프로젝트 URL
- **VITE_SUPABASE_ANON_KEY** — Supabase 공개 키
- **DISCORD_WEBHOOK_URL** — Discord 가입 알림 웹훅 (Cloudflare Function에서 사용)
- 로컬 개발: `.env` 파일에 설정 (`.env.example` 참고)
- 프로덕션: Cloudflare Pages Settings > Variables and Secrets (Type: Text)

## 브랜드 컬러
- **Primary**: `#CF8BA9` (더스티 로즈)
- **Secondary**: `#A66A85` (진한 로즈)
- **Light**: `#FDF0F5` (연한 로즈 배경)
- **Gradient**: `linear-gradient(135deg, #CF8BA9 0%, #A66A85 100%)`
- 컬러 변경 시 반드시 동기화할 곳: CSS 변수 (index.css :root), 하드코딩된 값 (index.css 전체), JSX 파일 (SVG, Canvas), tailwind.config.js, index.html (theme-color), manifest.json, 404.html, 블로그 HTML, js/ 파일들
- 이전 컬러 히스토리: `#ff6b9d` (원조 핑크) → `#F4A698` (피치, v2.0.14) → `#CF8BA9` (더스티 로즈, v2.0.16)

## 접근성 (Accessibility) 규칙
- 모든 버튼에 `:focus-visible` 스타일 필수 (키보드 사용자 지원)
- 아이콘 전용 버튼에는 `aria-label` 필수 (테마 토글, 언어 토글, 닫기 버튼 등)
- 모달에는 `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + ESC 키로 닫기
- 탭 버튼에는 `role="tab"` + `aria-selected` + `aria-controls`
- 터치 타겟 최소 44x44px (시각적으로 작더라도 `::after`로 터치 영역 확보)

## SEO / GEO 가이드라인
- **구조화 데이터 (index.html)**: WebSite, Organization, WebApplication, FAQPage, HowTo, BreadcrumbList, Blog+BlogPosting — 총 7종 JSON-LD
- **robots.txt 전략**: AI 검색봇 Allow (인용/트래픽) + AI 학습봇 Disallow (무단 학습 방지) 분리
- **llms.txt**: AI 크롤러를 위한 사이트 요약 마크다운 (public/llms.txt)
- **noscript**: SPA 크롤링 보완용 풍부한 HTML — 구체적 통계 수치 포함
- **BlogPosting에는 반드시 포함**: datePublished, dateModified, description, author, image
- **BreadcrumbList**: SPA이므로 Home → Blog 2단계만 (해시 URL은 사용하지 않음)
- **meta keywords 사용 금지**: Google이 2009년부터 무시. 절대 추가하지 말 것
- **블로그 canonical URL**: 각 포스트에 `<link rel="canonical">` self-referencing 필수
- **블로그 내부 링크**: 각 포스트 하단에 "Related Articles" / "관련 글" 섹션으로 2~3개 관련 글 연결
- **블로그 수정 시**: sitemap.xml `lastmod` + JSON-LD `dateModified` 날짜도 함께 업데이트
- **제3자 스크립트**: AdSense, gtag는 requestIdleCallback으로 지연 로딩 (LCP 보호)

## 성능 최적화 규칙
- 탭 컴포넌트: React.lazy + Suspense (AiBeautyTab, ProductsTab, ProceduresTab, WellnessTab, MyPageTab)
- Vendor chunk 분리: vendor-react, vendor-supabase, vendor-tesseract (vite.config.js)
- CLS 방지: weather-card min-height 56px, body scrollbar-gutter: stable, img에 width/height 필수
- 제3자 스크립트: AdSense/gtag → requestIdleCallback 지연 로딩, Clarity는 async 유지

## 상태 관리 (React Context)
| Context | 역할 | 저장소 |
|---------|------|--------|
| `AuthContext` | 로그인/로그아웃 (Google OAuth) | Supabase Auth |
| `ThemeContext` | 라이트/다크 모드 | localStorage (`glowmi_theme`) |
| `LanguageContext` | 영어/한국어 전환 + `t(en, ko)` 함수 | localStorage (`glowmi_lang`) |

## 컴포넌트 구조
```
src/
├── App.jsx                    — 탭 라우팅, lazy import, 온보딩/릴리즈 노트
├── main.jsx                   — React 진입점
├── index.css                  — 전역 스타일 (CSS 변수, 접근성, CLS 방지)
│
├── components/
│   ├── ai/                    — AI 뷰티 분석
│   │   ├── AiBeautyTab.jsx    — 탭 컨테이너
│   │   ├── PersonalColorAnalysis.jsx — 퍼스널컬러 (10타입)
│   │   ├── FaceShapeDetector.jsx     — 얼굴형 (7타입, 468 랜드마크)
│   │   ├── SkinAnalyzer.jsx          — 피부 상태 (5지표)
│   │   ├── SkinChat.jsx              — AI 뷰티 상담
│   │   └── analysis/                 — 분석 로직 파일들
│   │
│   ├── products/              — K-뷰티 제품/성분
│   │   ├── ProductsTab.jsx
│   │   ├── ProductBrowser.jsx        — 제품 검색/필터
│   │   ├── IngredientAnalyzer.jsx    — 성분 분석 (OCR 지원)
│   │   └── CompatibilityChecker.jsx  — 성분 호환성 체크
│   │
│   ├── procedures/            — 시술 가이드
│   │   └── ProceduresTab.jsx         — 15+ 시술 정보, 클리닉 파인더
│   │
│   ├── wellness/              — 웰니스
│   │   ├── WellnessTab.jsx
│   │   ├── NutrientRecs.jsx          — 맞춤 영양소
│   │   ├── KTrends.jsx               — K-뷰티 트렌드
│   │   └── KYoutubers.jsx            — 인기 유튜버
│   │
│   ├── mypage/                — 마이페이지 (로그인 필요)
│   │   ├── MyPageTab.jsx
│   │   ├── AnalysisHistory.jsx       — 분석 히스토리
│   │   ├── SkinProgress.jsx          — 피부 변화 추적 (그래프)
│   │   ├── SkinDiary.jsx             — 피부 일지
│   │   ├── MyRoutine.jsx             — AM/PM 루틴 관리
│   │   └── ProductShelf.jsx          — 제품 선반
│   │
│   ├── common/                — 공통 컴포넌트
│   │   ├── WeatherTips.jsx           — 날씨 기반 스킨케어 팁
│   │   ├── OnboardingModal.jsx       — 첫 방문 튜토리얼
│   │   ├── ReleaseNotesModal.jsx     — 업데이트 알림
│   │   ├── PageModal.jsx             — 범용 모달
│   │   ├── ShareCard.jsx             — 인스타 공유 카드
│   │   └── CameraView.jsx           — 웹캠 촬영
│   │
│   └── layout/                — 레이아웃
│       ├── Header.jsx                — 로고, 버전, 테마/언어 토글
│       ├── TabNav.jsx                — 하단 탭 네비게이션
│       └── Footer.jsx                — 푸터 링크
│
├── context/                   — React Context (위 표 참고)
├── data/                      — 정적 데이터 (제품 DB, 성분, 퀴즈 등)
├── lib/                       — 유틸리티 (Gemini API, Supabase, 스토리지)
└── hooks/                     — 커스텀 훅 (useCamera)
```

## 주요 파일 위치
| 파일 | 역할 |
|------|------|
| `index.html` | 메타태그, 구조화 데이터 (JSON-LD 7종), noscript, 제3자 스크립트 |
| `public/robots.txt` | 크롤러 접근 제어 (검색엔진 + AI봇) |
| `public/llms.txt` | AI 크롤러용 사이트 요약 |
| `public/sitemap.xml` | 사이트맵 (블로그 포함) |
| `public/_headers` | Cloudflare 캐시 헤더 |
| `public/_redirects` | 블로그 trailing-slash + SPA 라우팅 |
| `public/manifest.json` | PWA 설정 (앱 이름, 아이콘, 테마 컬러) |
| `public/blog/*.html` | 블로그 포스트 (독립 HTML, 각자 JSON-LD 포함) |
| `vite.config.js` | 빌드 설정 (esnext target, 청크 분리) |
| `tailwind.config.js` | Tailwind 설정 (브랜드 컬러, 반응형 브레이크포인트) |
| `scripts/pre-push-check.js` | 푸시 전 자동 검증 (7개 항목, 28개 체크) |
| `functions/api/notify-signup.js` | Cloudflare Function — 가입 시 Discord 알림 |
| `src/App.jsx` | 라우팅, lazy import, Suspense |
| `src/index.css` | 전역 스타일 (CSS 변수, 접근성, CLS 방지) |
| `src/lib/gemini.js` | Google Gemini API 연동 |
| `src/lib/db.js` | Supabase DB 쿼리 (결과 저장, 일지, 루틴) |
| `docs/SEO_GEO_GUIDE.md` | SEO 전략 상세 문서 |
