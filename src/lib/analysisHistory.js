// Analysis history — stored in localStorage alongside Supabase (which only keeps latest)
const HISTORY_KEY = 'glowmi_analysis_history'
const MAX_ENTRIES = 50

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
  } catch { return [] }
}

function saveHistory(entries) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
}

export function addHistoryEntry(type, data) {
  const entries = loadHistory()
  entries.unshift({
    type, // 'skin' | 'personalColor' | 'faceShape'
    data,
    date: new Date().toISOString()
  })
  saveHistory(entries)
}

export function getHistory(type) {
  return loadHistory().filter(e => !type || e.type === type)
}

export function getHistoryByType(type) {
  return loadHistory().filter(e => e.type === type)
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}
