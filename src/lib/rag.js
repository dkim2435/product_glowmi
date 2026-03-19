import { supabase } from './supabase'
import { getEmbedding } from './gemini'
import { PRODUCT_DB } from '../data/products'

// Quick lookup: product id → amazonUrl
const AMAZON_MAP = {}
for (const p of PRODUCT_DB) {
  if (p.amazonUrl) AMAZON_MAP[p.id] = p.amazonUrl
}

/**
 * 사용자 질문으로 관련 제품/성분을 벡터 검색.
 * @returns {{ products: object[], ingredients: object[] }} 최대 5개
 */
export async function searchRelevantContext(query, { matchCount = 5 } = {}) {
  const embedding = await getEmbedding(query)

  const { data, error } = await supabase.rpc('match_embeddings', {
    query_embedding: JSON.stringify(embedding),
    match_count: matchCount,
  })

  if (error) throw error

  const products = []
  const ingredients = []

  for (const row of data || []) {
    if (row.similarity < 0.3) continue
    const item = { ...row.metadata, similarity: row.similarity }
    if (row.type === 'product') products.push(item)
    else ingredients.push(item)
  }

  return { products, ingredients }
}

/**
 * 제품만 검색 (agent 도구용).
 */
export async function searchProductsRAG(query) {
  const embedding = await getEmbedding(query)
  const { data, error } = await supabase.rpc('match_embeddings', {
    query_embedding: JSON.stringify(embedding),
    match_count: 5,
    filter_type: 'product',
  })
  if (error) throw error
  if (!data?.length) return 'No matching products found.'
  return data
    .filter(r => r.similarity >= 0.3)
    .map(r => {
      const p = r.metadata
      const amazonUrl = p.amazonUrl || AMAZON_MAP[r.id?.replace('product:', '')] || ''
      const amazonPart = amazonUrl ? ` | Amazon: ${amazonUrl}` : ''
      return `${p.name} (${p.nameKr}) by ${p.brand} — ${p.category}, ${p.priceRange}, key ingredients: ${p.keyIngredients?.join(', ') || 'N/A'}, for: ${p.skinTypes?.join(', ') || 'all'}, concerns: ${p.skinConcerns?.join(', ') || 'general'}${amazonPart}`
    })
    .join('\n') || 'No matching products found.'
}

/**
 * 성분만 검색 (agent 도구용).
 */
export async function searchIngredientsRAG(query) {
  const embedding = await getEmbedding(query)
  const { data, error } = await supabase.rpc('match_embeddings', {
    query_embedding: JSON.stringify(embedding),
    match_count: 5,
    filter_type: 'ingredient',
  })
  if (error) throw error
  if (!data?.length) return 'No matching ingredients found.'
  return data
    .filter(r => r.similarity >= 0.3)
    .map(r => {
      const ing = r.metadata
      return `${ing.name} (${ing.nameKr}) — ${ing.category}, rating: ${ing.rating}, comedogenic: ${ing.comedogenic}/5, irritation: ${ing.irritation}/5. ${ing.description}`
    })
    .join('\n') || 'No matching ingredients found.'
}

/**
 * RAG 검색 결과를 Gemini 프롬프트용 텍스트로 포맷.
 */
export function formatRAGContext(results) {
  const lines = []

  if (results.products.length > 0) {
    lines.push('=== Relevant Products from Our Database ===')
    for (const p of results.products) {
      lines.push(`- ${p.name} (${p.nameKr}) by ${p.brand}`)
      lines.push(`  Category: ${p.category}, Price: ${p.priceRange}`)
      if (p.keyIngredients?.length) lines.push(`  Key Ingredients: ${p.keyIngredients.join(', ')}`)
      if (p.skinTypes?.length) lines.push(`  For skin types: ${p.skinTypes.join(', ')}`)
      if (p.skinConcerns?.length) lines.push(`  Addresses: ${p.skinConcerns.join(', ')}`)
    }
  }

  if (results.ingredients.length > 0) {
    lines.push('=== Relevant Ingredients from Our Database ===')
    for (const ing of results.ingredients) {
      lines.push(`- ${ing.name} (${ing.nameKr}): ${ing.category}, rating=${ing.rating}`)
      if (ing.comedogenic != null) lines.push(`  Comedogenic: ${ing.comedogenic}/5, Irritation: ${ing.irritation}/5`)
    }
  }

  return lines.length > 0 ? lines.join('\n') : ''
}

// ── Skin Analysis → Product Pipeline ──────────────────────────

const CONCERN_QUERY_MAP = {
  redness: 'soothing calming product for redness sensitive skin centella cica',
  oiliness: 'oil control mattifying product for oily acne prone skin niacinamide BHA',
  dryness: 'hydrating moisturizing product for dry dehydrated skin hyaluronic acid ceramide',
  darkSpots: 'brightening product for dark spots hyperpigmentation vitamin C niacinamide',
  texture: 'exfoliating smoothing product for rough uneven texture AHA BHA',
}

/**
 * 피부 점수 → RAG 검색 쿼리 변환 (Gemini 호출 없음).
 * 내림차순 정렬, 최소 2개 ~ 최대 3개 (점수 무관하게 상위 2개는 항상 포함).
 */
export function skinScoresToQueries(scores) {
  const sorted = Object.entries(scores)
    .filter(([key]) => CONCERN_QUERY_MAP[key])
    .sort((a, b) => b[1] - a[1])

  // 항상 상위 2개 + 40점 이상인 추가 고민 (최대 3개)
  const top2 = sorted.slice(0, 2)
  const extra = sorted.slice(2).filter(([, v]) => v >= 40)
  return [...top2, ...extra]
    .slice(0, 3)
    .map(([key]) => CONCERN_QUERY_MAP[key])
}

/**
 * 피부 점수 기반 RAG 제품 검색.
 * 병렬 검색 → 중복 제거 → PRODUCT_DB enrichment.
 * @returns {{ all: object[], byCategory: Record<string, object[]> }}
 */
export async function searchProductsForRoutine(scores) {
  const queries = skinScoresToQueries(scores)
  if (queries.length === 0) return { all: [], byCategory: {} }

  const results = await Promise.all(
    queries.map(q => searchRelevantContext(q, { matchCount: 8 }))
  )

  // Deduplicate by product name, keep highest similarity
  const seen = new Map()
  for (const r of results) {
    for (const p of r.products) {
      const key = p.name || p.id
      if (!seen.has(key) || seen.get(key).similarity < p.similarity) {
        seen.set(key, p)
      }
    }
  }

  // Enrich with PRODUCT_DB data (amazonUrl, rating, etc.)
  const all = []
  for (const p of seen.values()) {
    const dbMatch = PRODUCT_DB.find(
      db => db.name === p.name || db.id === p.id
    )
    all.push({
      ...p,
      amazonUrl: p.amazonUrl || dbMatch?.amazonUrl || AMAZON_MAP[p.id] || '',
      rating: p.rating ?? dbMatch?.rating,
      priceRange: p.priceRange || dbMatch?.priceRange,
      subcategory: p.subcategory || dbMatch?.subcategory,
    })
  }

  // Sort by similarity desc
  all.sort((a, b) => (b.similarity || 0) - (a.similarity || 0))

  // Group by category
  const byCategory = {}
  for (const p of all) {
    const cat = p.category || 'other'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(p)
  }

  return { all, byCategory }
}
