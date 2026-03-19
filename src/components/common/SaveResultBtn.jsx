import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { Save, LogIn } from 'lucide-react'

export default function SaveResultBtn({ onSave, onLogin, label }) {
  const { user, loginWithGoogle } = useAuth()
  const { t } = useLang()

  const btnLabel = label || t('Save My Result', '결과 저장하기')

  if (user) {
    return (
      <button className="save-result-btn" onClick={onSave}>
        <Save size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{btnLabel}
      </button>
    )
  }

  return (
    <div className="save-login-prompt">
      <img src="/illustrations/success-save.png" alt="" className="empty-illustration" width={120} height={120} />
      <p className="save-login-text">
        {t(
          <>Save to My Page and view it anytime — it's <strong>100% free!</strong></>,
          <>마이페이지에 저장하고 언제든 다시 보세요 — <strong>완전 무료!</strong></>
        )}
      </p>
      <button className="save-login-btn" onClick={onLogin || loginWithGoogle}>
        <LogIn size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{t('Free Sign Up & Save', '무료 가입 후 저장')}
      </button>
    </div>
  )
}
