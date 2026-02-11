import { useState, useEffect } from 'react'

const SLIDES = [
  {
    emoji: '🏆',
    title: 'Results',
    titleKr: 'AI 분석 결과',
    desc: 'All your AI analysis results in one place — Personal Color, Face Shape, Skin Score, and Skin Type.',
    descKr: 'AI 분석 결과를 한곳에서 확인하세요 — 퍼스널컬러, 얼굴형, 피부점수, 피부타입.',
    visual: [
      { emoji: '🎨', label: 'Personal Color', sub: '퍼스널컬러 진단' },
      { emoji: '💎', label: 'Face Shape', sub: '얼굴형 분석' },
      { emoji: '✨', label: 'Skin Score', sub: '피부 점수' },
      { emoji: '🧬', label: 'Skin Type', sub: '피부 타입' },
    ],
    visualType: 'steps',
  },
  {
    emoji: '📈',
    title: 'Progress',
    titleKr: '피부 진행현황',
    desc: 'Track your skin score over time and compare before & after photos to see your glow-up journey.',
    descKr: '피부 점수 변화를 추적하고 비포/애프터 사진을 비교하여 변화를 확인하세요.',
    visual: null,
    visualType: 'chart',
  },
  {
    emoji: '💄',
    title: 'My Shelf',
    titleKr: '내 화장대',
    desc: 'Register your skincare products, manage expiry dates, and auto-detect ingredient conflicts.',
    descKr: '스킨케어 제품을 등록하고, 유통기한을 관리하며, 성분 충돌을 자동으로 감지합니다.',
    visual: [
      { emoji: '🧴', label: 'Register products', sub: '제품 등록' },
      { emoji: '⏰', label: 'Expiry tracking', sub: '유통기한 관리' },
      { emoji: '⚠️', label: 'Conflict detection', sub: '성분 충돌 감지' },
    ],
    visualType: 'steps',
  },
  {
    emoji: '📝',
    title: 'Diary',
    titleKr: '피부 일지',
    desc: 'Log your daily skin condition, products used, weather, and mood. Build a history that helps you understand your skin.',
    descKr: '매일 피부 상태, 사용 제품, 날씨, 기분을 기록하세요. 나만의 피부 히스토리를 만들어보세요.',
    visual: [
      { emoji: '📅', label: 'Daily logging', sub: '매일 기록' },
      { emoji: '🧴', label: 'Products & weather', sub: '제품 & 날씨 메모' },
      { emoji: '😊', label: 'Mood tracking', sub: '기분 기록' },
    ],
    visualType: 'steps',
  },
  {
    emoji: '🧴',
    title: 'Routine',
    titleKr: 'AM/PM 루틴',
    desc: 'Organize your morning and night skincare routines step by step. Never miss a step again!',
    descKr: '아침/저녁 스킨케어 루틴을 단계별로 정리하세요. 빠뜨리는 단계 없이 관리할 수 있어요!',
    visual: [
      { emoji: '🌅', label: 'AM Routine', sub: '아침 루틴 관리' },
      { emoji: '🌙', label: 'PM Routine', sub: '저녁 루틴 관리' },
      { emoji: '📋', label: 'Step-by-step order', sub: '단계별 순서 정리' },
    ],
    visualType: 'steps',
  },
]

const STORAGE_KEY = 'glowmi_mypage_welcome_seen'

export function shouldShowMyPageWelcome() {
  return !localStorage.getItem(STORAGE_KEY)
}

function markMyPageWelcomeSeen() {
  localStorage.setItem(STORAGE_KEY, '1')
}

export default function MyPageWelcome({ onClose }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState('next')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
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
    markMyPageWelcomeSeen()
    onClose()
  }

  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1

  return (
    <div className="onboard-overlay" onClick={handleClose}>
      <div className="onboard-modal" onClick={e => e.stopPropagation()}>
        <button className="onboard-skip" onClick={handleClose}>
          {isLast ? '' : 'Skip 건너뛰기'}
        </button>

        <div className="onboard-slide" key={current}>
          <div className="onboard-emoji">{slide.emoji}</div>
          <h2 className="onboard-title">{slide.title}</h2>
          <p className="onboard-title-kr">{slide.titleKr}</p>
          <p className="onboard-desc">{slide.desc}</p>
          <p className="onboard-desc-kr">{slide.descKr}</p>

          {slide.visualType === 'chart' && (
            <div className="onboard-chart-preview">
              <svg viewBox="0 0 200 80" className="onboard-chart-svg">
                <defs>
                  <linearGradient id="mpChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ff6b9d" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d="M10,60 L40,50 L70,55 L100,40 L130,35 L160,25 L190,20 L190,70 L10,70 Z" fill="url(#mpChartGrad)" />
                <polyline points="10,60 40,50 70,55 100,40 130,35 160,25 190,20" fill="none" stroke="#ff6b9d" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx="10" cy="60" r="3" fill="#ff6b9d" />
                <circle cx="70" cy="55" r="3" fill="#ff6b9d" />
                <circle cx="130" cy="35" r="3" fill="#ff6b9d" />
                <circle cx="190" cy="20" r="3" fill="#c44569" />
                <text x="10" y="56" fontSize="7" fill="#888">65</text>
                <text x="100" y="36" fontSize="7" fill="#888">78</text>
                <text x="190" y="16" fontSize="7" fill="#888" textAnchor="end">88</text>
              </svg>
              <div className="onboard-chart-labels">
                <span>Week 1</span>
                <span>Week 4</span>
                <span>Week 8</span>
              </div>
            </div>
          )}

          {slide.visualType === 'steps' && (
            <div className="onboard-steps">
              {slide.visual.map((v, i) => (
                <div key={i} className="onboard-step-row">
                  <span className="onboard-step-emoji">{v.emoji}</span>
                  <div>
                    <div className="onboard-step-label">{v.label}</div>
                    <div className="onboard-step-sub">{v.sub}</div>
                  </div>
                </div>
              ))}
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
                ← Back
              </button>
            )}
            <button className="onboard-btn onboard-next" onClick={goNext}>
              {isLast ? 'Start Exploring! 시작하기 🎉' : 'Next 다음 →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
