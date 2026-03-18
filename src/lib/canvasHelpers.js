/** Shared canvas drawing utilities for ShareCard and charts */

export function roundRect(ctx, x, y, w, h, r) {
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

export function drawCircle(ctx, cx, cy, radius, fill) {
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
}

export function wrapText(ctx, text, maxWidth) {
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

export function drawBranding(ctx, w) {
  ctx.save()
  ctx.font = 'bold 36px "Segoe UI", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.shadowColor = 'rgba(0,0,0,0.15)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetY = 2
  ctx.fillText('Glowmi', w / 2, 60)
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(w * 0.2, 78)
  ctx.lineTo(w * 0.8, 78)
  ctx.stroke()
  ctx.restore()
}

export function drawWatermark(ctx, w, h) {
  ctx.save()
  ctx.font = '16px "Segoe UI", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.textAlign = 'center'
  ctx.fillText('glowmi.org', w / 2, h - 28)
  ctx.restore()
}

export function drawDecoDots(ctx, w, h, color) {
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

/**
 * Create a 2x resolution export canvas (1080x1920) and draw onto it.
 * @param {Function} drawFn - (ctx, w, h) => void
 * @returns {HTMLCanvasElement}
 */
export function createExportCanvas(drawFn) {
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = 1080
  exportCanvas.height = 1920
  const exportCtx = exportCanvas.getContext('2d')
  exportCtx.scale(2, 2)
  drawFn(exportCtx, 540, 960)
  return exportCanvas
}
