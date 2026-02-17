import { useEffect } from 'react'
import { pageContent } from '../../data/pageContent'

export default function PageModal({ page, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="page-modal" onClick={onClose}>
      <div className="page-modal-content" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <button className="page-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="page-modal-body" dangerouslySetInnerHTML={{ __html: pageContent[page] }} />
      </div>
    </div>
  )
}
