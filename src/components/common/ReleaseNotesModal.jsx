import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '1.2.7'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '✨',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 업데이트 소식`,
    desc: 'Complete dark mode overhaul and progress photo cloud sync.',
    descKr: '다크 모드 전면 개편 및 진행 사진 클라우드 동기화.',
    items: [
      { emoji: '🌙', label: 'Full Dark Mode', labelKr: '다크 모드 완성', desc: 'Every card, button, and text is now properly styled in dark mode.', descKr: '모든 카드, 버튼, 텍스트가 다크 모드에서 올바르게 표시됩니다.' },
      { emoji: '☁️', label: 'Photo Cloud Sync', labelKr: '사진 클라우드 저장', desc: 'Progress photos are now saved to your account — no more disappearing photos.', descKr: '진행 사진이 계정에 저장되어 더 이상 사라지지 않습니다.' },
      { emoji: '📸', label: 'Camera Fix', labelKr: '카메라 수정', desc: 'Front camera photos are no longer flipped.', descKr: '전면 카메라 사진이 더 이상 뒤집히지 않습니다.' },
      { emoji: '🎨', label: 'UI Consistency', labelKr: 'UI 통일', desc: 'Unified button sizes and styling across all pages.', descKr: '모든 페이지의 버튼 크기와 스타일을 통일했습니다.' },
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
