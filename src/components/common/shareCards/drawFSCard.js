import { roundRect, drawCircle, drawDecoDots, drawBranding, drawWatermark, wrapText } from '../../../lib/canvasHelpers'

export default function drawFSCard(ctx, w, h, data, t) {
  const emoji = data.emoji || '💎'
  const nameEn = data.name || ''
  const nameKr = data.korean || ''
  const confidence = data.confidence || 0
  const description = t(data.description || '', data.descriptionKr || data.description || '')

  // Soft gradient background
  const bg = ctx.createLinearGradient(0, 0, w * 0.5, h)
  bg.addColorStop(0, '#667EEA')
  bg.addColorStop(0.4, '#764BA2')
  bg.addColorStop(1, '#f093fb')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Decorative elements
  drawDecoDots(ctx, w, h, '#ffffff')

  // Extra soft circles
  ctx.save()
  ctx.globalAlpha = 0.05
  drawCircle(ctx, w * 0.8, h * 0.25, 120, '#ffffff')
  drawCircle(ctx, w * 0.2, h * 0.65, 90, '#ffffff')
  ctx.globalAlpha = 1
  ctx.restore()

  // Branding
  drawBranding(ctx, w)

  // Title
  ctx.save()
  ctx.font = '20px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.textAlign = 'center'
  ctx.fillText(t('Face Shape Analysis', '얼굴형 분석'), w / 2, 110)
  ctx.restore()

  // Large emoji
  ctx.save()
  ctx.font = '120px "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, w / 2, 240)
  ctx.restore()

  // Decorative circle behind emoji
  ctx.save()
  ctx.globalAlpha = 0.08
  drawCircle(ctx, w / 2, 240, 90, '#ffffff')
  ctx.globalAlpha = 1
  ctx.restore()

  // Shape name (English)
  ctx.save()
  ctx.font = 'bold 38px "Segoe UI", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.shadowColor = 'rgba(0,0,0,0.15)'
  ctx.shadowBlur = 10
  ctx.fillText(nameEn, w / 2, 360)
  ctx.restore()

  // Shape name (Korean)
  ctx.save()
  ctx.font = '24px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.textAlign = 'center'
  ctx.fillText(nameKr, w / 2, 396)
  ctx.restore()

  // Confidence bar
  if (confidence > 0) {
    const barY = 430
    const barW = 240
    const barH = 14
    const barX = w / 2 - barW / 2

    // Label
    ctx.save()
    ctx.font = '14px "Segoe UI", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.textAlign = 'center'
    ctx.fillText(`${t('Confidence', '신뢰도')}`, w / 2, barY)
    ctx.restore()

    // Track
    ctx.save()
    roundRect(ctx, barX, barY + 10, barW, barH, barH / 2)
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fill()
    ctx.restore()

    // Fill
    const fillW = Math.max(barH, (confidence / 100) * barW)
    ctx.save()
    roundRect(ctx, barX, barY + 10, fillW, barH, barH / 2)
    const confGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0)
    confGrad.addColorStop(0, '#ffffff')
    confGrad.addColorStop(1, 'rgba(255,255,255,0.7)')
    ctx.fillStyle = confGrad
    ctx.shadowColor = 'rgba(255,255,255,0.3)'
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.restore()

    // Percentage text
    ctx.save()
    ctx.font = 'bold 16px "Segoe UI", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(`${confidence}%`, w / 2, barY + 44)
    ctx.restore()
  }

  // Description card
  const descY = 500
  ctx.save()
  roundRect(ctx, 36, descY, w - 72, 180, 16)
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.fill()
  ctx.restore()

  // Description text (wrapped)
  ctx.save()
  ctx.font = '15px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.textAlign = 'left'
  const descLines = wrapText(ctx, description, w - 108)
  const maxLines = 7
  descLines.slice(0, maxLines).forEach((line, i) => {
    ctx.fillText(line, 54, descY + 30 + i * 22)
  })
  ctx.restore()

  // Decorative divider
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(w * 0.15, h - 120)
  ctx.lineTo(w * 0.85, h - 120)
  ctx.stroke()
  ctx.restore()

  // Motivational text
  ctx.save()
  ctx.font = '16px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.textAlign = 'center'
  ctx.fillText(t('Discover your face shape with AI', 'AI로 나의 얼굴형을 알아보세요'), w / 2, h - 70)
  ctx.restore()

  // Watermark
  drawWatermark(ctx, w, h)
}
