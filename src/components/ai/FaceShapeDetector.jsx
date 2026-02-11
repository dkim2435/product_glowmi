import { useState, useEffect } from 'react'
import { useCamera } from '../../hooks/useCamera'
import { useAuth } from '../../context/AuthContext'
import { initFaceLandmarker } from '../../lib/mediapipe'
import { saveFaceShapeResult } from '../../lib/db'
import { classifyFaceShape } from './analysis/faceShapeLogic'
import { fsShapeData } from '../../data/faceShape'
import CameraView from '../common/CameraView'
import ShareButtons from '../common/ShareButtons'
import SaveResultBtn from '../common/SaveResultBtn'
import Confetti from '../common/Confetti'

export default function FaceShapeDetector({ showToast }) {
  const { user, loginWithGoogle } = useAuth()
  const camera = useCamera()
  const [screen, setScreen] = useState('start')
  const [result, setResult] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

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

      const shape = classifyFaceShape(detection.faceLandmarks[0])
      setResult(shape)
      setScreen('result')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    } catch (e) {
      console.error('Face analysis error:', e)
      setScreen('camera')
      const msg = e.message?.includes('MediaPipe')
        ? 'AI model is loading. Please wait and try again. AI 모델을 불러오는 중입니다.'
        : 'Analysis failed. Please try again. 분석에 실패했습니다.'
      showToast(msg)
    }
  }

  async function handleSave() {
    if (!user || !result) return
    try {
      await saveFaceShapeResult(user.id, result)
      showToast('Face shape result saved! 얼굴형 결과가 저장되었습니다!')
    } catch {
      showToast('Failed to save. Please try again. 저장에 실패했습니다.')
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
          <p className="tool-desc">AI analyzes 468 facial landmarks to determine your face shape and provide styling tips.</p>
          <p className="tool-desc-kr">AI가 468개의 얼굴 랜드마크를 분석하여 얼굴형을 판별하고 스타일링 팁을 제공합니다.</p>
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
        analyzeLabel="💎 Analyze Face Shape 얼굴형 분석"
      />
    )
  }

  if (screen === 'analyzing') {
    return (
      <div className="analyzing-screen">
        <div className="analyzing-spinner" />
        <p>Analyzing your face shape...</p>
        <p className="analyzing-kr">얼굴형을 분석하고 있습니다...</p>
      </div>
    )
  }

  const data = fsShapeData[result.shape]
  if (!data) return null

  return (
    <div className="result-content animated">
      {showConfetti && <Confetti />}
      <div className="result-emoji">{data.emoji}</div>
      <h2 className="result-type">{data.name} Face</h2>
      <p className="result-type-korean">{data.korean}</p>
      <div className="fs-confidence">Confidence 신뢰도: {result.confidence}%</div>

      {/* 1) All Face Shapes — visible to everyone */}
      <div className="fs-ref-section">
        <h4>All Face Shapes 전체 얼굴형 가이드</h4>
        <div className="fs-ref-grid">
          {Object.entries(fsShapeData).map(([key, s]) => (
            <div key={key} className={'fs-ref-item' + (key === result.shape ? ' fs-ref-active' : '')}>
              <span className="face-shape-icon">{s.emoji}</span>
              <strong>{s.name} {s.korean}</strong>
              <p>{s.description}</p>
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
              <p className="gated-title">Sign up to see your personalized styling tips</p>
              <p className="gated-title-kr">가입하면 나만의 스타일링 팁을 볼 수 있어요</p>
              <p className="gated-free">100% Free 완전 무료</p>
              <button className="gated-login-btn" onClick={loginAndKeepResult}>Free Sign Up 무료 가입</button>
            </div>
          </div>
        )}
        <h4>About Your Face Shape</h4>
        <p>{data.description}</p>
        <h4>Styling Tips 스타일링 팁</h4>
        <ul>{data.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
      </div>

      <SaveResultBtn onSave={handleSave} onLogin={loginAndKeepResult} />
      <ShareButtons emoji={data.emoji} english={data.name} korean={data.korean} showToast={showToast} />
      <div className="fs-result-buttons">
        <button className="primary-btn" onClick={handleRetake}>🔄 Try Again 다시하기</button>
      </div>
    </div>
  )
}
