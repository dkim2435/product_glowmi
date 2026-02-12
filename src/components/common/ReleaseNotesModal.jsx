import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '2.0.0'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '🎉',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 대규모 업데이트!`,
    desc: 'Major update — Wellness overhaul, K-beauty YouTubers, global weather widget, privacy improvements, and a new onboarding experience!',
    descKr: '대규모 업데이트 — 웰니스 개편, K-뷰티 유튜버, 전역 날씨 위젯, 개인정보 보호 개선, 새로운 안내 화면!',
    items: [
      { emoji: '🧘', label: 'Wellness Tab', labelKr: '웰니스 탭', desc: 'Personalized nutrient recs based on your skin analysis + K-beauty trends 2025-2026.', descKr: '피부 분석 기반 맞춤 영양소 추천 + 2025-2026 K-뷰티 트렌드.' },
      { emoji: '📺', label: 'K-YouTubers', labelKr: 'K-뷰티 유튜버', desc: 'Meet the top 7 Korean beauty YouTubers with curated video picks.', descKr: '한국 인기 뷰티 유튜버 7인과 추천 영상을 만나보세요.' },
      { emoji: '🌤️', label: 'Weather Widget', labelKr: '날씨 위젯', desc: 'Weather skincare tips now appear on every page, not just AI Beauty.', descKr: '날씨 스킨케어 팁이 이제 모든 페이지 상단에 표시됩니다.' },
      { emoji: '🔒', label: 'Privacy Update', labelKr: '개인정보 개선', desc: 'Updated privacy policy to accurately disclose AI photo processing via Gemini API.', descKr: 'AI 사진 분석(Gemini API)에 대한 개인정보 처리방침을 정확하게 업데이트했습니다.' },
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
