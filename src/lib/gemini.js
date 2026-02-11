const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

/**
 * Resize an image to max 720px (longest side) and return base64 (no prefix).
 */
function resizeImageToBase64(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 720
      let w = img.naturalWidth
      let h = img.naturalHeight
      if (w > MAX || h > MAX) {
        const ratio = Math.min(MAX / w, MAX / h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      // strip "data:image/jpeg;base64," prefix
      resolve(dataUrl.split(',')[1])
    }
    img.onerror = reject
    img.src = imageSrc
  })
}

/**
 * Call Gemini API with an image and text prompt.
 * Returns parsed JSON object from Gemini's response.
 */
async function callGemini(imageBase64, prompt) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured')

  const url = `${GEMINI_URL}?key=${GEMINI_API_KEY}`

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1024
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Gemini API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('No response from Gemini')

  // Extract JSON from response (may be wrapped in ```json ... ```)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in Gemini response')

  return JSON.parse(jsonMatch[0])
}

/**
 * Call Gemini API with text-only prompt (no image).
 * Returns parsed JSON or raw text based on parseJson flag.
 */
async function callGeminiText(prompt, opts = {}) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured')

  const url = `${GEMINI_URL}?key=${GEMINI_API_KEY}`
  const temperature = opts.temperature ?? 0.1
  const maxOutputTokens = opts.maxOutputTokens ?? 1024

  const body = {
    contents: opts.contents || [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature, maxOutputTokens }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Gemini API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('No response from Gemini')

  if (opts.rawText) return text

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in Gemini response')
  return JSON.parse(jsonMatch[0])
}

/**
 * Call Gemini API with multiple images + text prompt.
 */
async function callGeminiMultiImage(imageSrcs, prompt, opts = {}) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured')

  const url = `${GEMINI_URL}?key=${GEMINI_API_KEY}`
  const parts = [{ text: prompt }]

  for (const src of imageSrcs) {
    const base64 = await resizeImageToBase64(src)
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64 } })
  }

  const body = {
    contents: [{ parts }],
    generationConfig: {
      temperature: opts.temperature ?? 0.1,
      maxOutputTokens: opts.maxOutputTokens ?? 1500
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Gemini API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('No response from Gemini')

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in Gemini response')
  return JSON.parse(jsonMatch[0])
}

/**
 * Generate AI skincare routine based on skin scores.
 */
export async function generateRoutineAI(skinScores) {
  const prompt = `You are an expert K-Beauty skincare advisor. Based on the user's skin analysis scores, create personalized AM and PM skincare routines.

Skin scores (5=minimal concern, 95=severe):
- Redness: ${skinScores.redness}
- Oiliness: ${skinScores.oiliness}
- Dryness: ${skinScores.dryness}
- Dark Spots: ${skinScores.darkSpots}
- Texture: ${skinScores.texture}

Rules:
- AM routine: 4-6 steps, MUST end with sunscreen
- PM routine: 5-8 steps, MUST start with oil_cleanser then water_cleanser (double cleanse)
- category MUST be one of: oil_cleanser, water_cleanser, exfoliator, toner, essence, serum, sheet_mask, eye_cream, moisturizer, sunscreen, sleeping_mask, other
- Recommend specific product types (not brand names) with key ingredients in parentheses
- Tailor recommendations to the skin concerns shown by the scores

Respond with ONLY a JSON object:
{
  "am": [{"category": "water_cleanser", "name": "Gentle Foam Cleanser (Centella)", "brand": ""}],
  "pm": [{"category": "oil_cleanser", "name": "Gentle Oil Cleanser", "brand": ""}],
  "weeklyTips": ["AHA exfoliation 2x/week"],
  "summary": "English summary of the routine strategy",
  "summaryKr": "한국어 루틴 전략 요약"
}`

  return await callGeminiText(prompt)
}

/**
 * Assess ingredient list against user's skin profile.
 */
export async function assessIngredientsForSkinAI(ingredientNames, skinScores) {
  const ingredients = ingredientNames.slice(0, 30).join(', ')
  const prompt = `You are an expert cosmetic chemist and dermatologist. Assess whether this product is suitable for the user's skin.

Product ingredients: ${ingredients}

User's skin scores (5=minimal, 95=severe):
- Redness: ${skinScores.redness}
- Oiliness: ${skinScores.oiliness}
- Dryness: ${skinScores.dryness}
- Dark Spots: ${skinScores.darkSpots}
- Texture: ${skinScores.texture}

Respond with ONLY a JSON object:
{
  "verdict": "good",
  "score": 8,
  "summary": "Great match for your skin",
  "summaryKr": "피부에 잘 맞는 제품입니다",
  "goodIngredients": [{"name": "Centella Asiatica", "reason": "Soothes redness", "reasonKr": "홍조 진정에 도움"}],
  "badIngredients": [{"name": "Fragrance", "reason": "May irritate sensitive skin", "reasonKr": "민감한 피부에 자극 가능"}],
  "tips": ["Apply after toner for best absorption"],
  "tipsKr": ["토너 후 사용하면 흡수가 좋습니다"]
}

verdict: "good" (score 7-10), "caution" (score 4-6), or "bad" (score 1-3)
score: 1-10 overall compatibility
List 1-5 good and bad ingredients each. Be specific about WHY each ingredient is good/bad for THIS user's skin.`

  return await callGeminiText(prompt)
}

/**
 * Generate AI progress report comparing two skin photos.
 */
export async function generateProgressReportAI(photoOldSrc, photoNewSrc, scoresOld, scoresNew, daysBetween) {
  const prompt = `You are an expert dermatologist. Compare these two facial photos taken ${daysBetween} days apart. The FIRST image is the BEFORE photo and the SECOND image is the AFTER photo.

Score changes (5=minimal concern, 95=severe):
- Redness: ${scoresOld?.redness ?? '?'} → ${scoresNew?.redness ?? '?'}
- Oiliness: ${scoresOld?.oiliness ?? '?'} → ${scoresNew?.oiliness ?? '?'}
- Dryness: ${scoresOld?.dryness ?? '?'} → ${scoresNew?.dryness ?? '?'}
- Dark Spots: ${scoresOld?.darkSpots ?? '?'} → ${scoresNew?.darkSpots ?? '?'}
- Texture: ${scoresOld?.texture ?? '?'} → ${scoresNew?.texture ?? '?'}

Respond with ONLY a JSON object:
{
  "overallProgress": "improved",
  "overallSummary": "Visible improvement in skin clarity and reduced redness",
  "overallSummaryKr": "피부 투명도 개선과 홍조 감소가 보입니다",
  "improvements": [{"area": "Redness", "detail": "Noticeably less facial redness", "detailKr": "홍조가 눈에 띄게 감소"}],
  "concerns": [{"area": "Dark Spots", "detail": "Still present on cheeks", "detailKr": "볼 부위에 아직 남아있음"}],
  "recommendations": ["Continue with centella-based products"],
  "recommendationsKr": ["시카 제품을 계속 사용하세요"],
  "encouragement": "Great progress! Keep up your routine.",
  "encouragementKr": "훌륭한 진전입니다! 루틴을 유지하세요."
}

overallProgress: "improved", "stable", or "declined"
Be honest but encouraging. Focus on visible changes between the photos.`

  return await callGeminiMultiImage([photoOldSrc, photoNewSrc], prompt)
}

/**
 * AI skincare chat — multi-turn conversation.
 */
export async function chatSkincare(conversationHistory, userContext) {
  const systemPrompt = `You are a friendly, knowledgeable K-Beauty skincare advisor named Glowmi AI. You provide personalized skincare advice.

User's skin profile:
${userContext}

Rules:
- Keep answers concise (2-4 sentences max)
- Be warm and encouraging
- Give specific, actionable advice based on the user's skin data
- Answer in the same language the user writes in (Korean or English)
- If asked about medical conditions, recommend seeing a dermatologist
- Stay on topic (skincare, beauty, K-beauty products)`

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt + '\n\nPlease greet the user briefly.' }] },
    { role: 'model', parts: [{ text: 'Understood! I\'m ready to help with skincare advice.' }] },
    ...conversationHistory
  ]

  return await callGeminiText('', {
    contents,
    temperature: 0.7,
    maxOutputTokens: 512,
    rawText: true
  })
}

