import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '1.3.1'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '✨',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 업데이트 소식`,
    desc: 'Camera fix, smart empty states, and cleaner navigation.',
    descKr: '카메라 수정, 스마트 빈 화면 안내, 깔끔한 네비게이션.',
    items: [
      { emoji: '📸', label: 'Camera Fix', labelKr: '카메라 수정', desc: 'Camera preview and saved photos are no longer flipped.', descKr: '카메라 프리뷰와 저장된 사진이 더 이상 좌우반전되지 않습니다.' },
      { emoji: '🧭', label: 'Smart Empty States', labelKr: '빈 화면 안내', desc: 'Results & Progress pages now guide you to the right tool when empty.', descKr: '결과/진행 페이지가 비어있을 때 관련 도구로 안내합니다.' },
      { emoji: '👤', label: 'Profile in Nav', labelKr: '네비에 프로필', desc: 'Your avatar is now in the tab bar for quick My Page access.', descKr: '탭 바에서 프로필 아바타로 마이페이지에 바로 접근하세요.' },
      { emoji: '🌙', label: 'Full Dark Mode', labelKr: '다크 모드 완성', desc: 'Every card, button, and text is now properly styled in dark mode.', descKr: '모든 카드, 버튼, 텍스트가 다크 모드에서 올바르게 표시됩니다.' },
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
