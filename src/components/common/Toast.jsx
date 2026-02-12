import { useEffect, useState } from 'react'

export default function Toast({ message }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10)
    const t2 = setTimeout(() => setVisible(false), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [message])

  return (
    <div className={'share-toast' + (visible ? ' share-toast-visible' : '')} role="alert" aria-live="polite">
      {message}
    </div>
  )
}
