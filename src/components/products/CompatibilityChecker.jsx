import { useState, useRef } from 'react'
import { parseIngredientList, findConflicts, countStrongActives, parseOCRText, lookupIngredient } from './ingredientLogic'
import { useLang } from '../../context/LanguageContext'

export default function CompatibilityChecker({ showToast }) {
  const { t } = useLang()
  const [inputA, setInputA] = useState('')
  const [inputB, setInputB] = useState('')
  const [results, setResults] = useState(null)
  const [scanningTarget, setScanningTarget] = useState(null) // 'A' | 'B' | null
  const [scanProgress, setScanProgress] = useState(0)
  const fileRefA = useRef(null)
  const fileRefB = useRef(null)

  function check() {
    if (!inputA.trim() || !inputB.trim()) return
    const listA = parseIngredientList(inputA)
    const listB = parseIngredientList(inputB)
    const conflicts = findConflicts(listA, listB)
    const actives = countStrongActives(listA, listB)

    // Side-by-side comparison
    const lookupA = listA.map(n => ({ raw: n, ...lookupIngredient(n) }))
    const lookupB = listB.map(n => ({ raw: n, ...lookupIngredient(n) }))
    const namesA = new Set(lookupA.filter(r => r.found).map(r => r.data.name.toLowerCase()))
    const namesB = new Set(lookupB.filter(r => r.found).map(r => r.data.name.toLowerCase()))
    const shared = lookupA.filter(r => r.found && namesB.has(r.data.name.toLowerCase()))
    const onlyA = lookupA.filter(r => r.found && !namesB.has(r.data.name.toLowerCase()))
    const onlyB = lookupB.filter(r => r.found && !namesA.has(r.data.name.toLowerCase()))

    setResults({ conflicts, actives, countA: listA.length, countB: listB.length, shared, onlyA, onlyB })
  }

  function clear() {
    setInputA('')
    setInputB('')
    setResults(null)
  }

  async function handleScan(imageDataUrl, target) {
    setScanningTarget(target)
    setScanProgress(10)
    try {
      const Tesseract = await import('tesseract.js')
      const result = await Tesseract.recognize(imageDataUrl, 'eng+kor', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.max(10, Math.round(m.progress * 100)))
          }
        }
      })
      setScanningTarget(null)
      const ocrText = result.data.text
      if (!ocrText || ocrText.trim().length < 5) {
        showToast?.(t('Could not read text. Please type the ingredients manually.', '텍스트를 읽지 못했습니다. 성분을 직접 입력해주세요.'))
        return
      }
      const ingredientNames = parseOCRText(ocrText)
      const joined = ingredientNames.join(', ')
      if (target === 'A') setInputA(joined)
      else setInputB(joined)
    } catch (err) {
      setScanningTarget(null)
      showToast?.(t('Scan failed. Please type the ingredients manually.', '스캔에 실패했습니다. 성분을 직접 입력해주세요.'))
    }
  }

  function handleFileUpload(e, target) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => handleScan(ev.target.result, target)
    reader.readAsDataURL(file)
    e.target.value = ''
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
      <div className="tool-usage-guide">
        <h4>{t('How to Use', '사용법')}</h4>
        <ol>
          <li>{t('Enter the ingredient list of Product A (e.g., your serum)', '제품 A의 전성분을 입력하세요 (예: 세럼)')}</li>
          <li>{t('Enter the ingredient list of Product B (e.g., your toner)', '제품 B의 전성분을 입력하세요 (예: 토너)')}</li>
          <li>{t('Tap "Check Compatibility" to find conflicts between the two products', '"호환성 확인"을 눌러 두 제품 간 충돌을 확인하세요')}</li>
        </ol>
        <p className="tool-usage-tip">{t('Tip: You can also scan labels with the camera button!', '팁: 카메라 버튼으로 라벨 사진을 촬영할 수도 있어요!')}</p>
      </div>

      <div className="compat-inputs">
        <div className="compat-input-group">
          <div className="compat-label-row">
            <label>{t('Product A', '제품 A')}</label>
            <button className="compat-scan-btn" onClick={() => fileRefA.current?.click()} disabled={!!scanningTarget}>
              {'📷 ' + t('Scan', '스캔')}
            </button>
          </div>
          <textarea className="compat-input" placeholder={t('Paste ingredients or scan label...', '성분을 붙여넣거나 라벨을 스캔하세요...')} value={inputA} onChange={e => setInputA(e.target.value)} rows={3} />
          {scanningTarget === 'A' && (
            <div className="ia-scan-progress">
              <p>{t('Scanning...', '스캔 중...')} {scanProgress}%</p>
              <div className="progress-bar"><div className="progress-fill" style={{ width: scanProgress + '%' }} /></div>
            </div>
          )}
        </div>
        <div className="compat-input-group">
          <div className="compat-label-row">
            <label>{t('Product B', '제품 B')}</label>
            <button className="compat-scan-btn" onClick={() => fileRefB.current?.click()} disabled={!!scanningTarget}>
              {'📷 ' + t('Scan', '스캔')}
            </button>
          </div>
          <textarea className="compat-input" placeholder={t('Paste ingredients or scan label...', '성분을 붙여넣거나 라벨을 스캔하세요...')} value={inputB} onChange={e => setInputB(e.target.value)} rows={3} />
          {scanningTarget === 'B' && (
            <div className="ia-scan-progress">
              <p>{t('Scanning...', '스캔 중...')} {scanProgress}%</p>
              <div className="progress-bar"><div className="progress-fill" style={{ width: scanProgress + '%' }} /></div>
            </div>
          )}
        </div>
      </div>

      <input ref={fileRefA} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'A')} />
      <input ref={fileRefB} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'B')} />

      <div className="compat-btn-row">
        <button className="primary-btn" onClick={check}>{'⚡ ' + t('Check Compatibility', '호환성 확인')}</button>
        <button className="secondary-btn" onClick={clear}>{t('Clear', '초기화')}</button>
      </div>

      {results && (
        <div className="compat-results">
          <div className={'compat-summary ' + overallClass}>
            <span className="compat-summary-emoji">{overallEmoji}</span>
            <div><strong>{t(overallText, overallTextKr)}</strong></div>
          </div>

          <div className="compat-stats">
            <span className="compat-stat">{t(`Product A: ${results.countA} ingredients`, `제품 A: ${results.countA}개 성분`)}</span>
            <span className="compat-stat">{t(`Product B: ${results.countB} ingredients`, `제품 B: ${results.countB}개 성분`)}</span>
            {highCount > 0 && <span className="compat-stat compat-stat-high">{t(`${highCount} high risk`, `${highCount}개 고위험`)}</span>}
            {medCount > 0 && <span className="compat-stat compat-stat-med">{t(`${medCount} medium`, `${medCount}개 중간`)}</span>}
            {lowCount > 0 && <span className="compat-stat compat-stat-low">{t(`${lowCount} low`, `${lowCount}개 저위험`)}</span>}
          </div>

          {results.actives.count >= 3 && (
            <div className="compat-active-warning">
              <strong>{t('⚠️ Active Stacking Warning', '⚠️ 활성 성분 과다 경고')}</strong>
              <p>{t(
                `${results.actives.count} strong actives detected: `,
                `두 제품에 ${results.actives.count}개의 강력한 활성 성분이 포함되어 있습니다: `
              )}<em>{results.actives.names.join(', ')}</em>{t('. Using too many actives at once can compromise your skin barrier.', '. 한 번에 너무 많은 활성 성분을 사용하면 피부 장벽이 손상될 수 있습니다.')}</p>
            </div>
          )}

          {results.conflicts.length > 0 && (
            <div className="compat-legend">
              <span className="compat-legend-item"><span className="compat-legend-dot high" /> {t('High Risk — avoid using together', '고위험 — 같이 사용하지 마세요')}</span>
              <span className="compat-legend-item"><span className="compat-legend-dot medium" /> {t('Medium — use at different times (AM/PM)', '중간 — 시간을 나눠 사용하세요 (아침/저녁)')}</span>
              <span className="compat-legend-item"><span className="compat-legend-dot low" /> {t('Low — generally safe, monitor skin', '저위험 — 보통 안전, 피부 반응 확인')}</span>
            </div>
          )}
          {results.conflicts.length > 0 && (
            <div className="compat-conflicts">
              {results.conflicts.map((c, i) => {
                const severityLabel = c.rule.severity === 'high'
                  ? t('🔴 High Risk', '🔴 고위험')
                  : c.rule.severity === 'medium'
                  ? t('🟡 Medium', '🟡 중간')
                  : t('🟢 Low', '🟢 저위험')
                return (
                  <div key={i} className={'compat-conflict-card compat-card-' + c.rule.severity}>
                    <div className="compat-card-header">
                      <span className="compat-severity">{severityLabel}</span>
                      <strong>{c.rule.nameA} + {c.rule.nameB}</strong>
                    </div>
                    <p className="compat-card-msg">{t(c.rule.message, c.rule.messageKr)}</p>
                    <p className="compat-card-tip">💡 <strong>{t('Tip:', '팁:')}</strong> {c.rule.tip}</p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Side-by-side ingredient comparison */}
          <div className="compat-compare">
            <h4>{t('Ingredient Comparison', '성분 비교')}</h4>
            <p className="compat-compare-hint">{t(
              'See which ingredients are shared between both products and which are unique to each.',
              '두 제품의 공통 성분과 각 제품에만 있는 고유 성분을 확인하세요.'
            )}</p>
            {results.shared.length > 0 && (
              <div className="compat-compare-group">
                <div className="compat-compare-label compat-shared-label">
                  {t(`Shared (${results.shared.length})`, `공통 성분 (${results.shared.length}개)`)}
                </div>
                <div className="compat-compare-tags">
                  {results.shared.map((r, i) => (
                    <span key={i} className="compat-tag compat-tag-shared" title={t(r.data.description, r.data.descriptionKr || r.data.description)}>
                      {t(r.data.name, r.data.nameKr || r.data.name)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="compat-compare-side">
              <div className="compat-compare-col">
                <div className="compat-compare-label compat-a-label">
                  {t(`Only in A (${results.onlyA.length})`, `A에만 (${results.onlyA.length}개)`)}
                </div>
                <div className="compat-compare-tags">
                  {results.onlyA.map((r, i) => (
                    <span key={i} className="compat-tag compat-tag-a" title={t(r.data.description, r.data.descriptionKr || r.data.description)}>
                      {t(r.data.name, r.data.nameKr || r.data.name)}
                    </span>
                  ))}
                  {results.onlyA.length === 0 && <span className="compat-tag-empty">{t('None', '없음')}</span>}
                </div>
              </div>
              <div className="compat-compare-col">
                <div className="compat-compare-label compat-b-label">
                  {t(`Only in B (${results.onlyB.length})`, `B에만 (${results.onlyB.length}개)`)}
                </div>
                <div className="compat-compare-tags">
                  {results.onlyB.map((r, i) => (
                    <span key={i} className="compat-tag compat-tag-b" title={t(r.data.description, r.data.descriptionKr || r.data.description)}>
                      {t(r.data.name, r.data.nameKr || r.data.name)}
                    </span>
                  ))}
                  {results.onlyB.length === 0 && <span className="compat-tag-empty">{t('None', '없음')}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
