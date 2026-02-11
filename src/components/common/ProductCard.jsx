import { PRODUCT_CATEGORIES } from '../../data/products'

export default function ProductCard({ product, compact = false, onAdd = null }) {
  const cat = PRODUCT_CATEGORIES[product.category] || { icon: '✨', name: product.category }
  const priceIcons = { budget: '💰', mid: '💰💰', premium: '💰💰💰' }

  return (
    <div className={'product-card' + (compact ? ' product-card-compact' : '')}>
      <div className="product-card-icon">{cat.icon}</div>
      <div className="product-card-body">
        <div className="product-card-brand">{product.brand}</div>
        <div className="product-card-name">{product.name}</div>
        {product.nameKr && <div className="product-card-name-kr">{product.nameKr}</div>}
        <div className="product-card-meta">
          {product.rating && <span className="product-card-rating">⭐ {product.rating}</span>}
          {product.priceRange && <span className="product-card-price">{priceIcons[product.priceRange] || '💰'}</span>}
        </div>
        {!compact && product.keyIngredients && product.keyIngredients.length > 0 && (
          <div className="product-card-ingredients">
            {product.keyIngredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="product-card-ing-tag">{ing}</span>
            ))}
          </div>
        )}
      </div>
      {onAdd && (
        <button className="product-card-add-btn" onClick={() => onAdd(product)} title="Add to shelf">+</button>
      )}
    </div>
  )
}
