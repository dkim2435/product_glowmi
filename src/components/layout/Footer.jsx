import { useState } from 'react'
import PageModal from '../common/PageModal'

export default function Footer() {
  const [page, setPage] = useState(null)

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <button className="footer-link" onClick={() => setPage('about')}>About</button>
            <button className="footer-link" onClick={() => setPage('contact')}>Contact</button>
            <button className="footer-link" onClick={() => setPage('privacy')}>Privacy</button>
          </div>
          <p className="footer-copy">&copy; 2026 Glowmi. All rights reserved.</p>
        </div>
      </footer>
      {page && <PageModal page={page} onClose={() => setPage(null)} />}
    </>
  )
}
