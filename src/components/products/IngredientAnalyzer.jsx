import { useState, useRef } from 'react'
import { parseIngredientList, analyzeIngredientList, parseOCRText } from './ingredientLogic'
import { useLang } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { loadAnalysisResults } from '../../lib/db'
import { assessIngredientsForSkinAI } from '../../lib/gemini'

export default function IngredientAnalyzer({ showToast }) {
  const { t } = useLang()
  const { user } = useAuth()
  const [input, setInput] = useState('')
  const [results, setResults] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const fileInputRef = useRef(null)
  const [aiVerdict, setAiVerdict] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  function analyze() {
    if (!input.trim()) return
    const names = parseIngredientList(input)
    const analysis = analyzeIngredientList(names)
    setResults(analysis)
  }

  function clear() {
    setInput('')
    setResults(null)
    setAiVerdict(null)
  }

  async function handleAiMatch() {
    if (!results || !user) return
    const ingredientNames = results.recognized.map(r => r.data.name)
    if (ingredientNames.length === 0) {
      showToast(t('No recognized ingredients to analyze.', '분석할 인식된 성분이 없습니다.'))
      return
    }
    setAiLoading(true)
    try {
      const analysis = await loadAnalysisResults(user.id)
      if (!analysis || !analysis.skin_redness) {
        showToast(t('Please complete a skin analysis first.', '먼저 피부 분석을 완료해주세요.'))
        setAiLoading(false)
        return
      }
      const skinScores = {
        redness: analysis.skin_redness,
        oiliness: analysis.skin_oiliness,
        dryness: analysis.skin_dryness,
        darkSpots: analysis.skin_dark_spots,
        texture: analysis.skin_texture
      }
      const verdict = await assessIngredientsForSkinAI(ingredientNames, skinScores)
      setAiVerdict(verdict)
    } catch (e) {
      console.error('AI ingredient assessment error:', e)
      showToast(t('AI analysis failed. Please try again.', 'AI 분석에 실패했습니다.'))
    }
    setAiLoading(false)
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
      <div className="tool-usage-guide">
        <h4>{t('How to Use', '사용법')}</h4>
        <ol>
          <li>{t('Find the ingredient list on your product packaging (usually on the back)', '제품 뒷면의 전성분 목록을 찾으세요')}</li>
          <li>{t('Copy & paste the ingredients below, or take a photo of the label', '아래에 성분을 복사/붙여넣기 하거나, 라벨 사진을 촬영하세요')}</li>
          <li>{t('Tap "Analyze" to see safety ratings, key actives, and warnings', '"분석" 버튼을 눌러 안전 등급, 핵심 성분, 주의사항을 확인하세요')}</li>
        </ol>
      </div>
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
          <p>{t('Scanning...', '스캔 중...')} {scanProgress}%</p>
          <div className="progress-bar"><div className="progress-fill" style={{ width: scanProgress + '%' }} /></div>
        </div>
      )}

      {results && (
        <div className="analyzer-results">
          <div className="analyzer-summary">
            <div className="analyzer-stat"><span className="analyzer-stat-num">{results.recognized.length}</span><span className="analyzer-stat-label">{t('Recognized', '인식됨')}</span></div>
            <div className="analyzer-stat"><span className="analyzer-stat-num">{results.actives.length}</span><span className="analyzer-stat-label">{t('Key Actives', '핵심 활성')}</span></div>
            <div className="analyzer-stat"><span className="analyzer-stat-num">{results.warnings.length}</span><span className="analyzer-stat-label">{t('Warnings', '주의')}</span></div>
            <div className="analyzer-stat"><span className="analyzer-stat-num">{results.unknown.length}</span><span className="analyzer-stat-label">{t('Unknown', '미인식')}</span></div>
          </div>

          {results.actives.length > 0 && (
            <>
              <div className="analyzer-section-title">{t('Key Actives', '핵심 활성 성분')}</div>
              {results.actives.map((r, i) => <IngredientRow key={i} data={r.data} extraClass="analyzer-row-active" />)}
            </>
          )}

          {results.warnings.length > 0 && (
            <>
              <div className="analyzer-section-title">{t('Warnings', '주의 성분')}</div>
              {results.warnings.map((r, i) => <IngredientRow key={i} data={r.data} extraClass="analyzer-row-warn" />)}
            </>
          )}

          {results.recognized.length > 0 && (
            <>
              <div className="analyzer-section-title">{t(`Full Breakdown (${results.recognized.length} ingredients)`, `전체 분석 (${results.recognized.length}개 성분)`)}</div>
              {results.recognized.map((r, i) => <IngredientRow key={i} data={r.data} />)}
            </>
          )}

          {results.unknown.length > 0 && (
            <>
              <div className="analyzer-section-title">{t(`Not Recognized (${results.unknown.length})`, `미인식 (${results.unknown.length}개)`)}</div>
              <div className="analyzer-unknown-list">
                {results.unknown.map((r, i) => <span key={i} className="analyzer-unknown-tag">{r.query}</span>)}
              </div>
              <p className="analyzer-unknown-hint">{t(
                'These ingredients were not found in our database. If scanned from a photo, try typing the ingredient names manually for better accuracy.',
                '이 성분들은 데이터베이스에 없습니다. 사진으로 스캔한 경우, 정확도를 위해 성분명을 직접 입력해 보세요.'
              )}</p>
            </>
          )}

          <div className="ai-skin-match-section">
            <h4>{t('AI Skin Matching', 'AI 피부 매칭')}</h4>
            {!user ? (
              <p className="ai-match-hint">{t('Sign up to get AI-powered skin compatibility analysis!', '가입하면 AI 맞춤 피부 적합성 분석을 받을 수 있어요!')}</p>
            ) : aiVerdict ? (
              <div className={'ai-verdict-card verdict-' + aiVerdict.verdict}>
                <div className="ai-verdict-header">
                  <span className="ai-verdict-emoji">{aiVerdict.verdict === 'good' ? '✅' : aiVerdict.verdict === 'caution' ? '⚠️' : '❌'}</span>
                  <span className="ai-verdict-score">{aiVerdict.score}/10</span>
                </div>
                <p className="ai-verdict-summary">{t(aiVerdict.summary, aiVerdict.summaryKr)}</p>

                {aiVerdict.goodIngredients && aiVerdict.goodIngredients.length > 0 && (
                  <div className="ai-verdict-list">
                    <strong>{t('Good for your skin', '피부에 좋은 성분')}</strong>
                    {aiVerdict.goodIngredients.map((ing, i) => (
                      <div key={i} className="ai-verdict-item good">
                        <span className="ai-verdict-ing-name">{ing.name}</span>
                        <span className="ai-verdict-ing-reason">{t(ing.reason, ing.reasonKr)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {aiVerdict.badIngredients && aiVerdict.badIngredients.length > 0 && (
                  <div className="ai-verdict-list">
                    <strong>{t('Watch out', '주의 성분')}</strong>
                    {aiVerdict.badIngredients.map((ing, i) => (
                      <div key={i} className="ai-verdict-item bad">
                        <span className="ai-verdict-ing-name">{ing.name}</span>
                        <span className="ai-verdict-ing-reason">{t(ing.reason, ing.reasonKr)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {aiVerdict.tips && aiVerdict.tips.length > 0 && (
                  <div className="ai-verdict-tips">
                    <strong>{t('Tips', '팁')}</strong>
                    <ul>
                      {aiVerdict.tips.map((tip, i) => (
                        <li key={i}>{t(tip, aiVerdict.tipsKr?.[i] || tip)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button className="primary-btn ai-match-btn" onClick={handleAiMatch} disabled={aiLoading}>
                {aiLoading ? t('Analyzing...', '분석 중...') : t('AI Skin Match', 'AI 피부 매칭')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function IngredientRow({ data, extraClass = '' }) {
  const { t } = useLang()
  const meta = []
  if (data.category) meta.push(data.category)
  if (data.comedogenic > 0) meta.push(t('comedogenic', '모공막힘') + ': ' + data.comedogenic + '/5')
  if (data.irritation > 0) meta.push(t('irritation', '자극') + ': ' + data.irritation + '/5')

  return (
    <div className={'analyzer-row ' + extraClass}>
      <span className={'analyzer-badge rating-' + data.rating}>{data.rating}</span>
      <div className="analyzer-row-info">
        <div className="analyzer-row-name">
          {t(data.name, data.nameKr || data.name)}
        </div>
        {meta.length > 0 && <div className="analyzer-row-meta">{meta.join(' · ')}</div>}
        <div className="analyzer-row-desc">{t(data.description, data.descriptionKr || data.description)}</div>
      </div>
    </div>
  )
}
