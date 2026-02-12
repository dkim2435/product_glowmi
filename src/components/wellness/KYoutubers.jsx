import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { KBEAUTY_YOUTUBERS } from '../../data/kbeautyYoutubers'

export default function KYoutubers() {
  const { t } = useLang()
  const [expanded, setExpanded] = useState(null)

  function toggle(i) {
    setExpanded(prev => prev === i ? null : i)
  }

  return (
    <div className="kyoutuber-section">
      <h3 className="nutrient-section-title">
        {t('K-Beauty YouTubers', 'K-뷰티 유튜버')}
      </h3>
      <p className="nutrient-section-desc">
        {t(
          'The creators driving K-beauty\'s global popularity on YouTube.',
          '유튜브에서 K-뷰티의 글로벌 인기를 이끄는 크리에이터들.'
        )}
      </p>

      <div className="kyoutuber-grid">
        {KBEAUTY_YOUTUBERS.map((yt, i) => {
          const isOpen = expanded === i
          return (
            <div
              key={i}
              className={'kyoutuber-card' + (isOpen ? ' kyoutuber-expanded' : '')}
              onClick={() => toggle(i)}
            >
              <div className="kyoutuber-emoji">{yt.emoji}</div>
              <div className="kyoutuber-name">{t(yt.name, yt.nameKr)}</div>
              <div className="kyoutuber-subs">
                📺 {t(yt.subs, yt.subsKr)} {t('subscribers', '구독자')}
              </div>
              <div className="kyoutuber-tags">
                {(t(yt.tags, yt.tagsKr)).map((tag, j) => (
                  <span key={j} className="kyoutuber-tag">{tag}</span>
                ))}
              </div>

              {!isOpen && (
                <div className="kyoutuber-hint">
                  {t('Tap for details ▾', '탭하여 자세히 보기 ▾')}
                </div>
              )}

              {isOpen && (
                <div className="kyoutuber-details" onClick={e => e.stopPropagation()}>
                  <p className="kyoutuber-desc">{t(yt.desc, yt.descKr)}</p>
                  <a
                    href={yt.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kyoutuber-video-link"
                  >
                    <span className="kyoutuber-yt-icon">▶</span>
                    {t(yt.videoTitle, yt.videoTitleKr)}
                  </a>
                  <button
                    className="kyoutuber-close-btn"
                    onClick={() => setExpanded(null)}
                  >
                    {t('Close', '닫기')} ▴
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
