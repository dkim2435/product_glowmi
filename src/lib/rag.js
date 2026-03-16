import { supabase } from './supabase'
import { getEmbedding } from './gemini'

/**
 * 사용자 질문으로 관련 제품/성분을 벡터 검색.
 * @returns {{ products: object[], ingredients: object[] }} 최대 5개
 */
export async function searchRelevantContext(query) {
  const embedding = await getEmbedding(query)

  const { data, error } = await supabase.rpc('match_embeddings', {
    query_embedding: JSON.stringify(embedding),
    match_count: 5,
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
      return `${p.name} (${p.nameKr}) by ${p.brand} — ${p.category}, ${p.priceRange}, key ingredients: ${p.keyIngredients?.join(', ') || 'N/A'}, for: ${p.skinTypes?.join(', ') || 'all'}, concerns: ${p.skinConcerns?.join(', ') || 'general'}`
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
