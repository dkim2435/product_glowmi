import { useState, useEffect, useRef } from 'react'
import { useLang } from '../../context/LanguageContext'
import { resizePhoto } from '../../lib/storage'
import { loadDiaryEntries, loadAnalysisResults, saveSkinProgressDB, loadSkinProgressDB, deleteSkinProgressDB } from '../../lib/db'
import { generateProgressReportAI } from '../../lib/gemini'
import { getLocalDate } from '../../lib/dateUtils'

export default function SkinProgress({ userId, showToast, onGoToSkinAnalyzer }) {
  const { t } = useLang()
  const [entries, setEntries] = useState([])
  const [diaryEntries, setDiaryEntries] = useState([])
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('chart') // chart | photos | compare
  const [compareA, setCompareA] = useState(null)
  const [compareB, setCompareB] = useState(null)
  const [aiReport, setAiReport] = useState(null)
  const [aiReportLoading, setAiReportLoading] = useState(false)
  const chartRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => { refresh() }, [userId])

  async function refresh() {
    setLoading(true)
    try {
      const progressData = userId ? await loadSkinProgressDB(userId) : []
      setEntries(progressData)

      // Also load diary entries that have AI scores
      const diary = await loadDiaryEntries(userId, 90)
      setDiaryEntries(diary.filter(d => d.ai_overall_score))

      // Load saved skin analysis from Supabase
      const analysis = await loadAnalysisResults(userId)
      setAnalysisResult(analysis)
    } catch {
      showToast(t('Failed to load progress data.', '진행 데이터를 불러오지 못했습니다.'))
    }
    setLoading(false)
  }

  useEffect(() => {
    if (viewMode === 'chart' && chartRef.current) drawChart()
  }, [entries, diaryEntries, analysisResult, viewMode])

  // Merge progress entries with diary AI scores and analysis results for the chart
  function getAllScores() {
    const map = new Map()

    // From saved AI skin analysis (Supabase analysis_results)
    if (analysisResult && analysisResult.skin_overall_score && analysisResult.skin_analyzed_at) {
      const date = analysisResult.skin_analyzed_at.split('T')[0]
      map.set(date, {
        date,
        score: analysisResult.skin_overall_score,
        source: 'analysis'
      })
    }

    // From diary entries with AI scores
    for (const d of diaryEntries) {
      if (d.ai_overall_score) {
        map.set(d.entry_date, {
          date: d.entry_date,
          score: d.ai_overall_score,
          source: 'diary'
        })
      }
    }

    // From progress tracker (overrides others if same date)
    for (const e of entries) {
      if (e.overallScore) {
        map.set(e.date, {
          date: e.date,
          score: e.overallScore,
          source: 'progress',
          hasPhoto: !!e.photoThumb
        })
      }
    }

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
  }

  function getPhotos() {
    return entries.filter(e => e.photoThumb).sort((a, b) => a.date.localeCompare(b.date))
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''

    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const thumb = await resizePhoto(ev.target.result, 400)
        const today = getLocalDate()

        await saveSkinProgressDB(userId, {
          date: today,
          photoThumb: thumb,
          overallScore: null,
          scores: null
        })
        const updated = await loadSkinProgressDB(userId)
        setEntries(updated)
        showToast(t('Progress photo saved!', '진행 사진이 저장되었습니다!'))
      } catch {
        showToast(t('Failed to save photo.', '사진 저장에 실패했습니다.'))
      }
    }
    reader.readAsDataURL(file)
  }

  async function handleDeleteEntry(id) {
    if (!window.confirm(t('Delete this entry?', '이 기록을 삭제하시겠습니까?'))) return
    try {
      await deleteSkinProgressDB(userId, id)
      const updated = await loadSkinProgressDB(userId)
      setEntries(updated)
    } catch {
      showToast(t('Failed to delete.', '삭제에 실패했습니다.'))
    }
  }

  async function handleAiReport() {
    const photosWithScores = entries.filter(e => e.photoThumb)
    if (photosWithScores.length < 2) return

    // Rate limit: once per day
    const lastReport = localStorage.getItem('glowmi_last_ai_report')
    if (lastReport) {
      const lastDate = getLocalDate(new Date(lastReport))
      const today = getLocalDate()
      if (lastDate === today) {
        showToast(t('AI report is available once per day.', 'AI 리포트는 하루 1회 가능합니다.'))
        return
      }
    }

    setAiReportLoading(true)
    try {
      const oldest = photosWithScores[0]
      const newest = photosWithScores[photosWithScores.length - 1]
      const daysBetween = Math.round((new Date(newest.date) - new Date(oldest.date)) / (1000 * 60 * 60 * 24))

      const report = await generateProgressReportAI(
        oldest.photoThumb,
        newest.photoThumb,
        oldest.scores,
        newest.scores,
        daysBetween
      )
      setAiReport(report)
      localStorage.setItem('glowmi_last_ai_report', new Date().toISOString())
    } catch (e) {
      console.error('AI report error:', e)
      showToast(t('Failed to generate AI report.', 'AI 리포트 생성에 실패했습니다.'))
    }
    setAiReportLoading(false)
  }

  function drawChart() {
    const canvas = chartRef.current
    if (!canvas) return
    const allScores = getAllScores()
    if (allScores.length < 2) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = 220 * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = '220px'
    ctx.scale(dpr, dpr)

    const w = rect.width, h = 220
    const pad = { top: 25, right: 20, bottom: 35, left: 45 }
    const plotW = w - pad.left - pad.right
    const plotH = h - pad.top - pad.bottom

    ctx.clearRect(0, 0, w, h)

    // Grid lines
    ctx.strokeStyle = '#f0f0f0'
    ctx.lineWidth = 1
    for (let g = 0; g <= 100; g += 25) {
      const gy = pad.top + plotH * (1 - g / 100)
      ctx.beginPath()
      ctx.moveTo(pad.left, gy)
      ctx.lineTo(w - pad.right, gy)
      ctx.stroke()
      ctx.fillStyle = '#aaa'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(g, pad.left - 6, gy + 3)
    }

    // Gradient fill under line
    const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH)
    gradient.addColorStop(0, 'rgba(139, 126, 200, 0.3)')
    gradient.addColorStop(1, 'rgba(139, 126, 200, 0.02)')

    ctx.beginPath()
    for (let i = 0; i < allScores.length; i++) {
      const x = pad.left + (i / (allScores.length - 1)) * plotW
      const y = pad.top + plotH * (1 - (allScores[i].score || 0) / 100)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    // Close path for fill
    ctx.lineTo(pad.left + plotW, pad.top + plotH)
    ctx.lineTo(pad.left, pad.top + plotH)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Line
    ctx.strokeStyle = '#8B7EC8'
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.beginPath()
    for (let i = 0; i < allScores.length; i++) {
      const x = pad.left + (i / (allScores.length - 1)) * plotW
      const y = pad.top + plotH * (1 - (allScores[i].score || 0) / 100)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Dots + date labels
    for (let i = 0; i < allScores.length; i++) {
      const x = pad.left + (i / (allScores.length - 1)) * plotW
      const y = pad.top + plotH * (1 - (allScores[i].score || 0) / 100)

      // Dot
      ctx.beginPath()
      ctx.arc(x, y, allScores[i].hasPhoto ? 5 : 3.5, 0, Math.PI * 2)
      ctx.fillStyle = allScores[i].hasPhoto ? '#6C5FA7' : '#8B7EC8'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Score label above dot
      ctx.fillStyle = '#555'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(allScores[i].score, x, y - 10)

      // Date label below
      const showLabel = allScores.length <= 10 || i === 0 || i === allScores.length - 1 || i % Math.ceil(allScores.length / 8) === 0
      if (showLabel) {
        ctx.fillStyle = '#888'
        ctx.font = '9px sans-serif'
        ctx.fillText(allScores[i].date.slice(5), x, h - 8)
      }
    }
  }

  if (loading) return <p className="mypage-loading">{t('Loading...', '불러오는 중...')}</p>

  const allScores = getAllScores()
  const photos = getPhotos()
  const latestScore = allScores.length > 0 ? allScores[allScores.length - 1] : null
  const firstScore = allScores.length > 1 ? allScores[0] : null
  const scoreDiff = latestScore && firstScore ? latestScore.score - firstScore.score : 0

  return (
    <div className="progress-content">
      {/* Summary header */}
      <div className="progress-summary">
        {latestScore ? (
          <>
            <div className="progress-score-big">
              <span className="progress-score-num">{latestScore.score}</span>
              <span className="progress-score-label">/100</span>
            </div>
            <div className="progress-score-meta">
              <span className="progress-latest-date">{t('Latest', '최근')}: {latestScore.date}</span>
              {allScores.length > 1 && (
                <span className={'progress-diff' + (scoreDiff >= 0 ? ' positive' : ' negative')}>
                  {scoreDiff >= 0 ? '↑' : '↓'} {Math.abs(scoreDiff)} pts
                  {scoreDiff >= 0 ? t(' improvement', ' 향상') : t(' decline', ' 하락')}
                </span>
              )}
              <span className="progress-count">{allScores.length} {t('records', '기록')}</span>
            </div>
          </>
        ) : (
          <div className="progress-empty">
            <p>{t('No skin scores yet.', '아직 피부 점수가 없습니다.')}</p>
            <p className="progress-empty-hint">{t('Analyze your skin and save the result — scores will appear here over time.', '피부 분석 후 결과를 저장하면 여기에 점수가 쌓여요.')}</p>
            <button className="mypage-empty-link" onClick={onGoToSkinAnalyzer}>🔬 {t('Go to Skin Analyzer', '피부 분석 하러가기')}</button>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="progress-actions">
        <button className="primary-btn progress-scan-btn" onClick={onGoToSkinAnalyzer}>
          🔬 {t('Quick Skin Scan', '피부 스캔')}
        </button>
        <button className="secondary-btn" onClick={() => fileInputRef.current?.click()}>
          📁 {t('Upload Photo', '사진 업로드')}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
      </div>

      {/* View toggle */}
      {(allScores.length > 0 || photos.length > 0) && (
        <div className="progress-view-toggle">
          <button className={'progress-toggle-btn' + (viewMode === 'chart' ? ' active' : '')} onClick={() => setViewMode('chart')}>
            📈 {t('Score Chart', '점수차트')}
          </button>
          <button className={'progress-toggle-btn' + (viewMode === 'photos' ? ' active' : '')} onClick={() => setViewMode('photos')}>
            📷 {t('Photo Timeline', '사진 타임라인')}
          </button>
          {photos.length >= 2 && (
            <button className={'progress-toggle-btn' + (viewMode === 'compare' ? ' active' : '')} onClick={() => setViewMode('compare')}>
              🔄 {t('Compare', '비교')}
            </button>
          )}
        </div>
      )}

      {/* Chart view */}
      {viewMode === 'chart' && allScores.length >= 2 && (
        <div className="progress-chart-section">
          <h4>{t('Skin Score Chart', '피부 점수차트')}</h4>
          <canvas ref={chartRef} width="600" height="220" />
          <p className="progress-chart-hint">
            {allScores.some(s => s.hasPhoto) && t('● Larger dots = has photo', '● 큰 점 = 사진 있음')}
          </p>
        </div>
      )}
      {viewMode === 'chart' && allScores.length < 2 && (
        <div className="progress-chart-empty">
          <p className="progress-empty">{allScores.length === 0
            ? t('No skin scores yet. Scan your skin and save — scores & photos are tracked here (1/day).', '아직 피부 점수가 없습니다. 피부 스캔 후 저장하면 점수와 사진이 여기에 기록돼요 (하루 1회).')
            : t('1 score recorded. Save one more scan to see the chart! (1 save/day)', '1개 점수 기록됨. 1번 더 스캔 후 저장하면 차트가 나타나요! (하루 1회 저장)')
          }</p>
        </div>
      )}

      {/* Photos timeline */}
      {viewMode === 'photos' && (
        <div className="progress-photos-section">
          <h4>{t('Progress Photos', '진행 사진')}</h4>
          {photos.length === 0 ? (
            <p className="mypage-empty-hint">{t('No photos yet. Add your first progress photo!', '아직 사진이 없습니다.')}</p>
          ) : (
            <div className="progress-photo-grid">
              {photos.map(entry => (
                <div key={entry.id} className="progress-photo-card">
                  <img src={entry.photoThumb} alt={entry.date} className="progress-photo-img" />
                  <div className="progress-photo-info">
                    <span className="progress-photo-date">{entry.date}</span>
                    {entry.overallScore && <span className="progress-photo-score">{t('Score', '점수')}: {entry.overallScore}</span>}
                  </div>
                  <button className="progress-photo-delete" onClick={() => handleDeleteEntry(entry.id)} title={t('Delete', '삭제')}>&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compare view */}
      {viewMode === 'compare' && photos.length >= 2 && (
        <div className="progress-compare-section">
          <h4>{t('Before & After', '비포 & 애프터')}</h4>
          <div className="compare-selectors">
            <div className="compare-select-group">
              <label>{t('Before', '이전')}</label>
              <select
                className="compare-select"
                value={compareA || ''}
                onChange={e => setCompareA(e.target.value)}
              >
                <option value="">{t('Select...', '선택')}</option>
                {photos.map(p => (
                  <option key={p.id} value={p.id}>{p.date} {p.overallScore ? `(${p.overallScore}pts)` : ''}</option>
                ))}
              </select>
            </div>
            <div className="compare-select-group">
              <label>{t('After', '이후')}</label>
              <select
                className="compare-select"
                value={compareB || ''}
                onChange={e => setCompareB(e.target.value)}
              >
                <option value="">{t('Select...', '선택')}</option>
                {photos.map(p => (
                  <option key={p.id} value={p.id}>{p.date} {p.overallScore ? `(${p.overallScore}pts)` : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {compareA && compareB && (() => {
            const photoA = photos.find(p => p.id === compareA)
            const photoB = photos.find(p => p.id === compareB)
            if (!photoA || !photoB) return null
            const diff = (photoB.overallScore || 0) - (photoA.overallScore || 0)
            return (
              <div className="compare-result">
                <div className="compare-photo-pair">
                  <div className="compare-photo-box">
                    <img src={photoA.photoThumb} alt="Before" className="compare-photo" />
                    <span className="compare-label">{t('Before', '이전')} {photoA.date}</span>
                    {photoA.overallScore && <span className="compare-score">{photoA.overallScore}/100</span>}
                  </div>
                  <div className="compare-arrow">→</div>
                  <div className="compare-photo-box">
                    <img src={photoB.photoThumb} alt="After" className="compare-photo" />
                    <span className="compare-label">{t('After', '이후')} {photoB.date}</span>
                    {photoB.overallScore && <span className="compare-score">{photoB.overallScore}/100</span>}
                  </div>
                </div>
                {photoA.overallScore && photoB.overallScore && (
                  <div className={'compare-diff' + (diff >= 0 ? ' positive' : ' negative')}>
                    {diff >= 0 ? '📈' : '📉'} {diff >= 0 ? '+' : ''}{diff} {t('points', '포인트')}
                  </div>
                )}
              </div>
            )
          })()}

          {/* AI Report button in compare view */}
          {photos.length >= 2 && (
            <div className="ai-report-section">
              <button className="primary-btn ai-report-btn" onClick={handleAiReport} disabled={aiReportLoading}>
                {aiReportLoading ? t('Generating AI Report...', 'AI 리포트 생성 중...') : t('Generate AI Report', 'AI 리포트 생성')}
              </button>
            </div>
          )}

          {aiReport && (
            <div className={'ai-report-card progress-' + aiReport.overallProgress}>
              <div className="ai-report-header">
                <span className="ai-report-emoji">{aiReport.overallProgress === 'improved' ? '📈' : aiReport.overallProgress === 'stable' ? '➡️' : '📉'}</span>
                <h4>{aiReport.overallProgress === 'improved' ? t('Improved!', '개선됨!') : aiReport.overallProgress === 'stable' ? t('Stable', '유지 중') : t('Needs attention', '관리 필요')}</h4>
              </div>
              <p className="ai-report-summary">{t(aiReport.overallSummary, aiReport.overallSummaryKr)}</p>

              {aiReport.improvements && aiReport.improvements.length > 0 && (
                <div className="ai-report-list">
                  <strong>{t('Improvements', '개선 사항')}</strong>
                  {aiReport.improvements.map((item, i) => (
                    <div key={i} className="ai-report-item good">
                      <span className="ai-report-area">{item.area}</span>
                      <span>{t(item.detail, item.detailKr)}</span>
                    </div>
                  ))}
                </div>
              )}

              {aiReport.concerns && aiReport.concerns.length > 0 && (
                <div className="ai-report-list">
                  <strong>{t('Areas of concern', '주의 사항')}</strong>
                  {aiReport.concerns.map((item, i) => (
                    <div key={i} className="ai-report-item concern">
                      <span className="ai-report-area">{item.area}</span>
                      <span>{t(item.detail, item.detailKr)}</span>
                    </div>
                  ))}
                </div>
              )}

              {aiReport.recommendations && aiReport.recommendations.length > 0 && (
                <div className="ai-report-recs">
                  <strong>{t('Recommendations', '추천')}</strong>
                  <ul>
                    {aiReport.recommendations.map((rec, i) => (
                      <li key={i}>{t(rec, aiReport.recommendationsKr?.[i] || rec)}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="ai-report-encouragement">{t(aiReport.encouragement, aiReport.encouragementKr)}</p>
            </div>
          )}

          {/* Quick compare shortcuts */}
          {photos.length >= 2 && (
            <div className="compare-shortcuts">
              <button
                className="compare-shortcut-btn"
                onClick={() => { setCompareA(photos[0].id); setCompareB(photos[photos.length - 1].id) }}
              >
                {t('First vs Latest', '처음 vs 최근')}
              </button>
              {photos.length >= 5 && (
                <button
                  className="compare-shortcut-btn"
                  onClick={() => { setCompareA(photos[photos.length - 5].id); setCompareB(photos[photos.length - 1].id) }}
                >
                  {t('Recent 5', '최근 5개 비교')}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
