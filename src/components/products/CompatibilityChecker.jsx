import { useState } from 'react'
import { parseIngredientList, findConflicts, countStrongActives } from './ingredientLogic'

export default function CompatibilityChecker() {
  const [inputA, setInputA] = useState('')
  const [inputB, setInputB] = useState('')
  const [results, setResults] = useState(null)

  function check() {
    if (!inputA.trim() || !inputB.trim()) return
    const listA = parseIngredientList(inputA)
    const listB = parseIngredientList(inputB)
    const conflicts = findConflicts(listA, listB)
    const actives = countStrongActives(listA, listB)
    setResults({ conflicts, actives, countA: listA.length, countB: listB.length })
  }

  function clear() {
    setInputA('')
    setInputB('')
    setResults(null)
  }

  const highCount = results?.conflicts.filter(c => c.rule.severity === 'high').length || 0
  const medCount = results?.conflicts.filter(c => c.rule.severity === 'medium').length || 0
  const lowCount = results?.conflicts.filter(c => c.rule.severity === 'low').length || 0

  let overallClass = '', overallEmoji = '', overallText = '', overallTextKr = ''
  if (results) {
    if (highCount > 0) {
      overallClass = 'compat-summary-bad'; overallEmoji = '⚠️'
      overallText = 'Conflicts detected — use caution!'; overallTextKr = '충돌 감지 — 주의가 필요합니다!'
    } else if (medCount > 0) {
      overallClass = 'compat-summary-warn'; overallEmoji = '⚡'
      overallText = 'Some ingredients may interact — check tips below.'; overallTextKr = '일부 성분이 상호작용할 수 있습니다.'
    } else {
      overallClass = 'compat-summary-good'; overallEmoji = '✅'
      overallText = 'No major conflicts found — these products look compatible!'; overallTextKr = '주요 충돌이 없습니다 — 함께 사용 가능합니다!'
    }
  }

  return (
    <div className="compatibility-checker">
      <div className="compat-inputs">
        <div className="compat-input-group">
          <label>Product A 제품 A</label>
          <textarea className="compat-input" placeholder="Paste ingredients..." value={inputA} onChange={e => setInputA(e.target.value)} rows={3} />
        </div>
        <div className="compat-input-group">
          <label>Product B 제품 B</label>
          <textarea className="compat-input" placeholder="Paste ingredients..." value={inputB} onChange={e => setInputB(e.target.value)} rows={3} />
        </div>
      </div>

      <div className="compat-btn-row">
        <button className="primary-btn" onClick={check}>⚡ Check Compatibility 호환성 확인</button>
        <button className="secondary-btn" onClick={clear}>Clear 초기화</button>
      </div>

      {results && (
        <div className="compat-results">
          <div className={'compat-summary ' + overallClass}>
            <span className="compat-summary-emoji">{overallEmoji}</span>
            <div><strong>{overallText}</strong><br /><span className="compat-summary-kr">{overallTextKr}</span></div>
          </div>

          <div className="compat-stats">
            <span className="compat-stat">Product A: {results.countA} ingredients</span>
            <span className="compat-stat">Product B: {results.countB} ingredients</span>
            {highCount > 0 && <span className="compat-stat compat-stat-high">{highCount} high risk</span>}
            {medCount > 0 && <span className="compat-stat compat-stat-med">{medCount} medium</span>}
            {lowCount > 0 && <span className="compat-stat compat-stat-low">{lowCount} low</span>}
          </div>

          {results.actives.count >= 3 && (
            <div className="compat-active-warning">
              <strong>⚠️ Active Stacking Warning 활성 성분 과다 경고</strong>
              <p>{results.actives.count} strong actives detected: <em>{results.actives.names.join(', ')}</em>. Using too many actives at once can compromise your skin barrier.</p>
              <p className="compat-summary-kr">두 제품에 {results.actives.count}개의 강력한 활성 성분이 포함되어 있습니다.</p>
            </div>
          )}

          {results.conflicts.length > 0 && (
            <div className="compat-conflicts">
              {results.conflicts.map((c, i) => {
                const severityLabel = c.rule.severity === 'high' ? '🔴 High Risk' : c.rule.severity === 'medium' ? '🟡 Medium' : '🟢 Low'
                return (
                  <div key={i} className={'compat-conflict-card compat-card-' + c.rule.severity}>
                    <div className="compat-card-header">
                      <span className="compat-severity">{severityLabel}</span>
                      <strong>{c.rule.nameA} + {c.rule.nameB}</strong>
                    </div>
                    <p className="compat-card-msg">{c.rule.message}</p>
                    <p className="compat-card-msg-kr">{c.rule.messageKr}</p>
                    <p className="compat-card-tip">💡 <strong>Tip:</strong> {c.rule.tip}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
