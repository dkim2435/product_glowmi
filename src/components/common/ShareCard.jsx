import { useRef, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'
import { createExportCanvas } from '../../lib/canvasHelpers'
import drawSkinCard from './shareCards/drawSkinCard'
import drawPCCard from './shareCards/drawPCCard'
import drawFSCard from './shareCards/drawFSCard'

const CARD_W = 540
const CARD_H = 960

export default function ShareCard({ type, data, onClose }) {
  const { t } = useLang()
  const canvasRef = useRef(null)

  const drawers = { skin: drawSkinCard, personalColor: drawPCCard, faceShape: drawFSCard }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = CARD_W
    canvas.height = CARD_H
    ctx.clearRect(0, 0, CARD_W, CARD_H)
    drawers[type]?.(ctx, CARD_W, CARD_H, data, t)
  }, [type, data, t])

  function getExportCanvas() {
    return createExportCanvas((ctx, w, h) => drawers[type]?.(ctx, w, h, data, t))
  }

  async function handleDownload() {
    const exportCanvas = getExportCanvas()
    const link = document.createElement('a')
    link.download = `glowmi-${type}-result.png`
    link.href = exportCanvas.toDataURL('image/png')
    link.click()
  }

  async function handleShare() {
    try {
      const exportCanvas = getExportCanvas()
      const blob = await new Promise(resolve => exportCanvas.toBlob(resolve, 'image/png'))
      const file = new File([blob], `glowmi-${type}.png`, { type: 'image/png' })
      await navigator.share({
        files: [file],
        title: 'Glowmi Result',
        text: t('Check out my Glowmi result!', 'Glowmi 결과를 확인해보세요!')
      })
    } catch {
      // User cancelled or share not supported
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
