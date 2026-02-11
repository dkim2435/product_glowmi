import { useState, useEffect } from 'react'
import { saveRoutine, loadRoutines } from '../../lib/db'

const ROUTINE_CATEGORIES = [
  { key: 'oil_cleanser', label: 'Oil Cleanser', labelKr: '오일 클렌저', emoji: '🫒' },
  { key: 'water_cleanser', label: 'Water Cleanser', labelKr: '폼 클렌저', emoji: '🫧' },
  { key: 'exfoliator', label: 'Exfoliator', labelKr: '각질 제거제', emoji: '🧽' },
  { key: 'toner', label: 'Toner', labelKr: '토너', emoji: '💦' },
  { key: 'essence', label: 'Essence', labelKr: '에센스', emoji: '💎' },
  { key: 'serum', label: 'Serum', labelKr: '세럼', emoji: '🧪' },
  { key: 'sheet_mask', label: 'Sheet Mask', labelKr: '시트 마스크', emoji: '🎭' },
  { key: 'eye_cream', label: 'Eye Cream', labelKr: '아이크림', emoji: '👁️' },
  { key: 'moisturizer', label: 'Moisturizer', labelKr: '보습제', emoji: '🧴' },
  { key: 'sunscreen', label: 'Sunscreen', labelKr: '선크림', emoji: '☀️' },
  { key: 'sleeping_mask', label: 'Sleeping Mask', labelKr: '수면팩', emoji: '🌙' },
  { key: 'other', label: 'Other', labelKr: '기타', emoji: '✨' }
]

function getCategoryByKey(key) {
  return ROUTINE_CATEGORIES.find(c => c.key === key) || null
}

export default function MyRoutine({ userId, showToast }) {
  const [routineData, setRoutineData] = useState({ am: [], pm: [] })
  const [activeType, setActiveType] = useState('am')
  const [loading, setLoading] = useState(true)
  const [newStep, setNewStep] = useState({ category: 'oil_cleanser', name: '', brand: '' })

  useEffect(() => { refresh() }, [userId])

  async function refresh() {
    setLoading(true)
    try {
      const routines = await loadRoutines(userId)
      const data = { am: [], pm: [] }
      for (const r of routines) {
        if (r.routine_type === 'am') data.am = r.steps || []
        if (r.routine_type === 'pm') data.pm = r.steps || []
      }
      setRoutineData(data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function addStep() {
    if (!newStep.name.trim()) {
      showToast('Please enter a product name. 제품명을 입력해주세요.')
      return
    }
    const updated = { ...routineData }
    updated[activeType] = [...updated[activeType], { category: newStep.category, name: newStep.name.trim(), brand: newStep.brand.trim() }]
    setRoutineData(updated)
    setNewStep({ category: 'oil_cleanser', name: '', brand: '' })
    try {
      await saveRoutine(userId, activeType, updated[activeType])
      showToast('Routine saved! 루틴이 저장되었습니다!')
    } catch {
      showToast('Failed to save routine. 루틴 저장에 실패했습니다.')
    }
  }

  async function removeStep(index) {
    const updated = { ...routineData }
    updated[activeType] = updated[activeType].filter((_, i) => i !== index)
    setRoutineData(updated)
    try {
      await saveRoutine(userId, activeType, updated[activeType])
    } catch { /* ignore */ }
  }

  async function moveStep(index, direction) {
    const steps = [...routineData[activeType]]
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= steps.length) return
    const temp = steps[index]
    steps[index] = steps[newIndex]
    steps[newIndex] = temp
    const updated = { ...routineData, [activeType]: steps }
    setRoutineData(updated)
    try {
      await saveRoutine(userId, activeType, steps)
    } catch { /* ignore */ }
  }

  if (loading) return <p className="mypage-loading">Loading... 불러오는 중...</p>

  const steps = routineData[activeType] || []

  return (
    <div className="mypage-routine-content">
      <div className="routine-type-toggle">
        <button className={'routine-toggle-btn' + (activeType === 'am' ? ' active' : '')} onClick={() => setActiveType('am')}>
          ☀️ Morning AM
        </button>
        <button className={'routine-toggle-btn' + (activeType === 'pm' ? ' active' : '')} onClick={() => setActiveType('pm')}>
          🌙 Evening PM
        </button>
      </div>

      <div className="routine-steps">
        {steps.length === 0 ? (
          <div className="mypage-empty-hint">No steps added yet. 아직 추가된 단계가 없습니다.</div>
        ) : (
          steps.map((step, i) => {
            const cat = getCategoryByKey(step.category)
            return (
              <div key={i} className="routine-step-item">
                <span className="routine-step-num">{i + 1}</span>
                <span className="routine-step-emoji">{cat ? cat.emoji : '✨'}</span>
                <div className="routine-step-info">
                  <span className="routine-step-name">{step.name || ''}</span>
                  {step.brand && <span className="routine-step-brand">{step.brand}</span>}
                  <span className="routine-step-cat">{cat ? cat.label : step.category}</span>
                </div>
                <div className="routine-step-actions">
                  {i > 0 && <button className="routine-action-btn" onClick={() => moveStep(i, -1)} title="Move up">↑</button>}
                  {i < steps.length - 1 && <button className="routine-action-btn" onClick={() => moveStep(i, 1)} title="Move down">↓</button>}
                  <button className="routine-action-btn routine-delete" onClick={() => removeStep(i)} title="Delete 삭제">&times;</button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="routine-add-section">
        <h4>Add Step 단계 추가</h4>
        <div className="routine-add-form">
          <select className="routine-select" value={newStep.category} onChange={e => setNewStep({ ...newStep, category: e.target.value })}>
            {ROUTINE_CATEGORIES.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.emoji} {cat.label} {cat.labelKr}</option>
            ))}
          </select>
          <input
            type="text"
            className="routine-input"
            placeholder="Product name 제품명"
            value={newStep.name}
            onChange={e => setNewStep({ ...newStep, name: e.target.value })}
          />
          <input
            type="text"
            className="routine-input"
            placeholder="Brand 브랜드 (optional)"
            value={newStep.brand}
            onChange={e => setNewStep({ ...newStep, brand: e.target.value })}
          />
          <button className="primary-btn routine-add-btn" onClick={addStep}>Add 추가</button>
        </div>
      </div>
    </div>
  )
}
