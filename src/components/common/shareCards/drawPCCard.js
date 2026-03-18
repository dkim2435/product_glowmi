import { roundRect, drawCircle, drawDecoDots, drawBranding, drawWatermark } from '../../../lib/canvasHelpers'

export default function drawPCCard(ctx, w, h, data, t) {
  const season = data.season || 'Spring'
  const typeName = t(data.english || '', data.korean || '')
  const subtitle = t(data.subtitle || '', data.subtitleKr || '')
  const emoji = data.emoji || '🎨'
  const bestColors = data.bestColors || []
  const confidence = data.confidence || 0

  // Season-based gradient
  const gradients = {
    Spring: ['#FF9A8B', '#FF6B6B', '#FECEB0'],
    Summer: ['#A8EDEA', '#6C63FF', '#BED3F3'],
    Fall: ['#F7971E', '#C2573A', '#FFD200'],
    Winter: ['#667EEA', '#764BA2', '#4834D4']
  }
  const colors = gradients[season] || gradients.Spring

  const bg = ctx.createLinearGradient(0, 0, w * 0.3, h)
  bg.addColorStop(0, colors[0])
  bg.addColorStop(0.5, colors[1])
  bg.addColorStop(1, colors[2])
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Decorative circles
  drawDecoDots(ctx, w, h, '#ffffff')

  // Extra large decorative circle in top right
  ctx.save()
  ctx.globalAlpha = 0.06
  drawCircle(ctx, w * 0.85, h * 0.12, 100, '#ffffff')
  ctx.globalAlpha = 0.04
  drawCircle(ctx, w * 0.15, h * 0.75, 130, '#ffffff')
  ctx.globalAlpha = 1
  ctx.restore()

  // Branding
  drawBranding(ctx, w)

  // Title
  ctx.save()
  ctx.font = '20px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.textAlign = 'center'
  ctx.fillText(t('Personal Color Analysis', '퍼스널 컬러 분석'), w / 2, 110)
  ctx.restore()

  // Emoji large
  ctx.save()
  ctx.font = '80px "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, w / 2, 190)
  ctx.restore()

  // Season badge
  ctx.save()
  const badgeText = season
  ctx.font = 'bold 14px "Segoe UI", sans-serif'
  const badgeW = ctx.measureText(badgeText).width + 28
  roundRect(ctx, w / 2 - badgeW / 2, 236, badgeW, 28, 14)
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.fill()
  ctx.font = 'bold 14px "Segoe UI", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(badgeText, w / 2, 250)
  ctx.restore()

  // Type name
  ctx.save()
  ctx.font = 'bold 34px "Segoe UI", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.shadowColor = 'rgba(0,0,0,0.15)'
  ctx.shadowBlur = 10
  ctx.fillText(typeName, w / 2, 310)
  ctx.restore()

  // Subtitle
  ctx.save()
  ctx.font = '18px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.textAlign = 'center'
  ctx.fillText(subtitle, w / 2, 340)
  ctx.restore()

  // Confidence
  if (confidence > 0) {
    ctx.save()
    ctx.font = '15px "Segoe UI", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.65)'
    ctx.textAlign = 'center'
    ctx.fillText(`${t('Confidence', '신뢰도')} ${confidence}%`, w / 2, 370)
    ctx.restore()
  }

  // "Best Colors" section
  ctx.save()
  ctx.font = 'bold 18px "Segoe UI", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.fillText(t('Best Colors', '베스트 컬러'), w / 2, 420)
  ctx.restore()

  // Color swatches card background
  const swatchRows = Math.ceil(bestColors.length / 3)
  const swatchCardH = swatchRows * 100 + 20
  ctx.save()
  roundRect(ctx, 30, 438, w - 60, swatchCardH, 16)
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.fill()
  ctx.restore()

  // Draw color swatches in a grid (3 per row)
  const swatchSize = 40
  const colCount = 3
  const swatchStartY = 470
  const colWidth = (w - 80) / colCount

  bestColors.forEach((color, i) => {
    const row = Math.floor(i / colCount)
    const col = i % colCount
    const sx = 40 + col * colWidth + colWidth / 2
    const sy = swatchStartY + row * 100

    // Shadow
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.2)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetY = 3

    // Swatch circle
    drawCircle(ctx, sx, sy, swatchSize, color.hex)

    // White border for light colors
    if (color.hex === '#FFFFFF' || color.hex === '#FFFFF0' || color.hex === '#FFFDD0') {
      ctx.strokeStyle = 'rgba(200,200,200,0.5)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(sx, sy, swatchSize, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.restore()

    // Color name
    ctx.save()
    ctx.font = '11px "Segoe UI", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(color.name, sx, sy + swatchSize + 16)
    ctx.restore()
  })

  // Motivational text
  ctx.save()
  ctx.font = '16px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.textAlign = 'center'
  ctx.fillText(t('Find your perfect colors with AI', 'AI로 나만의 퍼스널 컬러를 찾아보세요'), w / 2, h - 70)
  ctx.restore()

  // Watermark
  drawWatermark(ctx, w, h)
}
