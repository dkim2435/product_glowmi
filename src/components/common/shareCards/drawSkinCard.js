import { roundRect, drawCircle, drawDecoDots, drawBranding, drawWatermark } from '../../../lib/canvasHelpers'

export default function drawSkinCard(ctx, w, h, data, t) {
  // Background gradient (pink → purple)
  const bg = ctx.createLinearGradient(0, 0, w * 0.4, h)
  bg.addColorStop(0, '#CF8BA9')
  bg.addColorStop(0.5, '#c850c0')
  bg.addColorStop(1, '#a855f7')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Decorative elements
  drawDecoDots(ctx, w, h, '#ffffff')

  // Branding
  drawBranding(ctx, w)

  // Title
  ctx.save()
  ctx.font = '22px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.textAlign = 'center'
  ctx.fillText(t('Skin Condition Analysis', '피부 상태 분석'), w / 2, 110)
  ctx.restore()

  // Overall score circle
  const overallScore = data.overallScore || 0
  const cx = w / 2
  const cy = 210

  // Outer glow
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.2)'
  ctx.shadowBlur = 20
  drawCircle(ctx, cx, cy, 72, 'rgba(255,255,255,0.15)')
  ctx.restore()

  // White circle background
  drawCircle(ctx, cx, cy, 68, 'rgba(255,255,255,0.95)')

  // Score ring (colored arc)
  const ringColor = overallScore >= 80 ? '#2ED573' : overallScore >= 60 ? '#FFD700' : overallScore >= 40 ? '#FF9F43' : '#FF6B6B'
  ctx.save()
  ctx.strokeStyle = ringColor
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.beginPath()
  const startAngle = -Math.PI / 2
  const endAngle = startAngle + (Math.PI * 2) * (overallScore / 100)
  ctx.arc(cx, cy, 64, startAngle, endAngle)
  ctx.stroke()
  ctx.restore()

  // Score text
  ctx.save()
  ctx.font = 'bold 48px "Segoe UI", sans-serif'
  ctx.fillStyle = '#333'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(overallScore), cx, cy - 6)
  ctx.font = '14px "Segoe UI", sans-serif'
  ctx.fillStyle = '#888'
  ctx.fillText('/ 100', cx, cy + 24)
  ctx.restore()

  // Grade text
  let grade
  if (overallScore >= 80) grade = t('Excellent', '우수')
  else if (overallScore >= 60) grade = t('Good', '양호')
  else if (overallScore >= 40) grade = t('Fair', '보통')
  else grade = t('Needs Care', '관리필요')

  ctx.save()
  ctx.font = 'bold 20px "Segoe UI", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.fillText(grade, cx, 310)
  ctx.restore()

  // Concern bars
  const scores = data.scores || {}
  const concerns = [
    { key: 'redness', en: 'Redness', kr: '붉은기', emoji: '🔴' },
    { key: 'oiliness', en: 'Oiliness', kr: '유분', emoji: '💧' },
    { key: 'dryness', en: 'Dryness', kr: '건조함', emoji: '🏜️' },
    { key: 'darkSpots', en: 'Dark Spots', kr: '색소침착', emoji: '🟤' },
    { key: 'texture', en: 'Texture', kr: '피부결', emoji: '🔍' }
  ]

  const barStartY = 350
  const barHeight = 20
  const barSpacing = 70
  const barLeft = 60
  const barRight = w - 60
  const barWidth = barRight - barLeft

  // Card background for bars
  ctx.save()
  roundRect(ctx, 30, barStartY - 30, w - 60, concerns.length * barSpacing + 30, 16)
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.fill()
  ctx.restore()

  concerns.forEach((concern, i) => {
    const y = barStartY + i * barSpacing
    const score = scores[concern.key] || 0

    // Label
    ctx.save()
    ctx.font = '15px "Segoe UI", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'left'
    ctx.fillText(`${concern.emoji} ${t(concern.en, concern.kr)}`, barLeft, y)
    ctx.textAlign = 'right'
    ctx.font = 'bold 15px "Segoe UI", sans-serif'
    ctx.fillText(String(score), barRight, y)
    ctx.restore()

    // Bar track
    const trackY = y + 10
    ctx.save()
    roundRect(ctx, barLeft, trackY, barWidth, barHeight, barHeight / 2)
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fill()
    ctx.restore()

    // Bar fill
    const fillWidth = Math.max(barHeight, (score / 100) * barWidth)
    const barColor = score <= 30 ? '#2ED573' : score <= 60 ? '#FFD700' : '#FF6B6B'
    ctx.save()
    roundRect(ctx, barLeft, trackY, fillWidth, barHeight, barHeight / 2)
    const barGrad = ctx.createLinearGradient(barLeft, 0, barLeft + fillWidth, 0)
    barGrad.addColorStop(0, barColor)
    barGrad.addColorStop(1, barColor + 'cc')
    ctx.fillStyle = barGrad
    ctx.shadowColor = barColor
    ctx.shadowBlur = 6
    ctx.fill()
    ctx.restore()
  })

  // Legend
  const legendY = barStartY + concerns.length * barSpacing + 30
  ctx.save()
  ctx.font = '12px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.textAlign = 'center'
  const legendItems = [
    { color: '#2ED573', label: t('Low (Good)', '낮음 (양호)') },
    { color: '#FFD700', label: t('Medium', '보통') },
    { color: '#FF6B6B', label: t('High (Concern)', '높음 (주의)') }
  ]
  const legendSpacing = 140
  const legendStartX = w / 2 - legendSpacing
  legendItems.forEach((item, i) => {
    const lx = legendStartX + i * legendSpacing
    drawCircle(ctx, lx - 14, legendY, 5, item.color)
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.textAlign = 'left'
    ctx.fillText(item.label, lx - 6, legendY + 4)
  })
  ctx.restore()

  // Motivational text
  ctx.save()
  ctx.font = '16px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.textAlign = 'center'
  ctx.fillText(t('Discover your skin health with AI', 'AI로 나의 피부 건강을 알아보세요'), w / 2, h - 70)
  ctx.restore()

  // Watermark
  drawWatermark(ctx, w, h)
}
