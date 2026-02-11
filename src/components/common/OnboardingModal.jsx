import { useState, useEffect } from 'react'

const SLIDES = [
  {
    emoji: '✨',
    title: 'Welcome to Glowmi!',
    titleKr: 'Glowmi에 오신 걸 환영합니다!',
    desc: 'Your free, all-in-one K-Beauty companion powered by AI. Discover your best skincare routine today.',
    descKr: 'AI 기반 무료 K-뷰티 올인원 가이드. 나에게 딱 맞는 스킨케어 루틴을 찾아보세요.',
    visual: [
      { emoji: '🆓', label: '100% Free 완전 무료' },
      { emoji: '🤖', label: 'AI-Powered 분석' },
      { emoji: '🇰🇷', label: 'K-Beauty 전문' },
      { emoji: '🌏', label: 'English + 한국어' },
    ],
    visualType: 'icons'
  },
  {
    emoji: '🎨',
    title: 'AI Beauty Analysis',
    titleKr: 'AI 뷰티 분석',
    desc: 'Upload a selfie and get instant AI analysis — Personal Color, Face Shape, and Skin Score all in seconds.',
    descKr: '셀카 한 장으로 퍼스널컬러, 얼굴형, 피부 점수를 몇 초 만에 분석받으세요.',
    visual: [
      { emoji: '🎨', label: 'Personal Color', sub: '퍼스널컬러 진단' },
      { emoji: '💎', label: 'Face Shape', sub: '얼굴형 분석' },
      { emoji: '✨', label: 'Skin Score', sub: 'AI 피부 점수 측정' },
    ],
    visualType: 'steps',
    where: 'AI Beauty tab'
  },
  {
    emoji: '🧴',
    title: 'K-Beauty Guide',
    titleKr: 'K-뷰티 가이드',
    desc: 'Explore trending ingredients TOP 10, the famous 10-step Korean routine, and our ingredient analyzer for any product.',
    descKr: '트렌딩 성분 TOP 10, 10단계 한국 스킨케어 루틴, 제품 성분 분석기를 만나보세요.',
    visual: [
      { emoji: '🔥', label: 'Trending Ingredients', sub: 'TOP 10 인기 성분' },
      { emoji: '🧖', label: '10-Step Routine', sub: '10단계 스킨케어' },
      { emoji: '🔬', label: 'Ingredient Analyzer', sub: '성분 분석기' },
    ],
    visualType: 'steps',
    where: 'K-Beauty tab'
  },
  {
    emoji: '🌤️',
    title: 'Daily Weather Tips',
    titleKr: '오늘의 날씨 스킨케어 팁',
    desc: 'Get personalized skincare advice based on today\'s UV, humidity, and temperature. Updated automatically with your location.',
    descKr: '오늘의 자외선, 습도, 기온에 맞는 스킨케어 팁을 받아보세요. 위치 기반으로 자동 업데이트됩니다.',
    visual: [
      { emoji: '☀️', label: 'UV 8 → SPF 50+', sub: '자외선 차단제 필수' },
      { emoji: '🏜️', label: 'Humidity 25% → Hydrate', sub: '수분 보충 필요' },
      { emoji: '🥶', label: 'Cold → Barrier Cream', sub: '배리어 크림 추천' },
    ],
    visualType: 'tips',
    where: 'AI Beauty tab, top of page'
  },
  {
    emoji: '🙋',
    title: 'My Page — Your Beauty Hub',
    titleKr: '마이페이지 — 나만의 뷰티 허브',
    desc: 'Log in to unlock all personal features: save results, track progress, manage products, write a diary, and build your routine.',
    descKr: '로그인하고 모든 기능을 이용하세요: 결과 저장, 변화 추적, 제품 관리, 피부 일지, 루틴 관리.',
    visual: [
      { emoji: '🏆', label: 'Results 결과', sub: 'AI 분석 결과 모아보기' },
      { emoji: '📈', label: 'Progress 변화추적', sub: '점수 그래프 + 사진 비교' },
      { emoji: '💄', label: 'Shelf 화장대', sub: '제품 등록 & 성분 충돌' },
      { emoji: '📝', label: 'Diary 일지', sub: '피부 상태 매일 기록' },
      { emoji: '🧴', label: 'Routine 루틴', sub: 'AM/PM 루틴 관리' },
    ],
    visualType: 'steps',
    where: 'My Page (login required)'
  },
  {
    emoji: '🚀',
    title: 'Ready to Glow!',
    titleKr: '이제 빛나는 피부를 만들어볼까요!',
    desc: 'Start your glow-up journey right now — try the AI Skin Analyzer for free. Sign up to save your progress!',
    descKr: '지금 바로 AI 피부 분석을 시작하세요 — 완전 무료! 가입하면 모든 기록이 저장됩니다.',
    visual: [
      { emoji: '1️⃣', label: 'Allow location for weather tips', sub: '위치 허용으로 날씨 팁 받기' },
      { emoji: '2️⃣', label: 'Try AI Skin Analyzer — Free!', sub: 'AI 피부 분석 무료 체험' },
      { emoji: '3️⃣', label: 'Sign up & track your glow-up', sub: '무료 가입 후 변화 추적하기' },
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
  const [direction, setDirection] = useState('next') // for animation

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
    markOnboardingSeen()
    onClose()
  }

  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1

  return (
    <div className="onboard-overlay" onClick={handleClose}>
      <div className="onboard-modal" onClick={e => e.stopPropagation()}>
        {/* Skip button */}
        <button className="onboard-skip" onClick={handleClose}>
          {isLast ? '' : 'Skip 건너뛰기'}
        </button>

        {/* Slide content */}
        <div className="onboard-slide" key={current}>
          <div className="onboard-emoji">{slide.emoji}</div>
          <h2 className="onboard-title">{slide.title}</h2>
          <p className="onboard-title-kr">{slide.titleKr}</p>
          <p className="onboard-desc">{slide.desc}</p>
          <p className="onboard-desc-kr">{slide.descKr}</p>

          {/* Visual area */}
          {slide.visualType === 'icons' && (
            <div className="onboard-icons">
              {slide.visual.map((v, i) => (
                <div key={i} className="onboard-icon-item">
                  <span className="onboard-icon-emoji">{v.emoji}</span>
                  <span className="onboard-icon-label">{v.label}</span>
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
                    <div className="onboard-tip-label">{v.label}</div>
                    <div className="onboard-tip-sub">{v.sub}</div>
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
                    <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ff6b9d" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d="M10,60 L40,50 L70,55 L100,40 L130,35 L160,25 L190,20 L190,70 L10,70 Z" fill="url(#chartGrad)" />
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

          {slide.where && (
            <div className="onboard-where">
              📍 {slide.where}
            </div>
          )}
        </div>

        {/* Navigation */}
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
              {isLast ? 'Start Glowing! 시작하기 🎉' : 'Next 다음 →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
