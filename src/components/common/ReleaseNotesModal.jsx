import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '2.4.8'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '⚡',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 업데이트`,
    desc: 'UX improvements, faster loading, and smarter AI features.',
    descKr: 'UX 개선, 더 빠른 로딩, 더 똑똑한 AI 기능.',
    items: [
      { emoji: '📱', label: 'Better Mobile Experience', labelKr: '모바일 경험 개선', desc: 'Larger tap targets, bigger tab labels, and a cancel button during AI analysis.', descKr: '더 큰 터치 영역, 탭 글씨 확대, AI 분석 중 취소 버튼 추가.' },
      { emoji: '🎯', label: 'AI Personalized Badge', labelKr: 'AI 맞춤 뱃지', desc: 'Now shows whether product recommendations are AI-personalized or general suggestions.', descKr: '제품 추천이 AI 맞춤인지 일반 추천인지 표시돼요.' },
      { emoji: '⚡', label: 'Faster Loading', labelKr: '더 빠른 로딩', desc: 'Initial page load is 78% smaller — app opens noticeably faster.', descKr: '초기 페이지 용량이 78% 줄어서 앱이 더 빨리 열려요.' },
      { emoji: '💬', label: 'Chat Daily Limit', labelKr: '채팅 일일 한도', desc: '20 AI chat messages per day to ensure stable service for everyone.', descKr: '안정적인 서비스를 위해 AI 채팅은 하루 20회까지 사용 가능해요.' },
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
