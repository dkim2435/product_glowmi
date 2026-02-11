import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'
import { loadProducts, saveProduct, deleteProduct } from '../../lib/storage'
import { parseIngredientList } from '../products/ingredientLogic'
import { PRODUCT_DB, PRODUCT_CATEGORIES, searchProducts, getProductsByCategory } from '../../data/products'
import ProductCard from '../common/ProductCard'

const CATEGORIES = [
  { key: 'cleanser', label: 'Cleanser', labelKr: '클렌저', emoji: '🫧' },
  { key: 'toner', label: 'Toner', labelKr: '토너', emoji: '💦' },
  { key: 'essence', label: 'Essence', labelKr: '에센스', emoji: '💎' },
  { key: 'serum', label: 'Serum', labelKr: '세럼', emoji: '🧪' },
  { key: 'moisturizer', label: 'Moisturizer', labelKr: '보습제', emoji: '🧴' },
  { key: 'sunscreen', label: 'Sunscreen', labelKr: '선크림', emoji: '☀️' },
  { key: 'mask', label: 'Mask', labelKr: '마스크', emoji: '🎭' },
  { key: 'eye_cream', label: 'Eye Cream', labelKr: '아이크림', emoji: '👁️' },
  { key: 'other', label: 'Other', labelKr: '기타', emoji: '✨' }
]

function getCategoryInfo(key) {
  return CATEGORIES.find(c => c.key === key) || CATEGORIES[CATEGORIES.length - 1]
}

function getDaysRemaining(openedDate, expiryMonths) {
  if (!openedDate || !expiryMonths) return null
  const opened = new Date(openedDate)
  const expiry = new Date(opened)
  expiry.setMonth(expiry.getMonth() + parseInt(expiryMonths))
  const today = new Date()
  const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  return diff
}

function findConflicts(products) {
  const conflicts = []
  // Common ingredient conflicts
  const CONFLICT_PAIRS = [
    { a: ['retinol', 'retinal', 'tretinoin', 'adapalene'], b: ['vitamin c', 'ascorbic acid', 'l-ascorbic acid'], msg: 'Retinol + Vitamin C may cause irritation. Use at different times.', msgKr: '레티놀과 비타민C를 함께 사용하면 자극이 될 수 있어요. 다른 시간대에 사용하세요.' },
    { a: ['retinol', 'retinal', 'tretinoin'], b: ['aha', 'glycolic acid', 'lactic acid', 'bha', 'salicylic acid'], msg: 'Retinol + AHA/BHA can over-exfoliate. Alternate days.', msgKr: '레티놀과 AHA/BHA를 함께 사용하면 과각질 제거가 될 수 있어요.' },
    { a: ['vitamin c', 'ascorbic acid'], b: ['niacinamide'], msg: 'Vitamin C + Niacinamide: traditionally avoided but modern formulas work well together.', msgKr: '비타민C와 나이아신아마이드: 최신 제형에서는 함께 사용 가능합니다.' },
    { a: ['aha', 'glycolic acid', 'lactic acid'], b: ['bha', 'salicylic acid'], msg: 'AHA + BHA together can be too much exfoliation. Use one at a time.', msgKr: 'AHA와 BHA를 함께 사용하면 과한 각질 제거가 될 수 있어요.' },
    { a: ['benzoyl peroxide'], b: ['retinol', 'retinal', 'tretinoin', 'vitamin c', 'ascorbic acid'], msg: 'Benzoyl Peroxide can deactivate retinol and vitamin C.', msgKr: '벤조일 퍼옥사이드는 레티놀과 비타민C를 비활성화할 수 있어요.' },
  ]

  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const ingredientsA = (products[i].ingredients || []).map(s => s.toLowerCase())
      const ingredientsB = (products[j].ingredients || []).map(s => s.toLowerCase())

      for (const pair of CONFLICT_PAIRS) {
        const hasA1 = pair.a.some(a => ingredientsA.some(ia => ia.includes(a)))
        const hasB2 = pair.b.some(b => ingredientsB.some(ib => ib.includes(b)))
        const hasA2 = pair.a.some(a => ingredientsB.some(ib => ib.includes(a)))
        const hasB1 = pair.b.some(b => ingredientsA.some(ia => ia.includes(b)))

        if ((hasA1 && hasB2) || (hasA2 && hasB1)) {
          conflicts.push({
            productA: products[i].name,
            productB: products[j].name,
            msg: pair.msg,
            msgKr: pair.msgKr
          })
        }
      }
    }
  }
  return conflicts
}

