---
title: 개발 가이드
slug: dev-guide-ko
language: KO
category: guide
---

# Glowmi 개발 가이드

## 프로젝트 개요

- **프론트엔드**: React 18 + Vite 6 (build target: esnext)
- **아이콘**: Lucide React (tree-shaking, vendor-lucide 청크 분리)
- **레이아웃**: 모바일 탭 네비 / 데스크톱(768px+) 사이드바 네비
- **앱스토어**: Capacitor (iOS/Android 빌드 준비 완료)
- **배포**: Cloudflare Pages (자동 배포: GitHub main 브랜치 푸시 시)
- **인증**: Supabase Auth (Google OAuth)
- **DB**: Supabase (분석 결과, 피부 일지, 루틴 저장)
- **AI 분석**: Google Gemini 2.5 Flash (API 키: VITE_GEMINI_API_KEY)
- **폴백**: Gemini 실패 시 MediaPipe 로컬 분석으로 자동 전환
- **알림**: Discord Webhook (신규 가입 알림, Cloudflare Function)

---

## 환경변수

| 변수 | 용도 |
|------|------|
| `VITE_GEMINI_API_KEY` | Google Gemini API 키 (AI 분석용) |
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase 공개 키 |
| `VITE_LAMBDA_GEMINI_URL` | AWS Lambda Gemini 프록시 URL (설정 시 Cloudflare 프록시 대신 사용) |
| `DISCORD_WEBHOOK_URL` | Discord 가입 알림 웹훅 (Cloudflare Function에서 사용) |

- 로컬 개발: `.env` 파일에 설정 (`.env.example` 참고)
- 프로덕션: Cloudflare Pages Settings > Variables and Secrets (Type: Text)

---

## 브랜드 컬러

| 이름 | 코드 | 용도 |
|------|------|------|
| Primary | `#8B7EC8` | 소프트 라벤더 — 메인 브랜드 컬러 |
| Secondary | `#6C5FA7` | 딥 라벤더 — 어두운 변형 |
| Accent | `#E8A0BF` | 로즈 핑크 — 포인트/강조 |
| Light BG | `#F5F0FF` | 연보라 배경 |
| Dark BG | `#1A1028` | 딥 퍼플 (다크 모드) |
| Gradient | `linear-gradient(135deg, #8B7EC8 0%, #6C5FA7 100%)` | 브랜드 그라데이션 |

컬러 히스토리: `#ff6b9d` (원조 핑크) → `#F4A698` (피치, v2.0.14) → `#CF8BA9` (더스티 로즈, v2.0.16) → `#8B7EC8` (소프트 라벤더, v2.5.0)

---

## 버전 관리

- 버전은 3곳에서 동기화: `package.json`, `Header.jsx` (logo-version), `ReleaseNotesModal.jsx` (APP_VERSION)
- 매 푸시마다 patch 버전 +1 필수
- 릴리즈 노트는 한/영 이중 언어로 작성

---

## 푸시 전 체크리스트

1. 3곳 모두 patch 버전 올리기 (+1)
2. `npm run build` — 빌드 에러 없는지 확인
3. API 키 소스 코드에 하드코딩 안 됐는지 확인
4. index.html의 JSON-LD가 유효한 JSON인지 확인 (FAQPage, Blog, BreadcrumbList 등)
5. robots.txt AI봇 구분 유지 (검색봇 Allow, 학습봇 Disallow)
6. 새 기능/페이지 추가 시 llms.txt에 반영
7. 새 기능에 UX 안내 문구 포함 여부 확인 (빈 상태 메시지, 기능 설명, 범례/툴팁, 한/영 모두)
8. `git push` 시 pre-push hook이 자동 실행 (실패 시 푸시 차단)

---

## 상태 관리 (React Context)

| Context | 역할 | 저장소 |
|---------|------|--------|
| `AuthContext` | 로그인/로그아웃 (Google OAuth) | Supabase Auth |
| `ThemeContext` | 라이트/다크 모드 | localStorage (`glowmi_theme`) |
| `LanguageContext` | 영어/한국어 전환 + `t(en, ko)` 함수 | localStorage (`glowmi_lang`) |

---

## 접근성 규칙

- 모든 버튼에 `:focus-visible` 스타일 필수 (키보드 사용자 지원)
- 아이콘 전용 버튼에는 `aria-label` 필수 (테마 토글, 언어 토글, 닫기 버튼 등)
- 모달에는 `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + ESC 키로 닫기
- 탭 버튼에는 `role="tab"` + `aria-selected` + `aria-controls`
- 터치 타겟 최소 44x44px (시각적으로 작더라도 `::after`로 터치 영역 확보)

---

## 성능 최적화

- 탭 컴포넌트: React.lazy + Suspense (AiBeautyTab, ProductsTab, ProceduresTab, WellnessTab, MyPageTab)
- Vendor chunk 분리: vendor-react, vendor-supabase, vendor-tesseract (vite.config.js)
- CLS 방지: weather-card min-height 56px, body scrollbar-gutter: stable, img에 width/height 필수
- 제3자 스크립트: AdSense/gtag → requestIdleCallback 지연 로딩, Clarity는 async 유지

---

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
│   │   ├── ShareCard.jsx             — 인스타 공유 카드 (디스패처)
│   │   ├── shareCards/               — 카드별 캔버스 드로잉
│   │   │   ├── drawSkinCard.js       — 피부 분석 카드
│   │   │   ├── drawPCCard.js         — 퍼스널컬러 카드
│   │   │   └── drawFSCard.js         — 얼굴형 카드
│   │   ├── GatedContent.jsx          — 비회원 블러 게이트 (공통)
│   │   ├── StartBenefitsCard.jsx     — 가입 혜택 카드 (공통)
│   │   ├── IllustrationPlaceholder.jsx — 일러스트 플레이스홀더 (라벤더 그라데이션)
│   │   └── CameraView.jsx           — 웹캠 촬영
│   │
│   └── layout/                — 레이아웃
│       ├── Header.jsx                — 로고, 버전, 테마/언어 토글
│       ├── TabNav.jsx                — 하단 탭 네비게이션
│       └── Footer.jsx                — 푸터 링크
│
├── constants/                 — 공유 상수
│   └── aiMessages.js                — AI 분석 공통 메시지, CONFETTI_DURATION
├── context/                   — React Context (위 표 참고)
├── data/                      — 정적 데이터 (제품 DB, 성분, 퀴즈 등)
├── lib/                       — 유틸리티 (Gemini API, Supabase, 스토리지)
│   ├── canvasHelpers.js             — 캔버스 공통 함수 (roundRect, drawCircle 등)
│   └── classNames.js                — 조건부 className 결합 유틸
└── hooks/                     — 커스텀 훅
    ├── useCamera.js                 — 웹캠/사진 업로드
    └── useResultPersistence.js      — OAuth 리다이렉트 결과 보존
```

---

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
| `vite.config.js` | 빌드 설정 (esnext target, 청크 분리) |
| `tailwind.config.js` | Tailwind 설정 (브랜드 컬러, 반응형 브레이크포인트) |
| `scripts/pre-push-check.js` | 푸시 전 자동 검증 (7개 항목, 28개 체크) |
| `functions/api/notify-signup.js` | Cloudflare Function — 가입 시 Discord 알림 |
| `src/lib/gemini.js` | Google Gemini API 연동 |
| `src/lib/db.js` | Supabase DB 쿼리 (결과 저장, 일지, 루틴) |
| `docs/ko/rag-architecture.md` | AI 아키텍처 문서 |
| `docs/ko/seo-geo-guide.md` | SEO 전략 문서 |
