const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

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

  const res = await fetch(GEMINI_URL, {
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
