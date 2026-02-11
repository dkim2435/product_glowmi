import { useState, useEffect } from 'react'
import { useCamera } from '../../hooks/useCamera'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { initFaceLandmarker } from '../../lib/mediapipe'
import { savePersonalColorResult } from '../../lib/db'
import { analyzeSkinTone, cropFaceFromPhoto } from './analysis/personalColorLogic'
import { personalColorResults } from '../../data/personalColor'
import { getRecommendations } from '../../data/products'
import ProductCard from '../common/ProductCard'
import CameraView from '../common/CameraView'
import ShareButtons from '../common/ShareButtons'
import SaveResultBtn from '../common/SaveResultBtn'
import Confetti from '../common/Confetti'

export default function PersonalColorAnalysis({ showToast }) {
  const { user, loginWithGoogle } = useAuth()
  const { t } = useLang()
  const camera = useCamera()
  const [screen, setScreen] = useState('start') // start | camera | analyzing | result
  const [result, setResult] = useState(null)
  const [faceCrop, setFaceCrop] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Restore result after OAuth login redirect
  useEffect(() => {
    const saved = sessionStorage.getItem('pc_pending_result')
    if (saved && user) {
      try {
        const parsed = JSON.parse(saved)
        setResult(parsed)
        setScreen('result')
        sessionStorage.removeItem('pc_pending_result')
      } catch { /* ignore */ }
    }
  }, [user])

  function loginAndKeepResult() {
    if (result) {
      sessionStorage.setItem('pc_pending_result', JSON.stringify(result))
    }
    loginWithGoogle()
  }

  async function handleAnalyze() {
    setScreen('analyzing')
    try {
      const img = new Image()
      img.src = camera.capturedImage
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject })

      const landmarker = await initFaceLandmarker()
      const detection = landmarker.detect(img)

      if (!detection.faceLandmarks || detection.faceLandmarks.length === 0) {
        setScreen('camera')
        showToast(t('No face detected. Please try again.', '얼굴이 감지되지 않았습니다.'))
        return
      }

      const landmarks = detection.faceLandmarks[0]
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const analysis = analyzeSkinTone(ctx, landmarks, canvas.width, canvas.height)
      if (!analysis) {
        setScreen('camera')
        showToast(t('Could not analyze skin tone. Please try another photo.', '피부톤 분석에 실패했습니다.'))
        return
      }

      const crop = await cropFaceFromPhoto(camera.capturedImage, landmarker)
      setFaceCrop(crop)
      setResult(analysis)

      setTimeout(() => {
        setScreen('result')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }, 1500)
    } catch (e) {
      console.error('Color analysis failed:', e)
      setScreen('camera')
      showToast(t('Analysis failed. Please try again.', '분석에 실패했습니다.'))
    }
  }

  async function handleSave() {
    if (!user || !result) return
    try {
      await savePersonalColorResult(user.id, result)
      showToast(t('Personal color result saved!', '퍼스널컬러 결과가 저장되었습니다!'))
    } catch {
      showToast(t('Failed to save. Please try again.', '저장에 실패했습니다.'))
    }
  }

  function handleRetake() {
    camera.reset()
    setResult(null)
    setFaceCrop(null)
    setScreen('start')
  }

  if (screen === 'start') {
    return (
      <div className="pc-start-card">
        <div className="tool-intro">
          <span className="tool-icon">🎨</span>
          <h3>AI Personal Color Analysis</h3>
          <p className="tool-desc">{t('Discover your personal color type from a selfie. AI analyzes your skin tone to classify you into one of 10 types.', '셀카 한 장으로 퍼스널컬러를 알아보세요. AI가 피부톤을 분석하여 10가지 타입 중 하나로 분류합니다.')}</p>
          <p className="privacy-note">🔒 All processing happens on your device. Photos are never uploaded.</p>
        </div>
        <button className="primary-btn" onClick={() => { setScreen('camera'); camera.startCamera() }}>
          {t('Start Analysis', '분석 시작')}
        </button>
        <button className="secondary-btn" onClick={() => setScreen('camera')}>
          📁 {t('Upload Photo', '사진 업로드')}
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
        analyzeLabel={'🎨 ' + t('Analyze Color', '컬러 분석')}
      />
    )
  }

  if (screen === 'analyzing') {
    return (
      <div className="analyzing-screen">
        <div className="analyzing-spinner" />
        <p>{t('Analyzing your skin tone...', '피부톤을 분석하고 있습니다...')}</p>
      </div>
    )
  }

  // Result screen
  const r = personalColorResults[result.type]
  if (!r) return null

  const seasonColors = { Spring: '#FF7F50', Summer: '#B0E0E6', Fall: '#E2725B', Winter: '#4169E1' }
  const badgeColor = seasonColors[r.season] || '#888'
  const skinHex = '#' +
    ('0' + result.skinRgb.r.toString(16)).slice(-2) +
    ('0' + result.skinRgb.g.toString(16)).slice(-2) +
    ('0' + result.skinRgb.b.toString(16)).slice(-2)
  const warmthPct = (result.warmth + 100) / 200 * 100
  const depthPct = result.depth
  const clarityPct = result.clarity

  return (
    <div className="result-content animated">
      {showConfetti && <Confetti />}
      <div className="result-emoji">{r.emoji}</div>
      <h2 className="result-type">{t(r.english, r.korean)}</h2>
      <div className="season-result-badge" style={{ background: badgeColor }}>{r.season} {t(r.subtitle, r.subtitleKr)}</div>
      <div className="fs-confidence">{t('Confidence', '신뢰도')} {result.confidence}%</div>

      <div className="pc-skin-swatch">
        <div className="pc-skin-circle" style={{ background: skinHex }} />
        <span>{t('Detected Skin Tone', '감지된 피부톤')}</span>
      </div>

      <div className="pc-axis-section">
        <div className="pc-axis-row">
          <span className="pc-axis-label">Cool</span>
          <div className="pc-axis-bar"><div className="pc-axis-fill" style={{ width: warmthPct + '%', background: 'linear-gradient(90deg,#5B9BD5,#FF7F50)' }} /></div>
          <span className="pc-axis-label">Warm</span>
        </div>
        <div className="pc-axis-row">
          <span className="pc-axis-label">Deep</span>
          <div className="pc-axis-bar"><div className="pc-axis-fill" style={{ width: depthPct + '%', background: 'linear-gradient(90deg,#4A4A4A,#FFEAA7)' }} /></div>
          <span className="pc-axis-label">Light</span>
        </div>
        <div className="pc-axis-row">
          <span className="pc-axis-label">Mute</span>
          <div className="pc-axis-bar"><div className="pc-axis-fill" style={{ width: clarityPct + '%', background: 'linear-gradient(90deg,#B2BEB5,#FF69B4)' }} /></div>
          <span className="pc-axis-label">Bright</span>
        </div>
      </div>

      {/* 1) All 10 Types — visible to everyone */}
      <div className="pc-all-types">
        <h4>{t('All 10 Types', '전체 10가지 타입')}</h4>
        <div className="fs-ref-grid">
          {Object.entries(personalColorResults).map(([key, td]) => (
            <div key={key} className={'fs-ref-item' + (key === result.type ? ' fs-ref-active' : '')}>
              <span className="face-shape-icon">{td.emoji}</span>
              <div>
                <strong>{t(td.english, td.korean)}</strong>
                <p>{t(td.subtitle, td.subtitleKr)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2) About Your Colors — blurred for non-members */}
      <div className={'result-description' + (!user ? ' gated-blur' : '')}>
        {!user && (
          <div className="gated-overlay">
            <div className="gated-overlay-content">
              <span className="gated-lock">🔒</span>
              <p className="gated-title">{t('Sign up to unlock your full color analysis', '가입하면 나만의 컬러 분석을 볼 수 있어요')}</p>
              <p className="gated-free">{t('100% Free', '완전 무료')}</p>
              <button className="gated-login-btn" onClick={loginAndKeepResult}>{t('Free Sign Up', '무료 가입')}</button>
            </div>
          </div>
        )}
        <h4>{t('About Your Colors', '나의 컬러 분석')}</h4>
        <p>{t(r.description, r.descriptionKr)}</p>

        <h4>{t('Best Colors', '베스트 컬러')}</h4>
        <div className="color-palette">
          {r.bestColors.map((c, i) => (
            <div key={i} className="color-swatch">
              <div className="swatch-circle" style={{ background: c.hex, ...(c.hex === '#FFFFFF' ? { border: '2px solid #ddd' } : {}) }} />
              <span className="swatch-name">{c.name}</span>
            </div>
          ))}
        </div>

        <div className="worst-colors">
          <h4>{t('Colors to Avoid', '피해야 할 컬러')}</h4>
          <div className="color-palette">
            {r.worstColors.map((c, i) => (
              <div key={i} className="color-swatch">
                <div className="swatch-circle" style={{ background: c.hex }} />
                <span className="swatch-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        <h4>{t('Styling Tips', '스타일링 팁')}</h4>
        <ul>{r.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>

        <div className="makeup-guide">
          <h4>{t('Makeup Guide', '메이크업 가이드')}</h4>
          <div className="makeup-season"><strong>{t('Foundation', '파운데이션')}</strong><p>{r.makeup.foundation}</p></div>
          <div className="makeup-season"><strong>{t('Lip', '립')}</strong><p>{r.makeup.lip}</p></div>
          <div className="makeup-season"><strong>{t('Blush', '블러셔')}</strong><p>{r.makeup.blush}</p></div>
          <div className="makeup-season"><strong>{t('Eye Shadow', '아이섀도')}</strong><p>{r.makeup.eye}</p></div>
        </div>

        <div className="celeb-section">
          <h4>{t('Celebrity References', '참고 셀럽')}</h4>
          {t(
            r.celebs.map((c, i) => <span key={i} className="celeb-item">{c}</span>),
            (r.celebsKr || r.celebs).map((c, i) => <span key={i} className="celeb-item">{c}</span>)
          )}
        </div>
      </div>

      {/* 3) Skincare Recommendations — blurred for non-members */}
      <div className={'pc-skincare-recs' + (!user ? ' gated-blur' : '')}>
        {!user && (
          <div className="gated-overlay">
            <div className="gated-overlay-content">
              <span className="gated-lock">🔒</span>
              <p className="gated-title">{t('Save your result to see skincare picks', '결과를 저장하면 스킨케어 추천을 볼 수 있어요')}</p>
              <p className="gated-free">{t('100% Free', '완전 무료')}</p>
              <button className="gated-login-btn" onClick={loginAndKeepResult}>{t('Free Sign Up', '무료 가입')}</button>
            </div>
          </div>
        )}
        <h4>🧴 {t('Recommended Skincare', '스킨케어 추천')}</h4>
        <div className="product-card-list">
          {getRecommendations({
            concerns: (r.season === 'Spring' || r.season === 'Fall')
              ? ['redness', 'dryness']
              : ['dark_spots', 'texture'],
            categories: ['serum', 'moisturizer', 'sunscreen']
          })
            .filter((p, i, arr) => arr.findIndex(x => x.category === p.category) === i)
            .slice(0, 3)
            .map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <SaveResultBtn onSave={handleSave} onLogin={loginAndKeepResult} />
      <ShareButtons emoji={r.emoji} english={r.english} korean={r.korean} showToast={showToast} />
      <button className="secondary-btn" onClick={handleRetake}>{t('Retake Test', '다시하기')}</button>
    </div>
  )
}
