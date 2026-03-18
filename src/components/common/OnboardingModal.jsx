import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const SLIDES = [
  {
    emoji: '✨',
    title: 'Welcome to Glowmi!',
    titleKr: 'Glowmi에 오신 걸 환영합니다!',
    desc: 'Your free, all-in-one K-Beauty companion powered by AI — skincare analysis, product guides, and more in English & Korean.',
    descKr: 'AI 기반 무료 K-뷰티 올인원 가이드 — 피부 분석, 제품 가이드 등을 영어와 한국어로 제공합니다.',
    visual: [
      { emoji: '🆓', label: '100% Free', labelKr: '완전 무료' },
      { emoji: '🤖', label: 'AI-Powered', labelKr: 'AI 분석' },
      { emoji: '🇰🇷', label: 'K-Beauty', labelKr: 'K-뷰티 전문' },
      { emoji: '🌏', label: 'EN + 한국어', labelKr: 'EN + 한국어' },
    ],
    visualType: 'icons'
  },
  {
    emoji: '🎨',
    title: 'AI Beauty Analysis',
    titleKr: 'AI 뷰티 분석',
    desc: 'Upload a selfie for instant AI analysis — Personal Color (10 types), Face Shape (7 types), Skin Score (5 metrics), plus AI Chat.',
    descKr: '셀카 한 장으로 퍼스널컬러(10타입), 얼굴형(7타입), 피부 점수(5지표) 분석 + AI 상담까지.',
    visual: [
      { emoji: '🎨', label: 'Personal Color', labelKr: '퍼스널컬러', sub: '10 color types', subKr: '10가지 컬러 타입' },
      { emoji: '💎', label: 'Face Shape', labelKr: '얼굴형', sub: 'Shape + styling', subKr: '얼굴형 + 스타일링' },
      { emoji: '✨', label: 'Skin Score', labelKr: '피부 점수', sub: '5 skin metrics', subKr: '5가지 피부 지표' },
      { emoji: '💬', label: 'AI Chat', labelKr: 'AI 상담', sub: 'Ask anything', subKr: '뭐든 물어보세요' },
    ],
    visualType: 'steps',
    where: 'AI Beauty tab',
    whereKr: 'AI 뷰티 탭'
  },
  {
    emoji: '🧴',
    title: 'K-Beauty & Wellness',
    titleKr: 'K-뷰티 & 웰니스',
    desc: 'Product ingredient analysis, 10-step routine guide, K-beauty trends, personalized nutrients, and daily weather skincare tips.',
    descKr: '제품 성분 분석, 10단계 루틴 가이드, K-뷰티 트렌드, 맞춤 영양소, 오늘의 날씨 스킨케어 팁까지.',
    visual: [
      { emoji: '🔬', label: 'Ingredients', labelKr: '성분 분석', sub: 'Analyze any product', subKr: '제품 성분 분석' },
      { emoji: '🔥', label: 'K-Trends', labelKr: 'K-트렌드', sub: 'Latest trends', subKr: '최신 트렌드' },
      { emoji: '🍎', label: 'Nutrients', labelKr: '영양소', sub: 'Skin-based recs', subKr: '피부 맞춤 추천' },
      { emoji: '🌤️', label: 'Weather Tips', labelKr: '날씨 팁', sub: 'Daily skincare', subKr: '매일 스킨케어' },
    ],
    visualType: 'steps',
    where: 'K-Beauty & Wellness tabs',
    whereKr: 'K-뷰티 & 웰니스 탭'
  },
  {
    emoji: '🙋',
    title: 'My Page — Track & Save',
    titleKr: '마이페이지 — 저장 & 추적',
    desc: 'Free sign-up with Google — save results, track skin changes with graphs, keep a diary, and manage your AM/PM routine.',
    descKr: 'Google 무료 가입으로 결과 저장, 그래프로 피부 변화 추적, 일지 기록, AM/PM 루틴 관리까지.',
    visual: [
      { emoji: '🏆', label: 'Results', labelKr: '결과', sub: 'All analysis saved', subKr: '분석 결과 모아보기' },
      { emoji: '📈', label: 'Progress', labelKr: '변화추적', sub: 'Score graph + photos', subKr: '점수 그래프 + 사진' },
      { emoji: '📝', label: 'Diary', labelKr: '일지', sub: 'Daily skin log', subKr: '매일 피부 기록' },
      { emoji: '🧴', label: 'Routine', labelKr: '루틴', sub: 'AM/PM routine', subKr: 'AM/PM 루틴' },
    ],
    visualType: 'steps',
    where: 'My Page (free sign-up)',
    whereKr: '마이페이지 (무료 가입)'
  },
  {
    emoji: '🚀',
    title: 'Ready to Glow!',
    titleKr: '이제 시작해볼까요!',
    desc: 'Start right now — everything is free, no sign-up required to explore!',
    descKr: '지금 바로 시작하세요 — 가입 없이 모든 기능을 무료로 사용할 수 있어요!',
    visual: [
      { emoji: '1️⃣', label: 'Try AI Analysis', labelKr: 'AI 분석 체험', sub: 'Free, instant results', subKr: '무료, 즉시 결과' },
      { emoji: '2️⃣', label: 'Allow location', labelKr: '위치 허용', sub: 'For weather tips', subKr: '날씨 팁 받기' },
      { emoji: '3️⃣', label: 'Sign up & save', labelKr: '가입 후 저장', sub: 'Track your progress', subKr: '변화 추적하기' },
    ],
    visualType: 'steps',
    where: null
  },
]

