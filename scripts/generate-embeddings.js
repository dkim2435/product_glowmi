/**
 * 제품/성분 데이터를 임베딩하여 Supabase에 저장하는 일회성 스크립트.
 * 사용법: node scripts/generate-embeddings.js
 */

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY
const EMBEDDING_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent'
const SUPABASE_URL = 'https://notxbgusqkyrqqrkdaly.supabase.co'
const SUPABASE_KEY = 'sb_publishable_9YB99zTogPRKJy0423Tbcw_tGNN2tcv'

if (!GEMINI_API_KEY) {
  console.error('VITE_GEMINI_API_KEY 환경변수가 필요합니다. .env 파일을 확인하세요.')
  process.exit(1)
}

// --- 제품 데이터 (src/data/products.js에서 가져옴 — ESM이라 직접 복사) ---
async function loadProducts() {
  const mod = await import('file://' + process.cwd().replace(/\\/g, '/') + '/src/data/products.js')
  return mod.PRODUCT_DB
}

async function loadIngredients() {
  const mod = await import('file://' + process.cwd().replace(/\\/g, '/') + '/src/data/ingredients.js')
  return mod.INGREDIENT_DB
}

async function getEmbedding(text) {
  const res = await fetch(`${EMBEDDING_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      outputDimensionality: 768
    })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Embedding error ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.embedding?.values
}

async function upsertEmbedding(id, type, content, metadata, embedding) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({ id, type, content, metadata, embedding: JSON.stringify(embedding) })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase error ${res.status}: ${err}`)
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('=== Glowmi RAG 임베딩 생성 시작 ===\n')

  // 1) 제품 임베딩
  const products = await loadProducts()
  console.log(`제품 ${products.length}개 로드 완료`)

  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    const text = [
      `${p.name} (${p.nameKr}) by ${p.brand}`,
      `Category: ${p.category}${p.subcategory ? '/' + p.subcategory : ''}`,
      `Key ingredients: ${p.keyIngredients.join(', ')}`,
      `For skin types: ${p.skinTypes.join(', ')}`,
      `Skin concerns: ${p.skinConcerns.join(', ')}`,
      `Price: ${p.priceRange}`,
      p.description
    ].join('. ')

    try {
      const embedding = await getEmbedding(text)
      await upsertEmbedding(`product:${p.id}`, 'product', text, p, embedding)
      console.log(`  [${i + 1}/${products.length}] ${p.name}`)
    } catch (err) {
      console.error(`  ERROR: ${p.name} — ${err.message}`)
    }

    // Rate limit 방지 (60 RPM → 1초 간격)
    if (i < products.length - 1) await sleep(1100)
  }

  // 2) 성분 임베딩
  const ingredients = await loadIngredients()
  console.log(`\n성분 ${ingredients.length}개 로드 완료`)

  for (let i = 0; i < ingredients.length; i++) {
    const ing = ingredients[i]
    const text = [
      `${ing.name} (${ing.nameKr})`,
      `Category: ${ing.category}, Rating: ${ing.rating}`,
      `Comedogenic: ${ing.comedogenic}/5, Irritation: ${ing.irritation}/5`,
      ing.description
    ].join('. ')

    try {
      const embedding = await getEmbedding(text)
      await upsertEmbedding(`ingredient:${ing.name.toLowerCase().replace(/\s+/g, '-')}`, 'ingredient', text, ing, embedding)
      console.log(`  [${i + 1}/${ingredients.length}] ${ing.name}`)
    } catch (err) {
      console.error(`  ERROR: ${ing.name} — ${err.message}`)
    }

    if (i < ingredients.length - 1) await sleep(1100)
  }

  console.log('\n=== 완료! ===')
}

main().catch(console.error)
