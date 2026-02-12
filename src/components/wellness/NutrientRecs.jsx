import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { loadAnalysisResults } from '../../lib/db'
import { NUTRIENT_RECOMMENDATIONS, GENERIC_NUTRIENT_TIPS } from '../../data/nutrients'
import { SKIN_CONCERNS } from '../../data/skinConcerns'

const DB_KEY_MAP = {
  skin_redness: 'redness',
  skin_oiliness: 'oiliness',
  skin_dryness: 'dryness',
  skin_dark_spots: 'darkSpots',
  skin_texture: 'texture'
}

export default function NutrientRecs({ onNavigate }) {
  const { t } = useLang()
  const { user } = useAuth()
  const [concerns, setConcerns] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedConcern, setExpandedConcern] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    loadAnalysisResults(user.id).then(data => {
      if (data) {
        const scored = Object.entries(DB_KEY_MAP)
          .map(([dbKey, concernKey]) => ({
            key: concernKey,
            score: data[dbKey] || 0
          }))
          .filter(c => c.score >= 40)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
        if (scored.length > 0) {
          setConcerns(scored)
          setExpandedConcern(scored[0].key)
        }
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  if (loading) {
    return <div className="loading-spinner" />
  }

  // No user or no skin data — show generic tips + CTA
  if (!user || !concerns) {
    return (
      <div className="nutrient-generic">
        <h3 className="nutrient-section-title">
          {t('Nutrients for Healthy Skin', '건강한 피부를 위한 영양소')}
        </h3>
        <p className="nutrient-section-desc">
          {t(
            'Get personalized nutrient recommendations based on your skin analysis!',
            '피부 분석 결과를 기반으로 맞춤 영양소 추천을 받아보세요!'
          )}
        </p>

        <div className="nutrient-generic-grid">
          {GENERIC_NUTRIENT_TIPS.map((tip, i) => (
            <div key={i} className="nutrient-generic-card">
              <span className="nutrient-generic-emoji">{tip.emoji}</span>
              <h4>{t(tip.name, tip.nameKr)}</h4>
              <p>{t(tip.tip, tip.tipKr)}</p>
            </div>
          ))}
        </div>

        <button
          className="nutrient-cta"
          onClick={() => onNavigate?.('ai', 'skinAnalyzer')}
        >
          {t('🔬 Get Skin Analysis for Personalized Tips', '🔬 맞춤 추천을 위한 피부 분석 받기')}
        </button>
      </div>
    )
  }

  // Personalized nutrient recommendations
  return (
    <div className="nutrient-personalized">
      <h3 className="nutrient-section-title">
        {t('Your Nutrient Recommendations', '맞춤 영양소 추천')}
      </h3>
      <p className="nutrient-section-desc">
        {t('Based on your skin analysis results', '피부 분석 결과를 기반으로 추천합니다')}
      </p>

      {concerns.map(({ key, score }) => {
        const concern = SKIN_CONCERNS[key]
        const nutrients = NUTRIENT_RECOMMENDATIONS[key] || []
        const isExpanded = expandedConcern === key

        return (
          <div key={key} className="nutrient-concern-section">
            <div
              className="nutrient-concern-header"
              onClick={() => setExpandedConcern(isExpanded ? null : key)}
            >
              <div className="nutrient-concern-info">
                <span className="nutrient-concern-emoji">{concern.emoji}</span>
                <span className="nutrient-concern-name">
                  {t(concern.name, concern.nameKr)}
                </span>
              </div>
              <div className="nutrient-score-area">
                <div className="nutrient-score-bar">
                  <div
                    className="nutrient-score-fill"
                    style={{ width: `${score}%`, background: score >= 70 ? '#e74c3c' : score >= 50 ? '#f39c12' : '#f1c40f' }}
                  />
                </div>
                <span className="nutrient-score-num">{score}</span>
                <span className="content-card-chevron">{isExpanded ? '▲' : '▼'}</span>
              </div>
            </div>

            {isExpanded && (
              <div className="nutrient-cards">
                {nutrients.map((n, i) => (
                  <div key={i} className="nutrient-card">
                    <div className="nutrient-card-top">
                      <span className="nutrient-card-emoji">{n.emoji}</span>
                      <div>
                        <h4 className="nutrient-card-name">{t(n.name, n.nameKr)}</h4>
                        <p className="nutrient-card-benefit">{t(n.benefit, n.benefitKr)}</p>
                      </div>
                    </div>
                    <div className="food-chips">
                      {(t(n.foods, n.foodsKr)).map((food, j) => (
                        <span key={j} className="food-chip">{food}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
