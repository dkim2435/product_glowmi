import { useState } from 'react'
import PageModal from '../common/PageModal'
import { useLang } from '../../context/LanguageContext'

export default function Footer() {
  const [page, setPage] = useState(null)
  const { t } = useLang()

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <button className="footer-link" onClick={() => setPage('about')}>{t('About', '소개')}</button>
            <button className="footer-link" onClick={() => setPage('contact')}>{t('Contact', '문의')}</button>
            <button className="footer-link" onClick={() => setPage('privacy')}>{t('Privacy', '개인정보')}</button>
            <button className="footer-link" onClick={() => setPage('terms')}>{t('Terms', '이용약관')}</button>
            <a className="footer-link" href="/blog/" target="_blank" rel="noopener">{t('Blog', '블로그')}</a>
          </div>
          <p className="footer-copy">&copy; 2026 Glowmi. {t('All rights reserved.', '모든 권리 보유.')}</p>
        </div>
      </footer>
      {page && <PageModal page={page} onClose={() => setPage(null)} />}
    </>
  )
}
