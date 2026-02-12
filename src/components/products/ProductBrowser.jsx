import { useState, useMemo } from 'react'
import { useLang } from '../../context/LanguageContext'
import { PRODUCT_DB, PRODUCT_CATEGORIES } from '../../data/products'
import ProductCard from '../common/ProductCard'

const SKIN_TYPES = [
  { value: 'normal', label: 'Normal', labelKr: '보통' },
  { value: 'dry', label: 'Dry', labelKr: '건성' },
  { value: 'oily', label: 'Oily', labelKr: '지성' },
  { value: 'combination', label: 'Combination', labelKr: '복합성' },
  { value: 'sensitive', label: 'Sensitive', labelKr: '민감성' }
]

const PRICE_RANGES = [
  { value: 'budget', label: 'Budget', labelKr: '저가', emoji: '💚' },
  { value: 'mid', label: 'Mid', labelKr: '중가', emoji: '💛' },
  { value: 'premium', label: 'Premium', labelKr: '고가', emoji: '💜' }
]

const CONCERNS = [
  { value: 'dryness', label: 'Dryness', labelKr: '건조' },
  { value: 'oiliness', label: 'Oiliness', labelKr: '유분' },
  { value: 'acne', label: 'Acne', labelKr: '여드름' },
  { value: 'aging', label: 'Aging', labelKr: '노화' },
  { value: 'dark_spots', label: 'Dark Spots', labelKr: '잡티' },
  { value: 'redness', label: 'Redness', labelKr: '홍조' },
  { value: 'pores', label: 'Pores', labelKr: '모공' },
  { value: 'texture', label: 'Texture', labelKr: '피부결' }
]

export default function ProductBrowser() {
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [skinType, setSkinType] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [concern, setConcern] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  const filtered = useMemo(() => {
    let products = [...PRODUCT_DB]

    if (search.trim()) {
      const q = search.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.nameKr.includes(q) ||
        p.keyIngredients.some(i => i.toLowerCase().includes(q))
      )
    }
    if (category !== 'all') products = products.filter(p => p.category === category)
    if (skinType !== 'all') products = products.filter(p => p.skinTypes?.includes(skinType))
    if (priceRange !== 'all') products = products.filter(p => p.priceRange === priceRange)
    if (concern !== 'all') products = products.filter(p => p.skinConcerns?.includes(concern))

    if (sortBy === 'rating') products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    else if (sortBy === 'name') products.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'brand') products.sort((a, b) => a.brand.localeCompare(b.brand))

    return products
  }, [search, category, skinType, priceRange, concern, sortBy])

  const activeFilterCount = [category, skinType, priceRange, concern].filter(v => v !== 'all').length

  function clearFilters() {
    setCategory('all')
    setSkinType('all')
    setPriceRange('all')
    setConcern('all')
    setSearch('')
  }

  return (
    <div className="product-browser">
      <p className="pb-helper-text">{t(
        'Use filters to find products that match your skin type and concerns.',
        '필터를 조합하여 내 피부 타입과 고민에 맞는 제품을 찾아보세요.'
      )}</p>
      <div className="pb-search">
        <input
          type="text"
          className="pb-search-input"
          placeholder={t('Search products, brands, ingredients...', '제품, 브랜드, 성분 검색...')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="pb-search-clear" onClick={() => setSearch('')}>&times;</button>}
      </div>

      <div className="pb-filters">
        <div className="pb-filter-row">
          <label>{t('Category', '카테고리')}</label>
          <div className="pb-chip-row">
            <button className={'pb-chip' + (category === 'all' ? ' active' : '')} onClick={() => setCategory('all')}>
              {t('All', '전체')}
            </button>
            {Object.entries(PRODUCT_CATEGORIES).map(([key, cat]) => (
              <button key={key} className={'pb-chip' + (category === key ? ' active' : '')} onClick={() => setCategory(key)}>
                {cat.icon} {t(cat.name, cat.nameKr)}
              </button>
            ))}
          </div>
        </div>

        <div className="pb-filter-row">
          <label>{t('Skin Type', '피부 타입')}</label>
          <div className="pb-chip-row">
            <button className={'pb-chip' + (skinType === 'all' ? ' active' : '')} onClick={() => setSkinType('all')}>
              {t('All', '전체')}
            </button>
            {SKIN_TYPES.map(st => (
              <button key={st.value} className={'pb-chip' + (skinType === st.value ? ' active' : '')} onClick={() => setSkinType(st.value)}>
                {t(st.label, st.labelKr)}
              </button>
            ))}
          </div>
        </div>

        <div className="pb-filter-row">
          <label>{t('Price', '가격대')}</label>
          <div className="pb-chip-row">
            <button className={'pb-chip' + (priceRange === 'all' ? ' active' : '')} onClick={() => setPriceRange('all')}>
              {t('All', '전체')}
            </button>
            {PRICE_RANGES.map(pr => (
              <button key={pr.value} className={'pb-chip' + (priceRange === pr.value ? ' active' : '')} onClick={() => setPriceRange(pr.value)}>
                {pr.emoji} {t(pr.label, pr.labelKr)}
              </button>
            ))}
          </div>
        </div>

        <div className="pb-filter-row">
          <label>{t('Concern', '피부 고민')}</label>
          <div className="pb-chip-row">
            <button className={'pb-chip' + (concern === 'all' ? ' active' : '')} onClick={() => setConcern('all')}>
              {t('All', '전체')}
            </button>
            {CONCERNS.map(c => (
              <button key={c.value} className={'pb-chip' + (concern === c.value ? ' active' : '')} onClick={() => setConcern(c.value)}>
                {t(c.label, c.labelKr)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pb-toolbar">
        <span className="pb-count">
          {filtered.length} {t('products', '개 제품')}
          {activeFilterCount > 0 && (
            <button className="pb-clear-btn" onClick={clearFilters}>
              {t('Clear filters', '필터 초기화')}
            </button>
          )}
        </span>
        <select className="pb-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="rating">{t('Rating', '평점순')}</option>
          <option value="name">{t('Name', '이름순')}</option>
          <option value="brand">{t('Brand', '브랜드순')}</option>
        </select>
      </div>

      <div className="pb-grid">
        {filtered.length === 0 ? (
          <div className="pb-empty">
            <p>{t('No products match your filters.', '필터에 맞는 제품이 없습니다.')}</p>
            <button className="secondary-btn" onClick={clearFilters}>{t('Clear filters', '필터 초기화')}</button>
          </div>
        ) : (
          filtered.map(p => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  )
}
