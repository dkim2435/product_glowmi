import { useRef, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

export default function ShareCard({ type, data, onClose }) {
  const { lang, t } = useLang()
  const canvasRef = useRef(null)

  useEffect(() => {
    drawCard()
  }, [type, data, lang])

  // ─── Helper: rounded rectangle ───
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  // ─── Helper: draw circle ───
  function drawCircle(ctx, cx, cy, radius, fill) {
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fillStyle = fill
    ctx.fill()
  }

  // ─── Helper: wrap text into lines ───
  function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ')
    const lines = []
    let currentLine = words[0] || ''
    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i]
      if (ctx.measureText(testLine).width > maxWidth) {
        lines.push(currentLine)
        currentLine = words[i]
      } else {
        currentLine = testLine
      }
    }
    lines.push(currentLine)
    return lines
  }

  // ─── Helper: draw Glowmi branding ───
  function drawBranding(ctx, w) {
    ctx.save()
    ctx.font = 'bold 36px "Segoe UI", sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetY = 2
    ctx.fillText('Glowmi', w / 2, 60)
    ctx.restore()

    // Thin separator line
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(w * 0.2, 78)
    ctx.lineTo(w * 0.8, 78)
    ctx.stroke()
    ctx.restore()
  }

  // ─── Helper: draw watermark at bottom ───
  function drawWatermark(ctx, w, h) {
    ctx.save()
    ctx.font = '16px "Segoe UI", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.textAlign = 'center'
    ctx.fillText('glowmi.org', w / 2, h - 28)
    ctx.restore()
  }

  // ─── Helper: draw decorative dots ───
  function drawDecoDots(ctx, w, h, color) {
    ctx.save()
    ctx.globalAlpha = 0.08
    for (let i = 0; i < 20; i++) {
      const x = Math.sin(i * 1.7) * w * 0.4 + w / 2
      const y = Math.cos(i * 2.3) * h * 0.35 + h / 2
      const r = 20 + (i % 5) * 15
      drawCircle(ctx, x, y, r, color)
    }
    ctx.globalAlpha = 1
    ctx.restore()
  }

  // ═══════════════════════════════════════════
  // SKIN ANALYSIS CARD
  // ═══════════════════════════════════════════
  function drawSkinCard(ctx, w, h) {
    // Background gradient (pink → purple)
    const bg = ctx.createLinearGradient(0, 0, w * 0.4, h)
    bg.addColorStop(0, '#ff6b9d')
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

  // ═══════════════════════════════════════════
  // PERSONAL COLOR CARD
  // ═══════════════════════════════════════════
  function drawPCCard(ctx, w, h) {
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

  // ═══════════════════════════════════════════
  // FACE SHAPE CARD
  // ═══════════════════════════════════════════
  function drawFSCard(ctx, w, h) {
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

  // ─── Main draw dispatcher ───
  function drawCard() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = 540
    const h = 960
    canvas.width = w
    canvas.height = h

    // Clear
    ctx.clearRect(0, 0, w, h)

    if (type === 'skin') drawSkinCard(ctx, w, h)
    else if (type === 'personalColor') drawPCCard(ctx, w, h)
    else if (type === 'faceShape') drawFSCard(ctx, w, h)
  }

  // ─── Download as PNG (2x resolution) ───
  async function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a 2x export canvas for high resolution (1080x1920)
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = 1080
    exportCanvas.height = 1920
    const exportCtx = exportCanvas.getContext('2d')
    exportCtx.scale(2, 2)

    // Re-draw onto the 2x canvas
    if (type === 'skin') drawSkinCard(exportCtx, 540, 960)
    else if (type === 'personalColor') drawPCCard(exportCtx, 540, 960)
    else if (type === 'faceShape') drawFSCard(exportCtx, 540, 960)

    const link = document.createElement('a')
    link.download = `glowmi-${type}-result.png`
    link.href = exportCanvas.toDataURL('image/png')
    link.click()
  }

  // ─── Share using Web Share API ───
  async function handleShare() {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a 2x export canvas for sharing
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = 1080
    exportCanvas.height = 1920
    const exportCtx = exportCanvas.getContext('2d')
    exportCtx.scale(2, 2)

    if (type === 'skin') drawSkinCard(exportCtx, 540, 960)
    else if (type === 'personalColor') drawPCCard(exportCtx, 540, 960)
    else if (type === 'faceShape') drawFSCard(exportCtx, 540, 960)

    try {
      const blob = await new Promise(resolve => exportCanvas.toBlob(resolve, 'image/png'))
      const file = new File([blob], `glowmi-${type}.png`, { type: 'image/png' })
      await navigator.share({
        files: [file],
        title: 'Glowmi Result',
        text: t('Check out my Glowmi result!', 'Glowmi 결과를 확인해보세요!')
      })
    } catch {
      // User cancelled or share not supported — silently ignore
    }
  }

  return (
    <div className="share-card-overlay" onClick={onClose}>
      <div className="share-card-modal" onClick={e => e.stopPropagation()}>
        <button className="share-card-close" onClick={onClose}>&times;</button>
        <canvas
          ref={canvasRef}
          className="share-card-canvas"
          style={{
            width: '100%',
            maxWidth: 360,
            height: 'auto',
            aspectRatio: '9 / 16',
            borderRadius: 12,
            display: 'block',
            margin: '0 auto'
          }}
        />
        <div className="share-card-actions">
          <button className="primary-btn" onClick={handleDownload}>
            {t('Download Image', '이미지 다운로드')}
          </button>
          {typeof navigator !== 'undefined' && navigator.share && (
            <button className="secondary-btn" onClick={handleShare}>
              {t('Share', '공유')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
