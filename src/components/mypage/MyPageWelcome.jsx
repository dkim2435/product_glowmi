import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const SLIDES = [
  {
    emoji: '🏆',
    title: 'Results',
    titleKr: 'AI 분석 결과',
    desc: 'All your AI analysis results in one place — Personal Color, Face Shape, Skin Score, and Skin Type.',
    descKr: 'AI 분석 결과를 한곳에서 확인하세요 — 퍼스널컬러, 얼굴형, 피부점수, 피부타입.',
    visual: [
      { emoji: '🎨', label: 'Personal Color', labelKr: '퍼스널컬러 진단', sub: 'Personal Color', subKr: '퍼스널컬러 진단' },
      { emoji: '💎', label: 'Face Shape', labelKr: '얼굴형 분석', sub: 'Face Shape', subKr: '얼굴형 분석' },
      { emoji: '✨', label: 'Skin Score', labelKr: '피부 점수', sub: 'Skin Score', subKr: '피부 점수' },
      { emoji: '🧬', label: 'Skin Type', labelKr: '피부 타입', sub: 'Skin Type', subKr: '피부 타입' },
    ],
    visualType: 'steps',
  },
  {
    emoji: '📈',
    title: 'Progress',
    titleKr: '피부현황',
    desc: 'Track your skin score over time and compare before & after photos to see your glow-up journey.',
    descKr: '피부 점수 변화를 추적하고 비포/애프터 사진을 비교하여 변화를 확인하세요.',
    visual: null,
    visualType: 'chart',
  },
  {
    emoji: '📝',
    title: 'Diary',
    titleKr: '피부 일지',
    desc: 'Log your daily skin condition, products used, weather, and mood. Build a history that helps you understand your skin.',
    descKr: '매일 피부 상태, 사용 제품, 날씨, 기분을 기록하세요. 나만의 피부 히스토리를 만들어보세요.',
    visual: [
      { emoji: '📅', label: 'Daily logging', labelKr: '매일 기록', sub: 'Daily logging', subKr: '매일 기록' },
      { emoji: '🧴', label: 'Products & weather', labelKr: '제품 & 날씨', sub: 'Products & weather', subKr: '제품 & 날씨 메모' },
      { emoji: '😊', label: 'Mood tracking', labelKr: '기분 기록', sub: 'Mood tracking', subKr: '기분 기록' },
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
      { emoji: '🌅', label: 'AM Routine', labelKr: '아침 루틴', sub: 'AM Routine', subKr: '아침 루틴 관리' },
      { emoji: '🌙', label: 'PM Routine', labelKr: '저녁 루틴', sub: 'PM Routine', subKr: '저녁 루틴 관리' },
      { emoji: '📋', label: 'Step-by-step', labelKr: '단계별 정리', sub: 'Step-by-step order', subKr: '단계별 순서 정리' },
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
  const { t } = useLang()

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
          {isLast ? '' : t('Skip', '건너뛰기')}
        </button>

        <div className="onboard-slide" key={current}>
          <div className="onboard-emoji">{slide.emoji}</div>
          <h2 className="onboard-title">{t(slide.title, slide.titleKr)}</h2>
          <p className="onboard-desc">{t(slide.desc, slide.descKr)}</p>

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
                <circle cx="190" cy="20" r="3" fill="#c44569" />
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
              {isLast ? t('Start Exploring! 🎉', '시작하기 🎉') : t('Next →', '다음 →')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
