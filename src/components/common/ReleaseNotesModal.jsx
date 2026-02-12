import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '2.0.4'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '✨',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 품질 개선!`,
    desc: 'Bug fixes, full Korean translation, and UX improvements across the entire app.',
    descKr: '버그 수정, 전체 한국어 번역, 앱 전반의 사용성 개선!',
    items: [
      { emoji: '🐛', label: 'Bug Fixes', labelKr: '버그 수정', desc: 'Fixed diary AI analysis, clinic filters, and dark mode toast issues.', descKr: '다이어리 AI 분석, 클리닉 필터, 다크모드 토스트 문제를 수정했습니다.' },
      { emoji: '🌐', label: 'Full Korean', labelKr: '완전 한국어화', desc: 'All face shapes, ingredients, personal colors, and UI labels now fully translated.', descKr: '얼굴형, 성분, 퍼스널컬러, UI 라벨 모두 한국어 번역 완료.' },
      { emoji: '📱', label: 'UX Improvements', labelKr: 'UX 개선', desc: 'Better upload flow, chat history saved, improved camera tips, and more.', descKr: '업로드 개선, 채팅 기록 저장, 카메라 팁 개선 등.' },
      { emoji: '⚡', label: 'Performance', labelKr: '성능 개선', desc: 'Lazy loading, reduced layout shifts, and optimized script loading.', descKr: '지연 로딩, 레이아웃 시프트 감소, 스크립트 로딩 최적화.' },
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
