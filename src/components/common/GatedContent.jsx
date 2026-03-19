import { useLang } from '../../context/LanguageContext'
import { Lock } from 'lucide-react'

/**
 * Wraps content in a blurred overlay for non-logged-in users.
 * Shows a login prompt to unlock.
 *
 * @param {string} className - Additional class name for the wrapper
 * @param {boolean} locked - Whether the content should be gated (typically !user)
 * @param {string} title / titleKr - Prompt text shown on the overlay
 * @param {Function} onLogin - Called when user clicks the sign-up button
 * @param {React.ReactNode} children - The actual content (visible when unlocked)
 */
export default function GatedContent({ className = '', locked, title, titleKr, onLogin, children }) {
  const { t } = useLang()

  return (
    <div className={className + (locked ? ' gated-blur' : '')}>
      {locked && (
        <div className="gated-overlay">
          <div className="gated-overlay-content">
            <span className="gated-lock"><Lock size={24} /></span>
            <p className="gated-title">{t(title, titleKr)}</p>
            <p className="gated-free">{t('100% Free', '완전 무료')}</p>
            <button className="gated-login-btn" onClick={onLogin}>{t('Free Sign Up', '무료 가입')}</button>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
