import { useState, useRef } from 'react'
import { parseIngredientList, analyzeIngredientList, parseOCRText } from './ingredientLogic'
import { useLang } from '../../context/LanguageContext'

export default function IngredientAnalyzer({ showToast }) {
  const { t } = useLang()
  const [input, setInput] = useState('')
  const [results, setResults] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const fileInputRef = useRef(null)

  function analyze() {
    if (!input.trim()) return
    const names = parseIngredientList(input)
    const analysis = analyzeIngredientList(names)
    setResults(analysis)
  }

  function clear() {
    setInput('')
    setResults(null)
  }

  async function handleScan(imageDataUrl) {
    setScanning(true)
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
      setScanning(false)
      const ocrText = result.data.text
      if (!ocrText || ocrText.trim().length < 5) {
        showToast(t('Could not read text. Try a clearer photo.', '텍스트를 읽을 수 없습니다.'))
        return
      }
      const ingredientNames = parseOCRText(ocrText)
      setInput(ingredientNames.join(', '))
      // Auto-analyze
      const analysis = analyzeIngredientList(ingredientNames)
      setResults(analysis)
    } catch (err) {
      setScanning(false)
      showToast(t('Scan failed: ', '스캔 실패: ') + err.message)
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => handleScan(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="ingredient-analyzer">
      <div className="analyzer-input-area">
        <textarea
          className="analyzer-input"
          placeholder={t('Paste ingredient list here...', '성분 목록을 붙여넣으세요...')}
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
        />
        <div className="analyzer-btn-row">
          <button className="primary-btn" onClick={analyze}>{'🔍 ' + t('Analyze', '분석')}</button>
          <button className="secondary-btn" onClick={() => fileInputRef.current?.click()}>{'📷 ' + t('Scan Label', '라벨 스캔')}</button>
          <button className="secondary-btn" onClick={clear}>{t('Clear', '초기화')}</button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />

      {scanning && (
        <div className="ia-scan-progress">
          <p>Scanning... {scanProgress}%</p>
          <div className="progress-bar"><div className="progress-fill" style={{ width: scanProgress + '%' }} /></div>
        </div>
      )}

      {results && (
        <div className="analyzer-results">
          <div className="analyzer-summary">
            <div className="analyzer-stat"><span className="analyzer-stat-num">{results.recognized.length}</span><span className="analyzer-stat-label">Recognized</span></div>
            <div className="analyzer-stat"><span className="analyzer-stat-num">{results.actives.length}</span><span className="analyzer-stat-label">Key Actives</span></div>
            <div className="analyzer-stat"><span className="analyzer-stat-num">{results.warnings.length}</span><span className="analyzer-stat-label">Warnings</span></div>
            <div className="analyzer-stat"><span className="analyzer-stat-num">{results.unknown.length}</span><span className="analyzer-stat-label">Unknown</span></div>
          </div>

          {results.actives.length > 0 && (
            <>
              <div className="analyzer-section-title">Key Actives</div>
              {results.actives.map((r, i) => <IngredientRow key={i} data={r.data} extraClass="analyzer-row-active" />)}
            </>
          )}

          {results.warnings.length > 0 && (
            <>
              <div className="analyzer-section-title">Warnings</div>
              {results.warnings.map((r, i) => <IngredientRow key={i} data={r.data} extraClass="analyzer-row-warn" />)}
            </>
          )}

          {results.recognized.length > 0 && (
            <>
              <div className="analyzer-section-title">Full Breakdown ({results.recognized.length} ingredients)</div>
              {results.recognized.map((r, i) => <IngredientRow key={i} data={r.data} />)}
            </>
          )}

          {results.unknown.length > 0 && (
            <>
              <div className="analyzer-section-title">Not Recognized ({results.unknown.length})</div>
              <div className="analyzer-unknown-list">
                {results.unknown.map((r, i) => <span key={i} className="analyzer-unknown-tag">{r.query}</span>)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function IngredientRow({ data, extraClass = '' }) {
  const { t } = useLang()
  const meta = []
  if (data.category) meta.push(data.category)
  if (data.comedogenic > 0) meta.push('comedogenic: ' + data.comedogenic + '/5')
  if (data.irritation > 0) meta.push('irritation: ' + data.irritation + '/5')

  return (
    <div className={'analyzer-row ' + extraClass}>
      <span className={'analyzer-badge rating-' + data.rating}>{data.rating}</span>
      <div className="analyzer-row-info">
        <div className="analyzer-row-name">
          {t(data.name, data.nameKr || data.name)}
        </div>
        {meta.length > 0 && <div className="analyzer-row-meta">{meta.join(' · ')}</div>}
        <div className="analyzer-row-desc">{data.description}</div>
      </div>
    </div>
  )
}