export default function ProductShelf({ showToast }) {
  const { t } = useLang()
  const [products, setProducts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState({
    name: '', brand: '', category: 'moisturizer',
    ingredientText: '', openedDate: '', expiryMonths: '12'
  })
  const [editingId, setEditingId] = useState(null)
  const [showBrowse, setShowBrowse] = useState(false)
  const [browseSearch, setBrowseSearch] = useState('')
  const [browseCategory, setBrowseCategory] = useState('all')

  useEffect(() => {
    setProducts(loadProducts())
  }, [])

  function handleSave() {
    if (!form.name.trim()) {
      showToast(t('Enter a product name.', '제품명을 입력해주세요.'))
      return
    }

    const ingredients = form.ingredientText.trim()
      ? parseIngredientList(form.ingredientText)
      : []

    const product = {
      id: editingId || undefined,
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      ingredients,
      openedDate: form.openedDate || null,
      expiryMonths: form.expiryMonths ? parseInt(form.expiryMonths) : null,
    }

    const updated = saveProduct(product)
    setProducts(updated)
    resetForm()
    showToast(editingId ? t('Product updated!', '제품이 수정되었습니다!') : t('Product added!', '제품이 추가되었습니다!'))
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      brand: product.brand || '',
      category: product.category || 'other',
      ingredientText: (product.ingredients || []).join(', '),
      openedDate: product.openedDate || '',
      expiryMonths: product.expiryMonths ? String(product.expiryMonths) : '12'
    })
    setShowAddForm(true)
  }

  function handleDelete(id) {
    if (!window.confirm(t('Remove this product?', '이 제품을 삭제하시겠습니까?'))) return
    const updated = deleteProduct(id)
    setProducts(updated)
    showToast(t('Product removed.', '제품이 삭제되었습니다.'))
  }

  function resetForm() {
    setForm({ name: '', brand: '', category: 'moisturizer', ingredientText: '', openedDate: '', expiryMonths: '12' })
    setEditingId(null)
    setShowAddForm(false)
  }

  function addFromDB(dbProduct) {
    const product = {
      name: dbProduct.name,
      brand: dbProduct.brand,
      category: dbProduct.category,
      ingredients: dbProduct.keyIngredients || [],
      openedDate: null,
      expiryMonths: 12,
    }
    const updated = saveProduct(product)
    setProducts(updated)
    showToast(t(`${dbProduct.brand} ${dbProduct.name} added!`, `${dbProduct.brand} ${dbProduct.name} 추가되었습니다!`))
  }

  function getBrowseProducts() {
    let results = browseCategory === 'all' ? PRODUCT_DB : getProductsByCategory(browseCategory)
    if (browseSearch.trim()) {
      const q = browseSearch.toLowerCase()
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.nameKr.includes(q) ||
        p.keyIngredients.some(i => i.toLowerCase().includes(q))
      )
    }
    return results
  }

  const conflicts = findConflicts(products)
  const expiringProducts = products.filter(p => {
    const days = getDaysRemaining(p.openedDate, p.expiryMonths)
    return days !== null && days <= 30
  })

  return (
    <div className="shelf-content">
      {/* Alerts */}
      {(conflicts.length > 0 || expiringProducts.length > 0) && (
        <div className="shelf-alerts">
          {expiringProducts.map((p, i) => {
            const days = getDaysRemaining(p.openedDate, p.expiryMonths)
            return (
              <div key={i} className={'shelf-alert' + (days <= 0 ? ' shelf-alert-expired' : ' shelf-alert-expiring')}>
                <span>{days <= 0 ? '🚨' : '⏰'}</span>
                <span>
                  <strong>{p.name}</strong> — {days <= 0 ? t('Expired!', '유통기한 만료!') : t(`${days} days left`, `남은 일수: ${days}일`)}
                </span>
              </div>
            )
          })}
          {conflicts.map((c, i) => (
            <div key={i} className="shelf-alert shelf-alert-conflict">
              <span>⚠️</span>
              <span>
                <strong>{c.productA}</strong> + <strong>{c.productB}</strong>: {t(c.msg, c.msgKr)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="shelf-empty">
          <div className="shelf-empty-icon">💄</div>
          <p>{t('Your shelf is empty.', '내 화장대가 비어있습니다.')}</p>
          <p className="mypage-empty-hint">{t('Add your skincare products to track ingredients and expiry dates!', '스킨케어 제품을 추가하여 성분과 유통기한을 관리하세요!')}</p>
        </div>
      ) : (
        <div className="shelf-grid">
          {products.map(product => {
            const cat = getCategoryInfo(product.category)
            const days = getDaysRemaining(product.openedDate, product.expiryMonths)
            let expiryClass = ''
            if (days !== null) {
              if (days <= 0) expiryClass = 'shelf-expired'
              else if (days <= 30) expiryClass = 'shelf-expiring'
            }
            return (
              <div key={product.id} className={'shelf-card ' + expiryClass}>
                <div className="shelf-card-emoji">{cat.emoji}</div>
                <div className="shelf-card-info">
                  <div className="shelf-card-name">{product.name}</div>
                  {product.brand && <div className="shelf-card-brand">{product.brand}</div>}
                  <div className="shelf-card-cat">{t(cat.label, cat.labelKr)}</div>
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div className="shelf-card-ingredients">
                      {product.ingredients.length} {t('ingredients', '성분')}
                    </div>
                  )}
                  {days !== null && (
                    <div className={'shelf-card-expiry ' + expiryClass}>
                      {days <= 0 ? t('⚠️ Expired', '⚠️ 만료') : t(`📅 ${days}d left`, `📅 ${days}일 남음`)}
                    </div>
                  )}
                </div>
                <div className="shelf-card-actions">
                  <button className="shelf-action-btn" onClick={() => handleEdit(product)} title={t('Edit', '수정')}>✏️</button>
                  <button className="shelf-action-btn shelf-delete" onClick={() => handleDelete(product.id)} title={t('Delete', '삭제')}>&times;</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit form */}
      {showAddForm ? (
        <div className="shelf-form">
          <h4>{editingId ? t('Edit Product', '제품 수정') : t('Add Product', '제품 추가')}</h4>
          <div className="shelf-form-fields">
            <select className="shelf-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>{c.emoji} {t(c.label, c.labelKr)}</option>
              ))}
            </select>
            <input
              type="text"
              className="shelf-input"
              placeholder={t('Product name *', '제품명 *')}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              className="shelf-input"
              placeholder={t('Brand', '브랜드')}
              value={form.brand}
              onChange={e => setForm({ ...form, brand: e.target.value })}
            />
            <textarea
              className="shelf-textarea"
              placeholder={t('Paste ingredient list (optional)', '성분 목록 붙여넣기 (선택)')}
              value={form.ingredientText}
              onChange={e => setForm({ ...form, ingredientText: e.target.value })}
              rows={3}
            />
            <div className="shelf-date-row">
              <div className="shelf-date-field">
                <label>{t('Opened Date', '개봉일')}</label>
                <input
                  type="date"
                  className="shelf-input"
                  value={form.openedDate}
                  onChange={e => setForm({ ...form, openedDate: e.target.value })}
                />
              </div>
              <div className="shelf-date-field">
                <label>{t('Shelf Life (months)', '유통기한 (개월)')}</label>
                <select className="shelf-select" value={form.expiryMonths} onChange={e => setForm({ ...form, expiryMonths: e.target.value })}>
                  <option value="6">{t('6 months', '6개월')}</option>
                  <option value="12">{t('12 months', '12개월')}</option>
                  <option value="18">{t('18 months', '18개월')}</option>
                  <option value="24">{t('24 months', '24개월')}</option>
                  <option value="36">{t('36 months', '36개월')}</option>
                </select>
              </div>
            </div>
          </div>
          <div className="shelf-form-btns">
            <button className="primary-btn" onClick={handleSave}>
              {editingId ? t('Update', '수정') : t('Add Product', '추가')}
            </button>
            <button className="secondary-btn" onClick={resetForm}>{t('Cancel', '취소')}</button>
          </div>
        </div>
      ) : (
        <div className="shelf-btn-row">
          <button className="primary-btn shelf-add-btn" onClick={() => setShowAddForm(true)}>
            + {t('Add Product', '제품 추가')}
          </button>
          <button className="secondary-btn shelf-browse-btn" onClick={() => setShowBrowse(true)}>
            🔍 {t('Browse K-Beauty', 'K-뷰티 검색')}
          </button>
        </div>
      )}

      {showBrowse && (
        <div className="browse-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowBrowse(false) }}>
          <div className="browse-modal">
            <div className="browse-header">
              <h4>{t('Browse K-Beauty Products', 'K-뷰티 제품 검색')}</h4>
              <button className="browse-close" onClick={() => setShowBrowse(false)}>&times;</button>
            </div>
            <div className="browse-filters">
              <input
                type="text"
                className="browse-search"
                placeholder={t('Search products, brands, ingredients...', '제품, 브랜드, 성분 검색...')}
                value={browseSearch}
                onChange={e => setBrowseSearch(e.target.value)}
              />
              <div className="browse-cat-row">
                <button
                  className={'browse-cat-btn' + (browseCategory === 'all' ? ' active' : '')}
                  onClick={() => setBrowseCategory('all')}
                >{t('All', '전체')}</button>
                {Object.entries(PRODUCT_CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    className={'browse-cat-btn' + (browseCategory === key ? ' active' : '')}
                    onClick={() => setBrowseCategory(key)}
                  >{cat.icon} {cat.name}</button>
                ))}
              </div>
            </div>
            <div className="browse-results">
              {getBrowseProducts().map(p => (
                <ProductCard key={p.id} product={p} onAdd={addFromDB} />
              ))}
              {getBrowseProducts().length === 0 && (
                <p className="browse-empty">{t('No products found.', '제품을 찾을 수 없습니다.')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
