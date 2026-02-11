import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { id: 'ai', label: 'AI Beauty', labelKr: 'AI 뷰티', emoji: '✨' },
  { id: 'quiz', label: 'Skin Quiz', labelKr: '피부 퀴즈', emoji: '📝' },
  { id: 'products', label: 'K-Beauty', labelKr: 'K-뷰티', emoji: '🧴' },
  { id: 'procedures', label: 'Treatments', labelKr: '시술 가이드', emoji: '💉' },
  { id: 'wellness', label: 'Wellness', labelKr: '웰니스', emoji: '🧘' },
]

export default function TabNav({ activeTab, onTabChange }) {
  const { user, loginWithGoogle, logout, loading } = useAuth()
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

  const allTabs = user
    ? [...TABS, { id: 'mypage', label: 'My Page', labelKr: '마이페이지', emoji: '👤' }]
    : TABS

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
          {allTabs.map(tab => (
            <button
              key={tab.id}
              className={'tab-btn' + (activeTab === tab.id ? ' active' : '')}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="tab-emoji">{tab.emoji}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-nav-auth">
          {!loading && !user && (
            <button className="nav-login-btn" onClick={handleLogin}>
              Login 로그인
            </button>
          )}
          {!loading && user && (
            <div className="nav-user-menu" ref={dropdownRef}>
              <button className="nav-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img
                  src={user.user_metadata?.avatar_url || ''}
                  alt="avatar"
                  className="header-user-avatar"
                />
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-name">{user.user_metadata?.full_name || 'User'}</div>
                  <button className="user-dropdown-item" onClick={() => { onTabChange('mypage'); setDropdownOpen(false) }}>
                    My Page 마이페이지
                  </button>
                  <button className="user-dropdown-item user-dropdown-logout" onClick={logout}>
                    Logout 로그아웃
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
