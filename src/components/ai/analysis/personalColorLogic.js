// Pure functions for personal color analysis — no DOM dependencies

export function sampleSkinRegion(ctx, landmark, imgW, imgH) {
  const px = Math.round(landmark.x * imgW)
  const py = Math.round(landmark.y * imgH)
  const half = 3 // 7x7 region
  const x0 = Math.max(0, px - half)
  const y0 = Math.max(0, py - half)
  const x1 = Math.min(imgW - 1, px + half)
  const y1 = Math.min(imgH - 1, py + half)
  const w = x1 - x0 + 1
  const h = y1 - y0 + 1
  if (w < 1 || h < 1) return null
  const data = ctx.getImageData(x0, y0, w, h).data
  let totalR = 0, totalG = 0, totalB = 0, count = 0
  for (let i = 0; i < data.length; i += 4) {
    totalR += data[i]
    totalG += data[i + 1]
    totalB += data[i + 2]
    count++
  }
  if (count === 0) return null
  return { r: totalR / count, g: totalG / count, b: totalB / count }
}

export function getMedianSkinColor(ctx, landmarks, imgW, imgH) {
  const indices = [10, 67, 297, 116, 345, 234, 454, 6, 152, 172, 397]
  const samples = []
  for (let i = 0; i < indices.length; i++) {
    const lm = landmarks[indices[i]]
    if (lm) {
      const s = sampleSkinRegion(ctx, lm, imgW, imgH)
      if (s) samples.push(s)
    }
  }
  if (samples.length === 0) return null
  samples.sort((a, b) => (a.r + a.g + a.b) - (b.r + b.g + b.b))
  const trimCount = Math.floor(samples.length * 0.2)
  let trimmed = samples.slice(trimCount, samples.length - trimCount)
  if (trimmed.length === 0) trimmed = samples
  let avgR = 0, avgG = 0, avgB = 0
  for (let j = 0; j < trimmed.length; j++) {
    avgR += trimmed[j].r
    avgG += trimmed[j].g
    avgB += trimmed[j].b
  }
  return {
    r: Math.round(avgR / trimmed.length),
    g: Math.round(avgG / trimmed.length),
    b: Math.round(avgB / trimmed.length)
  }
}

export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function normalizeWhiteBalance(rgb) {
  const avg = (rgb.r + rgb.g + rgb.b) / 3
  if (avg < 30 || avg > 240) return rgb
  const factor = 128 / avg
  const blendFactor = 0.3
  return {
    r: Math.round(rgb.r + (rgb.r * factor - rgb.r) * blendFactor),
    g: Math.round(rgb.g + (rgb.g * factor - rgb.g) * blendFactor),
    b: Math.round(rgb.b + (rgb.b * factor - rgb.b) * blendFactor)
  }
}

export function classifyUndertone(rgb, hsl) {
  const yellowIndex = (rgb.r - rgb.b) / 255
  const pinkIndex = (rgb.r - rgb.g) / 255
  let warmth = 0
  warmth += yellowIndex * 120
  warmth -= pinkIndex * 40
  if (hsl.h >= 15 && hsl.h <= 45) warmth += 20
  else if (hsl.h >= 0 && hsl.h < 15) warmth -= 15
  else if (hsl.h > 340) warmth -= 10
  warmth = Math.max(-100, Math.min(100, warmth))
  return warmth
}

export function classifyDepth(hsl) {
  return hsl.l
}

export function classifyClarity(hsl, rgb) {
  const chroma = (Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b)) / 255 * 100
  return hsl.s * 0.6 + chroma * 0.4
}

