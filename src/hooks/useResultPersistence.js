import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

/**
 * Persist analysis result across OAuth login redirects.
 * Saves to sessionStorage before login, restores after redirect.
 *
 * @param {string} storageKey - Unique key for sessionStorage (e.g. 'pc_pending_result')
 * @param {object} opts
 * @param {Function} opts.onRestore - Called with parsed result when restored (e.g. set state)
 * @param {Function} opts.getResult - Returns current result to persist before login
 */
export function useResultPersistence(storageKey, { onRestore, getResult }) {
  const { user, loginWithGoogle } = useAuth()

  // Restore result after OAuth redirect
  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey)
    if (saved && user) {
      try {
        onRestore(JSON.parse(saved))
        sessionStorage.removeItem(storageKey)
      } catch { /* ignore */ }
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  function loginAndKeepResult() {
    const result = getResult()
    if (result) {
      sessionStorage.setItem(storageKey, JSON.stringify(result))
    }
    loginWithGoogle()
  }

  return { loginAndKeepResult }
}
