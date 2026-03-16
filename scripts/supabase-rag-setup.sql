-- Glowmi RAG Setup — Supabase SQL Editor에서 실행
-- pgvector 확장 활성화 + embeddings 테이블 + 검색 함수

-- 1) pgvector 확장 활성화
create extension if not exists vector with schema extensions;

-- 2) embeddings 테이블
create table if not exists public.embeddings (
  id text primary key,            -- 예: "product:cosrx-snail-mucin" 또는 "ingredient:niacinamide"
  type text not null,             -- "product" 또는 "ingredient"
  content text not null,          -- 임베딩 생성에 사용된 원본 텍스트
  metadata jsonb default '{}'::jsonb, -- 원본 데이터 (name, nameKr, category 등)
  embedding vector(768),          -- 768차원 벡터 (Gemini embedding-001)
  created_at timestamptz default now()
);

-- 3) 벡터 검색 인덱스 (IVFFlat — 207개 소규모라 lists=1로 충분)
create index if not exists embeddings_vector_idx
  on public.embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 1);

-- 4) 코사인 유사도 검색 RPC 함수
create or replace function public.match_embeddings(
  query_embedding vector(768),
  match_count int default 5,
  filter_type text default null
)
returns table (
  id text,
  type text,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    e.id,
    e.type,
    e.content,
    e.metadata,
    1 - (e.embedding <=> query_embedding) as similarity
  from public.embeddings e
  where (filter_type is null or e.type = filter_type)
  order by e.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 5) RLS 설정 (읽기 전용 공개)
alter table public.embeddings enable row level security;

create policy "embeddings_read_all" on public.embeddings
  for select using (true);

-- 완료! 이제 scripts/generate-embeddings.js를 실행하면 됩니다.