export function classifyPersonalColor(warmth, depth, clarity) {
  const types = {
    springBright:  { undertone: 'warm', depthRange: [45, 70], clarityRange: [50, 100] },
    springLight:   { undertone: 'warm', depthRange: [60, 85], clarityRange: [25, 60] },
    summerBright:  { undertone: 'cool', depthRange: [45, 70], clarityRange: [50, 100] },
    summerLight:   { undertone: 'cool', depthRange: [60, 85], clarityRange: [25, 60] },
    summerMute:    { undertone: 'cool', depthRange: [35, 60], clarityRange: [0, 40] },
    fallMute:      { undertone: 'warm', depthRange: [35, 60], clarityRange: [0, 40] },
    fallDeep:      { undertone: 'warm', depthRange: [15, 45], clarityRange: [25, 60] },
    fallStrong:    { undertone: 'warm', depthRange: [25, 55], clarityRange: [50, 100] },
    winterDeep:    { undertone: 'cool', depthRange: [15, 45], clarityRange: [35, 70] },
    winterBright:  { undertone: 'cool', depthRange: [30, 60], clarityRange: [50, 100] }
  }

  const scores = {}
  const keys = Object.keys(types)
  let totalScore = 0

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const t = types[key]
    let score = 0

    if (t.undertone === 'warm') score += Math.max(0, warmth) * 0.4
    else score += Math.max(0, -warmth) * 0.4

    const depthMid = (t.depthRange[0] + t.depthRange[1]) / 2
    const depthSpan = (t.depthRange[1] - t.depthRange[0]) / 2
    const depthDist = Math.abs(depth - depthMid)
    score += Math.max(0, 30 - (depthDist / depthSpan) * 30)

    const clarityMid = (t.clarityRange[0] + t.clarityRange[1]) / 2
    const claritySpan = (t.clarityRange[1] - t.clarityRange[0]) / 2
    const clarityDist = Math.abs(clarity - clarityMid)
    score += Math.max(0, 30 - (clarityDist / claritySpan) * 30)

    scores[key] = score
    totalScore += score
  }

  let maxKey = keys[0]
  let maxScore = 0
  for (let j = 0; j < keys.length; j++) {
    if (scores[keys[j]] > maxScore) {
      maxScore = scores[keys[j]]
      maxKey = keys[j]
    }
  }

  let confidence = totalScore > 0 ? Math.round((maxScore / totalScore) * 100 * 1.8) : 50
  confidence = Math.min(confidence, 95)
  confidence = Math.max(confidence, 50)

  return { type: maxKey, confidence, scores, warmth, depth, clarity }
}

export function analyzeSkinTone(ctx, landmarks, imgW, imgH) {
  const rawRgb = getMedianSkinColor(ctx, landmarks, imgW, imgH)
  if (!rawRgb) return null
  const rgb = normalizeWhiteBalance(rawRgb)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const warmth = classifyUndertone(rgb, hsl)
  const depth = classifyDepth(hsl)
  const clarity = classifyClarity(hsl, rgb)
  const result = classifyPersonalColor(warmth, depth, clarity)
  result.skinRgb = rawRgb
  return result
}

export async function cropFaceFromPhoto(imageDataUrl, landmarker) {
  try {
    const img = new Image()
    img.src = imageDataUrl
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
    const result = landmarker.detect(img)
    if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
      return imageDataUrl
    }
    const lm = result.faceLandmarks[0]
    let minX = 1, minY = 1, maxX = 0, maxY = 0
    for (let i = 0; i < lm.length; i++) {
      if (lm[i].x < minX) minX = lm[i].x
      if (lm[i].y < minY) minY = lm[i].y
      if (lm[i].x > maxX) maxX = lm[i].x
      if (lm[i].y > maxY) maxY = lm[i].y
    }
    const w = maxX - minX, h = maxY - minY
    const pad = Math.max(w, h) * 0.3
    minX = Math.max(0, minX - pad)
    minY = Math.max(0, minY - pad)
    maxX = Math.min(1, maxX + pad)
    maxY = Math.min(1, maxY + pad)
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2
    const side = Math.max(maxX - minX, maxY - minY)
    const half = side / 2
    const sx = Math.max(0, cx - half), sy = Math.max(0, cy - half)
    const ex = Math.min(1, cx + half), ey = Math.min(1, cy + half)
    const canvas = document.createElement('canvas')
    const cropSize = 300
    canvas.width = cropSize
    canvas.height = cropSize
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img,
      sx * img.naturalWidth, sy * img.naturalHeight,
      (ex - sx) * img.naturalWidth, (ey - sy) * img.naturalHeight,
      0, 0, cropSize, cropSize
    )
    return canvas.toDataURL('image/jpeg', 0.9)
  } catch (e) {
    console.warn('Face crop failed, using original image:', e)
    return imageDataUrl
  }
}
