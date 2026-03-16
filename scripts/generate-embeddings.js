/**
 * Glowmi RAG — 임베딩 일괄 생성 스크립트
 *
 * 실행 방법:
 *   npm run generate-embeddings
 *
 * 필요한 환경변수 (.env 파일):
 *   VITE_GEMINI_API_KEY   — Gemini API 키
 *
 * Supabase 설정은 src/lib/supabase.js와 동일한 값을 사용.
 * 한 번만 실행하면 됨. 데이터가 바뀌면 다시 실행.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── .env에서 Gemini API 키만 가져오기 ──
const envPath = resolve(__dirname, '..', '.env')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx).trim()
  let val = trimmed.slice(eqIdx + 1).trim()
  // 따옴표 제거 ("value" 또는 'value' → value)
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  env[key] = val
}

const GEMINI_API_KEY = env.VITE_GEMINI_API_KEY
if (!GEMINI_API_KEY) { console.error('VITE_GEMINI_API_KEY not set in .env'); process.exit(1) }

// 키가 잘 읽혔는지 첫 8자만 보여주기
console.log(`🔑 API 키 확인: ${GEMINI_API_KEY.slice(0, 8)}...`)

// ── Supabase (src/lib/supabase.js와 동일) ──
const supabase = createClient(
  'https://notxbgusqkyrqqrkdaly.supabase.co',
  'sb_publishable_9YB99zTogPRKJy0423Tbcw_tGNN2tcv'
)

const EMBEDDING_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent'

// ── 데이터 로드 (ESM import로 직접 가져올 수 없으니 파일 읽어서 파싱) ──
// products.js와 ingredients.js는 브라우저용 ESM인데 Node에서도 동적 import 가능

async function loadData() {
  const productsModule = await import(pathToFileURL(resolve(__dirname, '..', 'src', 'data', 'products.js')).href)
  const ingredientsModule = await import(pathToFileURL(resolve(__dirname, '..', 'src', 'data', 'ingredients.js')).href)
  return {
    products: productsModule.PRODUCT_DB,
    ingredients: ingredientsModule.INGREDIENT_DB,
  }
}

// ── 텍스트 포맷팅 (양국어) ──

function formatProductText(p) {
  const parts = [
    `${p.name} (${p.nameKr})`,
    `Brand: ${p.brand}`,
    `Category: ${p.category}${p.subcategory ? ` / ${p.subcategory}` : ''}`,
    `Key Ingredients: ${p.keyIngredients?.join(', ') || 'N/A'}`,
    `Skin Types: ${p.skinTypes?.join(', ') || 'all'}`,
    `Skin Concerns: ${p.skinConcerns?.join(', ') || 'general'}`,
    `Price: ${p.priceRange || 'mid'}`,
    p.description,
  ]
  return parts.join('. ')
}

function formatIngredientText(ing) {
  const parts = [
    `${ing.name} (${ing.nameKr})`,
    `Category: ${ing.category}`,
    `Rating: ${ing.rating}`,
    `Comedogenic: ${ing.comedogenic}/5`,
    `Irritation: ${ing.irritation}/5`,
    ing.description,
    ing.descriptionKr,
  ]
  return parts.join('. ')
}

// ── Gemini 임베딩 호출 ──

async function getEmbedding(text) {
  const res = await fetch(`${EMBEDDING_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      outputDimensionality: 768,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Embedding API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.embedding?.values
}

// ── Supabase에 저장 ──

async function upsertEmbedding(id, type, content, metadata, embedding) {
  const { error } = await supabase.from('embeddings').upsert({
    id,
    type,
    content,
    metadata,
    embedding: JSON.stringify(embedding),
  }, { onConflict: 'id' })

  if (error) throw error
}

// ── 메인 ──

async function main() {
  console.log('📦 데이터 로드 중...')
  const { products, ingredients } = await loadData()
  console.log(`  제품: ${products.length}개, 성분: ${ingredients.length}개`)

  let success = 0
  let failed = 0
  const total = products.length + ingredients.length

  // 제품 임베딩
  console.log('\n🏷️  제품 임베딩 생성 중...')
  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    const id = `product:${p.id}`
    const text = formatProductText(p)
    const metadata = {
      name: p.name,
      nameKr: p.nameKr,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      keyIngredients: p.keyIngredients,
      skinTypes: p.skinTypes,
      skinConcerns: p.skinConcerns,
      priceRange: p.priceRange,
      rating: p.rating,
    }

    try {
      const embedding = await getEmbedding(text)
      await upsertEmbedding(id, 'product', text, metadata, embedding)
      success++
      process.stdout.write(`\r  [${i + 1}/${products.length}] ${p.name}`)
    } catch (e) {
      failed++
      console.error(`\n  ❌ ${p.name}: ${e.message}`)
    }

    // Rate limit: Gemini 무료 티어는 분당 1500 요청이지만 여유있게
    if ((i + 1) % 10 === 0) await sleep(1000)
  }

  // 성분 임베딩
  console.log('\n\n🧪 성분 임베딩 생성 중...')
  for (let i = 0; i < ingredients.length; i++) {
    const ing = ingredients[i]
    const id = `ingredient:${ing.name.toLowerCase().replace(/\s+/g, '-')}`
    const text = formatIngredientText(ing)
    const metadata = {
      name: ing.name,
      nameKr: ing.nameKr,
      category: ing.category,
      rating: ing.rating,
      comedogenic: ing.comedogenic,
      irritation: ing.irritation,
    }

    try {
      const embedding = await getEmbedding(text)
      await upsertEmbedding(id, 'ingredient', text, metadata, embedding)
      success++
      process.stdout.write(`\r  [${i + 1}/${ingredients.length}] ${ing.name}`)
    } catch (e) {
      failed++
      console.error(`\n  ❌ ${ing.name}: ${e.message}`)
    }

    if ((i + 1) % 10 === 0) await sleep(1000)
  }

  console.log(`\n\n✅ 완료! 성공: ${success}/${total}, 실패: ${failed}`)
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
