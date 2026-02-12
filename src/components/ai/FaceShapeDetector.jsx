import { useState, useEffect, useRef } from 'react'
import { useCamera } from '../../hooks/useCamera'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { initFaceLandmarker } from '../../lib/mediapipe'
import { saveFaceShapeResult } from '../../lib/db'
import { addHistoryEntry } from '../../lib/analysisHistory'
import { classifyFaceShape } from './analysis/faceShapeLogic'
import { analyzeFaceShapeAI } from '../../lib/gemini'
import { fsShapeData } from '../../data/faceShape'
import CameraView from '../common/CameraView'
import ShareButtons from '../common/ShareButtons'
import ShareCard from '../common/ShareCard'
import SaveResultBtn from '../common/SaveResultBtn'
import Confetti from '../common/Confetti'

export default function FaceShapeDetector({ showToast }) {
  const { user, loginWithGoogle } = useAuth()
  const { lang, t } = useLang()
  const camera = useCamera()
  const startUploadRef = useRef(null)
  const [screen, setScreen] = useState('start')
  const [result, setResult] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [usedGemini, setUsedGemini] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)

  // Restore result after OAuth login redirect
  useEffect(() => {
    const saved = sessionStorage.getItem('fs_pending_result')
    if (saved && user) {
      try {
        const parsed = JSON.parse(saved)
        setResult(parsed)
        setScreen('result')
        sessionStorage.removeItem('fs_pending_result')
      } catch { /* ignore */ }
    }
  }, [user])

  function loginAndKeepResult() {
    if (result) {
      sessionStorage.setItem('fs_pending_result', JSON.stringify(result))
    }
    loginWithGoogle()
  }

  async function handleAnalyze() {
    setScreen('analyzing')
    try {
      let shape = null

      // Try Gemini AI first
      try {
        shape = await analyzeFaceShapeAI(camera.capturedImage)
        setUsedGemini(true)
      } catch (geminiErr) {
        console.warn('Gemini failed, falling back to local analysis:', geminiErr)
        setUsedGemini(false)
      }

      // Fallback to local MediaPipe analysis
      if (!shape) {
        const landmarker = await initFaceLandmarker()
        const img = new Image()
        img.src = camera.capturedImage
        await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject })

        const detection = landmarker.detect(img)
        if (!detection.faceLandmarks || detection.faceLandmarks.length === 0) {
          setScreen('camera')
          showToast(t('No face detected. Please try again.', '얼굴이 감지되지 않았습니다.'))
          return
        }

        shape = classifyFaceShape(detection.faceLandmarks[0])
      }

      setResult(shape)
      setScreen('result')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    } catch (e) {
      console.error('Face analysis error:', e)
      setScreen('camera')
      const msg = e.message?.includes('MediaPipe')
        ? t('AI model is loading. Please wait and try again.', 'AI 모델을 불러오는 중입니다.')
        : t('Analysis failed. Please try again.', '분석에 실패했습니다.')
      showToast(msg)
    }
  }

  async function handleSave() {
    if (!user || !result) return
    try {
      await saveFaceShapeResult(user.id, result)
      addHistoryEntry('faceShape', { shape: result.shape, confidence: result.confidence })
      showToast(t('Saved! View in My Page > Results', '저장 완료! 마이페이지 > 결과에서 확인하세요'))
    } catch {
      showToast(t('Failed to save. Please try again.', '저장에 실패했습니다.'))
    }
  }

  function handleRetake() {
    camera.reset()
    setResult(null)
    setScreen('start')
  }

  if (screen === 'start') {
    return (
      <div className="pc-start-card">
        <div className="tool-intro">
          <span className="tool-icon">💎</span>
          <h3>AI Face Shape Detector</h3>
          <p className="tool-desc">{t('AI analyzes 468 facial landmarks to determine your face shape and provide styling tips.', 'AI가 468개의 얼굴 랜드마크를 분석하여 얼굴형을 판별하고 스타일링 팁을 제공합니다.')}</p>
          <p className="privacy-note">🔒 {t('Photos are sent to Google AI for analysis. Not stored.', '사진은 Google AI로 전송되어 분석됩니다. 저장되지 않습니다.')}</p>
        </div>
        <button className="primary-btn" onClick={() => { setScreen('camera'); camera.startCamera() }}>
          {t('Start Analysis', '분석 시작')}
        </button>
        <button className="secondary-btn" onClick={() => startUploadRef.current?.click()}>
          📁 {t('Upload Photo', '사진 업로드')}
        </button>
        <input ref={startUploadRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
          const file = e.target.files[0]
          if (file) { camera.handleUpload(file).then(() => setScreen('camera')).catch(err => showToast(err.message)) }
          e.target.value = ''
        }} />
        {!user && (
          <p className="start-signup-nudge">
            {'🆓 ' + t('Free! Sign up to save results & track progress.', '무료! 가입하면 결과 저장 & 변화 추적이 가능해요.')}
          </p>
        )}
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
        analyzeLabel={'💎 ' + t('Analyze Face Shape', '얼굴형 분석')}
      />
    )
  }

  if (screen === 'analyzing') {
    return (
      <div className="analyzing-screen">
        <div className="analyzing-spinner" />
        <p>{t('Analyzing your face shape...', '얼굴형을 분석하고 있습니다...')}</p>
        <div className="analyzing-tip">
          <strong>{t('Did you know?', '알고 계셨나요?')}</strong>
          <p>{t(
            'Face shape analysis uses AI to map facial proportions and classify into 7 types — oval, round, square, heart, oblong, diamond, and triangle — each with personalized style recommendations.',
            '얼굴형 분석은 AI로 얼굴 비율을 측정하고 7가지 유형(타원형, 둥근형, 사각형, 하트형, 긴형, 다이아몬드형, 삼각형)으로 분류하여 맞춤 스타일을 추천해요.'
          )}</p>
        </div>
      </div>
    )
  }

  const data = fsShapeData[result.shape]
  if (!data) return null

  return (
    <div className="result-content animated">
      {showConfetti && <Confetti />}
      <div className="result-emoji">{data.emoji}</div>
      <h2 className="result-type">{t(data.name + ' Face', data.korean)}</h2>
      <div className="fs-confidence">{t('Confidence', '신뢰도')}: {result.confidence}%</div>
      <div className={usedGemini ? 'ai-badge ai-badge-gemini' : 'ai-badge ai-badge-local'}>
        {usedGemini ? '🤖 AI Powered' : '📱 Local Analysis'}
      </div>

      {/* 1) All Face Shapes — visible to everyone */}
      <div className="fs-ref-section">
        <h4>{t('All Face Shapes', '전체 얼굴형 가이드')}</h4>
        <div className="fs-ref-grid">
          {Object.entries(fsShapeData).map(([key, s]) => (
            <div key={key} className={'fs-ref-item' + (key === result.shape ? ' fs-ref-active' : '')}>
              <span className="face-shape-icon">{s.emoji}</span>
              <strong>{t(s.name, s.korean)}</strong>
              <p>{t(s.description, s.descriptionKr || s.description)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2) About Your Face Shape — blurred for non-members */}
      <div className={'result-description' + (!user ? ' gated-blur' : '')}>
        {!user && (
          <div className="gated-overlay">
            <div className="gated-overlay-content">
              <span className="gated-lock">🔒</span>
              <p className="gated-title">{t('Sign up to see your personalized styling tips', '가입하면 나만의 스타일링 팁을 볼 수 있어요')}</p>
              <p className="gated-free">{t('100% Free', '완전 무료')}</p>
              <button className="gated-login-btn" onClick={loginAndKeepResult}>{t('Free Sign Up', '무료 가입')}</button>
            </div>
          </div>
        )}
        <h4>{t('About Your Face Shape', '나의 얼굴형 분석')}</h4>
        <p>{t(data.description, data.descriptionKr || data.description)}</p>
        <h4>{t('Styling Tips', '스타일링 팁')}</h4>
        <ul>{(lang === 'ko' && data.tipsKr ? data.tipsKr : data.tips).map((tip, i) => <li key={i}>{tip}</li>)}</ul>
      </div>

      <SaveResultBtn onSave={handleSave} onLogin={loginAndKeepResult} />
      <ShareButtons emoji={data.emoji} english={data.name} korean={data.korean} showToast={showToast} />
      <div className="fs-result-buttons">
        <button className="secondary-btn" onClick={() => setShowShareCard(true)}>{'🖼️ ' + t('Create Share Card', '공유 카드 만들기')}</button>
        <button className="primary-btn" onClick={handleRetake}>🔄 {t('Try Again', '다시하기')}</button>
      </div>
      {showShareCard && <ShareCard type="faceShape" data={{ shape: result.shape, confidence: result.confidence, emoji: data.emoji, name: data.name, korean: data.korean }} onClose={() => setShowShareCard(false)} />}
    </div>
  )
}
