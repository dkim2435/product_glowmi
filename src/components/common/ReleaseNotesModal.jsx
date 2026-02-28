import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '2.2.1'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '📝',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 콘텐츠 대업데이트!`,
    desc: 'New standalone pages, 6 new blog posts, and expanded content for AdSense compliance.',
    descKr: '독립 페이지 추가, 블로그 6개 신규 작성, 기존 블로그 보강!',
    items: [
      { emoji: '📄', label: 'Legal Pages', labelKr: '법적 페이지', desc: 'Standalone About, Contact, Privacy, and Terms pages now live at their own URLs.', descKr: 'About, Contact, Privacy, Terms 페이지가 독립 URL로 접근 가능합니다.' },
      { emoji: '✍️', label: '6 New Blog Posts', labelKr: '블로그 6개 추가', desc: 'Double cleansing, dry skin routine, snail mucin, retinol, niacinamide, and AI skin analysis guides.', descKr: '더블클렌징, 건성 루틴, 달팽이 뮤신, 레티놀, 나이아신아마이드, AI 피부분석 가이드.' },
      { emoji: '📈', label: 'Blog Expansion', labelKr: '기존 블로그 보강', desc: '3 existing blog posts expanded from ~250 to 800+ words with deeper content.', descKr: '기존 블로그 3개를 250단어에서 800+ 단어로 대폭 보강했습니다.' },
      { emoji: '🔗', label: 'Better Navigation', labelKr: '네비게이션 개선', desc: 'Footer links now crawlable by search engines. Blog footers include legal page links.', descKr: '푸터 링크를 검색엔진이 인식할 수 있게 개선하고, 블로그 푸터에 법적 페이지 링크를 추가했습니다.' },
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
