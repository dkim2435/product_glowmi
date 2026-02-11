// localStorage helpers for features without Supabase tables

const KEYS = {
  SKIN_PROGRESS: 'glowmi_skin_progress',
  PRODUCT_SHELF: 'glowmi_product_shelf',
  WEATHER_CACHE: 'glowmi_weather_cache',
}

function getStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch { return [] }
}

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getObj(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || null
  } catch { return null }
}

function setObj(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ===== Skin Progress =====

export function saveSkinProgress(entry) {
  // entry: { date, overallScore, scores, photoThumb? }
  const list = getStore(KEYS.SKIN_PROGRESS)
  const existing = list.findIndex(e => e.date === entry.date)
  if (existing >= 0) {
    list[existing] = { ...list[existing], ...entry, updatedAt: Date.now() }
  } else {
    list.push({ ...entry, id: crypto.randomUUID(), createdAt: Date.now() })
  }
  // Keep last 90 entries
  const sorted = list.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 90)
  setStore(KEYS.SKIN_PROGRESS, sorted)
  return sorted
}

export function loadSkinProgress() {
  return getStore(KEYS.SKIN_PROGRESS).sort((a, b) => a.date.localeCompare(b.date))
}

export function deleteSkinProgress(id) {
  const list = getStore(KEYS.SKIN_PROGRESS).filter(e => e.id !== id)
  setStore(KEYS.SKIN_PROGRESS, list)
  return list
}

// ===== Product Shelf =====

export function saveProduct(product) {
  // product: { name, brand, category, ingredients[], openedDate, expiryMonths }
  const list = getStore(KEYS.PRODUCT_SHELF)
  if (product.id) {
    const idx = list.findIndex(p => p.id === product.id)
    if (idx >= 0) list[idx] = { ...list[idx], ...product, updatedAt: Date.now() }
  } else {
    list.push({ ...product, id: crypto.randomUUID(), addedAt: Date.now() })
  }
  setStore(KEYS.PRODUCT_SHELF, list)
  return list
}

export function loadProducts() {
  return getStore(KEYS.PRODUCT_SHELF)
}

export function deleteProduct(id) {
  const list = getStore(KEYS.PRODUCT_SHELF).filter(p => p.id !== id)
  setStore(KEYS.PRODUCT_SHELF, list)
  return list
}

// ===== Weather Cache =====

export function getWeatherCache() {
  const cached = getObj(KEYS.WEATHER_CACHE)
  if (!cached) return null
  // Cache for 30 minutes
  if (Date.now() - cached.fetchedAt > 30 * 60 * 1000) return null
  return cached
}

export function setWeatherCache(data) {
  setObj(KEYS.WEATHER_CACHE, { ...data, fetchedAt: Date.now() })
}

// ===== Photo Resize Utility =====

export function resizePhoto(dataUrl, maxWidth = 300) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = Math.min(1, maxWidth / img.width)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}
