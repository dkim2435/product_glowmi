import { useLang } from '../../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-links">
          <a className="footer-link" href="/about">{t('About', '소개')}</a>
          <a className="footer-link" href="/contact">{t('Contact', '문의')}</a>
          <a className="footer-link" href="/privacy">{t('Privacy', '개인정보')}</a>
          <a className="footer-link" href="/terms">{t('Terms', '이용약관')}</a>
          <a className="footer-link" href="/blog/">{t('Blog', '블로그')}</a>
        </div>
        <p className="footer-copy">&copy; 2026 Glowmi. {t('All rights reserved.', '모든 권리 보유.')}</p>
      </div>
    </footer>
  )
}
