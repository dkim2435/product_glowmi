import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const APP_VERSION = '2.4.5'

const STORAGE_KEY = 'glowmi_last_seen_version'
const ONBOARDING_KEY = 'glowmi_onboarding_seen'

const RELEASE_NOTES = [
  {
    emoji: '✨',
    title: `What's New in v${APP_VERSION}`,
    titleKr: `v${APP_VERSION} 업데이트`,
    desc: 'AI Beauty UX upgrades — photo guides, smarter navigation, and personalized experiences!',
    descKr: 'AI 뷰티 UX 대폭 개선 — 사진 가이드, 스마트 내비게이션, 개인화 경험!',
    items: [
      { emoji: '📸', label: 'Photo Guide', labelKr: '사진 가이드', desc: 'Tips for taking better photos shown before analysis — natural light, face centered, no filters.', descKr: '분석 전 좋은 사진 찍는 팁 제공 — 자연광, 정면, 필터 금지.' },
      { emoji: '🔗', label: 'Result → Products', labelKr: '결과 → 제품 연결', desc: 'Analysis results now link directly to matching products and ingredient analyzer.', descKr: '분석 결과에서 맞춤 제품과 성분 분석기로 바로 이동할 수 있어요.' },
      { emoji: '🤖', label: 'Smarter AI Chat', labelKr: 'AI 상담 개선', desc: 'Personalized suggested questions based on your skin analysis data.', descKr: '피부 분석 데이터 기반 맞춤 추천 질문이 표시됩니다.' },
      { emoji: '💎', label: 'Face Shape Cards', labelKr: '얼굴형 카드 뷰', desc: 'Styling tips now displayed as visual cards instead of a plain list.', descKr: '스타일링 팁이 카드 형태로 보기 좋게 바뀌었어요.' },
      { emoji: '📊', label: 'Score Comparison', labelKr: '점수 비교', desc: 'Skin analysis now shows changes compared to your last result.', descKr: '피부 분석 시 이전 결과와 점수 변화를 보여줍니다.' },
      { emoji: '🌤️', label: 'Weather + Skin', labelKr: '날씨 + 피부 연동', desc: 'Weather tips now reference your skin scores. City search when location is blocked.', descKr: '날씨 팁에 피부 점수가 반영되고, 위치 거부 시 도시 검색이 가능해요.' },
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
