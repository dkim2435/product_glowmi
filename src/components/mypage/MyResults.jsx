import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'
import { loadAnalysisResults } from '../../lib/db'
import { personalColorResults } from '../../data/personalColor'
import { fsShapeData } from '../../data/faceShape'
import { skinTypeResults } from '../../data/quiz'
import { getRecommendations } from '../../data/products'
import ProductCard from '../common/ProductCard'

export default function MyResults({ userId, onNavigate }) {
  const { t } = useLang()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null) // which card is expanded

  useEffect(() => {
    loadAnalysisResults(userId)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [userId])

  if (loading) return <p className="mypage-loading">{t('Loading...', '불러오는 중...')}</p>

  if (!data || (!data.pc_type && !data.fs_shape && !data.skin_overall_score && !data.quiz_type)) {
    return (
      <div className="mypage-empty">
        <p>{t('No saved results yet.', '저장된 결과가 없습니다.')}</p>
        <p className="mypage-empty-hint">{t('Try an AI tool to get started!', 'AI 도구를 사용해 시작해보세요!')}</p>
        <div className="mypage-empty-actions">
          <button className="mypage-empty-link" onClick={() => onNavigate('ai', 'personalColor')}>🎨 {t('Personal Color', '퍼스널컬러')}</button>
          <button className="mypage-empty-link" onClick={() => onNavigate('ai', 'faceShape')}>💎 {t('Face Shape', '얼굴형')}</button>
          <button className="mypage-empty-link" onClick={() => onNavigate('ai', 'skinAnalyzer')}>🔬 {t('Skin Analyzer', '피부 분석')}</button>
          <button className="mypage-empty-link" onClick={() => onNavigate('ai', 'skinAnalyzer')}>📝 {t('Skin Type Quiz', '피부타입 퀴즈')}</button>
        </div>
      </div>
    )
  }

  function toggle(key) {
    setExpanded(prev => prev === key ? null : key)
  }

  return (
    <div className="mypage-results-grid">
      {/* Personal Color */}
      {data.pc_type && personalColorResults[data.pc_type] && (() => {
        const pc = personalColorResults[data.pc_type]
        const isOpen = expanded === 'pc'
        return (
          <div className={'mypage-result-card' + (isOpen ? ' expanded' : '')} onClick={() => toggle('pc')}>
            <div className="mypage-card-icon">{pc.emoji}</div>
            <div className="mypage-card-title">{t('Personal Color', '퍼스널컬러')}</div>
            <div className="mypage-card-value">{t(pc.english, pc.korean)}</div>
            <div className="mypage-card-meta">{t('Confidence', '신뢰도')}: {data.pc_confidence}%</div>
            {!isOpen && <div className="mypage-card-expand-hint">{t('Tap for details ▾', '탭하여 상세보기 ▾')}</div>}
            {isOpen && (
              <div className="mypage-card-details" onClick={e => e.stopPropagation()}>
                <div className="mypage-card-desc">{t(pc.description, pc.descriptionKr)}</div>

                <div className="mypage-card-section-title">{t('Best Colors', '어울리는 컬러')}</div>
                <div className="mypage-card-colors">
                  {pc.bestColors.map((c, i) => (
                    <div key={i} className="mypage-color-swatch" style={{ background: c.hex }} title={c.name} />
                  ))}
                </div>

                <div className="mypage-card-section-title">{t('Avoid Colors', '피할 컬러')}</div>
                <div className="mypage-card-colors">
                  {pc.worstColors.map((c, i) => (
                    <div key={i} className="mypage-color-swatch" style={{ background: c.hex }} title={c.name} />
                  ))}
                </div>

                {pc.makeup && (
                  <>
                    <div className="mypage-card-section-title">{t('Makeup Shades', '메이크업 쉐이드')}</div>
                    <div className="mypage-card-makeup">
                      {Object.entries(pc.makeup).map(([k, v]) => (
                        <div key={k} className="mypage-makeup-item">
                          <span className="mypage-makeup-label">{k}</span>
                          <span className="mypage-makeup-val">{v}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {pc.tips && pc.tips.length > 0 && (
                  <>
                    <div className="mypage-card-section-title">{t('Tips', '팁')}</div>
                    <ul className="mypage-card-tips">
                      {pc.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </>
                )}

                {pc.celebs && (
                  <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: 6 }}>
                    {t('Celebs', '셀럽')}: {pc.celebs.join(', ')}
                  </div>
                )}

                <div className="mypage-card-section-title">🧴 {t('Skincare', '스킨케어 추천')}</div>
                <div className="product-card-list">
                  {getRecommendations({
                    concerns: (pc.season === 'Spring' || pc.season === 'Fall')
                      ? ['redness', 'dryness']
                      : ['dark_spots', 'texture'],
                    categories: ['serum', 'moisturizer', 'sunscreen']
                  })
                    .filter((p, idx, arr) => arr.findIndex(x => x.category === p.category) === idx)
                    .slice(0, 3)
                    .map(p => <ProductCard key={p.id} product={p} compact />)}
                </div>

                <button className="mypage-card-close" onClick={() => setExpanded(null)}>{t('Close', '닫기')} ▴</button>
              </div>
            )}
          </div>
        )
      })()}

      {/* Face Shape */}
      {data.fs_shape && fsShapeData[data.fs_shape] && (() => {
        const fs = fsShapeData[data.fs_shape]
        const isOpen = expanded === 'fs'
        return (
          <div className={'mypage-result-card' + (isOpen ? ' expanded' : '')} onClick={() => toggle('fs')}>
            <div className="mypage-card-icon">{fs.emoji}</div>
            <div className="mypage-card-title">{t('Face Shape', '얼굴형')}</div>
            <div className="mypage-card-value">{t(fs.name, fs.korean)}</div>
            <div className="mypage-card-meta">{t('Confidence', '신뢰도')}: {data.fs_confidence}%</div>
            {!isOpen && <div className="mypage-card-expand-hint">{t('Tap for details ▾', '탭하여 상세보기 ▾')}</div>}
            {isOpen && (
              <div className="mypage-card-details" onClick={e => e.stopPropagation()}>
                <div className="mypage-card-desc">{fs.description}</div>

                {fs.tips && fs.tips.length > 0 && (
                  <>
                    <div className="mypage-card-section-title">{t('Style Tips', '스타일 팁')}</div>
                    <ul className="mypage-card-tips">
                      {fs.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </>
                )}

                <button className="mypage-card-close" onClick={() => setExpanded(null)}>{t('Close', '닫기')} ▴</button>
              </div>
            )}
          </div>
        )
      })()}

      {/* Skin Score */}
      {data.skin_overall_score && (() => {
        let gradeText = ''
        let gradeEmoji = ''
        if (data.skin_overall_score >= 80) { gradeText = t('Excellent', '우수'); gradeEmoji = '🌟' }
        else if (data.skin_overall_score >= 60) { gradeText = t('Good', '양호'); gradeEmoji = '✨' }
        else if (data.skin_overall_score >= 40) { gradeText = t('Fair', '보통'); gradeEmoji = '👌' }
        else { gradeText = t('Needs Care', '관리필요'); gradeEmoji = '💪' }
        const isOpen = expanded === 'skin'

        const scores = [
          { label: t('Hydration', '수분'), value: data.skin_hydration },
          { label: t('Clarity', '맑기'), value: data.skin_clarity },
          { label: t('Texture', '결'), value: data.skin_texture },
          { label: t('Tone', '톤'), value: data.skin_tone },
          { label: t('Pores', '모공'), value: data.skin_pores },
        ]

        return (
          <div className={'mypage-result-card' + (isOpen ? ' expanded' : '')} onClick={() => toggle('skin')}>
            <div className="mypage-card-icon">🔬</div>
            <div className="mypage-card-title">{t('Skin Score', '피부 점수')}</div>
            <div className="mypage-card-value">{data.skin_overall_score} / 100</div>
            <div className="mypage-card-sub">{gradeEmoji} {gradeText}</div>
            {!isOpen && <div className="mypage-card-expand-hint">{t('Tap for details ▾', '탭하여 상세보기 ▾')}</div>}
            {isOpen && (
              <div className="mypage-card-details" onClick={e => e.stopPropagation()}>
                <div className="mypage-card-section-title">{t('Detailed Scores', '상세 점수')}</div>
                <div className="mypage-card-makeup">
                  {scores.map(({ label, value }) => value != null && (
                    <div key={label} className="mypage-makeup-item">
                      <span className="mypage-makeup-label">{label}</span>
                      <span className="mypage-makeup-val">{value}/100</span>
                    </div>
                  ))}
                </div>

                {data.skin_concerns && (
                  <>
                    <div className="mypage-card-section-title">{t('Top Concerns', '주요 피부 고민')}</div>
                    <div className="mypage-card-desc">
                      {(Array.isArray(data.skin_concerns) ? data.skin_concerns : []).join(', ') || t('None detected', '감지 없음')}
                    </div>
                  </>
                )}

                <button className="mypage-card-close" onClick={() => setExpanded(null)}>{t('Close', '닫기')} ▴</button>
              </div>
            )}
          </div>
        )
      })()}

      {/* Skin Type (Quiz) — supports both combined and legacy results */}
      {data.quiz_type && (() => {
        const hasCombined = data.quiz_scores?.combinedLabel
        const q = skinTypeResults[data.quiz_type]
        if (!hasCombined && !q) return null
        const isOpen = expanded === 'quiz'
        const displayLabel = hasCombined
          ? t(data.quiz_scores.combinedLabel, data.quiz_scores.combinedLabelKr || data.quiz_scores.combinedLabel)
          : t(q.english, q.korean)
        const displayEmoji = hasCombined ? '🧬' : q?.emoji
        return (
          <div className={'mypage-result-card' + (isOpen ? ' expanded' : '')} onClick={() => toggle('quiz')}>
            <div className="mypage-card-icon">{displayEmoji}</div>
            <div className="mypage-card-title">{t('Skin Type', '피부타입')}</div>
            <div className="mypage-card-value">{displayLabel}</div>
            {hasCombined && <div className="mypage-card-meta">{t('Photo + Quiz Combined', '사진+퀴즈 종합')}</div>}
            {!hasCombined && data.quiz_season && <div className="mypage-card-meta">{data.quiz_season === 'summer' ? '☀️ Summer' : '❄️ Winter'}</div>}
            {!isOpen && <div className="mypage-card-expand-hint">{t('Tap for details ▾', '탭하여 상세보기 ▾')}</div>}
            {isOpen && (
              <div className="mypage-card-details" onClick={e => e.stopPropagation()}>
                {q && <div className="mypage-card-desc">{q.description}</div>}

                {q?.tips && q.tips.length > 0 && (
                  <>
                    <div className="mypage-card-section-title">{t('Care Tips', '관리 팁')}</div>
                    <ul className="mypage-card-tips">
                      {q.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </>
                )}

                <button className="mypage-card-close" onClick={() => setExpanded(null)}>{t('Close', '닫기')} ▴</button>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