/**
 * Combined skin analysis — merges AI photo scores + quiz answers for comprehensive skin type.
 */
export async function analyzeSkinCombinedAI(skinScores, quizAnswers, season) {
  const prompt = `You are an expert dermatologist and skin type analyst. Based on the AI photo analysis scores AND the user's self-reported quiz answers, determine their comprehensive skin type.

AI Photo Analysis Scores (5=minimal concern, 95=severe):
- Redness: ${skinScores.redness}
- Oiliness: ${skinScores.oiliness}
- Dryness: ${skinScores.dryness}
- Dark Spots: ${skinScores.darkSpots}
- Texture: ${skinScores.texture}

User's Quiz Answers:
1. Product reaction (sensitivity): ${quizAnswers[0]}
2. Seasonal skin changes (adaptability): ${quizAnswers[1]}
3. Biggest skin concern (subjective priority): ${quizAnswers[2]}
4. Afternoon skin feel (oil-moisture balance): ${quizAnswers[3]}
5. Stress/sleep skin response: ${quizAnswers[4]}

Current season: ${season}

You are NOT limited to 5 basic types. Use compound types when appropriate (e.g. dehydrated_oily, sensitive_combination, etc.).

Respond with ONLY a JSON object:
{
  "skinType": "dehydrated_oily",
  "skinTypeLabel": "Dehydrated Oily",
  "skinTypeLabelKr": "수분부족 지성",
  "skinTypeEmoji": "💧",
  "description": "English description of the skin type and why this was determined",
  "descriptionKr": "한국어 피부타입 설명",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "tipsKr": ["팁 1", "팁 2", "팁 3"],
  "keyIngredients": ["Hyaluronic Acid", "Niacinamide"],
  "avoidIngredients": ["Alcohol", "Fragrance"]
}

Be specific and personalized. The description should explain WHY this type was determined based on both photo data and quiz responses. Provide 3-5 tips and 3-5 key/avoid ingredients each.`

  return await callGeminiText(prompt)
}

