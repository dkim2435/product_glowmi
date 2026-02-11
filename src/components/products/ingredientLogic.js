// Pure functions for ingredient analysis — no DOM dependencies
import { INGREDIENT_DB, INGREDIENT_ALIASES, INGREDIENT_CONFLICTS, STRONG_ACTIVE_NAMES } from '../../data/ingredients'

// Build lookup maps on first import
const _ingredientMap = {}
const _ingredientMapKr = {}
for (let i = 0; i < INGREDIENT_DB.length; i++) {
  _ingredientMap[INGREDIENT_DB[i].name.toLowerCase()] = INGREDIENT_DB[i]
  if (INGREDIENT_DB[i].nameKr) {
    _ingredientMapKr[INGREDIENT_DB[i].nameKr.toLowerCase()] = INGREDIENT_DB[i]
  }
}

export function lookupIngredient(rawName) {
  const query = rawName.trim()
  if (!query) return { found: false, query: rawName }
  const lower = query.toLowerCase()

  // Tier 1: aliases
  if (INGREDIENT_ALIASES[lower]) {
    const canonical = INGREDIENT_ALIASES[lower]
    const entry = _ingredientMap[canonical.toLowerCase()]
    if (entry) return { found: true, data: entry }
  }

  // Tier 2: exact English
  if (_ingredientMap[lower]) return { found: true, data: _ingredientMap[lower] }

  // Tier 2.5: exact Korean
  if (_ingredientMapKr[lower]) return { found: true, data: _ingredientMapKr[lower] }

  // Tier 3: substring
  for (let i = 0; i < INGREDIENT_DB.length; i++) {
    const dbLower = INGREDIENT_DB[i].name.toLowerCase()
    if (lower.indexOf(dbLower) !== -1 || dbLower.indexOf(lower) !== -1) {
      return { found: true, data: INGREDIENT_DB[i] }
    }
    if (INGREDIENT_DB[i].nameKr) {
      const krLower = INGREDIENT_DB[i].nameKr.toLowerCase()
      if (lower.indexOf(krLower) !== -1 || krLower.indexOf(lower) !== -1) {
        return { found: true, data: INGREDIENT_DB[i] }
      }
    }
  }

  return { found: false, query }
}

export function parseIngredientList(text) {
  if (!text.trim()) return []
  return text.split(/,(?![^()]*\))/).map(s => s.trim()).filter(Boolean)
}

export function analyzeIngredientList(names) {
  const results = names.map(n => lookupIngredient(n))
  const recognized = results.filter(r => r.found)
  const unknown = results.filter(r => !r.found)
  const actives = recognized.filter(r =>
    r.data.rating === 'great' && (r.data.category === 'active' || r.data.category === 'ferment' || r.data.category === 'soothing')
  )
  const warnings = recognized.filter(r =>
    r.data.rating === 'poor' || r.data.rating === 'bad'
  )
  return { recognized, unknown, actives, warnings }
}

export function findConflicts(listA, listB) {
  const conflicts = []
  const allTextA = listA.join(' ').toLowerCase()
  const allTextB = listB.join(' ').toLowerCase()

  for (let i = 0; i < INGREDIENT_CONFLICTS.length; i++) {
    const rule = INGREDIENT_CONFLICTS[i]
    let matchA_inA = false, matchB_inB = false
    let matchA_inB = false, matchB_inA = false
    let matchedIngA = '', matchedIngB = ''

    for (let j = 0; j < rule.keywordsA.length; j++) {
      if (allTextA.indexOf(rule.keywordsA[j]) !== -1) { matchA_inA = true; matchedIngA = rule.keywordsA[j]; break }
    }
    for (let k = 0; k < rule.keywordsB.length; k++) {
      if (allTextB.indexOf(rule.keywordsB[k]) !== -1) { matchB_inB = true; matchedIngB = rule.keywordsB[k]; break }
    }

    if (!matchA_inA || !matchB_inB) {
      for (let j2 = 0; j2 < rule.keywordsA.length; j2++) {
        if (allTextB.indexOf(rule.keywordsA[j2]) !== -1) { matchA_inB = true; matchedIngA = rule.keywordsA[j2]; break }
      }
      for (let k2 = 0; k2 < rule.keywordsB.length; k2++) {
        if (allTextA.indexOf(rule.keywordsB[k2]) !== -1) { matchB_inA = true; matchedIngB = rule.keywordsB[k2]; break }
      }
    }

    if ((matchA_inA && matchB_inB) || (matchA_inB && matchB_inA)) {
      conflicts.push({ rule, ingredientA: matchedIngA, ingredientB: matchedIngB })
    }
  }
  return conflicts
}

export function countStrongActives(listA, listB) {
  const combined = listA.concat(listB).join(' ').toLowerCase()
  let count = 0
  const found = []
  for (let i = 0; i < STRONG_ACTIVE_NAMES.length; i++) {
    if (combined.indexOf(STRONG_ACTIVE_NAMES[i]) !== -1) {
      count++
      found.push(STRONG_ACTIVE_NAMES[i])
    }
  }
  return { count, names: found }
}

export function parseOCRText(text) {
  const normalized = text.replace(/[\r\n\t]+/g, ', ').replace(/\s{2,}/g, ' ')
  const parts = normalized.split(/[,;/·•|]+/)
  const names = []
  for (let i = 0; i < parts.length; i++) {
    const cleaned = parts[i].trim()
      .replace(/^\d+[.)]\s*/, '')
      .replace(/\(\d+%?\)/g, '')
      .replace(/[^\w\s\-()가-힣ㄱ-ㅎㅏ-ㅣéèêëàâäùûüôöîïçñ]/g, '')
      .trim()
    if (cleaned.length >= 3 && cleaned.length <= 80) {
      names.push(cleaned)
    }
  }
  return names
}
