import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { getHistory, clearHistory } from '../../lib/analysisHistory'
import { personalColorResults } from '../../data/personalColor'
import { fsShapeData } from '../../data/faceShape'

export default function AnalysisHistory({ showToast }) {
  const { t } = useLang()
  const [filter, setFilter] = useState('all')
  const [history, setHistory] = useState(() => getHistory())

  if (history.length === 0) {
    return (
      <div className="ah-empty">
        <span className="ah-empty-icon">📊</span>
        <p>{t('No analysis history yet.', '아직 분석 기록이 없습니다.')}</p>
        <p className="ah-empty-hint">{t('Save your analysis results to track changes over time!', '분석 결과를 저장하면 시간에 따른 변화를 추적할 수 있어요!')}</p>
      </div>
    )
  }

  const filtered = filter === 'all' ? history : history.filter(e => e.type === filter)
  const counts = {
    all: history.length,
    skin: history.filter(e => e.type === 'skin').length,
    personalColor: history.filter(e => e.type === 'personalColor').length,
    faceShape: history.filter(e => e.type === 'faceShape').length
  }

  function handleClear() {
    if (window.confirm(t('Clear all analysis history?', '모든 분석 기록을 삭제하시겠습니까?'))) {
      clearHistory()
      setHistory([])
      showToast(t('History cleared.', '기록이 삭제되었습니다.'))
    }
  }

  function formatDate(iso) {
    const d = new Date(iso)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  function formatTime(iso) {
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  function renderEntry(entry, i) {
    const { type, data, date } = entry

    if (type === 'skin') {
      const score = data.overallScore || 0
      let grade = ''
      if (score >= 80) grade = '🌟'
      else if (score >= 60) grade = '✨'
      else if (score >= 40) grade = '👌'
      else grade = '💪'
      return (
        <div key={i} className="ah-entry ah-entry-skin">
          <div className="ah-entry-date">{formatDate(date)} <span className="ah-entry-time">{formatTime(date)}</span></div>
          <div className="ah-entry-content">
            <span className="ah-entry-icon">🔬</span>
            <div className="ah-entry-main">
              <strong>{t('Skin Score', '피부 점수')}: {score}/100 {grade}</strong>
              <div className="ah-entry-scores" title={t('Dryness · Oiliness · Redness · Dark Spots · Texture', '건조 · 유분 · 홍조 · 잡티 · 질감')}>
                {data.scores && <>
                  <span className="ah-mini-score" title={t('Dryness', '건조')}>🏜️{data.scores.dryness}</span>
                  <span className="ah-mini-score" title={t('Oiliness', '유분')}>💧{data.scores.oiliness}</span>
                  <span className="ah-mini-score" title={t('Redness', '홍조')}>🔴{data.scores.redness}</span>
                  <span className="ah-mini-score" title={t('Dark Spots', '잡티')}>🫧{data.scores.darkSpots}</span>
                  <span className="ah-mini-score" title={t('Texture', '질감')}>⚡{data.scores.texture}</span>
                </>}
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (type === 'personalColor') {
      const pcData = personalColorResults[data.type]
      return (
        <div key={i} className="ah-entry ah-entry-pc">
          <div className="ah-entry-date">{formatDate(date)} <span className="ah-entry-time">{formatTime(date)}</span></div>
          <div className="ah-entry-content">
            <span className="ah-entry-icon">{pcData?.emoji || '🎨'}</span>
            <div className="ah-entry-main">
              <strong>{t(pcData?.english || data.type, pcData?.korean || data.type)}</strong>
              <span className="ah-entry-conf">{data.confidence}%</span>
            </div>
          </div>
        </div>
      )
    }

    if (type === 'faceShape') {
      const fsData = fsShapeData[data.shape]
      return (
        <div key={i} className="ah-entry ah-entry-fs">
          <div className="ah-entry-date">{formatDate(date)} <span className="ah-entry-time">{formatTime(date)}</span></div>
          <div className="ah-entry-content">
            <span className="ah-entry-icon">{fsData?.emoji || '💎'}</span>
            <div className="ah-entry-main">
              <strong>{t(fsData?.name || data.shape, fsData?.korean || data.shape)}</strong>
              <span className="ah-entry-conf">{data.confidence}%</span>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  // Detect changes between consecutive entries of same type
  function getTrend(entries, type) {
    const typed = entries.filter(e => e.type === type)
    if (typed.length < 2) return null
    const latest = typed[0]
    const prev = typed[1]

    if (type === 'skin') {
      const diff = (latest.data.overallScore || 0) - (prev.data.overallScore || 0)
      if (diff > 0) return { direction: 'up', diff }
      if (diff < 0) return { direction: 'down', diff: Math.abs(diff) }
      return { direction: 'same', diff: 0 }
    }
    if (type === 'personalColor') {
      return latest.data.type === prev.data.type ? { direction: 'same' } : { direction: 'changed' }
    }
    if (type === 'faceShape') {
      return latest.data.shape === prev.data.shape ? { direction: 'same' } : { direction: 'changed' }
    }
    return null
  }

  const skinTrend = getTrend(history, 'skin')

  return (
    <div className="analysis-history">
      <div className="ah-header">
        <h4>{t('Analysis History', '분석 기록')}</h4>
        <button className="ah-clear-btn" onClick={handleClear}>{t('Clear', '삭제')}</button>
      </div>

      <p className="ah-helper-text">{t(
        'Compare your past results and track how your skin changes over time.',
        '지난 분석 결과를 비교하고 피부 변화를 추적해보세요.'
      )}</p>

      {skinTrend && (
        <div className="ah-trend-badge">
          {skinTrend.direction === 'up' && <span className="ah-trend-up">{t(`Skin score improved by ${skinTrend.diff} pts!`, `피부 점수가 ${skinTrend.diff}점 올랐어요!`)} 📈</span>}
          {skinTrend.direction === 'down' && <span className="ah-trend-down">{t(`Skin score dropped ${skinTrend.diff} pts`, `피부 점수가 ${skinTrend.diff}점 내려갔어요`)} 📉</span>}
          {skinTrend.direction === 'same' && <span className="ah-trend-same">{t('Skin score stable', '피부 점수 유지 중')} ➡️</span>}
        </div>
      )}

      <div className="ah-filter-row">
        <button className={'ah-filter-btn' + (filter === 'all' ? ' active' : '')} onClick={() => setFilter('all')}>
          {t('All', '전체')} ({counts.all})
        </button>
        <button className={'ah-filter-btn' + (filter === 'skin' ? ' active' : '')} onClick={() => setFilter('skin')}>
          {'🔬 ' + t('Skin', '피부')} ({counts.skin})
        </button>
        <button className={'ah-filter-btn' + (filter === 'personalColor' ? ' active' : '')} onClick={() => setFilter('personalColor')}>
          {'🎨 ' + t('Color', '컬러')} ({counts.personalColor})
        </button>
        <button className={'ah-filter-btn' + (filter === 'faceShape' ? ' active' : '')} onClick={() => setFilter('faceShape')}>
          {'💎 ' + t('Shape', '얼굴형')} ({counts.faceShape})
        </button>
      </div>

      <div className="ah-entries">
        {filtered.map((entry, i) => renderEntry(entry, i))}
      </div>
    </div>
  )
}
