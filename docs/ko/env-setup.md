---
title: 환경 설정 가이드
slug: env-setup-ko
language: KO
category: guide
---

# Glowmi 환경 설정 가이드

## 환경변수

| 변수 | 필수 여부 | 용도 | 발급처 |
|------|----------|------|--------|
| `VITE_GEMINI_API_KEY` | 로컬 개발만 | Google Gemini API 키 (AI 뷰티 분석) | [Google AI Studio](https://aistudio.google.com/apikey) |
| `VITE_SUPABASE_URL` | 필수 | Supabase 프로젝트 URL | Supabase Dashboard > Settings > API |
| `VITE_SUPABASE_ANON_KEY` | 필수 | Supabase 공개(anon) 키 | Supabase Dashboard > Settings > API |
| `VITE_LAMBDA_GEMINI_URL` | 프로덕션만 | AWS Lambda Gemini 프록시 URL | AWS Lambda 콘솔 — API Gateway URL |
| `DISCORD_WEBHOOK_URL` | 선택 | Discord 신규 가입 알림 웹훅 | Discord 서버 설정 > 연동 > 웹훅 |

---

## 로컬 개발 환경 설정

1. `.env.example`을 `.env`로 복사:
   ```bash
   cp .env.example .env
   ```

2. `.env`에 값 입력:
   ```
   VITE_GEMINI_API_KEY=your-gemini-api-key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. 의존성 설치 및 개발 서버 실행:
   ```bash
   npm install
   npm run dev
   ```

---

## 프로덕션 설정 (Cloudflare Pages)

1. Cloudflare Dashboard > Pages > 프로젝트 > Settings 이동
2. **Variables and Secrets** 메뉴
3. 각 변수를 Type: **Text**로 추가

### API 키 우선순위 (gemini.js)

```
1순위: AWS Lambda (VITE_LAMBDA_GEMINI_URL이 설정된 경우)
  → 모든 Gemini 호출이 Lambda를 거침
  → API 키는 Lambda 환경변수에 저장
  → CloudWatch가 모든 호출 모니터링

2순위: Cloudflare Functions (Lambda URL 없는 경우)
  → /api/gemini Cloudflare Function으로 호출
  → API 키는 Cloudflare Secret에 저장

3순위: 직접 API 호출 (로컬 개발만)
  → .env의 VITE_GEMINI_API_KEY 사용
  → API 키가 브라우저에 노출됨 (개발 환경만!)
```

---

## 보안 주의사항

- API 키를 소스 코드에 **절대** 하드코딩하지 말 것
- `.env`는 `.gitignore`에 포함 — 커밋되지 않음
- 프로덕션 키는 Cloudflare Secrets 또는 Lambda 환경변수에만 저장
- `VITE_` 접두사 변수는 브라우저에 노출됨 — 공개 키(Supabase anon key)에만 사용
- `DISCORD_WEBHOOK_URL`은 `VITE_` 접두사 없음 — 서버 사이드(Cloudflare Function)에서만 접근 가능
