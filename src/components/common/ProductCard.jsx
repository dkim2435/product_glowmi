import { PRODUCT_CATEGORIES } from '../../data/products'

const PRICE_LABELS = { budget: '$', mid: '$$', premium: '$$$' }

export default function ProductCard({ product, compact = false, onAdd = null }) {
  const cat = PRODUCT_CATEGORIES[product.category] || { icon: '✨', name: product.category, nameKr: '' }

  const hasTrending = product.trendingIngredients && product.trendingIngredients.length > 0

  return (
    <div className={'pcard' + (compact ? ' pcard-compact' : '') + (hasTrending ? ' pcard-trending' : '')}>
      <div className="pcard-left">
        <span className="pcard-cat-icon">{cat.icon}</span>
        <span className="pcard-cat-label">{cat.name}</span>
      </div>
      <div className="pcard-main">
        {hasTrending && <span className="pcard-trending-badge">HOT 2025</span>}
        <div className="pcard-brand">{product.brand}</div>
        <div className="pcard-name">{product.name}</div>
        {!compact && product.nameKr && <div className="pcard-name-kr">{product.nameKr}</div>}
        <div className="pcard-row">
          {product.rating && <span className="pcard-rating">⭐ {product.rating}</span>}
          {product.priceRange && <span className="pcard-price">{PRICE_LABELS[product.priceRange] || '$'}</span>}
        </div>
        {!compact && product.keyIngredients && product.keyIngredients.length > 0 && (
          <div className="pcard-tags">
            {product.keyIngredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="pcard-tag">{ing}</span>
            ))}
          </div>
        )}
      </div>
      {onAdd && (
        <button className="pcard-add" onClick={() => onAdd(product)} title="Add to shelf">+</button>
      )}
    </div>
  )
}
