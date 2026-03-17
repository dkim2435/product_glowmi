import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '2.4.2'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '✨',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 업데이트`,
    desc: 'Bug fixes and cleaner mobile UI for product filters and color analysis.',
    descKr: '버그 수정 및 모바일 UI 개선!',
    items: [
      { emoji: '✅', label: 'AI Routine Fix', labelKr: 'AI 루틴 추천 수정', desc: 'The "Generate AI Routine" button was failing for many users. Now works reliably!', descKr: '"AI 루틴 추천받기" 버튼 오류를 수정했습니다. 이제 정상 작동합니다!' },
      { emoji: '🎛️', label: 'Compact Filters', labelKr: '필터 UI 개선', desc: 'Product filters are now clean dropdowns instead of long chip lists — much better on mobile.', descKr: '제품 필터가 드롭다운 방식으로 바뀌어 모바일에서 훨씬 깔끔해졌습니다.' },
      { emoji: '🎨', label: 'Color Analysis Layout', labelKr: '컬러 분석 레이아웃', desc: 'Personal Color results are now properly centered instead of shifted to the right.', descKr: '퍼스널컬러 분석 결과가 오른쪽으로 치우치던 문제를 수정했습니다.' },
      { emoji: '📦', label: 'Consistent Cards', labelKr: '제품 카드 정렬', desc: 'Product category labels now have uniform width for a tidier look.', descKr: '제품 카드의 카테고리 라벨 너비가 통일되어 더 깔끔해졌습니다.' },
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
