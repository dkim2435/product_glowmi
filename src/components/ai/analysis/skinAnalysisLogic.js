// Pure functions for skin condition analysis — no DOM dependencies

export function analyzeSkinPixels(ctx, landmarks, imgW, imgH) {
  let minX = 1, maxX = 0, minY = 1, maxY = 0
  for (let i = 0; i < landmarks.length; i++) {
    if (landmarks[i].x < minX) minX = landmarks[i].x
    if (landmarks[i].x > maxX) maxX = landmarks[i].x
    if (landmarks[i].y < minY) minY = landmarks[i].y
    if (landmarks[i].y > maxY) maxY = landmarks[i].y
  }

  const pad = 0.02
  const x1 = Math.max(0, Math.floor((minX - pad) * imgW))
  const y1 = Math.max(0, Math.floor((minY - pad) * imgH))
  const x2 = Math.min(imgW, Math.ceil((maxX + pad) * imgW))
  const y2 = Math.min(imgH, Math.ceil((maxY + pad) * imgH))
  const w = x2 - x1
  const h = y2 - y1

  if (w < 10 || h < 10) {
    return { redness: 30, oiliness: 25, dryness: 35, darkSpots: 20, texture: 30 }
  }

  const imageData = ctx.getImageData(x1, y1, w, h)
  const pixels = imageData.data
  const totalPixels = w * h

  let totalR = 0, totalG = 0, totalB = 0
  let highRedCount = 0
  let brightCount = 0
  let darkCount = 0
  let varianceSum = 0
  const luminanceValues = []

  for (let p = 0; p < pixels.length; p += 4) {
    const r = pixels[p]
    const g = pixels[p + 1]
    const b = pixels[p + 2]

    totalR += r
    totalG += g
    totalB += b

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    luminanceValues.push(luminance)

    if (r > g + 30 && r > b + 30 && r > 120) highRedCount++
    if (luminance > 200) brightCount++
    if (luminance < 80) darkCount++
  }

  const avgR = totalR / totalPixels
  const avgG = totalG / totalPixels
  const avgLum = luminanceValues.reduce((a, b) => a + b, 0) / totalPixels

  // Texture variance
  const gridSize = 8
  const blockW = Math.floor(w / gridSize)
  const blockH = Math.floor(h / gridSize)
  const blockAverages = []

  if (blockW > 0 && blockH > 0) {
    for (let gy = 0; gy < gridSize; gy++) {
      for (let gx = 0; gx < gridSize; gx++) {
        let sum = 0
        let count = 0
        for (let by = 0; by < blockH; by++) {
          for (let bx = 0; bx < blockW; bx++) {
            const idx = (gy * blockH + by) * w + (gx * blockW + bx)
            if (idx < luminanceValues.length) {
              sum += luminanceValues[idx]
              count++
            }
          }
        }
        if (count > 0) blockAverages.push(sum / count)
      }
    }

    if (blockAverages.length > 1) {
      const blockMean = blockAverages.reduce((a, b) => a + b, 0) / blockAverages.length
      for (let v = 0; v < blockAverages.length; v++) {
        varianceSum += Math.pow(blockAverages[v] - blockMean, 2)
      }
      varianceSum = Math.sqrt(varianceSum / blockAverages.length)
    }
  }

  const clamp = (val) => Math.max(5, Math.min(95, val))

  const rednessRatio = highRedCount / totalPixels
  const rednessScore = clamp(Math.round(rednessRatio * 500 + (avgR - avgG) * 1.5))

  const brightnessRatio = brightCount / totalPixels
  const oilinessScore = clamp(Math.round(brightnessRatio * 400 + (avgLum > 160 ? (avgLum - 160) * 0.8 : 0)))

  const drynessScore = clamp(Math.round(100 - oilinessScore * 0.5 - (avgLum > 130 ? 20 : 0) + varianceSum * 0.5))

  const darkRatio = darkCount / totalPixels
  const darkSpotsScore = clamp(Math.round(darkRatio * 600 + Math.abs(avgR - avgG) * 0.5))

  const textureScore = clamp(Math.round(varianceSum * 3))

  return {
    redness: rednessScore,
    oiliness: oilinessScore,
    dryness: drynessScore,
    darkSpots: darkSpotsScore,
    texture: textureScore
  }
}
