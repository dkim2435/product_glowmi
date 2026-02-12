import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '2.0.6'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '✨',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 품질 개선!`,
    desc: '7 new features — product browser, share cards, skin timeline, reminders, and more!',
    descKr: '7개 신규 기능 — 제품 브라우저, 공유 카드, 피부 타임라인, 루틴 알림 등!',
    items: [
      { emoji: '🛒', label: 'Product Browser', labelKr: '제품 브라우저', desc: 'Browse all K-beauty products with filters for skin type, price, and concerns.', descKr: '피부타입, 가격대, 고민별 필터로 K-뷰티 제품을 탐색하세요.' },
      { emoji: '🖼️', label: 'Share Cards', labelKr: '공유 카드', desc: 'Create beautiful Instagram-style cards to share your analysis results.', descKr: '분석 결과를 인스타그램 스타일의 예쁜 카드로 공유하세요.' },
      { emoji: '📊', label: 'Skin Timeline', labelKr: '피부 타임라인', desc: 'Multi-metric chart showing skin trends over time + analysis history.', descKr: '다중 지표 차트로 피부 변화 추적 + 분석 기록 보기.' },
      { emoji: '🔔', label: 'Routine Reminders', labelKr: '루틴 알림', desc: 'Set AM/PM skincare reminders with push notifications.', descKr: 'AM/PM 스킨케어 알림을 설정하세요.' },
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
    document.body.style.overflowY = 'hidden'
    return () => { document.body.style.overflowY = '' }
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
