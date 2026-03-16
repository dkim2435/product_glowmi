# Glowmi RAG Architecture

## Overview
RAG (Retrieval-Augmented Generation) pipeline that grounds SkinChat responses in our curated product/ingredient database — so the AI recommends real K-beauty products instead of generic advice.

SkinChat에서 사용자 질문에 대해 우리 제품/성분 DB를 참고하여 맞춤 답변을 생성하는 RAG 파이프라인. AI가 일반론이 아닌 실제 K-뷰티 제품을 추천할 수 있게 해줌.

## Flow

```
User Question (사용자 질문)
    │
    ▼
┌──────────────┐
│  Embedding   │  Convert question to 768-dim vector via Gemini embedding-001
│              │  질문을 768차원 벡터로 변환
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Vector Search│  Cosine similarity search in Supabase pgvector
│  (pgvector)  │  Top 5 results, filtered by similarity > 0.3
│              │  코사인 유사도로 가장 관련 있는 제품/성분 5개 검색
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Format     │  Format results as text (product name, brand, ingredients, skin types)
│              │  검색 결과를 텍스트로 포맷
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Gemini LLM  │  User question + skin data + RAG context → personalized answer
│ (2.5 Flash)  │  사용자 질문 + 피부 데이터 + RAG 컨텍스트 → 맞춤 답변 생성
└──────────────┘
```

## Tech Stack

| Component (구성요소) | Technology (기술) | Role (역할) |
|---------|------|------|
| Embedding (임베딩) | Gemini embedding-001 | Text → 768-dim vector (텍스트 → 768차원 벡터 변환) |
| Vector DB (벡터 DB) | Supabase pgvector | Vector storage + cosine similarity search (벡터 저장 + 유사도 검색) |
| LLM | Gemini 2.5 Flash | Context-aware answer generation (컨텍스트 기반 답변 생성) |
| Proxy (프록시) | Cloudflare Functions | Server-side API key protection (API 키 서버 사이드 보호) |

## Data

- **Products (제품)**: 108 items (K-beauty — cleansers, toners, serums, creams, sunscreens, etc.)
- **Ingredients (성분)**: 99 items (actives, humectants, emollients, botanicals, etc.)
- **Total embeddings (총 임베딩)**: 207, each 768 dimensions
- **Search index (검색 인덱스)**: IVFFlat (lists=1, optimized for small dataset)

## Key Files (주요 파일)

| File (파일) | Role (역할) |
|------|------|
| `src/lib/rag.js` | Vector search + result formatting (벡터 검색 + 결과 포맷팅) |
| `src/lib/gemini.js` | Gemini API calls (auto proxy/direct switch) + `getEmbedding()` |
| `src/components/ai/SkinChat.jsx` | Injects RAG context into AI Chat (RAG 컨텍스트를 채팅에 주입) |
| `functions/api/gemini.js` | Cloudflare Function — Gemini generateContent proxy |
| `functions/api/embedding.js` | Cloudflare Function — Gemini embedding proxy |
| `scripts/generate-embeddings.js` | Batch embedding generation (임베딩 일괄 생성, 일회성) |
| `scripts/supabase-rag-setup.sql` | pgvector table + RPC function SQL |

## Supabase Schema

```sql
-- embeddings table (임베딩 테이블)
id text primary key          -- e.g. "product:cosrx-snail-mucin" or "ingredient:niacinamide"
type text                    -- "product" or "ingredient"
content text                 -- Original text used for embedding (임베딩 생성에 사용된 원본 텍스트)
metadata jsonb               -- Source data (name, brand, category, etc.) (원본 데이터)
embedding vector(768)        -- 768-dimensional vector (768차원 벡터)

-- RPC function: match_embeddings(query_embedding, match_count, filter_type)
-- Cosine similarity search → returns: id, type, content, metadata, similarity
-- 코사인 유사도 검색 → 결과: id, type, content, metadata, similarity
```

## Error Handling (에러 처리)

- RAG search fails → chat continues without product context (graceful fallback)
  RAG 검색 실패 시 → 제품 추천 없이 일반 대화 유지
- Embedding API fails → falls back to non-RAG AI answer
  임베딩 API 실패 시 → RAG 없이 일반 AI 답변
- similarity < 0.3 → filtered out (irrelevant results excluded)
  유사도 0.3 미만 → 필터링 (관련 없는 결과 제외)

## API Key Flow (API 키 흐름)

```
Production (프로덕션):
  Browser → /api/gemini (Cloudflare Function) → Gemini API
  GEMINI_API_KEY stored as Cloudflare Secret — never exposed to browser
  API 키는 Cloudflare Secret에 저장 — 브라우저에 노출 안 됨

Local Dev (로컬 개발):
  Browser → Gemini API (direct call)
  VITE_GEMINI_API_KEY loaded from .env file
  .env 파일에서 키 로드
```

## Example: Before vs After RAG (RAG 적용 전후 비교)

**Without RAG (RAG 없이):**
> User: "선크림 추천해줘"
> AI: "SPF 50 이상의 선크림을 매일 사용하세요." (generic / 일반적)

**With RAG (RAG 적용 후):**
> User: "선크림 추천해줘"
> AI: "건성 피부시니까 **Beauty of Joseon Relief Sun**이나 **Skin1004 Hyaluronic Acid Watery Sun Gel** 추천해요!" (real products from our DB / 우리 DB의 실제 제품)
