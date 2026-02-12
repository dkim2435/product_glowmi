import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { TRENDING_INGREDIENTS } from '../../data/trendingIngredients'
import { KTREND_METHODS, KTREND_PHILOSOPHY, KTREND_BRANDS } from '../../data/ktrends'

const SECTIONS = [
  { id: 'ingredients', emoji: '🧪', label: 'Trending Ingredients', labelKr: '트렌딩 성분' },
  { id: 'methods', emoji: '💡', label: 'Trending Methods', labelKr: '트렌딩 방법' },
  { id: 'philosophy', emoji: '🧘', label: 'K-Beauty Philosophy', labelKr: 'K-뷰티 철학' },
  { id: 'brands', emoji: '🏆', label: 'Must-Know Brands', labelKr: '주목 브랜드' }
]

export default function KTrends() {
  const { t } = useLang()
  const [openSections, setOpenSections] = useState({ ingredients: true })

  function toggleSection(id) {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="ktrends">
      <h3 className="nutrient-section-title">
        {t('2025-2026 K-Beauty Trends', '2025-2026 K-뷰티 트렌드')}
      </h3>
      <p className="nutrient-section-desc">
        {t(
          'The latest trends shaping Korean skincare — ingredients, methods, philosophy, and brands.',
          '한국 스킨케어를 이끄는 최신 트렌드 — 성분, 방법, 철학, 브랜드.'
        )}
      </p>

      {SECTIONS.map(section => (
        <div key={section.id} className="ktrend-section">
          <div
            className="ktrend-section-header"
            onClick={() => toggleSection(section.id)}
          >
            <span>{section.emoji} {t(section.label, section.labelKr)}</span>
            <span className="content-card-chevron">
              {openSections[section.id] ? '▲' : '▼'}
            </span>
          </div>

          {openSections[section.id] && (
            <div className="ktrend-section-body">
              {section.id === 'ingredients' && TRENDING_INGREDIENTS.map((ing, i) => (
                <div key={i} className="ktrend-card">
                  <h4>{t(ing.name, ing.nameKr)}</h4>
                  <p className="ktrend-card-desc">{t(ing.desc, ing.descKr)}</p>
                  <div className="ktrend-card-products">
                    {ing.products.map((p, j) => (
                      <span key={j} className="brand-chip">{p}</span>
                    ))}
                  </div>
                </div>
              ))}

              {section.id === 'methods' && KTREND_METHODS.map((m, i) => (
                <div key={i} className="ktrend-card">
                  <h4>{m.emoji} {t(m.name, m.nameKr)}</h4>
                  <p className="ktrend-card-desc">{t(m.desc, m.descKr)}</p>
                </div>
              ))}

              {section.id === 'philosophy' && KTREND_PHILOSOPHY.map((p, i) => (
                <div key={i} className="ktrend-card">
                  <h4>{p.emoji} {t(p.name, p.nameKr)}</h4>
                  <p className="ktrend-card-desc">{t(p.desc, p.descKr)}</p>
                </div>
              ))}

              {section.id === 'brands' && KTREND_BRANDS.map((b, i) => (
                <div key={i} className="ktrend-card ktrend-brand-card">
                  <div className="ktrend-brand-top">
                    <span className="ktrend-brand-emoji">{b.emoji}</span>
                    <div>
                      <h4>{b.name}</h4>
                      <span className="brand-chip">{t(b.hero, b.heroKr)}</span>
                    </div>
                  </div>
                  <p className="ktrend-card-desc">{t(b.note, b.noteKr)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
