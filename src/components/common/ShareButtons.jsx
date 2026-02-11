export default function ShareButtons({ emoji, english, korean, showToast }) {
  const shareText = `${emoji} My result: ${english}\n${korean}\n\nTry free at glowmi.org!`

  function shareToTwitter() {
    window.open(
      'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText),
      '_blank', 'noopener,noreferrer'
    )
  }

  function shareToFacebook() {
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://glowmi.org/'),
      '_blank', 'noopener,noreferrer'
    )
  }

  function copyLink() {
    const copyText = shareText + '\n\nhttps://glowmi.org/'
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(copyText).then(() => {
        showToast?.('Link copied! 링크가 복사되었습니다!')
      })
    } else {
      const ta = document.createElement('textarea')
      ta.value = copyText
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      showToast?.('Link copied! 링크가 복사되었습니다!')
    }
  }

  function shareNative() {
    if (navigator.share) {
      navigator.share({ title: 'Glowmi', text: shareText, url: 'https://glowmi.org/' })
    }
  }

  return (
    <div className="share-section">
      <p className="share-label">Share Your Result 결과 공유하기</p>
      <div className="share-buttons">
        <button className="share-btn share-btn-x" onClick={shareToTwitter} title="Share on X">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </button>
        <button className="share-btn share-btn-fb" onClick={shareToFacebook} title="Share on Facebook">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </button>
        <button className="share-btn share-btn-copy" onClick={copyLink} title="Copy Link 링크 복사">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        {typeof navigator !== 'undefined' && navigator.share && (
          <button className="share-btn share-btn-native" onClick={shareNative} title="Share 공유">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
        )}
      </div>
    </div>
  )
}
