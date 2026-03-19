import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'
import { Sparkles, Palette, Gem, Sun } from 'lucide-react'

const APP_VERSION = '3.1.1'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '✨',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 업데이트`,
    desc: 'Desktop layout overhaul! Cleaner navigation, product grid view, and warmer design.',
    descKr: '데스크톱 레이아웃 개편! 깔끔한 네비게이션, 제품 그리드 뷰, 따뜻한 디자인.',
    items: [
      { emoji: '🖥️', label: 'Desktop Layout', labelKr: '데스크톱 레이아웃', desc: 'Replaced sidebar with top navigation for a cleaner, wider layout.', descKr: '사이드바를 상단 탭 네비로 교체해서 더 넓고 깔끔한 레이아웃으로 개선했어요.' },
      { emoji: '🛍️', label: 'Product Grid', labelKr: '제품 그리드', desc: 'Products now display in a 3-4 column grid on desktop — browse faster!', descKr: '데스크톱에서 제품이 3-4열 그리드로 표시돼요. 더 빠르게 둘러보세요!' },
      { emoji: '🎨', label: 'Warm Design', labelKr: '따뜻한 디자인', desc: 'New warm cream background for a softer, more inviting feel.', descKr: '따뜻한 크림색 배경으로 더 부드럽고 편안한 느낌이에요.' },
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
