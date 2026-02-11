import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '1.2.1'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '🎉',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 업데이트 소식`,
    desc: 'Glowmi just got a major upgrade! Here are the latest features to enhance your K-Beauty journey.',
    descKr: 'Glowmi가 대폭 업그레이드되었어요! K-뷰티 여정을 더 편하게 만들어줄 새 기능들을 소개합니다.',
    items: [
      { emoji: '🌙', label: 'Dark Mode', labelKr: '다크 모드', desc: 'Easy on the eyes — toggle dark/light theme anytime.', descKr: '눈이 편한 다크 모드를 언제든 전환할 수 있어요.' },
      { emoji: '🌏', label: 'EN / 한국어 Switch', labelKr: '영어/한국어 전환', desc: 'One tap to switch the entire app language.', descKr: '한 번의 탭으로 앱 전체 언어를 전환하세요.' },
      { emoji: '🔥', label: 'Trending Ingredients', labelKr: '트렌딩 성분 TOP 10', desc: 'Discover the hottest K-Beauty ingredients with product picks.', descKr: '인기 K-뷰티 성분과 추천 제품을 확인하세요.' },
      { emoji: '🏠', label: 'MyPage Tour', labelKr: '마이페이지 가이드', desc: 'A guided welcome tour for first-time MyPage visitors.', descKr: '마이페이지 첫 방문 시 기능 안내 투어.' },
      { emoji: '🧖', label: '10-Step Routine Guide', labelKr: '10단계 루틴 가이드', desc: 'Step-by-step Korean skincare routine with numbered steps.', descKr: '단계별 번호가 매겨진 10단계 스킨케어 루틴.' },
      { emoji: '✨', label: 'Better Onboarding', labelKr: '온보딩 강화', desc: 'Revamped welcome slides with AI Beauty & K-Beauty guides.', descKr: 'AI 뷰티 & K-뷰티 가이드가 포함된 새로운 온보딩.' },
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
