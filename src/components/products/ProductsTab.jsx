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
          {'📖 ' + t('Guide', '스킨케어 가이드')}
        </button>
        <button className={'sub-tab-btn' + (activeSub === 'analyzer' ? ' active' : '')} onClick={() => setActiveSub('analyzer')}>
          {'🧪 ' + t('Analyzer', '성분 분석기')}
        </button>
        <button className={'sub-tab-btn' + (activeSub === 'compatibility' ? ' active' : '')} onClick={() => setActiveSub('compatibility')}>
          {'⚡ ' + t('Compat', '호환성')} <span className="beta-badge">beta</span>
        </button>
      </div>

      {activeSub === 'analyzer' && <IngredientAnalyzer showToast={showToast} />}
      {activeSub === 'compatibility' && <CompatibilityChecker showToast={showToast} />}
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
          <li><strong>{t('Step 1. Oil Cleanser', '1단계. 오일 클렌저')}</strong> — {t('Removes makeup & sunscreen', '메이크업과 선크림 제거')}</li>
          <li><strong>{t('Step 2. Water Cleanser', '2단계. 수성 클렌저')}</strong> — {t('Deep cleanse pores', '모공 속 깊은 세안')}</li>
          <li><strong>{t('Step 3. Exfoliator', '3단계. 각질 제거')}</strong> — {t('1-2x per week', '주 1-2회')}</li>
          <li><strong>{t('Step 4. Toner', '4단계. 토너')}</strong> — {t('Balance pH & prep skin', 'pH 밸런스 & 피부 준비')}</li>
          <li><strong>{t('Step 5. Essence', '5단계. 에센스')}</strong> — {t('Hydration boost', '수분 공급 부스트')}</li>
          <li><strong>{t('Step 6. Serum/Ampoule', '6단계. 세럼/앰플')}</strong> — {t('Targeted treatment', '집중 케어')}</li>
          <li><strong>{t('Step 7. Sheet Mask', '7단계. 시트 마스크')}</strong> — {t('1-2x per week for extra hydration', '주 1-2회 집중 보습')}</li>
          <li><strong>{t('Step 8. Eye Cream', '8단계. 아이크림')}</strong> — {t('Delicate eye area care', '섬세한 눈가 케어')}</li>
          <li><strong>{t('Step 9. Moisturizer', '9단계. 수분크림')}</strong> — {t('Lock in hydration', '수분 잠금')}</li>
          <li><strong>{t('Step 10. Sunscreen', '10단계. 선크림')}</strong> — {t('SPF 50+ PA++++ (AM only)', 'SPF 50+ PA++++ (아침만)')}</li>
        </ol>
      )
    },
    {
      id: 'ingredients',
      title: '🔬 Key Ingredients Guide',
      titleKr: '🔬 주요 성분 가이드',
      content: (
        <div className="ingredients-guide">
          <p><strong>{t('Hyaluronic Acid', '히알루론산')}</strong> — {t('Holds 1000x its weight in water. Great for all skin types.', '자기 무게의 1000배 수분을 머금습니다. 모든 피부 타입에 좋습니다.')}</p>
          <p><strong>{t('Niacinamide', '나이아신아마이드')}</strong> — {t('Brightens, minimizes pores, controls oil. The K-Beauty hero.', '미백, 모공 축소, 유분 조절. K-뷰티의 만능 성분.')}</p>
          <p><strong>{t('Centella Asiatica (CICA)', '센텔라 아시아티카 (시카)')}</strong> — {t('Soothes, heals, reduces redness. Essential for sensitive skin.', '진정, 치유, 홍조 완화. 민감 피부 필수 성분.')}</p>
          <p><strong>{t('Retinol', '레티놀')}</strong> — {t('Anti-aging gold standard. Start low (0.025%), use at night, always use sunscreen.', '안티에이징 대표 성분. 저농도(0.025%)부터 시작, 야간 사용, 반드시 선크림과 함께.')}</p>
          <p><strong>{t('Vitamin C', '비타민 C')}</strong> — {t('Antioxidant, brightening. Use in AM under sunscreen.', '항산화, 미백 효과. 아침에 선크림 아래 사용.')}</p>
          <p><strong>{t('Snail Mucin', '달팽이 뮤신')}</strong> — {t('Hydrates, repairs, fades scars. Uniquely Korean.', '수분 공급, 피부 재생, 흉터 완화. 한국만의 대표 성분.')}</p>
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
          <li>{t('Start with 5 basics: cleanser, toner, moisturizer, sunscreen, and one serum', '기본 5가지부터: 클렌저, 토너, 수분크림, 선크림, 세럼 하나')}</li>
          <li>{t('Introduce new products one at a time, wait 2 weeks before adding another', '새 제품은 한 번에 하나씩, 다음 제품 추가 전 2주 기다리기')}</li>
          <li>{t('Patch test new products on your inner arm or behind your ear', '새 제품은 팔 안쪽이나 귀 뒤에 먼저 패치 테스트')}</li>
          <li>{t('Apply products thinnest to thickest consistency', '제형이 가벼운 것부터 무거운 순으로 바르기')}</li>
          <li>{t('Sunscreen is non-negotiable — reapply every 2 hours outdoors', '선크림은 필수 — 야외에서 2시간마다 덧바르기')}</li>
          <li>{t('Consistency beats intensity — a simple routine done daily beats a complex one done rarely', '꾸준함이 최고 — 매일 하는 간단한 루틴이 가끔 하는 복잡한 루틴보다 낫습니다')}</li>
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
