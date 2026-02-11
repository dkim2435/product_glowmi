import { useState } from 'react'
import { TRENDING_INGREDIENTS } from '../../data/trendingIngredients'
import IngredientAnalyzer from './IngredientAnalyzer'
import CompatibilityChecker from './CompatibilityChecker'
import { useLang } from '../../context/LanguageContext'

export default function ProductsTab({ showToast }) {
  const [activeSub, setActiveSub] = useState('guide')
  const { t } = useLang()

  return (
    <section className="tab-panel" id="products">
      <div className="ai-tool-tabs">
        <button className={'sub-tab-btn' + (activeSub === 'guide' ? ' active' : '')} onClick={() => setActiveSub('guide')}>
          {'📖 ' + t('Skincare Guide', '스킨케어 가이드')}
        </button>
        <button className={'sub-tab-btn' + (activeSub === 'analyzer' ? ' active' : '')} onClick={() => setActiveSub('analyzer')}>
          {'🧪 ' + t('Ingredient Analyzer', '성분 분석기')}
        </button>
        <button className={'sub-tab-btn' + (activeSub === 'compatibility' ? ' active' : '')} onClick={() => setActiveSub('compatibility')}>
          {'⚡ ' + t('Compatibility', '호환성')}
        </button>
      </div>

      {activeSub === 'analyzer' && <IngredientAnalyzer showToast={showToast} />}
      {activeSub === 'compatibility' && <CompatibilityChecker />}
      {activeSub === 'guide' && <SkincareGuide />}
    </section>
  )
}

function SkincareGuide() {
  const [openCard, setOpenCard] = useState(null)
  const { t } = useLang()

  const cards = [
    {
      id: 'routine',
      title: '🧴 Korean 10-Step Routine',
      titleKr: '🧴 한국식 10단계 스킨케어',
      content: (
        <ol className="routine-steps-guide">
          <li><strong>Step 1. Oil Cleanser</strong> — Removes makeup & sunscreen</li>
          <li><strong>Step 2. Water Cleanser</strong> — Deep cleanse pores</li>
          <li><strong>Step 3. Exfoliator</strong> — 1-2x per week</li>
          <li><strong>Step 4. Toner</strong> — Balance pH & prep skin</li>
          <li><strong>Step 5. Essence</strong> — Hydration boost</li>
          <li><strong>Step 6. Serum/Ampoule</strong> — Targeted treatment</li>
          <li><strong>Step 7. Sheet Mask</strong> — 1-2x per week for extra hydration</li>
          <li><strong>Step 8. Eye Cream</strong> — Delicate eye area care</li>
          <li><strong>Step 9. Moisturizer</strong> — Lock in hydration</li>
          <li><strong>Step 10. Sunscreen</strong> — SPF 50+ PA++++ (AM only)</li>
        </ol>
      )
    },
    {
      id: 'ingredients',
      title: '🔬 Key Ingredients Guide',
      titleKr: '🔬 주요 성분 가이드',
      content: (
        <div className="ingredients-guide">
          <p><strong>Hyaluronic Acid</strong> — Holds 1000x its weight in water. Great for all skin types.</p>
          <p><strong>Niacinamide</strong> — Brightens, minimizes pores, controls oil. The K-Beauty hero.</p>
          <p><strong>Centella Asiatica (CICA)</strong> — Soothes, heals, reduces redness. Essential for sensitive skin.</p>
          <p><strong>Retinol</strong> — Anti-aging gold standard. Start low (0.025%), use at night, always use sunscreen.</p>
          <p><strong>Vitamin C</strong> — Antioxidant, brightening. Use in AM under sunscreen.</p>
          <p><strong>Snail Mucin</strong> — Hydrates, repairs, fades scars. Uniquely Korean.</p>
        </div>
      )
    },
    {
      id: 'trending',
      title: '🔥 2025/2026 Trending Ingredients',
      titleKr: '🔥 올해 한국에서 제일 핫한 성분 TOP 10',
      content: <TrendingIngredients />
    },
    {
      id: 'tips',
      title: '💡 Beginner Tips',
      titleKr: '💡 초보자 팁',
      content: (
        <ul className="tips-list">
          <li>Start with 5 basics: cleanser, toner, moisturizer, sunscreen, and one serum</li>
          <li>Introduce new products one at a time, wait 2 weeks before adding another</li>
          <li>Patch test new products on your inner arm or behind your ear</li>
          <li>Apply products thinnest to thickest consistency</li>
          <li>Sunscreen is non-negotiable — reapply every 2 hours outdoors</li>
          <li>Consistency beats intensity — a simple routine done daily beats a complex one done rarely</li>
        </ul>
      )
    }
  ]

  return (
    <div className="skincare-guide-section">
      {cards.map(card => (
        <div
          key={card.id}
          className={'content-card' + (openCard === card.id ? ' open' : '')}
          onClick={() => setOpenCard(openCard === card.id ? null : card.id)}
        >
          <div className="content-card-header">
            <h4>{t(card.title, card.titleKr)}</h4>
            <span className="content-card-chevron">{openCard === card.id ? '▲' : '▼'}</span>
          </div>
          {openCard === card.id && (
            <div className="content-card-body" onClick={e => e.stopPropagation()}>
              {card.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function TrendingIngredients() {
  const [openIdx, setOpenIdx] = useState(null)
  const { t } = useLang()

  return (
    <div className="trending-ing-list">
      <p className="trending-source">Source: Olive Young, Hwahae, Allure Korea 2025-2026</p>
      {TRENDING_INGREDIENTS.map((ing, i) => {
        const isOpen = openIdx === i
        return (
          <div key={i} className={'trending-ing-item' + (isOpen ? ' open' : '')} onClick={() => setOpenIdx(isOpen ? null : i)}>
            <div className="trending-ing-header">
              <span className="trending-ing-rank">#{i + 1}</span>
              <div className="trending-ing-names">
                <strong>{t(ing.name, ing.nameKr)}</strong>
              </div>
              <span className="trending-ing-chevron">{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
              <div className="trending-ing-body" onClick={e => e.stopPropagation()}>
                <p className="trending-ing-desc">{t(ing.desc, ing.descKr)}</p>
                <div className="trending-ing-why">
                  <strong>{t('Why trending', '왜 핫한가')}</strong>
                  <p>{ing.why}</p>
                </div>
                <div className="trending-ing-products">
                  <strong>{t('Popular Products', '인기 제품')}</strong>
                  <ul>
                    {ing.products.map((p, j) => <li key={j}>{p}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
