import { useState, useEffect } from 'react'

const APP_VERSION = '1.1.5'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '🎉',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 업데이트 소식`,
    desc: 'Glowmi just got better! Here\'s what we\'ve added to make your K-Beauty journey even smoother.',
    descKr: 'Glowmi가 더 좋아졌어요! K-뷰티 여정을 더 편하게 만들어줄 새 기능들을 소개합니다.',
    items: [
      { emoji: '🏠', label: 'MyPage Welcome Tour', labelKr: '마이페이지 웰컴 투어', desc: 'First time on My Page? A quick slideshow introduces every tab.' },
      { emoji: '✨', label: 'Enhanced Onboarding', labelKr: '온보딩 강화', desc: 'New AI Beauty & K-Beauty Guide slides in the welcome tutorial.' },
      { emoji: '📋', label: 'Release Notes', labelKr: '릴리즈 노트', desc: 'You\'ll now see what\'s new after every update — like this!' },
    ],
  },
]

/**
 * Show release notes only when:
 * 1. User has seen onboarding before (not a first-time visitor)
 * 2. Stored version differs from current version (new update)
 */
export function shouldShowReleaseNotes() {
  const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY)
  if (!hasSeenOnboarding) return false

  const lastVersion = localStorage.getItem(STORAGE_KEY)
  return lastVersion !== APP_VERSION
}

export function markReleaseNotesSeen() {
  localStorage.setItem(STORAGE_KEY, APP_VERSION)
}

/** Call on first visit to seed the version so they don't see release notes next time */
export function seedVersionForNewUser() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, APP_VERSION)
  }
}

export default function ReleaseNotesModal({ onClose }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleClose() {
    markReleaseNotesSeen()
    onClose()
  }

  const note = RELEASE_NOTES[current]
  const isLast = current === RELEASE_NOTES.length - 1

  return (
    <div className="onboard-overlay" onClick={handleClose}>
      <div className="onboard-modal" onClick={e => e.stopPropagation()}>
        <button className="onboard-skip" onClick={handleClose}>
          Close 닫기
        </button>

        <div className="onboard-slide" key={current}>
          <div className="onboard-emoji">{note.emoji}</div>
          <h2 className="onboard-title">{note.title}</h2>
          <p className="onboard-title-kr">{note.titleKr}</p>
          <p className="onboard-desc">{note.desc}</p>
          <p className="onboard-desc-kr">{note.descKr}</p>

          <div className="onboard-steps">
            {note.items.map((item, i) => (
              <div key={i} className="onboard-step-row">
                <span className="onboard-step-emoji">{item.emoji}</span>
                <div>
                  <div className="onboard-step-label">{item.label}</div>
                  <div className="onboard-step-sub">{item.labelKr} — {item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="onboard-nav">
          {RELEASE_NOTES.length > 1 && (
            <div className="onboard-dots">
              {RELEASE_NOTES.map((_, i) => (
                <span
                  key={i}
                  className={'onboard-dot' + (i === current ? ' active' : '')}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          )}
          <div className="onboard-btns">
            <button className="onboard-btn onboard-next" onClick={handleClose}>
              Got it! 확인 👍
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
