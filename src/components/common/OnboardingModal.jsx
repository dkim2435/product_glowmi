import { useState, useEffect } from 'react'

const SLIDES = [
  {
    emoji: '✨',
    title: 'Welcome to Glowmi!',
    titleKr: 'Glowmi에 오신 걸 환영합니다!',
    desc: 'Your all-in-one K-Beauty companion. Here\'s a quick tour of what you can do.',
    descKr: '나만의 K-뷰티 올인원 가이드입니다. 주요 기능을 소개해드릴게요.',
    visual: [
      { emoji: '🎨', label: 'AI Beauty' },
      { emoji: '📝', label: 'Skin Quiz' },
      { emoji: '🧴', label: 'K-Beauty' },
      { emoji: '💉', label: 'Treatments' },
      { emoji: '🧘', label: 'Wellness' },
    ],
    visualType: 'icons'
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
    emoji: '📈',
    title: 'Skin Progress Tracker',
    titleKr: '피부 변화 추적',
    desc: 'Track your skin score over time. Take regular scans to see your improvement journey with a beautiful trend chart.',
    descKr: '시간에 따른 피부 점수 변화를 추적하세요. 정기적으로 스캔하여 개선 과정을 확인할 수 있어요.',
    visual: null,
    visualType: 'chart',
    where: 'My Page → Progress tab'
  },
  {
    emoji: '📸',
    title: 'Before & After Gallery',
    titleKr: '비포 & 애프터 갤러리',
    desc: 'Upload progress photos and compare them side by side. See how far your skin has come!',
    descKr: '진행 사진을 업로드하고 나란히 비교해보세요. 피부가 얼마나 좋아졌는지 확인할 수 있어요!',
    visual: [
      { emoji: '📷', label: 'Upload photos weekly', sub: '매주 사진 업로드' },
      { emoji: '🔄', label: 'Compare Before vs After', sub: '비포 vs 애프터 비교' },
      { emoji: '📊', label: 'Track score changes', sub: '점수 변화 확인' },
    ],
    visualType: 'steps',
    where: 'My Page → Progress → Compare tab'
  },
  {
    emoji: '💄',
    title: 'My Product Shelf',
    titleKr: '내 화장대',
    desc: 'Save your skincare products, track expiry dates, and auto-detect ingredient conflicts between products.',
    descKr: '스킨케어 제품을 저장하고, 유통기한을 관리하며, 제품 간 성분 충돌을 자동으로 감지합니다.',
    visual: [
      { emoji: '🧴', label: 'Save products', sub: '제품 등록' },
      { emoji: '⏰', label: 'Expiry alerts', sub: '유통기한 알림' },
      { emoji: '⚠️', label: 'Conflict detection', sub: '성분 충돌 감지' },
    ],
    visualType: 'steps',
    where: 'My Page → My Shelf tab'
  },
  {
    emoji: '🚀',
    title: 'Ready to Glow!',
    titleKr: '이제 시작해볼까요!',
    desc: 'Log in with Google to unlock My Page features: Progress Tracking, Product Shelf, Skin Diary, and Routine Manager.',
    descKr: 'Google 로그인으로 마이페이지 기능을 이용하세요: 피부 변화 추적, 화장대, 피부 일지, 루틴 관리.',
    visual: [
      { emoji: '1️⃣', label: 'Allow location for weather tips', sub: '위치 허용으로 날씨 팁 받기' },
      { emoji: '2️⃣', label: 'Try AI Skin Analyzer', sub: 'AI 피부 분석 해보기' },
      { emoji: '3️⃣', label: 'Login & track your progress', sub: '로그인 후 변화 추적하기' },
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
              {isLast ? 'Get Started! 시작하기 🎉' : 'Next 다음 →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
