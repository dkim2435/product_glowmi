import { useEffect } from 'react'
import { pageContent } from '../../data/pageContent'

export default function PageModal({ page, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="page-modal" onClick={onClose}>
      <div className="page-modal-content" onClick={e => e.stopPropagation()}>
        <button className="page-modal-close" onClick={onClose}>&times;</button>
        <div className="page-modal-body" dangerouslySetInnerHTML={{ __html: pageContent[page] }} />
      </div>
    </div>
  )
}
