import { PRODUCT_CATEGORIES, INGREDIENT_KR } from '../../data/products'
import { useLang } from '../../context/LanguageContext'

const PRICE_LABELS = { budget: '$', mid: '$$', premium: '$$$' }

function ingKr(name) {
  if (INGREDIENT_KR[name]) return INGREDIENT_KR[name]
  // Try base name without percentages: "Niacinamide (10%)" → "Niacinamide"
  const base = name.replace(/\s*\(.*?\)\s*$/, '')
  return INGREDIENT_KR[base] || name
}

export default function ProductCard({ product, compact = false, onAdd = null }) {
  const { t, lang } = useLang()
  const cat = PRODUCT_CATEGORIES[product.category] || { icon: '✨', name: product.category, nameKr: '' }

  const hasTrending = product.trendingIngredients && product.trendingIngredients.length > 0
  const isKr = lang === 'ko'

  return (
    <div className={'pcard' + (compact ? ' pcard-compact' : '') + (hasTrending ? ' pcard-trending' : '')}>
      <div className="pcard-left">
        <span className="pcard-cat-icon">{cat.icon}</span>
        <span className="pcard-cat-label">{t(cat.name, cat.nameKr)}</span>
      </div>
      <div className="pcard-main">
        {hasTrending && <span className="pcard-trending-badge">{t('HOT 2025', '인기 2025')}</span>}
        <div className="pcard-brand">{product.brand}</div>
        <div className="pcard-name">{isKr && product.nameKr ? product.nameKr : product.name}</div>
        {!compact && (isKr ? product.name : product.nameKr) && <div className="pcard-name-kr">{isKr ? product.name : product.nameKr}</div>}
        <div className="pcard-row">
          {product.rating && <span className="pcard-rating">⭐ {product.rating}</span>}
          {product.priceRange && <span className="pcard-price">{PRICE_LABELS[product.priceRange] || '$'}</span>}
        </div>
        {!compact && product.keyIngredients && product.keyIngredients.length > 0 && (
          <div className="pcard-tags">
            {product.keyIngredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="pcard-tag">{isKr ? ingKr(ing) : ing}</span>
            ))}
          </div>
        )}
      </div>
      {onAdd && (
        <button className="pcard-add" onClick={() => onAdd(product)} title={t('Add to shelf', '선반에 추가')}>+</button>
      )}
    </div>
  )
}
