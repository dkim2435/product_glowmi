import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { Sparkles, Droplets, Heart, Syringe } from 'lucide-react'

const TABS = [
  { id: 'ai', label: 'AI Beauty', labelKr: 'AI 뷰티', icon: Sparkles },
  { id: 'products', label: 'K-Beauty', labelKr: 'K-뷰티', icon: Droplets },
  { id: 'wellness', label: 'Wellness', labelKr: '웰니스', icon: Heart },
  { id: 'procedures', label: 'Treatments', labelKr: '시술 가이드', icon: Syringe },
]

export default function TabNav({ activeTab, onTabChange }) {
  const { user, loginWithGoogle, logout, loading } = useAuth()
  const { t } = useLang()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  async function handleLogin() {
    try {
      await loginWithGoogle()
    } catch {
      // error handled in context
    }
  }

  return (
    <nav className="tab-nav" role="tablist">
      <div className="tab-nav-inner">
        <div className="tab-buttons">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={'tab-btn' + (activeTab === tab.id ? ' active' : '')}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="tab-emoji"><tab.icon size={18} /></span>
              <span className="tab-label">{t(tab.label, tab.labelKr)}</span>
            </button>
          ))}
        </div>

        <div className="tab-nav-auth">
          {!loading && !user && (
            <button className="nav-login-btn" onClick={handleLogin}>
              <svg className="nav-login-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="8" r="3.5" opacity="0.85" />
                <path d="M12 13c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" opacity="0.65" />
              </svg>
              <span className="nav-login-label">{t('Login / Signup', '로그인 / 가입')}</span>
            </button>
          )}
          {!loading && user && (
            <div className="nav-user-menu" ref={dropdownRef}>
              <button
                className={'nav-avatar-btn' + (activeTab === 'mypage' ? ' active' : '')}
                onClick={() => { onTabChange('mypage'); setDropdownOpen(false) }}
              >
                <img
                  src={user.user_metadata?.avatar_url || ''}
                  alt="avatar"
                  className="header-user-avatar"
                  width={32}
                  height={32}
                />
                <span className="nav-avatar-label">{t('My Page', '마이페이지')}</span>
              </button>
              <button className="nav-avatar-menu-btn" onClick={() => setDropdownOpen(!dropdownOpen)} aria-label={t('User menu', '사용자 메뉴')}>▾</button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-name">{user.user_metadata?.full_name || 'User'}</div>
                  <button className="user-dropdown-item user-dropdown-logout" onClick={logout}>
                    {t('Logout', '로그아웃')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
