import { useState, useEffect, useRef } from 'react'
import { useLang } from '../../context/LanguageContext'
import { saveDiaryEntry, loadDiaryEntries, deleteDiaryEntry } from '../../lib/db'
import { analyzeDiaryAI } from '../../lib/gemini'
import { getLocalDate } from '../../lib/dateUtils'
import { CheckCircle, AlertCircle, AlertTriangle, XCircle, Thermometer, Droplet, Zap } from 'lucide-react'

const CONDITIONS = [
  { value: 'good', emoji: '😊', label: 'Good', labelKr: '좋음' },
  { value: 'normal', emoji: '😐', label: 'Normal', labelKr: '보통' },
  { value: 'bad', emoji: '😫', label: 'Bad', labelKr: '나쁨' }
]

const LEVEL_ICONS = {
  none: CheckCircle,
  mild: AlertCircle,
  moderate: AlertTriangle,
  severe: XCircle,
  few: AlertCircle,
  some: AlertTriangle,
  many: XCircle,
}

const SKIN_LEVELS = [
  { value: 'none', score: 10, icon: CheckCircle, label: 'None', labelKr: '없음' },
  { value: 'mild', score: 30, icon: AlertCircle, label: 'Mild', labelKr: '약간' },
  { value: 'moderate', score: 55, icon: AlertTriangle, label: 'Moderate', labelKr: '보통' },
  { value: 'severe', score: 80, icon: XCircle, label: 'Severe', labelKr: '심함' }
]

