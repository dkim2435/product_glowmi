import { useState, useEffect } from 'react'
import { useCamera } from '../../hooks/useCamera'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { initFaceLandmarker } from '../../lib/mediapipe'
import { saveSkinResult, saveSkinProgressDB, checkSkinProgressToday, saveRoutine, saveQuizResult } from '../../lib/db'
import { resizePhoto } from '../../lib/storage'
import { analyzeSkinPixels } from './analysis/skinAnalysisLogic'
import { analyzeSkinAI, generateRoutineAI, analyzeSkinCombinedAI } from '../../lib/gemini'
import { SKIN_CONCERNS, SKIN_RECOMMENDATIONS } from '../../data/skinConcerns'
import { combinedQuizQuestions, detectSeason } from '../../data/quiz'
import { lookupIngredient } from '../products/ingredientLogic'
import { getRecommendations } from '../../data/products'
import ProductCard from '../common/ProductCard'
import CameraView from '../common/CameraView'
import ShareButtons from '../common/ShareButtons'
import SaveResultBtn from '../common/SaveResultBtn'
import Confetti from '../common/Confetti'

export default function SkinAnalyzer({ showToast }) {
  const { user, loginWithGoogle } = useAuth()
  const { t } = useLang()
  const camera = useCamera()
  const [screen, setScreen] = useState('start')
  const [scores, setScores] = useState(null)
  const [overallScore, setOverallScore] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [usedGemini, setUsedGemini] = useState(false)
  const [dailyLimitModal, setDailyLimitModal] = useState(null)
  const [routineLoading, setRoutineLoading] = useState(false)
  const [routineResult, setRoutineResult] = useState(null)
  const [showRoutineModal, setShowRoutineModal] = useState(false)

  // Quiz integration state
  const [quizPhase, setQuizPhase] = useState(null) // null | 'questions' | 'analyzing' | 'done'
  const [quizQ, setQuizQ] = useState(0)
  const [quizScores, setQuizScores] = useState({ dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 })
  const [quizAnswers, setQuizAnswers] = useState([])
  const [combinedResult, setCombinedResult] = useState(null)

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
      let skinScores = null

      // Try Gemini AI first
      try {
        skinScores = await analyzeSkinAI(camera.capturedImage)
        setUsedGemini(true)
      } catch (geminiErr) {
        console.warn('Gemini failed, falling back to local analysis:', geminiErr)
        setUsedGemini(false)
      }

      // Fallback to local MediaPipe analysis
      if (!skinScores) {
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

        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = img.width
        tempCanvas.height = img.height
        const ctx = tempCanvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        skinScores = analyzeSkinPixels(ctx, detection.faceLandmarks[0], img.width, img.height)
      }

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
      showToast(t('Analysis failed. Please try again.', '분석에 실패했습니다.'))
    }
  }

  // Quiz handlers
  function handleStartQuiz() {
    setQuizPhase('questions')
    setQuizQ(0)
    setQuizScores({ dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 })
    setQuizAnswers([])
    setCombinedResult(null)
  }

  async function handleQuizAnswer(option) {
    const newScores = { ...quizScores }
    for (const [key, val] of Object.entries(option.scores)) {
      newScores[key] += val
    }
    setQuizScores(newScores)

    const answerText = t(option.english, option.korean)
    const newAnswers = [...quizAnswers, answerText]
    setQuizAnswers(newAnswers)

    if (quizQ + 1 < combinedQuizQuestions.length) {
      setQuizQ(quizQ + 1)
    } else {
      // All questions answered — run combined analysis
      setQuizPhase('analyzing')
      try {
        const season = detectSeason()
        const result = await analyzeSkinCombinedAI(scores, newAnswers, season)
        setCombinedResult(result)
        setQuizPhase('done')

        // Auto-save quiz result if logged in
        if (user) {
          const simpleType = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0]
          try {
            await saveQuizResult(user.id, simpleType, season, {
              ...newScores,
              combinedType: result.skinType,
              combinedLabel: result.skinTypeLabel,
              combinedLabelKr: result.skinTypeLabelKr
            })
          } catch (saveErr) {
            console.warn('Failed to save quiz result:', saveErr)
          }
        }
      } catch (err) {
        console.error('Combined analysis error:', err)
        setQuizPhase(null)
        showToast(t('Combined analysis failed. Your photo results are still valid.', '종합 분석에 실패했습니다. 사진 분석 결과는 유효합니다.'))
      }
    }
  }

  async function handleSave() {
    if (!user || !scores) return
    try {
      // Check if already saved today
      const existingTime = await checkSkinProgressToday(user.id)
      if (existingTime) {
        const savedAt = new Date(existingTime)
        const tomorrow = new Date(savedAt)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        const now = new Date()
        const diffMs = tomorrow - now
        const diffH = Math.floor(diffMs / (1000 * 60 * 60))
        const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        const timeMsg = diffH > 0
          ? t(`${diffH}h ${diffM}m`, `${diffH}시간 ${diffM}분`)
          : t(`${diffM}m`, `${diffM}분`)
        setDailyLimitModal(timeMsg)
        return
      }

      await saveSkinResult(user.id, scores, overallScore)
      let photoThumb = null
      if (camera.capturedImage) {
        photoThumb = await resizePhoto(camera.capturedImage, 400)
      }
      await saveSkinProgressDB(user.id, {
        date: new Date().toISOString().split('T')[0],
        overallScore,
        scores,
        photoThumb
      })
      showToast(t('Saved! Score & photo tracked in Skin Progress', '저장 완료! 점수와 사진이 피부현황에 기록됩니다'))
    } catch {
      showToast(t('Failed to save. Please try again.', '저장에 실패했습니다.'))
    }
  }

  async function handleGenerateRoutine() {
    if (!scores) return
    setRoutineLoading(true)
    try {
      const result = await generateRoutineAI(scores)
      setRoutineResult(result)
      setShowRoutineModal(true)
    } catch (e) {
      console.error('AI routine error:', e)
      showToast(t('Failed to generate routine. Please try again.', '루틴 생성에 실패했습니다. 다시 시도해주세요.'))
    }
    setRoutineLoading(false)
  }

  async function handleApplyRoutine() {
    if (!user || !routineResult) return
    if (!window.confirm(t('This will replace your current routine. Continue?', '기존 루틴이 덮어씌워집니다. 계속하시겠습니까?'))) return
    try {
      if (routineResult.am) await saveRoutine(user.id, 'am', routineResult.am)
      if (routineResult.pm) await saveRoutine(user.id, 'pm', routineResult.pm)
      showToast(t('Routine applied! Check My Routine.', '루틴이 적용되었습니다! 내 루틴에서 확인하세요.'))
      setShowRoutineModal(false)
    } catch {
      showToast(t('Failed to save routine.', '루틴 저장에 실패했습니다.'))
    }
  }

  function handleRetake() {
    camera.reset()
    setScores(null)
    setOverallScore(null)
    setRoutineResult(null)
    setShowRoutineModal(false)
    setQuizPhase(null)
    setQuizQ(0)
    setQuizScores({ dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 })
    setQuizAnswers([])
    setCombinedResult(null)
    setScreen('start')
  }

  if (screen === 'start') {
    return (
      <div className="pc-start-card">
        <div className="tool-intro">
          <span className="tool-icon">🔬</span>
          <h3>AI Skin Condition Analyzer</h3>
          <p className="tool-desc">{t('AI analyzes your skin for redness, oiliness, dryness, dark spots, and texture to provide personalized recommendations.', 'AI가 홍조, 유분, 건조, 색소침착, 피부결을 분석하여 맞춤 추천을 제공합니다.')}</p>
          <p className="privacy-note">🔒 {t('Photos are sent to Google AI for analysis. Not stored.', '사진은 Google AI로 전송되어 분석됩니다. 저장되지 않습니다.')}</p>
        </div>
        <button className="primary-btn" onClick={() => { setScreen('camera'); camera.startCamera() }}>
          {t('Start Analysis', '분석 시작')}
        </button>
        <button className="secondary-btn" onClick={() => setScreen('camera')}>
          {'📁 ' + t('Upload Photo', '사진 업로드')}
        </button>
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
        analyzeLabel={'🔬 ' + t('Analyze Skin', '피부 분석')}
      />
    )
  }

  if (screen === 'analyzing') {
    return (
      <div className="analyzing-screen">
        <div className="analyzing-spinner" />
        <p>{t('Analyzing your skin condition...', '피부 상태를 분석하고 있습니다...')}</p>
      </div>
    )
  }

  // === Quiz phase: questions ===
  if (quizPhase === 'questions') {
    const q = combinedQuizQuestions[quizQ]
    const progress = ((quizQ) / combinedQuizQuestions.length) * 100
    return (
      <div className="result-content animated">
        <div className="combined-quiz-container">
          <div className="combined-quiz-header">
            <h4>{t('Skin Type Quiz', '피부타입 퀴즈')}</h4>
            <span className="combined-quiz-count">{quizQ + 1} / {combinedQuizQuestions.length}</span>
          </div>
          <div className="combined-quiz-progress">
            <div className="combined-quiz-progress-fill" style={{ width: progress + '%' }} />
          </div>
          <p className="combined-quiz-question">{t(q.english, q.korean)}</p>
          <div className="combined-quiz-options">
            {q.options.map((opt, i) => (
              <button key={i} className="combined-quiz-option" onClick={() => handleQuizAnswer(opt)}>
                {t(opt.english, opt.korean)}
              </button>
            ))}
          </div>
          <button className="combined-quiz-skip" onClick={() => setQuizPhase(null)}>
            {t('Cancel quiz', '퀴즈 취소')}
          </button>
        </div>
      </div>
    )
  }

  // === Quiz phase: analyzing ===
  if (quizPhase === 'analyzing') {
    return (
      <div className="analyzing-screen">
        <div className="analyzing-spinner" />
        <p>{t('Running comprehensive skin analysis...', '종합 피부 분석 중...')}</p>
      </div>
    )
  }

  // Result screen
  let grade, gradeClass
  if (overallScore >= 80) { grade = t('Excellent', '우수'); gradeClass = 'skin-grade-excellent' }
  else if (overallScore >= 60) { grade = t('Good', '양호'); gradeClass = 'skin-grade-good' }
  else if (overallScore >= 40) { grade = t('Fair', '보통'); gradeClass = 'skin-grade-fair' }
  else { grade = t('Needs Care', '관리필요'); gradeClass = 'skin-grade-care' }

  const concernKeys = Object.keys(scores).sort((a, b) => scores[b] - scores[a])
  const topConcerns = concernKeys.slice(0, 2)

  return (
    <div className="result-content animated">
      {showConfetti && <Confetti />}

      {/* Combined result (quiz done) */}
      {quizPhase === 'done' && combinedResult && (
        <div className="combined-result-card">
          <div className="combined-result-type">
            <span className="combined-result-emoji">{combinedResult.skinTypeEmoji}</span>
            <div>
              <div className="combined-result-label">{combinedResult.skinTypeLabel}</div>
              <div className="combined-result-label-kr">{combinedResult.skinTypeLabelKr}</div>
            </div>
          </div>
          <p className="combined-result-desc">{t(combinedResult.description, combinedResult.descriptionKr)}</p>

          <div className="combined-result-section">
            <h4>{t('Key Ingredients', '추천 성분')}</h4>
            <div className="combined-result-tags">
              {(combinedResult.keyIngredients || []).map((ing, i) => (
                <span key={i} className="combined-tag combined-tag-good">{ing}</span>
              ))}
            </div>
          </div>

          <div className="combined-result-section">
            <h4>{t('Ingredients to Avoid', '피할 성분')}</h4>
            <div className="combined-result-tags">
              {(combinedResult.avoidIngredients || []).map((ing, i) => (
                <span key={i} className="combined-tag combined-tag-bad">{ing}</span>
              ))}
            </div>
          </div>

          <div className="combined-result-section">
            <h4>{t('Care Tips', '관리 팁')}</h4>
            <ul className="combined-result-tips">
              {(combinedResult.tips || []).map((tip, i) => (
                <li key={i}>{t(tip, combinedResult.tipsKr?.[i] || tip)}</li>
              ))}
            </ul>
          </div>

          <div className="combined-result-badge">
            {'🧬 ' + t('Photo + Quiz Combined Analysis', '사진 + 퀴즈 종합 분석')}
          </div>
        </div>
      )}

      {/* Quiz prompt card (only if quiz not started yet) */}
      {!quizPhase && (
        <div className="quiz-prompt-card">
          <div className="quiz-prompt-icon">📝</div>
          <h4>{t('Want a more accurate skin type?', '더 정확한 피부타입을 알고 싶다면?')}</h4>
          <p>{t('Answer 5 quick questions to combine with your photo analysis for a comprehensive skin type diagnosis.', '5개 질문에 답하면 사진 분석과 합쳐서 종합 피부타입을 진단해 드려요.')}</p>
          <div className="quiz-prompt-actions">
            <button className="primary-btn" onClick={handleStartQuiz}>
              {t('Start Quiz', '퀴즈 시작')}
            </button>
            <button className="quiz-prompt-skip" onClick={() => setQuizPhase('skipped')}>
              {t('Skip', '건너뛰기')}
            </button>
          </div>
        </div>
      )}

      <div className="skin-overall">
        <div className="skin-score-circle">
          <span className="skin-score-number">{overallScore}</span>
          <span className="skin-score-label">/ 100</span>
        </div>
        <div className={'skin-grade ' + gradeClass}>{grade}</div>
        <p className="skin-overall-desc">{t('Your overall skin health score based on AI pixel analysis.', 'AI 픽셀 분석 기반 전체 피부 건강 점수입니다.')}</p>
        <div className={usedGemini ? 'ai-badge ai-badge-gemini' : 'ai-badge ai-badge-local'}>
          {usedGemini ? '🤖 AI Powered' : '📱 Local Analysis'}
        </div>
      </div>

      <div className="skin-scores">
        <h4>{t('Skin Concern Scores', '피부 고민 점수')}</h4>
        {concernKeys.map(key => {
          const concern = SKIN_CONCERNS[key]
          if (!concern) return null
          const score = scores[key]
          const barClass = score >= 60 ? 'skin-bar-high' : score >= 35 ? 'skin-bar-med' : 'skin-bar-low'
          return (
            <div key={key} className="skin-score-row">
              <div className="skin-score-label-row">
                <span>{concern.emoji} {t(concern.name, concern.nameKr)}</span>
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
        <h4>{t('Personalized Recommendations', '맞춤 추천')}</h4>
        {topConcerns.map(cKey => {
          const cData = SKIN_CONCERNS[cKey]
          const rec = SKIN_RECOMMENDATIONS[cKey]
          if (!cData || !rec) return null
          return (
            <div key={cKey} className="skin-rec-card">
              <div className="skin-rec-header">{cData.emoji} <strong>{t(cData.name, cData.nameKr)}</strong> — Score: {scores[cKey]}</div>
              <p className="skin-rec-desc">{cData.description}</p>
              <div className="skin-rec-tips">
                <strong>{t('Tips', '팁')}:</strong>
                <ul>
                  {rec.tips.map((tip, i) => (
                    <li key={i}>{t(tip, rec.tipsKr[i])}</li>
                  ))}
                </ul>
              </div>
              <div className="skin-rec-ingredients">
                <strong>{t('Key Ingredients', '핵심 성분')}:</strong>
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
        <h4>{'🛒 ' + t('Recommended Products', '추천 제품')}</h4>
        <div className="product-card-list">
          {getRecommendations({
            concerns: topConcerns.map(k => k === 'darkSpots' ? 'dark_spots' : k)
          }).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <div className="ai-routine-section">
        <h4>{t('AI Routine Recommendation', 'AI 루틴 추천')}</h4>
        <p className="ai-routine-desc">{t('Get a personalized AM/PM routine based on your skin analysis.', '피부 분석 결과를 바탕으로 맞춤 AM/PM 루틴을 추천받으세요.')}</p>
        <button className="primary-btn ai-routine-btn" onClick={handleGenerateRoutine} disabled={routineLoading}>
          {routineLoading ? t('Generating...', '생성 중...') : t('Generate AI Routine', 'AI 루틴 추천받기')}
        </button>
      </div>

      {showRoutineModal && routineResult && (
        <div className="routine-modal-overlay" onClick={() => setShowRoutineModal(false)}>
          <div className="routine-modal" onClick={e => e.stopPropagation()}>
            <button className="routine-modal-close" onClick={() => setShowRoutineModal(false)}>&times;</button>
            <h3>{t('Your AI Routine', 'AI 맞춤 루틴')}</h3>
            <p className="routine-modal-summary">{t(routineResult.summary, routineResult.summaryKr)}</p>

            <div className="routine-modal-section">
              <h4>{'☀️ ' + t('Morning (AM)', '아침 (AM)')}</h4>
              {(routineResult.am || []).map((step, i) => (
                <div key={i} className="routine-modal-step">
                  <span className="routine-modal-num">{i + 1}</span>
                  <span className="routine-modal-name">{step.name}</span>
                </div>
              ))}
            </div>

            <div className="routine-modal-section">
              <h4>{'🌙 ' + t('Evening (PM)', '저녁 (PM)')}</h4>
              {(routineResult.pm || []).map((step, i) => (
                <div key={i} className="routine-modal-step">
                  <span className="routine-modal-num">{i + 1}</span>
                  <span className="routine-modal-name">{step.name}</span>
                </div>
              ))}
            </div>

            {routineResult.weeklyTips && routineResult.weeklyTips.length > 0 && (
              <div className="routine-modal-section">
                <h4>{t('Weekly Tips', '주간 팁')}</h4>
                <ul className="routine-modal-tips">
                  {routineResult.weeklyTips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}

            <div className="routine-modal-actions">
              {user ? (
                <button className="primary-btn" onClick={handleApplyRoutine}>
                  {t('Apply to My Routine', '내 루틴에 적용')}
                </button>
              ) : (
                <button className="primary-btn" onClick={loginAndKeepResult}>
                  {t('Sign up to save routine', '가입하고 루틴 저장하기')}
                </button>
              )}
              <button className="secondary-btn" onClick={() => setShowRoutineModal(false)}>
                {t('Close', '닫기')}
              </button>
            </div>
          </div>
        </div>
      )}

      <SaveResultBtn onSave={handleSave} onLogin={loginAndKeepResult} />
      <ShareButtons emoji="🔬" english={`Skin Score ${overallScore}/100 (${grade})`} korean="AI 피부 분석 결과" showToast={showToast} />
      <div className="fs-result-buttons">
        <button className="primary-btn" onClick={handleRetake}>{'🔄 ' + t('Try Again', '다시하기')}</button>
      </div>

      {dailyLimitModal && (
        <div className="daily-limit-overlay" onClick={() => setDailyLimitModal(null)}>
          <div className="daily-limit-modal" onClick={e => e.stopPropagation()}>
            <div className="daily-limit-icon">⏰</div>
            <h3>{t("Today's save is done!", '오늘의 저장이 완료되었어요!')}</h3>
            <p>{t(
              'Skin progress saves once per day to track meaningful changes.',
              '의미 있는 변화를 추적하기 위해 하루 1회 저장됩니다.'
            )}</p>
            <p className="daily-limit-time">
              {t(`Next save available in ${dailyLimitModal}`, `${dailyLimitModal} 후에 다시 저장할 수 있어요`)}
            </p>
            <button className="primary-btn" onClick={() => setDailyLimitModal(null)}>
              {t('Got it!', '확인')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
