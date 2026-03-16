import { callGeminiAgent } from './gemini'
import { searchProductsRAG, searchIngredientsRAG } from './rag'
import { loadAnalysisResults, loadRoutines, loadDiaryEntries } from './db'
import { getWeatherCache } from './storage'
import { PRODUCT_DB } from '../data/products'

// Quick lookup for matching product names to DB entries with Amazon URLs
function findMatchingProducts(toolResults) {
  const matched = []
  const seen = new Set()
  for (const result of toolResults) {
    if (!result.includes('Amazon:')) continue
    // Each line has "ProductName (한국어) by Brand ... | Amazon: URL"
    for (const line of result.split('\n')) {
      const amazonMatch = line.match(/\| Amazon: (https:\/\/[^\s]+)/)
      const nameMatch = line.match(/^(.+?) \(/)
      if (amazonMatch && nameMatch) {
        const name = nameMatch[1].trim()
        if (seen.has(name)) continue
        seen.add(name)
        // Find in PRODUCT_DB for full info
        const dbProduct = PRODUCT_DB.find(p => p.name === name)
        if (dbProduct) {
          matched.push({ name: dbProduct.name, nameKr: dbProduct.nameKr, brand: dbProduct.brand, amazonUrl: amazonMatch[1] })
        } else {
          matched.push({ name, nameKr: '', brand: '', amazonUrl: amazonMatch[1] })
        }
      }
    }
  }
  return matched.slice(0, 5)
}

const MAX_ITERATIONS = 3

const TOOL_DECLARATIONS = [
  {
    name: 'searchProducts',
    description: 'Search K-beauty product database by query. Use when user asks about product recommendations, specific products, or product comparisons.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query for products (e.g. "moisturizer for dry skin", "vitamin C serum")' }
      },
      required: ['query']
    }
  },
  {
    name: 'searchIngredients',
    description: 'Search skincare ingredient database. Use when user asks about specific ingredients, ingredient safety, or ingredient interactions.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query for ingredients (e.g. "niacinamide", "retinol safety")' }
      },
      required: ['query']
    }
  },
  {
    name: 'getUserSkinData',
    description: 'Get user skin analysis results (skin scores, personal color type, skin type). Use when user asks about their skin condition or needs personalized advice.',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'getWeather',
    description: 'Get current weather (temperature, humidity, UV index). Use when user asks about weather-appropriate skincare or sun protection.',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'getUserRoutine',
    description: 'Get user current AM/PM skincare routine. Use when user asks about their routine, routine optimization, or product ordering.',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'getUserDiary',
    description: 'Get recent skin diary entries (last 14 days). Use when user asks about skin trends, recent changes, or lifestyle impact on skin.',
    parameters: { type: 'object', properties: {} }
  }
]

const TOOL_LABEL = {
  searchProducts: { en: 'Searching products...', kr: '제품 검색 중...' },
  searchIngredients: { en: 'Searching ingredients...', kr: '성분 검색 중...' },
  getUserSkinData: { en: 'Checking your skin data...', kr: '피부 데이터 확인 중...' },
  getWeather: { en: 'Checking weather...', kr: '날씨 확인 중...' },
  getUserRoutine: { en: 'Checking your routine...', kr: '루틴 확인 중...' },
  getUserDiary: { en: 'Reading your diary...', kr: '피부 일지 확인 중...' }
}

async function executeToolCall(name, args, userId) {
  try {
    switch (name) {
      case 'searchProducts':
        return await withTimeout(searchProductsRAG(args.query), 8000)
      case 'searchIngredients':
        return await withTimeout(searchIngredientsRAG(args.query), 8000)
      case 'getUserSkinData': {
        if (!userId) return 'User not logged in. No skin data available.'
        const data = await withTimeout(loadAnalysisResults(userId), 5000)
        if (!data) return 'No skin analysis results yet.'
        const parts = []
        if (data.skin_redness) parts.push(`Skin scores — Redness: ${data.skin_redness}, Oiliness: ${data.skin_oiliness}, Dryness: ${data.skin_dryness}, Dark Spots: ${data.skin_dark_spots}, Texture: ${data.skin_texture}`)
        if (data.pc_type) parts.push(`Personal color: ${data.pc_type}`)
        if (data.quiz_type) parts.push(`Skin type: ${data.quiz_type}`)
        return parts.length > 0 ? parts.join('\n') : 'No skin analysis results yet.'
      }
      case 'getWeather': {
        const w = getWeatherCache()
        if (!w) return 'Weather data not available.'
        return `Temperature: ${w.temp}°C, Humidity: ${w.humidity}%, UV Index: ${w.uvIndex}`
      }
      case 'getUserRoutine': {
        if (!userId) return 'User not logged in.'
        const routineRows = await withTimeout(loadRoutines(userId), 5000)
        if (!routineRows?.length) return 'No routine saved yet.'
        const am = routineRows.find(r => r.routine_type === 'am')
        const pm = routineRows.find(r => r.routine_type === 'pm')
        const lines = []
        if (am?.steps?.length) lines.push('AM: ' + am.steps.map(s => `${s.category}: ${s.name}`).join(' → '))
        if (pm?.steps?.length) lines.push('PM: ' + pm.steps.map(s => `${s.category}: ${s.name}`).join(' → '))
        return lines.length > 0 ? lines.join('\n') : 'No routine saved yet.'
      }
      case 'getUserDiary': {
        if (!userId) return 'User not logged in.'
        const entries = await withTimeout(loadDiaryEntries(userId, 14), 5000)
        if (!entries?.length) return 'No diary entries yet.'
        return entries.slice(0, 7).map(e =>
          `${e.entry_date}: condition=${e.overall_condition || '-'}, sleep=${e.sleep_hours || '-'}h, stress=${e.stress_level || '-'}, water=${e.water_intake || '-'}L`
        ).join('\n')
      }
      default:
        return `Unknown tool: ${name}`
    }
  } catch (err) {
    return `Tool error: ${err.message}`
  }
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ])
}

