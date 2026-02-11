import { useAuth } from '../../context/AuthContext'

export default function SaveResultBtn({ onSave, onLogin, label = 'Save My Result 결과 저장하기' }) {
  const { user, loginWithGoogle } = useAuth()

  if (user) {
    return (
      <button className="save-result-btn" onClick={onSave}>
        💾 {label}
      </button>
    )
  }

  return (
    <div className="save-login-prompt">
      <p className="save-login-text">Save your result and view it anytime — it's <strong>100% free!</strong></p>
      <p className="save-login-text-kr">결과를 저장하고 언제든 다시 보세요 — <strong>완전 무료!</strong></p>
      <button className="save-login-btn" onClick={onLogin || loginWithGoogle}>
        🔐 Free Sign Up & Save 무료 가입 후 저장
      </button>
    </div>
  )
}
