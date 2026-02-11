export default function Header({ onLogoClick }) {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
          Glowmi
          <span className="logo-version">v1.1.5</span>
        </h1>
        <p className="subtitle">Your K-Beauty Companion 나만의 K-뷰티 가이드</p>
      </div>
    </header>
  )
}
