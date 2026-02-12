import { useState, useEffect, useRef } from 'react'
import { useLang } from '../../context/LanguageContext'
import { saveDiaryEntry, loadDiaryEntries, deleteDiaryEntry } from '../../lib/db'
import { analyzeDiaryAI } from '../../lib/gemini'

const CONDITIONS = [
  { value: 'good', emoji: '😊', label: 'Good', labelKr: '좋음' },
  { value: 'normal', emoji: '😐', label: 'Normal', labelKr: '보통' },
  { value: 'bad', emoji: '😫', label: 'Bad', labelKr: '나쁨' }
]

const SKIN_LEVELS = [
  { value: 'none', score: 10, emoji: '✅', label: 'None', labelKr: '없음' },
  { value: 'mild', score: 30, emoji: '🟡', label: 'Mild', labelKr: '약간' },
  { value: 'moderate', score: 55, emoji: '🟠', label: 'Moderate', labelKr: '보통' },
  { value: 'severe', score: 80, emoji: '🔴', label: 'Severe', labelKr: '심함' }
]

const BREAKOUT_LEVELS = [
  { value: 'none', score: 10, emoji: '✅', label: 'None', labelKr: '없음' },
  { value: 'few', score: 30, emoji: '🟡', label: 'Few', labelKr: '조금' },
  { value: 'some', score: 55, emoji: '🟠', label: 'Some', labelKr: '보통' },
  { value: 'many', score: 80, emoji: '🔴', label: 'Many', labelKr: '많음' }
]

const SLEEP_OPTS = ['<4h', '5-6h', '7-8h', '9h+']
const STRESS_OPTS = [
  { value: 'low', emoji: '😊', label: 'Low', labelKr: '낮음' },
  { value: 'medium', emoji: '😐', label: 'Medium', labelKr: '보통' },
  { value: 'high', emoji: '😫', label: 'High', labelKr: '높음' }
]
const WATER_OPTS = [
  { value: 'low', label: 'Low', labelKr: '적음' },
  { value: 'normal', label: 'Normal', labelKr: '보통' },
  { value: 'high', label: 'High', labelKr: '많음' }
]

function scoreToLevel(score, levels) {
  if (!score || score <= 15) return levels[0]
  if (score <= 40) return levels[1]
  if (score <= 65) return levels[2]
  return levels[3]
}