const STORAGE_KEY = 'glowmi_onboarding_seen'

export function shouldShowOnboarding() {
  return !localStorage.getItem(STORAGE_KEY)
}

export function markOnboardingSeen() {
  localStorage.setItem(STORAGE_KEY, '1')
}

export default function OnboardingModal({ onClose }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState('next')
  const { t } = useLang()

  useEffect(() => {
    document.body.style.overflowY = 'hidden'
    function handleKeyDown(e) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflowY = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function goNext() {
    if (current < SLIDES.length - 1) {
      setDirection('next')
      setCurrent(current + 1)
    } else {
      handleClose()
    }
  }

  function goPrev() {
    if (current > 0) {
      setDirection('prev')
      setCurrent(current - 1)
    }
  }

  function handleClose() {
    markOnboardingSeen()
    onClose()
  }

  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1

  return (
    <div className="onboard-overlay" onClick={handleClose}>
      <div className="onboard-modal" role="dialog" aria-modal="true" aria-labelledby="onboard-title" onClick={e => e.stopPropagation()}>
        <button className="onboard-skip" onClick={handleClose}>
          {isLast ? '' : t('Skip', '건너뛰기')}
        </button>

        <div className="onboard-slide" key={current}>
          <div className="onboard-emoji">{slide.emoji}</div>
          <h2 className="onboard-title" id="onboard-title">{t(slide.title, slide.titleKr)}</h2>
          <p className="onboard-desc">{t(slide.desc, slide.descKr)}</p>

          {slide.visualType === 'icons' && (
            <div className="onboard-icons">
              {slide.visual.map((v, i) => (
                <div key={i} className="onboard-icon-item">
                  <span className="onboard-icon-emoji">{v.emoji}</span>
                  <span className="onboard-icon-label">{t(v.label, v.labelKr)}</span>
                </div>
              ))}
            </div>
          )}

          {slide.visualType === 'tips' && (
            <div className="onboard-tips">
              {slide.visual.map((v, i) => (
                <div key={i} className="onboard-tip-row">
                  <span className="onboard-tip-emoji">{v.emoji}</span>
                  <div>
                    <div className="onboard-tip-label">{t(v.label, v.labelKr)}</div>
                    <div className="onboard-tip-sub">{t(v.sub, v.subKr)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {slide.visualType === 'chart' && (
            <div className="onboard-chart-preview">
              <svg viewBox="0 0 200 80" className="onboard-chart-svg">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CF8BA9" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#CF8BA9" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d="M10,60 L40,50 L70,55 L100,40 L130,35 L160,25 L190,20 L190,70 L10,70 Z" fill="url(#chartGrad)" />
                <polyline points="10,60 40,50 70,55 100,40 130,35 160,25 190,20" fill="none" stroke="#CF8BA9" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx="10" cy="60" r="3" fill="#CF8BA9" />
                <circle cx="190" cy="20" r="3" fill="#A66A85" />
              </svg>
            </div>
          )}

          {slide.visualType === 'steps' && (
            <div className="onboard-steps">
              {slide.visual.map((v, i) => (
                <div key={i} className="onboard-step-row">
                  <span className="onboard-step-emoji">{v.emoji}</span>
                  <div>
                    <div className="onboard-step-label">{t(v.label, v.labelKr)}</div>
                    <div className="onboard-step-sub">{t(v.sub, v.subKr)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {slide.where && (
            <div className="onboard-where">
              📍 {t(slide.where, slide.whereKr)}
            </div>
          )}
        </div>

        <div className="onboard-nav">
          <div className="onboard-dots">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={'onboard-dot' + (i === current ? ' active' : '')}
                onClick={() => { setDirection(i > current ? 'next' : 'prev'); setCurrent(i) }}
              />
            ))}
          </div>
          <div className="onboard-btns">
            {current > 0 && (
              <button className="onboard-btn onboard-prev" onClick={goPrev}>
                ← {t('Back', '이전')}
              </button>
            )}
            <button className="onboard-btn onboard-next" onClick={goNext}>
              {isLast ? t('Start Glowing! 🎉', '시작하기 🎉') : t('Next →', '다음 →')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
