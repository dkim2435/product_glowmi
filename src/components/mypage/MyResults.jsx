import { useState, useEffect } from 'react'
import { loadAnalysisResults } from '../../lib/db'
import { personalColorResults } from '../../data/personalColor'
import { fsShapeData } from '../../data/faceShape'
import { skinTypeResults } from '../../data/quiz'
import { getRecommendations } from '../../data/products'
import ProductCard from '../common/ProductCard'

export default function MyResults({ userId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null) // which card is expanded

  useEffect(() => {
    loadAnalysisResults(userId)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [userId])

  if (loading) return <p className="mypage-loading">Loading... 불러오는 중...</p>

  if (!data || (!data.pc_type && !data.fs_shape && !data.skin_overall_score && !data.quiz_type)) {
    return (
      <div className="mypage-empty">
        <p>No saved results yet. 저장된 결과가 없습니다.</p>
        <p className="mypage-empty-hint">Use AI Beauty tools and save your results! AI 뷰티 분석 후 결과를 저장해보세요!</p>
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
            <div className="mypage-card-title">Personal Color 퍼스널컬러</div>
            <div className="mypage-card-value">{pc.english}</div>
            <div className="mypage-card-sub">{pc.korean}</div>
            <div className="mypage-card-meta">Confidence: {data.pc_confidence}%</div>
            {isOpen && (
              <div className="mypage-card-details" onClick={e => e.stopPropagation()}>
                <div className="mypage-card-desc">{pc.description}</div>
                <div className="mypage-card-desc" style={{ color: '#999', fontSize: '0.78rem' }}>{pc.descriptionKr}</div>

                <div className="mypage-card-section-title">Best Colors</div>
                <div className="mypage-card-colors">
                  {pc.bestColors.map((c, i) => (
                    <div key={i} className="mypage-color-swatch" style={{ background: c.hex }} title={c.name} />
                  ))}
                </div>

                <div className="mypage-card-section-title">Avoid Colors</div>
                <div className="mypage-card-colors">
                  {pc.worstColors.map((c, i) => (
                    <div key={i} className="mypage-color-swatch" style={{ background: c.hex }} title={c.name} />
                  ))}
                </div>

                {pc.makeup && (
                  <>
                    <div className="mypage-card-section-title">Makeup Shades</div>
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
                    <div className="mypage-card-section-title">Tips</div>
                    <ul className="mypage-card-tips">
                      {pc.tips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </>
                )}

                {pc.celebs && (
                  <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: 6 }}>
                    Celebs: {pc.celebs.join(', ')}
                  </div>
                )}

                <div className="mypage-card-section-title">🧴 Skincare 스킨케어 추천</div>
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

                <button className="mypage-card-close" onClick={() => setExpanded(null)}>Close ▴</button>
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
            <div className="mypage-card-title">Face Shape 얼굴형</div>
            <div className="mypage-card-value">{fs.name}</div>
            <div className="mypage-card-sub">{fs.korean}</div>
            <div className="mypage-card-meta">Confidence: {data.fs_confidence}%</div>
            {isOpen && (
              <div className="mypage-card-details" onClick={e => e.stopPropagation()}>
                <div className="mypage-card-desc">{fs.description}</div>

                {fs.tips && fs.tips.length > 0 && (
                  <>
                    <div className="mypage-card-section-title">Style Tips</div>
                    <ul className="mypage-card-tips">
                      {fs.tips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </>
                )}

                <button className="mypage-card-close" onClick={() => setExpanded(null)}>Close ▴</button>
              </div>
            )}
          </div>
        )
      })()}

      {/* Skin Score */}
      {data.skin_overall_score && (() => {
        let gradeText = ''
        let gradeEmoji = ''
        if (data.skin_overall_score >= 80) { gradeText = 'Excellent 우수'; gradeEmoji = '🌟' }
        else if (data.skin_overall_score >= 60) { gradeText = 'Good 양호'; gradeEmoji = '✨' }
        else if (data.skin_overall_score >= 40) { gradeText = 'Fair 보통'; gradeEmoji = '👌' }
        else { gradeText = 'Needs Care 관리필요'; gradeEmoji = '💪' }
        const isOpen = expanded === 'skin'

        const scores = {
          'Hydration 수분': data.skin_hydration,
          'Clarity 맑기': data.skin_clarity,
          'Texture 결': data.skin_texture,
          'Tone 톤': data.skin_tone,
          'Pores 모공': data.skin_pores,
        }

        return (
          <div className={'mypage-result-card' + (isOpen ? ' expanded' : '')} onClick={() => toggle('skin')}>
            <div className="mypage-card-icon">🔬</div>
            <div className="mypage-card-title">Skin Score 피부 점수</div>
            <div className="mypage-card-value">{data.skin_overall_score} / 100</div>
            <div className="mypage-card-sub">{gradeEmoji} {gradeText}</div>
            {isOpen && (
              <div className="mypage-card-details" onClick={e => e.stopPropagation()}>
                <div className="mypage-card-section-title">Detailed Scores</div>
                <div className="mypage-card-makeup">
                  {Object.entries(scores).map(([label, val]) => val != null && (
                    <div key={label} className="mypage-makeup-item">
                      <span className="mypage-makeup-label">{label}</span>
                      <span className="mypage-makeup-val">{val}/100</span>
                    </div>
                  ))}
                </div>

                {data.skin_concerns && (
                  <>
                    <div className="mypage-card-section-title">Top Concerns</div>
                    <div className="mypage-card-desc">
                      {(Array.isArray(data.skin_concerns) ? data.skin_concerns : []).join(', ') || 'None detected'}
                    </div>
                  </>
                )}

                <button className="mypage-card-close" onClick={() => setExpanded(null)}>Close ▴</button>
              </div>
            )}
          </div>
        )
      })()}

      {/* Skin Type (Quiz) */}
      {data.quiz_type && skinTypeResults[data.quiz_type] && (() => {
        const q = skinTypeResults[data.quiz_type]
        const isOpen = expanded === 'quiz'
        return (
          <div className={'mypage-result-card' + (isOpen ? ' expanded' : '')} onClick={() => toggle('quiz')}>
            <div className="mypage-card-icon">{q.emoji}</div>
            <div className="mypage-card-title">Skin Type 피부타입</div>
            <div className="mypage-card-value">{q.english}</div>
            <div className="mypage-card-sub">{q.korean}</div>
            {data.quiz_season && <div className="mypage-card-meta">{data.quiz_season === 'summer' ? '☀️ Summer' : '❄️ Winter'}</div>}
            {isOpen && (
              <div className="mypage-card-details" onClick={e => e.stopPropagation()}>
                <div className="mypage-card-desc">{q.description}</div>

                {q.tips && q.tips.length > 0 && (
                  <>
                    <div className="mypage-card-section-title">Care Tips</div>
                    <ul className="mypage-card-tips">
                      {q.tips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </>
                )}

                <button className="mypage-card-close" onClick={() => setExpanded(null)}>Close ▴</button>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