/**
 * Run agentic chat — AI decides which tools to call.
 * @param {object[]} conversationHistory - chat messages
 * @param {string|null} userId - Supabase user id
 * @param {string} userContext - skin profile summary
 * @param {object} opts - { onToolCall?: (label) => void }
 * @returns {string} final text response
 */
export async function runAgentChat(conversationHistory, userId, userContext, opts = {}) {
  const systemPrompt = `You are Glowmi AI, a friendly K-Beauty skincare advisor. You have access to tools to look up real data.

User's skin profile:
${userContext || 'No skin data available.'}

RULES:
- Use tools to get REAL data before answering. Don't make up product names or ingredient info.
- For product recommendations: ALWAYS call searchProducts first.
- For ingredient questions: ALWAYS call searchIngredients first.
- For personalized advice: call getUserSkinData to check their skin profile.
- For weather-related advice: call getWeather.
- For routine questions: call getUserRoutine AND searchProducts together — find real purchasable products for each routine step.
- For skin trend questions: call getUserDiary.
- You can call multiple tools at once if needed.
- If a tool returns no data or an error, give general advice instead.
- IMPORTANT: Whenever you mention a specific product, ALWAYS include its Amazon purchase link if available. Format as: [아마존에서 구매](URL) or [Buy on Amazon](URL). The searchProducts tool results include "Amazon: URL" — you MUST use these URLs in your response. This is critical for our business.
- Answer in the same language the user writes in (Korean or English).
- Keep answers concise but always include Amazon links for mentioned products.
- Be warm and encouraging.
- If asked about medical conditions, recommend seeing a dermatologist.
- Stay on topic (skincare, beauty, K-beauty products).`

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt + '\n\nPlease acknowledge you are ready.' }] },
    { role: 'model', parts: [{ text: 'Ready to help with skincare advice using real product data!' }] },
    ...conversationHistory
  ]

  const tools = [{ functionDeclarations: TOOL_DECLARATIONS }]
  const allToolResults = [] // collect searchProducts results for product cards

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const data = await callGeminiAgent({
      contents,
      tools,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    })

    const parts = data?.candidates?.[0]?.content?.parts
    if (!parts?.length) throw new Error('Empty response from agent')

    // Check for function calls first (prioritize tool use over text)
    const functionCalls = parts.filter(p => p.functionCall)
    if (functionCalls.length === 0) {
      // No function calls — check for text (final answer)
      const textPart = parts.find(p => p.text)
      if (textPart) {
        const products = findMatchingProducts(allToolResults)
        return { text: textPart.text, products }
      }
      throw new Error('No text or function calls in response')
    }

    // Add model response to conversation
    contents.push({ role: 'model', parts })

    // Execute tools
    const responseParts = []
    for (const fc of functionCalls) {
      const label = TOOL_LABEL[fc.functionCall.name]
      if (label) opts.onToolCall?.(label)

      const result = await executeToolCall(fc.functionCall.name, fc.functionCall.args, userId)

      // Track searchProducts results for product cards
      if (fc.functionCall.name === 'searchProducts' && typeof result === 'string') {
        allToolResults.push(result)
      }

      responseParts.push({
        functionResponse: {
          name: fc.functionCall.name,
          response: { result: typeof result === 'string' ? result : JSON.stringify(result) }
        }
      })
    }

    contents.push({ role: 'user', parts: responseParts })
  }

  throw new Error('Agent exceeded max iterations')
}

export { TOOL_LABEL }
