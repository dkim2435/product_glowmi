import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '2.4.7'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '🧴',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 업데이트`,
    desc: 'Skin analysis now recommends real products with Amazon links and builds your routine from actual K-Beauty products.',
    descKr: '피부 분석 후 실제 K-뷰티 제품을 추천하고, 진짜 제품으로 루틴을 만들어줘요.',
    items: [
      { emoji: '🛒', label: 'Smart Product Recommendations', labelKr: '스마트 제품 추천', desc: 'Skin analysis now finds personalized products from our database with Amazon links.', descKr: '피부 분석 결과에 맞는 제품을 자동으로 찾아서 아마존 링크와 함께 보여줘요.' },
      { emoji: '✨', label: 'Real Product Routines', labelKr: '진짜 제품 루틴', desc: 'AI routines now use actual K-Beauty products instead of generic suggestions.', descKr: 'AI 루틴이 이제 가상 제품이 아닌 실제 K-뷰티 제품으로 구성돼요.' },
      { emoji: '💡', label: 'Routine Reasons', labelKr: '추천 이유 표시', desc: 'Each routine step now explains why that product was chosen for your skin.', descKr: '루틴의 각 단계마다 왜 그 제품이 추천되었는지 이유를 알려줘요.' },
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