export default function SkinDiary({ userId, showToast }) {
  const { t } = useLang()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    overall_condition: '', dryness: '', oiliness: '', redness: '', breakouts: '', sensitivity: '',
    sleep_hours: '', stress_level: '', water_intake: '', notes: ''
  })
  const [todaySaved, setTodaySaved] = useState(false)
  const [aiReport, setAiReport] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const chartRef = useRef(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { refresh() }, [userId])

  async function refresh() {
    setLoading(true)
    try {
      const data = await loadDiaryEntries(userId, 14)
      setEntries(data)
      const todayEntry = data.find(e => e.entry_date === today)
      if (todayEntry) {
        setTodaySaved(true)
        setForm({
          overall_condition: todayEntry.overall_condition || '',
          dryness: scoreToLevel(todayEntry.ai_dryness, SKIN_LEVELS).value,
          oiliness: scoreToLevel(todayEntry.ai_oiliness, SKIN_LEVELS).value,
          redness: scoreToLevel(todayEntry.ai_redness, SKIN_LEVELS).value,
          breakouts: scoreToLevel(todayEntry.ai_dark_spots, BREAKOUT_LEVELS).value,
          sensitivity: scoreToLevel(todayEntry.ai_texture, SKIN_LEVELS).value,
          sleep_hours: todayEntry.sleep_hours || '',
          stress_level: todayEntry.stress_level || '',
          water_intake: todayEntry.water_intake || '',
          notes: todayEntry.notes || ''
        })
      } else {
        setTodaySaved(false)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => {
    if (entries.length >= 2 && chartRef.current) drawChart()
  }, [entries])

  function getSkinScore(levelValue, levels) {
    const found = levels.find(l => l.value === levelValue)
    return found ? found.score : null
  }

  async function handleSave() {
    try {
      const entry = {
        entry_date: today,
        overall_condition: form.overall_condition || null,
        sleep_hours: form.sleep_hours || null,
        stress_level: form.stress_level || null,
        water_intake: form.water_intake || null,
        notes: form.notes || null
      }
      const dryScore = getSkinScore(form.dryness, SKIN_LEVELS)
      const oilScore = getSkinScore(form.oiliness, SKIN_LEVELS)
      const redScore = getSkinScore(form.redness, SKIN_LEVELS)
      const breakScore = getSkinScore(form.breakouts, BREAKOUT_LEVELS)
      const sensScore = getSkinScore(form.sensitivity, SKIN_LEVELS)
      if (dryScore || oilScore || redScore || breakScore || sensScore) {
        const scores = [dryScore, oilScore, redScore, breakScore, sensScore].filter(Boolean)
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
        entry.ai_scores = {
          dryness: dryScore || 0,
          oiliness: oilScore || 0,
          redness: redScore || 0,
          darkSpots: breakScore || 0,
          texture: sensScore || 0,
          overallScore: avg
        }
      }
      await saveDiaryEntry(userId, entry)
      showToast(t('Diary entry saved!', '일지가 저장되었습니다!'))
      setTodaySaved(true)
      refresh()
    } catch {
      showToast(t('Failed to save diary.', '일지 저장에 실패했습니다.'))
    }
  }

  async function handleDelete(entryId) {
    if (!window.confirm(t('Delete this entry?', '이 일지를 삭제하시겠습니까?'))) return
    try {
      await deleteDiaryEntry(userId, entryId)
      showToast(t('Entry deleted.', '일지가 삭제되었습니다.'))
      refresh()
    } catch {
      showToast(t('Failed to delete.', '삭제에 실패했습니다.'))
    }
  }

  async function handleAiAnalysis() {
    if (entries.length < 7) return
    setAiLoading(true)
    try {
      const result = await analyzeDiaryAI(entries.slice(0, 7))
      setAiReport(result)
    } catch {
      showToast(t('AI analysis failed. Please try again.', 'AI 분석에 실패했습니다. 다시 시도해주세요.'))
    }
    setAiLoading(false)
  }

  function drawChart() {
    const canvas = chartRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = 200 * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = '200px'
    ctx.scale(dpr, dpr)

    const w = rect.width, h = 200
    const pad = { top: 20, right: 20, bottom: 30, left: 40 }
    const condMap = { good: 3, normal: 2, bad: 1 }

    const sorted = entries.slice().sort((a, b) => a.entry_date.localeCompare(b.entry_date))
    const points = sorted.filter(e => e.overall_condition).map(e => ({
      date: e.entry_date.slice(5),
      value: condMap[e.overall_condition] || 2
    }))

    if (points.length < 2) return
    ctx.clearRect(0, 0, w, h)

    ctx.strokeStyle = '#eee'; ctx.lineWidth = 1
    for (let g = 1; g <= 3; g++) {
      const gy = pad.top + (h - pad.top - pad.bottom) * (1 - (g - 1) / 2)
      ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(w - pad.right, gy); ctx.stroke()
    }

    ctx.fillStyle = '#888'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'
    const yLabels = ['😫', '😐', '😊']
    for (let yl = 0; yl < yLabels.length; yl++) {
      const yy = pad.top + (h - pad.top - pad.bottom) * (1 - yl / 2)
      ctx.fillText(yLabels[yl], pad.left - 6, yy + 4)
    }

    const plotW = w - pad.left - pad.right
    const plotH = h - pad.top - pad.bottom

    ctx.strokeStyle = '#ff6b9d'; ctx.lineWidth = 2; ctx.lineJoin = 'round'
    ctx.beginPath()
    for (let p = 0; p < points.length; p++) {
      const px = pad.left + (p / (points.length - 1)) * plotW
      const py = pad.top + plotH * (1 - (points[p].value - 1) / 2)
      if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
    }
    ctx.stroke()

    for (let d = 0; d < points.length; d++) {
      const dx = pad.left + (d / (points.length - 1)) * plotW
      const dy = pad.top + plotH * (1 - (points[d].value - 1) / 2)
      ctx.beginPath(); ctx.arc(dx, dy, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#ff6b9d'; ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
      ctx.fillStyle = '#888'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center'
      ctx.fillText(points[d].date, dx, h - 8)
    }
  }

  if (loading) return <p className="mypage-loading">{t('Loading...', '불러오는 중...')}</p>

  const condEmoji = { good: '😊', normal: '😐', bad: '😫' }
  const stressEmoji = { low: '😊', medium: '😐', high: '😫' }

  return (
    <div className="mypage-diary-content">
      {/* Today's form */}
      <div className="diary-form">
        <h4>{t("Today's Skin Log", '오늘의 피부 기록')}</h4>
        <p className="diary-form-date">{today}</p>

        {todaySaved && !form._editing ? (
          <div className="diary-saved-state">
            <div className="diary-saved-icon">✅</div>
            <p className="diary-saved-msg">{t("Today's entry saved!", '오늘의 기록이 저장되었습니다!')}</p>
            <div className="diary-saved-summary">
              {form.overall_condition && <span className="diary-tag">{condEmoji[form.overall_condition]} {t(CONDITIONS.find(c => c.value === form.overall_condition)?.label || '', CONDITIONS.find(c => c.value === form.overall_condition)?.labelKr || '')}</span>}
              {form.dryness && form.dryness !== 'none' && <span className="diary-tag">{'🏜️ ' + t('Dry', '건조') + ': ' + t(SKIN_LEVELS.find(l => l.value === form.dryness)?.label || '', SKIN_LEVELS.find(l => l.value === form.dryness)?.labelKr || '')}</span>}
              {form.oiliness && form.oiliness !== 'none' && <span className="diary-tag">{'💧 ' + t('Oily', '유분') + ': ' + t(SKIN_LEVELS.find(l => l.value === form.oiliness)?.label || '', SKIN_LEVELS.find(l => l.value === form.oiliness)?.labelKr || '')}</span>}
              {form.redness && form.redness !== 'none' && <span className="diary-tag">{'🔴 ' + t('Red', '홍조') + ': ' + t(SKIN_LEVELS.find(l => l.value === form.redness)?.label || '', SKIN_LEVELS.find(l => l.value === form.redness)?.labelKr || '')}</span>}
              {form.sleep_hours && <span className="diary-tag">💤 {form.sleep_hours}</span>}
            </div>
            {form.notes && <p className="diary-saved-notes">{form.notes}</p>}
            <button className="secondary-btn" onClick={() => setForm({ ...form, _editing: true })}>{t('Edit', '수정하기')}</button>
          </div>
        ) : (
          <>
            <div className="diary-field">
              <label>{t('Overall Skin Condition', '전체 피부 컨디션')}</label>
              <div className="diary-emoji-btns">
                {CONDITIONS.map(c => (
                  <button
                    key={c.value}
                    className={'diary-emoji-btn' + (form.overall_condition === c.value ? ' diary-btn-selected' : '')}
                    onClick={() => setForm({ ...form, overall_condition: c.value })}
                  >
                    <span className="diary-emoji">{c.emoji}</span>
                    <span className="diary-btn-label">{t(c.label, c.labelKr)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="diary-skin-section">
              <label className="diary-section-label">{t('Skin Conditions', '피부 상태')}</label>

              <div className="diary-field">
                <label>{'🏜️ ' + t('Dryness', '건조함')}</label>
                <div className="diary-pill-btns">
                  {SKIN_LEVELS.map(l => (
                    <button key={l.value} className={'diary-pill-btn' + (form.dryness === l.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, dryness: l.value })}>
                      {l.emoji + ' ' + t(l.label, l.labelKr)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="diary-field">
                <label>{'💧 ' + t('Oiliness', '유분')}</label>
                <div className="diary-pill-btns">
                  {SKIN_LEVELS.map(l => (
                    <button key={l.value} className={'diary-pill-btn' + (form.oiliness === l.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, oiliness: l.value })}>
                      {l.emoji + ' ' + t(l.label, l.labelKr)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="diary-field">
                <label>{'🔴 ' + t('Redness', '홍조')}</label>
                <div className="diary-pill-btns">
                  {SKIN_LEVELS.map(l => (
                    <button key={l.value} className={'diary-pill-btn' + (form.redness === l.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, redness: l.value })}>
                      {l.emoji + ' ' + t(l.label, l.labelKr)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="diary-field">
                <label>{'🫧 ' + t('Breakouts', '트러블')}</label>
                <div className="diary-pill-btns">
                  {BREAKOUT_LEVELS.map(l => (
                    <button key={l.value} className={'diary-pill-btn' + (form.breakouts === l.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, breakouts: l.value })}>
                      {l.emoji + ' ' + t(l.label, l.labelKr)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="diary-field">
                <label>{'⚡ ' + t('Sensitivity', '민감도')}</label>
                <div className="diary-pill-btns">
                  {SKIN_LEVELS.map(l => (
                    <button key={l.value} className={'diary-pill-btn' + (form.sensitivity === l.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, sensitivity: l.value })}>
                      {l.emoji + ' ' + t(l.label, l.labelKr)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="diary-field">
              <label>{t('Sleep', '수면 시간')}</label>
              <div className="diary-pill-btns">
                {SLEEP_OPTS.map(s => (
                  <button key={s} className={'diary-pill-btn' + (form.sleep_hours === s ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, sleep_hours: s })}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="diary-field">
              <label>{t('Stress', '스트레스')}</label>
              <div className="diary-emoji-btns">
                {STRESS_OPTS.map(st => (
                  <button key={st.value} className={'diary-emoji-btn' + (form.stress_level === st.value ? ' diary-btn-selected' : '')} onClick={() => setForm({ ...form, stress_level: st.value })}>
                    <span className="diary-emoji">{st.emoji}</span>
                    <span className="diary-btn-label">{t(st.label, st.labelKr)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="diary-field">
              <label>{t('Water Intake', '수분 섭취')}</label>
              <div className="diary-pill-btns">
                {WATER_OPTS.map(w => (
                  <button key={w.value} className={'diary-pill-btn' + (form.water_intake === w.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, water_intake: w.value })}>
                    {t(w.label, w.labelKr)}
                  </button>
                ))}
              </div>
            </div>

            <div className="diary-field">
              <label>{t('Notes', '메모')}</label>
              <textarea
                className="diary-textarea"
                placeholder={t('Any skin changes, new products, etc.', '피부 변화, 새 제품 사용 등을 기록하세요.')}
                rows={2}
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <button className="primary-btn diary-save-btn" onClick={handleSave}>
              {todaySaved ? t('Update Entry', '수정하기') : t('Save Entry', '저장하기')}
            </button>
          </>
        )}
      </div>

      {/* AI 7-day analysis */}
      <div className="diary-ai-section">
        <h4>{t('7-Day AI Skin Analysis', '7일 AI 피부 분석')}</h4>
        {entries.length < 7 ? (
          <div className="diary-ai-locked">
            <p>{t(`Record ${7 - entries.length} more day(s) to unlock AI analysis.`, `AI 분석을 위해 ${7 - entries.length}일 더 기록하세요.`)}</p>
            <div className="diary-ai-progress">
              <div className="diary-ai-progress-fill" style={{ width: (entries.length / 7 * 100) + '%' }} />
            </div>
            <span className="diary-ai-count">{entries.length} / 7 {t('days', '일')}</span>
          </div>
        ) : (
          <>
            <button className="primary-btn" onClick={handleAiAnalysis} disabled={aiLoading}>
              {aiLoading ? t('Analyzing...', '분석 중...') : t('Analyze My Skin Trends', '피부 트렌드 분석하기')}
            </button>
            {aiReport && (
              <div className="diary-ai-report">
                <div className="diary-ai-report-section">
                  <h5>{t('Summary', '요약')}</h5>
                  <p>{t(aiReport.summary, aiReport.summaryKr)}</p>
                </div>

                {aiReport.patterns && aiReport.patterns.length > 0 && (
                  <div className="diary-ai-report-section">
                    <h5>{t('Patterns Found', '발견된 패턴')}</h5>
                    <ul>
                      {aiReport.patterns.map((p, i) => <li key={i}>{t(p, aiReport.patternsKr?.[i] || p)}</li>)}
                    </ul>
                  </div>
                )}

                <div className="diary-ai-report-section">
                  <h5>{t('Improvement Tips', '개선 방법')}</h5>
                  <ul>
                    {(aiReport.improvements || []).map((tip, i) => <li key={i}>{t(tip, aiReport.improvementsKr?.[i] || tip)}</li>)}
                  </ul>
                </div>

                {aiReport.keyIngredients && aiReport.keyIngredients.length > 0 && (
                  <div className="diary-ai-report-section">
                    <h5>{t('Recommended Ingredients', '추천 성분')}</h5>
                    <div className="diary-ai-tags">
                      {aiReport.keyIngredients.map((ing, i) => <span key={i} className="combined-tag combined-tag-good">{ing}</span>)}
                    </div>
                  </div>
                )}

                {aiReport.avoidIngredients && aiReport.avoidIngredients.length > 0 && (
                  <div className="diary-ai-report-section">
                    <h5>{t('Ingredients to Avoid', '피할 성분')}</h5>
                    <div className="diary-ai-tags">
                      {aiReport.avoidIngredients.map((ing, i) => <span key={i} className="combined-tag combined-tag-bad">{ing}</span>)}
                    </div>
                  </div>
                )}

                {aiReport.lifestyleTips && aiReport.lifestyleTips.length > 0 && (
                  <div className="diary-ai-report-section">
                    <h5>{t('Lifestyle Tips', '생활 팁')}</h5>
                    <ul>
                      {aiReport.lifestyleTips.map((tip, i) => <li key={i}>{t(tip, aiReport.lifestyleTipsKr?.[i] || tip)}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Timeline */}
      <div className="diary-timeline-section">
        <h4>{t('Recent Entries', '최근 일지')}</h4>
        {entries.length === 0 ? (
          <p className="mypage-empty-hint">{t('No entries yet. Start tracking today!', '아직 일지가 없습니다. 오늘부터 시작해보세요!')}</p>
        ) : (
          <div className="diary-timeline">
            {entries.map(entry => (
              <div key={entry.id} className="diary-card">
                <div className="diary-card-date">{entry.entry_date}</div>
                <div className="diary-card-row">
                  {entry.overall_condition && <span className="diary-tag">{condEmoji[entry.overall_condition] || ''} {t(CONDITIONS.find(c => c.value === entry.overall_condition)?.label || entry.overall_condition, CONDITIONS.find(c => c.value === entry.overall_condition)?.labelKr || entry.overall_condition)}</span>}
                  {entry.ai_dryness > 15 && <span className="diary-tag">{'🏜️ ' + scoreToLevel(entry.ai_dryness, SKIN_LEVELS).emoji}</span>}
                  {entry.ai_oiliness > 15 && <span className="diary-tag">{'💧 ' + scoreToLevel(entry.ai_oiliness, SKIN_LEVELS).emoji}</span>}
                  {entry.ai_redness > 15 && <span className="diary-tag">{'🔴 ' + scoreToLevel(entry.ai_redness, SKIN_LEVELS).emoji}</span>}
                  {entry.ai_dark_spots > 15 && <span className="diary-tag">{'🫧 ' + scoreToLevel(entry.ai_dark_spots, BREAKOUT_LEVELS).emoji}</span>}
                  {entry.sleep_hours && <span className="diary-tag">💤 {entry.sleep_hours}</span>}
                  {entry.stress_level && <span className="diary-tag">{stressEmoji[entry.stress_level] || ''} {t('stress', '스트레스')}</span>}
                </div>
                {entry.notes && <div className="diary-card-notes">{entry.notes}</div>}
                <button className="diary-delete-btn" onClick={() => handleDelete(entry.id)} title={t('Delete', '삭제')}>&times;</button>
              </div>
            ))}
          </div>
        )}

        {entries.length >= 2 && (
          <div className="diary-chart-section">
            <h4>{t('Trend', '트렌드')}</h4>
            <canvas ref={chartRef} width="600" height="200" />
          </div>
        )}
      </div>
    </div>
  )
}
