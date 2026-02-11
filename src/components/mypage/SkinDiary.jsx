import { useState, useEffect, useRef } from 'react'
import { useLang } from '../../context/LanguageContext'
import { saveDiaryEntry, loadDiaryEntries, deleteDiaryEntry } from '../../lib/db'

const CONDITIONS = [
  { value: 'good', emoji: '😊', label: 'Good', labelKr: '좋음' },
  { value: 'normal', emoji: '😐', label: 'Normal', labelKr: '보통' },
  { value: 'bad', emoji: '😫', label: 'Bad', labelKr: '나쁨' }
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

export default function SkinDiary({ userId, showToast }) {
  const { t } = useLang()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ overall_condition: '', sleep_hours: '', stress_level: '', water_intake: '', notes: '' })
  const [todaySaved, setTodaySaved] = useState(false)
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

  async function handleSave() {
    try {
      await saveDiaryEntry(userId, { entry_date: today, ...form })
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

    // Grid
    ctx.strokeStyle = '#eee'; ctx.lineWidth = 1
    for (let g = 1; g <= 3; g++) {
      const gy = pad.top + (h - pad.top - pad.bottom) * (1 - (g - 1) / 2)
      ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(w - pad.right, gy); ctx.stroke()
    }

    // Y labels
    ctx.fillStyle = '#888'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'
    const yLabels = ['😫', '😐', '😊']
    for (let yl = 0; yl < yLabels.length; yl++) {
      const yy = pad.top + (h - pad.top - pad.bottom) * (1 - yl / 2)
      ctx.fillText(yLabels[yl], pad.left - 6, yy + 4)
    }

    const plotW = w - pad.left - pad.right
    const plotH = h - pad.top - pad.bottom

    // Line
    ctx.strokeStyle = '#ff6b9d'; ctx.lineWidth = 2; ctx.lineJoin = 'round'
    ctx.beginPath()
    for (let p = 0; p < points.length; p++) {
      const px = pad.left + (p / (points.length - 1)) * plotW
      const py = pad.top + plotH * (1 - (points[p].value - 1) / 2)
      if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
    }
    ctx.stroke()

    // Dots + labels
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
        <h4>{t("Today's Entry", '오늘의 기록')}</h4>
        <p className="diary-form-date">{today}</p>

        {todaySaved && !form._editing ? (
          <div className="diary-saved-state">
            <div className="diary-saved-icon">✅</div>
            <p className="diary-saved-msg">{t("Today's entry saved!", '오늘의 기록이 저장되었습니다!')}</p>
            <div className="diary-saved-summary">
              {form.overall_condition && <span className="diary-tag">{condEmoji[form.overall_condition]} {form.overall_condition}</span>}
              {form.sleep_hours && <span className="diary-tag">💤 {form.sleep_hours}</span>}
              {form.stress_level && <span className="diary-tag">{stressEmoji[form.stress_level]} {t('stress', '스트레스')}</span>}
              {form.water_intake && <span className="diary-tag">💧 {form.water_intake}</span>}
            </div>
            {form.notes && <p className="diary-saved-notes">{form.notes}</p>}
            <button className="secondary-btn" onClick={() => setForm({ ...form, _editing: true })}>{t('Edit', '수정하기')}</button>
          </div>
        ) : (
          <>
            <div className="diary-field">
              <label>{t('Overall Condition', '전체 컨디션')}</label>
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

            <div className="diary-field">
              <label>{t('Sleep', '수면 시간')}</label>
              <div className="diary-pill-btns">
                {SLEEP_OPTS.map(s => (
                  <button
                    key={s}
                    className={'diary-pill-btn' + (form.sleep_hours === s ? ' diary-pill-selected' : '')}
                    onClick={() => setForm({ ...form, sleep_hours: s })}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div className="diary-field">
              <label>{t('Stress', '스트레스')}</label>
              <div className="diary-emoji-btns">
                {STRESS_OPTS.map(st => (
                  <button
                    key={st.value}
                    className={'diary-emoji-btn' + (form.stress_level === st.value ? ' diary-btn-selected' : '')}
                    onClick={() => setForm({ ...form, stress_level: st.value })}
                  >
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
                  <button
                    key={w.value}
                    className={'diary-pill-btn' + (form.water_intake === w.value ? ' diary-pill-selected' : '')}
                    onClick={() => setForm({ ...form, water_intake: w.value })}
                  >{t(w.label, w.labelKr)}</button>
                ))}
              </div>
            </div>

            <div className="diary-field">
              <label>{t('Notes', '메모')}</label>
              <textarea
                className="diary-textarea"
                placeholder={t('How is your skin today?', '오늘 피부 상태는 어떤가요?')}
                rows={3}
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
                  {entry.overall_condition && <span className="diary-tag">{condEmoji[entry.overall_condition] || ''} {entry.overall_condition}</span>}
                  {entry.sleep_hours && <span className="diary-tag">💤 {entry.sleep_hours}</span>}
                  {entry.stress_level && <span className="diary-tag">{stressEmoji[entry.stress_level] || ''} {t('stress', '스트레스')}</span>}
                  {entry.water_intake && <span className="diary-tag">💧 {entry.water_intake}</span>}
                </div>
                {entry.ai_overall_score && <div className="diary-card-ai">{t('AI Score', 'AI 점수')}: {entry.ai_overall_score}/100</div>}
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
