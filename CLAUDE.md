# Glowmi — Claude Code 가이드

## 푸시 전 체크리스트
1. **매 푸시마다 버전 올리기 (필수)** — patch 버전을 반드시 +1 (예: 1.3.2 → 1.3.3)
2. **3곳 동기화** — package.json `version`, Header.jsx `logo-version`, ReleaseNotesModal.jsx `APP_VERSION` 세 곳 모두 동일한 버전으로 업데이트
4. **npm run build** — 빌드 에러 없는지 확인
5. **.env 키가 코드에 하드코딩 안 됐는지** — API 키가 소스에 직접 들어가면 안 됨

## 버전 관리 규칙
- 버전은 Header.jsx, ReleaseNotesModal.jsx, package.json 3곳에서 동기화
- 릴리즈 노트는 사용자가 읽기 쉬운 한/영 설명으로 작성

## 프로젝트 구조
- 프론트엔드: React + Vite
- 배포: Cloudflare Pages
- 환경변수: Cloudflare Pages Settings > Variables and Secrets (Type: Text)
- AI 분석: Google Gemini 2.0 Flash (API 키: VITE_GEMINI_API_KEY)
- 폴백: Gemini 실패 시 MediaPipe 로컬 분석으로 자동 전환
