# Glowmi RAG Architecture

## Overview
SkinChat에서 사용자 질문에 대해 우리 제품/성분 DB를 참고하여 맞춤 답변을 생성하는 RAG (Retrieval-Augmented Generation) 파이프라인.

## Flow

```
사용자 질문
    │
    ▼
┌──────────────┐
│  Embedding   │  Gemini embedding-001로 질문을 768차원 벡터로 변환
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Vector Search│  Supabase pgvector — 코사인 유사도로 가장 관련 있는
│  (pgvector)  │  제품/성분 5개 검색 (similarity > 0.3 필터)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Format     │  검색 결과를 텍스트로 포맷 (제품명, 브랜드, 성분, 피부타입 등)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Gemini LLM  │  사용자 질문 + 피부 데이터 + RAG 컨텍스트 → 맞춤 답변 생성
│ (2.5 Flash)  │
└──────────────┘
```

## Tech Stack

| 구성요소 | 기술 | 역할 |
|---------|------|------|
| Embedding | Gemini embedding-001 | 텍스트 → 768차원 벡터 변환 |
| Vector DB | Supabase pgvector | 벡터 저장 + 코사인 유사도 검색 |
| LLM | Gemini 2.5 Flash | 컨텍스트 기반 답변 생성 |
| Proxy | Cloudflare Functions | API 키 서버 사이드 보호 |

## Data

- **제품**: 108개 (K-뷰티 제품 — 클렌저, 토너, 세럼, 크림, 선크림 등)
- **성분**: 99개 (활성성분, 보습제, 에몰리언트, 식물추출물 등)
- **총 임베딩**: 207개, 각 768차원
- **검색 인덱스**: IVFFlat (lists=1, 소규모 최적)

## Key Files

| 파일 | 역할 |
|------|------|
| `src/lib/rag.js` | 벡터 검색 + 결과 포맷팅 |
| `src/lib/gemini.js` | Gemini API 호출 (프록시/직접 자동 분기) + `getEmbedding()` |
| `src/components/ai/SkinChat.jsx` | RAG 컨텍스트를 AI Chat에 주입 |
| `functions/api/gemini.js` | Cloudflare Function — Gemini generateContent 프록시 |
| `functions/api/embedding.js` | Cloudflare Function — Gemini embedding 프록시 |
| `scripts/generate-embeddings.js` | 제품/성분 데이터 임베딩 일괄 생성 (일회성) |
| `scripts/supabase-rag-setup.sql` | pgvector 테이블 + RPC 함수 SQL |

## Supabase Schema

```sql
-- embeddings 테이블
id text primary key          -- "product:cosrx-snail-mucin" 또는 "ingredient:niacinamide"
type text                    -- "product" 또는 "ingredient"
content text                 -- 임베딩 생성에 사용된 원본 텍스트
metadata jsonb               -- 원본 데이터 (name, brand, category 등)
embedding vector(768)        -- 768차원 벡터

-- RPC 함수: match_embeddings(query_embedding, match_count, filter_type)
-- 코사인 유사도 기반 검색, 결과: id, type, content, metadata, similarity
```

## Error Handling

- RAG 검색 실패 시 → 기존 대화 유지 (graceful fallback)
- 임베딩 API 실패 시 → RAG 없이 일반 AI 답변
- similarity < 0.3 결과 → 필터링 (관련 없는 결과 제외)

## API Key Flow

```
프로덕션:  브라우저 → /api/gemini (Cloudflare Function) → Gemini API
           (GEMINI_API_KEY는 Cloudflare Secret에 저장, 브라우저 노출 없음)

로컬 개발: 브라우저 → Gemini API 직접 호출
           (VITE_GEMINI_API_KEY를 .env에서 로드)
```
