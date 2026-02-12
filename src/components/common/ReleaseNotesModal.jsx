import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '1.5.5'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '🧘',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 업데이트 소식`,
    desc: 'Wellness tab upgraded with personalized nutrients, weather care, and K-beauty trends!',
    descKr: '웰니스 탭이 맞춤 영양소, 날씨케어, K-뷰티 트렌드로 업그레이드!',
    items: [
      { emoji: '🍎', label: 'Nutrient Recs', labelKr: '맞춤 영양소', desc: 'Get personalized food & nutrient recommendations based on your skin analysis.', descKr: '피부 분석 결과에 따른 맞춤 음식 및 영양소를 추천받으세요.' },
      { emoji: '🌤️', label: 'Weather Care', labelKr: '날씨케어', desc: 'Real-time weather-based skincare tips with product recommendations.', descKr: '실시간 날씨 기반 스킨케어 팁과 제품 추천.' },
      { emoji: '🔥', label: 'K-Trends', labelKr: 'K트렌드', desc: '2025-2026 K-beauty trends — ingredients, methods, philosophy, and top brands.', descKr: '2025-2026 K-뷰티 트렌드 — 성분, 방법, 철학, 주목 브랜드.' },
    ],
  },
]

export function shouldShowReleaseNotes() {
  const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY)
  if (!hasSeenOnboarding) return false
  const lastVersion = localStorage.getItem(STORAGE_KEY)
  return lastVersion !== APP_VERSION
}

export function markReleaseNotesSeen() {
  localStorage.setItem(STORAGE_KEY, APP_VERSION)
}

export function seedVersionForNewUser() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, APP_VERSION)
  }
}

export default function ReleaseNotesModal({ onClose }) {
  const [current, setCurrent] = useState(0)
  const { t } = useLang()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleClose() {
    markReleaseNotesSeen()
    onClose()
  }

  const note = RELEASE_NOTES[current]

  return (
    <div className="onboard-overlay" onClick={handleClose}>
      <div className="onboard-modal" onClick={e => e.stopPropagation()}>
        <button className="onboard-skip" onClick={handleClose}>
          {t('Close', '닫기')}
        </button>

        <div className="onboard-slide" key={current}>
          <div className="onboard-emoji">{note.emoji}</div>
          <h2 className="onboard-title">{t(note.title, note.titleKr)}</h2>
          <p className="onboard-desc">{t(note.desc, note.descKr)}</p>

          <div className="onboard-steps">
            {note.items.map((item, i) => (
              <div key={i} className="onboard-step-row">
                <span className="onboard-step-emoji">{item.emoji}</span>
                <div>
                  <div className="onboard-step-label">{t(item.label, item.labelKr)}</div>
                  <div className="onboard-step-sub">{t(item.desc, item.descKr)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="onboard-nav">
          <div className="onboard-btns">
            <button className="onboard-btn onboard-next" onClick={handleClose}>
              {t('Got it! 👍', '확인 👍')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