const BREAKOUT_LEVELS = [
  { value: 'none', score: 10, icon: CheckCircle, label: 'None', labelKr: '없음' },
  { value: 'few', score: 30, icon: AlertCircle, label: 'Few', labelKr: '조금' },
  { value: 'some', score: 55, icon: AlertTriangle, label: 'Some', labelKr: '보통' },
  { value: 'many', score: 80, icon: XCircle, label: 'Many', labelKr: '많음' }
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
  const { t, lang } = useLang()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    overall_condition: '', dryness: '', oiliness: '', redness: '', breakouts: '', sensitivity: '',
    sleep_hours: '', stress_level: '', water_intake: '', notes: ''
  })
  const [todaySaved, setTodaySaved] = useState(false)
  const [aiReport, setAiReport] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [chartMetric, setChartMetric] = useState('all')
  const chartRef = useRef(null)

  const today = getLocalDate()

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
    } catch {
      showToast(t('Failed to load diary.', '일지를 불러오지 못했습니다.'))
    }
    setLoading(false)
  }

  useEffect(() => {
    if (entries.length >= 2 && chartRef.current) drawChart()
  }, [entries, chartMetric])

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
    const chartH = 240
    canvas.width = rect.width * dpr
    canvas.height = chartH * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = chartH + 'px'
    ctx.scale(dpr, dpr)

    const w = rect.width, h = chartH
    const pad = { top: 20, right: 15, bottom: 35, left: 35 }
    const plotW = w - pad.left - pad.right
    const plotH = h - pad.top - pad.bottom

    const sorted = entries.slice().sort((a, b) => a.entry_date.localeCompare(b.entry_date))
    if (sorted.length < 2) return
    ctx.clearRect(0, 0, w, h)

    // Grid lines
    ctx.strokeStyle = '#eee'; ctx.lineWidth = 0.5
    for (let g = 0; g <= 100; g += 25) {
      const gy = pad.top + plotH * (1 - g / 100)
      ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(w - pad.right, gy); ctx.stroke()
    }
    ctx.fillStyle = '#999'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right'
    for (let g = 0; g <= 100; g += 25) {
      const gy = pad.top + plotH * (1 - g / 100)
      ctx.fillText(g, pad.left - 5, gy + 3)
    }

    const isKr = lang === 'ko'
    const metrics = [
      { key: 'ai_dryness', color: '#f59e0b', label: isKr ? '건조' : 'Dry' },
      { key: 'ai_oiliness', color: '#3b82f6', label: isKr ? '유분' : 'Oil' },
      { key: 'ai_redness', color: '#ef4444', label: isKr ? '홍조' : 'Red' },
      { key: 'ai_dark_spots', color: '#8b5cf6', label: isKr ? '잡티' : 'Spots' },
      { key: 'ai_texture', color: '#10b981', label: isKr ? '질감' : 'Tex' }
    ]

    // Draw each metric line
    metrics.forEach(metric => {
      const points = sorted.filter(e => e[metric.key] != null).map(e => ({
        date: e.entry_date.slice(5),
        value: e[metric.key]
      }))
      if (points.length < 2) return

      ctx.strokeStyle = metric.color; ctx.lineWidth = 2; ctx.lineJoin = 'round'
      ctx.globalAlpha = chartMetric === 'all' || chartMetric === metric.key ? 1 : 0.15
      ctx.beginPath()
      for (let p = 0; p < points.length; p++) {
        const px = pad.left + (p / (sorted.length - 1)) * plotW
        const py = pad.top + plotH * (1 - points[p].value / 100)
        if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // Draw dots
      for (let p = 0; p < points.length; p++) {
        const px = pad.left + (p / (sorted.length - 1)) * plotW
        const py = pad.top + plotH * (1 - points[p].value / 100)
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2)
        ctx.fillStyle = metric.color; ctx.fill()
      }
      ctx.globalAlpha = 1
    })

    // X-axis labels
    ctx.fillStyle = '#888'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center'
    const step = Math.max(1, Math.floor(sorted.length / 7))
    for (let i = 0; i < sorted.length; i += step) {
      const dx = pad.left + (i / (sorted.length - 1)) * plotW
      ctx.fillText(sorted[i].entry_date.slice(5), dx, h - 8)
    }
    // Always draw last date
    if (sorted.length > 1) {
      const dx = pad.left + plotW
      ctx.fillText(sorted[sorted.length - 1].entry_date.slice(5), dx, h - 8)
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
            <div className="diary-saved-icon"><CheckCircle size={24} /></div>
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
              <p className="diary-section-hint">{t('Rate each condition based on how your skin feels today.', '오늘 피부가 느껴지는 정도를 선택하세요.')}</p>

              <div className="diary-field">
                <label><Thermometer size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{t('Dryness', '건조함')}</label>
                <p className="diary-field-hint">{t('Tightness, flaking, or rough patches', '당김, 각질, 거친 부위')}</p>
                <div className="diary-pill-btns">
                  {SKIN_LEVELS.map(l => (
                    <button key={l.value} className={'diary-pill-btn' + (form.dryness === l.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, dryness: l.value })}>
                      <l.icon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />{t(l.label, l.labelKr)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="diary-field">
                <label><Droplet size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{t('Oiliness', '유분')}</label>
                <p className="diary-field-hint">{t('Shine or greasiness on T-zone or cheeks', 'T존이나 볼의 번들거림')}</p>
                <div className="diary-pill-btns">
                  {SKIN_LEVELS.map(l => (
                    <button key={l.value} className={'diary-pill-btn' + (form.oiliness === l.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, oiliness: l.value })}>
                      <l.icon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />{t(l.label, l.labelKr)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="diary-field">
                <label><XCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4, color: '#ef4444' }} />{t('Redness', '홍조')}</label>
                <p className="diary-field-hint">{t('Visible redness or flushing', '눈에 보이는 붉은기나 홍조')}</p>
                <div className="diary-pill-btns">
                  {SKIN_LEVELS.map(l => (
                    <button key={l.value} className={'diary-pill-btn' + (form.redness === l.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, redness: l.value })}>
                      <l.icon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />{t(l.label, l.labelKr)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="diary-field">
                <label><AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{t('Breakouts', '트러블')}</label>
                <p className="diary-field-hint">{t('Pimples, whiteheads, or bumps', '여드름, 좁쌀, 뾰루지')}</p>
                <div className="diary-pill-btns">
                  {BREAKOUT_LEVELS.map(l => (
                    <button key={l.value} className={'diary-pill-btn' + (form.breakouts === l.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, breakouts: l.value })}>
                      <l.icon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />{t(l.label, l.labelKr)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="diary-field">
                <label><Zap size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{t('Sensitivity', '민감도')}</label>
                <p className="diary-field-hint">{t('Stinging, itching, or reaction to products', '따가움, 가려움, 제품 반응')}</p>
                <div className="diary-pill-btns">
                  {SKIN_LEVELS.map(l => (
                    <button key={l.value} className={'diary-pill-btn' + (form.sensitivity === l.value ? ' diary-pill-selected' : '')} onClick={() => setForm({ ...form, sensitivity: l.value })}>
                      <l.icon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />{t(l.label, l.labelKr)}
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
          <>
            <img src="/illustrations/empty-diary.png" alt="" className="empty-illustration" width={160} height={160} />
            <p className="mypage-empty-hint">{t('No entries yet. Start tracking today!', '아직 일지가 없습니다. 오늘부터 시작해보세요!')}</p>
          </>
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
            <h4>{t('Skin Metrics Trend', '피부 지표 트렌드')}</h4>
            <div className="chart-metric-toggles">
              <button className={'chart-metric-btn' + (chartMetric === 'all' ? ' active' : '')} onClick={() => setChartMetric('all')}>{t('All', '전체')}</button>
              <button className={'chart-metric-btn' + (chartMetric === 'ai_dryness' ? ' active' : '')} onClick={() => setChartMetric('ai_dryness')} style={{ borderColor: '#f59e0b' }}>{'🏜️ ' + t('Dry', '건조')}</button>
              <button className={'chart-metric-btn' + (chartMetric === 'ai_oiliness' ? ' active' : '')} onClick={() => setChartMetric('ai_oiliness')} style={{ borderColor: '#3b82f6' }}>{'💧 ' + t('Oil', '유분')}</button>
              <button className={'chart-metric-btn' + (chartMetric === 'ai_redness' ? ' active' : '')} onClick={() => setChartMetric('ai_redness')} style={{ borderColor: '#ef4444' }}>{'🔴 ' + t('Red', '홍조')}</button>
              <button className={'chart-metric-btn' + (chartMetric === 'ai_dark_spots' ? ' active' : '')} onClick={() => setChartMetric('ai_dark_spots')} style={{ borderColor: '#8b5cf6' }}>{'🫧 ' + t('Spots', '잡티')}</button>
              <button className={'chart-metric-btn' + (chartMetric === 'ai_texture' ? ' active' : '')} onClick={() => setChartMetric('ai_texture')} style={{ borderColor: '#10b981' }}>{'⚡ ' + t('Tex', '질감')}</button>
            </div>
            <canvas ref={chartRef} width="600" height="240" />
          </div>
        )}
      </div>
    </div>
  )
}
