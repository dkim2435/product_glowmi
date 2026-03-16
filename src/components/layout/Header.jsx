import { useTheme } from '../../context/ThemeContext'
import { useLang } from '../../context/LanguageContext'

export default function Header({ onLogoClick }) {
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang, t } = useLang()

  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
          Glowmi
          <span className="logo-version">v2.3.1</span>
        </h1>
        <p className="subtitle">{t('Your K-Beauty Companion', '나만의 K-뷰티 가이드')}</p>
      </div>
      <div className="header-controls">
        <button
          className="header-toggle-btn"
          onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
          title={t('Switch to Korean', '한국어로 전환')}
          aria-label={t('Switch to Korean', '한국어로 전환')}
        >
          {lang === 'en' ? '한' : 'EN'}
        </button>
        <button
          className="header-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? t('Switch to Dark Mode', '다크 모드로 전환') : t('Switch to Light Mode', '라이트 모드로 전환')}
          aria-label={theme === 'light' ? t('Switch to Dark Mode', '다크 모드로 전환') : t('Switch to Light Mode', '라이트 모드로 전환')}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}