/**
 * Analyze personal color type using Gemini AI.
 * Returns: { type, confidence, warmth, depth, clarity, skinRgb, scores }
 */
export async function analyzePersonalColorAI(imageSrc) {
  const base64 = await resizeImageToBase64(imageSrc)

  const prompt = `You are an expert personal color analyst. Analyze this person's photo and determine their personal color season type.

You MUST respond with ONLY a JSON object (no other text) with these exact fields:
- "type": one of exactly these 10 values: "springBright", "springLight", "summerBright", "summerLight", "summerMute", "fallMute", "fallDeep", "fallStrong", "winterDeep", "winterBright"
- "confidence": number 60-95, your confidence percentage
- "warmth": number -100 to 100, negative=cool positive=warm
- "depth": number 0-100, 0=deep 100=light
- "clarity": number 0-100, 0=muted 100=bright
- "skinRgb": object with "r", "g", "b" (0-255) representing their skin tone color

Analyze the skin undertone, contrast, and clarity carefully. Consider:
- Warm vs cool undertone (yellow/golden vs pink/blue)
- Depth (how light or deep the coloring is)
- Clarity (bright/clear vs soft/muted)

Respond with ONLY the JSON object.`

  const result = await callGemini(base64, prompt)

  // Validate type
  const validTypes = ['springBright', 'springLight', 'summerBright', 'summerLight', 'summerMute', 'fallMute', 'fallDeep', 'fallStrong', 'winterDeep', 'winterBright']
  if (!validTypes.includes(result.type)) {
    throw new Error(`Invalid personal color type: ${result.type}`)
  }

  return {
    type: result.type,
    confidence: Math.max(50, Math.min(99, result.confidence || 75)),
    warmth: Math.max(-100, Math.min(100, result.warmth || 0)),
    depth: Math.max(0, Math.min(100, result.depth || 50)),
    clarity: Math.max(0, Math.min(100, result.clarity || 50)),
    skinRgb: {
      r: Math.max(0, Math.min(255, result.skinRgb?.r || 200)),
      g: Math.max(0, Math.min(255, result.skinRgb?.g || 180)),
      b: Math.max(0, Math.min(255, result.skinRgb?.b || 160))
    }
  }
}

/**
 * Analyze face shape using Gemini AI.
 * Returns: { shape, confidence, scores }
 */
export async function analyzeFaceShapeAI(imageSrc) {
  const base64 = await resizeImageToBase64(imageSrc)

  const prompt = `You are an expert face shape analyst. Analyze this person's photo and determine their face shape.

You MUST respond with ONLY a JSON object (no other text) with these exact fields:
- "shape": one of exactly these 6 values: "oval", "round", "square", "diamond", "heart", "long"
- "confidence": number 60-95, your confidence percentage
- "scores": object with all 6 shape keys ("oval", "round", "square", "diamond", "heart", "long"), each a number 0-100 representing likelihood percentage. They should sum to 100.

Analyze the jawline, cheekbones, forehead width, and face length-to-width ratio carefully.

Respond with ONLY the JSON object.`

  const result = await callGemini(base64, prompt)

  // Validate shape
  const validShapes = ['oval', 'round', 'square', 'diamond', 'heart', 'long']
  if (!validShapes.includes(result.shape)) {
    throw new Error(`Invalid face shape: ${result.shape}`)
  }

  const scores = {}
  for (const s of validShapes) {
    scores[s] = Math.max(0, Math.min(100, result.scores?.[s] || 0))
  }

  return {
    shape: result.shape,
    confidence: Math.max(50, Math.min(99, result.confidence || 75)),
    scores
  }
}

/**
 * Analyze skin condition using Gemini AI.
 * Returns: { redness, oiliness, dryness, darkSpots, texture }
 */
export async function analyzeSkinAI(imageSrc) {
  const base64 = await resizeImageToBase64(imageSrc)

  const prompt = `You are an expert dermatologist / skin analyst. Analyze this person's facial skin condition from the photo.

You MUST respond with ONLY a JSON object (no other text) with these exact fields, each a number from 5 to 95:
- "redness": how much facial redness/rosacea is visible (5=none, 95=severe)
- "oiliness": how oily/shiny the skin appears (5=none, 95=very oily)
- "dryness": how dry/flaky the skin appears (5=none, 95=very dry)
- "darkSpots": how much hyperpigmentation/dark spots are visible (5=none, 95=severe)
- "texture": how rough/uneven the skin texture is (5=smooth, 95=very rough)

Be realistic and nuanced in your assessment. Most healthy skin will have low to moderate scores.

Respond with ONLY the JSON object.`

  const result = await callGemini(base64, prompt)

  return {
    redness: Math.max(5, Math.min(95, result.redness || 30)),
    oiliness: Math.max(5, Math.min(95, result.oiliness || 30)),
    dryness: Math.max(5, Math.min(95, result.dryness || 30)),
    darkSpots: Math.max(5, Math.min(95, result.darkSpots || 20)),
    texture: Math.max(5, Math.min(95, result.texture || 25))
  }
}
