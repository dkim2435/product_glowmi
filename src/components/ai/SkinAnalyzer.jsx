import { useState, useEffect } from 'react'
import { useCamera } from '../../hooks/useCamera'
import { useAuth } from '../../context/AuthContext'
import { initFaceLandmarker } from '../../lib/mediapipe'
import { saveSkinResult } from '../../lib/db'
import { analyzeSkinPixels } from './analysis/skinAnalysisLogic'
import { SKIN_CONCERNS, SKIN_RECOMMENDATIONS } from '../../data/skinConcerns'
import { lookupIngredient } from '../products/ingredientLogic'
import { getRecommendations } from '../../data/products'
import ProductCard from '../common/ProductCard'
import CameraView from '../common/CameraView'
import ShareButtons from '../common/ShareButtons'
import SaveResultBtn from '../common/SaveResultBtn'
import Confetti from '../common/Confetti'

export default function SkinAnalyzer({ showToast }) {
  const { user, loginWithGoogle } = useAuth()
  const camera = useCamera()
  const [screen, setScreen] = useState('start')
  const [scores, setScores] = useState(null)
  const [overallScore, setOverallScore] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Restore result after OAuth login redirect
  useEffect(() => {
    const saved = sessionStorage.getItem('skin_pending_result')
    if (saved && user) {
      try {
        const parsed = JSON.parse(saved)
        setScores(parsed.scores)
        setOverallScore(parsed.overallScore)
        setScreen('result')
        sessionStorage.removeItem('skin_pending_result')
      } catch { /* ignore */ }
    }
  }, [user])

  function loginAndKeepResult() {
    if (scores && overallScore) {
      sessionStorage.setItem('skin_pending_result', JSON.stringify({ scores, overallScore }))
    }
    loginWithGoogle()
  }

  async function handleAnalyze() {
    setScreen('analyzing')
    try {
      const landmarker = await initFaceLandmarker()
      const img = new Image()
      img.src = camera.capturedImage
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject })

      const detection = landmarker.detect(img)
      if (!detection.faceLandmarks || detection.faceLandmarks.length === 0) {
        setScreen('camera')
        showToast('No face detected. Please try again. 얼굴이 감지되지 않았습니다.')
        return
      }

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = img.width
      tempCanvas.height = img.height
      const ctx = tempCanvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const skinScores = analyzeSkinPixels(ctx, detection.faceLandmarks[0], img.width, img.height)
      const avgConcern = (skinScores.redness + skinScores.oiliness + skinScores.dryness + skinScores.darkSpots + skinScores.texture) / 5
      let overall = Math.round(100 - avgConcern * 0.6)
      overall = Math.max(10, Math.min(95, overall))

      setScores(skinScores)
      setOverallScore(overall)
      setScreen('result')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    } catch (e) {
      console.error('Skin analysis error:', e)
      setScreen('camera')
      showToast('Analysis failed. Please try again. 분석에 실패했습니다.')
    }
  }

  async function handleSave() {
    if (!user || !scores) return
    try {
      await saveSkinResult(user.id, scores, overallScore)
      showToast('Skin analysis saved! 피부 분석 결과가 저장되었습니다!')
    } catch {
      showToast('Failed to save. Please try again. 저장에 실패했습니다.')
    }
  }

  function handleRetake() {
    camera.reset()
    setScores(null)
    setOverallScore(null)
    setScreen('start')
  }

  if (screen === 'start') {
    return (
      <div className="pc-start-card">
        <div className="tool-intro">
          <span className="tool-icon">🔬</span>
          <h3>AI Skin Condition Analyzer</h3>
          <p className="tool-desc">AI analyzes your skin for redness, oiliness, dryness, dark spots, and texture to provide personalized recommendations.</p>
          <p className="tool-desc-kr">AI가 홍조, 유분, 건조, 색소침착, 피부결을 분석하여 맞춤 추천을 제공합니다.</p>
          <p className="privacy-note">🔒 All processing happens on your device. Photos are never uploaded.</p>
        </div>
        <button className="primary-btn" onClick={() => { setScreen('camera'); camera.startCamera() }}>
          Start Analysis 분석 시작
        </button>
        <button className="secondary-btn" onClick={() => setScreen('camera')}>
          📁 Upload Photo 사진 업로드
        </button>
      </div>
    )
  }

  if (screen === 'camera') {
    return (
      <CameraView
        videoRef={camera.videoRef}
        canvasRef={camera.canvasRef}
        capturedImage={camera.capturedImage}
        cameraActive={camera.cameraActive}
        cameraError={camera.cameraError}
        onStartCamera={camera.startCamera}
        onCapture={camera.capturePhoto}
        onUpload={(file) => camera.handleUpload(file).catch(e => showToast(e.message))}
        onAnalyze={handleAnalyze}
        onRetake={handleRetake}
        onCancel={handleRetake}
        analyzeLabel="🔬 Analyze Skin 피부 분석"
      />
    )
  }

  if (screen === 'analyzing') {
    return (
      <div className="analyzing-screen">
        <div className="analyzing-spinner" />
        <p>Analyzing your skin condition...</p>
        <p className="analyzing-kr">피부 상태를 분석하고 있습니다...</p>
      </div>
    )
  }

  // Result screen
  let grade, gradeClass
  if (overallScore >= 80) { grade = 'Excellent 우수'; gradeClass = 'skin-grade-excellent' }
  else if (overallScore >= 60) { grade = 'Good 양호'; gradeClass = 'skin-grade-good' }
  else if (overallScore >= 40) { grade = 'Fair 보통'; gradeClass = 'skin-grade-fair' }
  else { grade = 'Needs Care 관리필요'; gradeClass = 'skin-grade-care' }

  const concernKeys = Object.keys(scores).sort((a, b) => scores[b] - scores[a])
  const topConcerns = concernKeys.slice(0, 2)

  return (
    <div className="result-content animated">
      {showConfetti && <Confetti />}

      <div className="skin-overall">
        <div className="skin-score-circle">
          <span className="skin-score-number">{overallScore}</span>
          <span className="skin-score-label">/ 100</span>
        </div>
        <div className={'skin-grade ' + gradeClass}>{grade}</div>
        <p className="skin-overall-desc">Your overall skin health score based on AI pixel analysis.</p>
        <p className="skin-overall-desc-kr">AI 픽셀 분석 기반 전체 피부 건강 점수입니다.</p>
      </div>

      <div className="skin-scores">
        <h4>Skin Concern Scores 피부 고민 점수</h4>
        {concernKeys.map(key => {
          const concern = SKIN_CONCERNS[key]
          if (!concern) return null
          const score = scores[key]
          const barClass = score >= 60 ? 'skin-bar-high' : score >= 35 ? 'skin-bar-med' : 'skin-bar-low'
          return (
            <div key={key} className="skin-score-row">
              <div className="skin-score-label-row">
                <span>{concern.emoji} {concern.name} <span className="skin-score-kr">{concern.nameKr}</span></span>
                <span className="skin-score-value">{score}</span>
              </div>
              <div className="skin-bar-track">
                <div className={'skin-bar-fill ' + barClass} style={{ width: score + '%' }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="skin-recommendations">
        <h4>Personalized Recommendations 맞춤 추천</h4>
        {topConcerns.map(cKey => {
          const cData = SKIN_CONCERNS[cKey]
          const rec = SKIN_RECOMMENDATIONS[cKey]
          if (!cData || !rec) return null
          return (
            <div key={cKey} className="skin-rec-card">
              <div className="skin-rec-header">{cData.emoji} <strong>{cData.name} {cData.nameKr}</strong> — Score: {scores[cKey]}</div>
              <p className="skin-rec-desc">{cData.description}</p>
              <div className="skin-rec-tips">
                <strong>Tips 팁:</strong>
                <ul>
                  {rec.tips.map((tip, i) => (
                    <li key={i}>{tip}<br /><span className="skin-tip-kr">{rec.tipsKr[i]}</span></li>
                  ))}
                </ul>
              </div>
              <div className="skin-rec-ingredients">
                <strong>Key Ingredients 핵심 성분:</strong>
                <div className="skin-ingredient-tags">
                  {rec.ingredients.map((ing, i) => {
                    const lookup = lookupIngredient(ing)
                    const tagClass = lookup.found ? 'skin-ing-tag-found' : 'skin-ing-tag'
                    return <span key={i} className={tagClass}>{ing}</span>
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="skin-product-recs">
        <h4>🛒 Recommended Products 추천 제품</h4>
        <div className="product-card-list">
          {getRecommendations({
            concerns: topConcerns.map(k => k === 'darkSpots' ? 'dark_spots' : k)
          }).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <SaveResultBtn onSave={handleSave} onLogin={loginAndKeepResult} />
      <ShareButtons emoji="🔬" english={`Skin Score ${overallScore}/100 (${grade})`} korean="AI 피부 분석 결과" showToast={showToast} />
      <div className="fs-result-buttons">
        <button className="primary-btn" onClick={handleRetake}>🔄 Try Again 다시하기</button>
      </div>
    </div>
  )
}
