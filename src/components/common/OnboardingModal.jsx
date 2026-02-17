import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'

const SLIDES = [
  {
    emoji: '✨',
    title: 'Welcome to Glowmi!',
    titleKr: 'Glowmi에 오신 걸 환영합니다!',
    desc: 'Your free, all-in-one K-Beauty companion powered by AI. Skincare analysis, product guides, wellness tips, and more — all in English & Korean.',
    descKr: 'AI 기반 무료 K-뷰티 올인원 가이드. 피부 분석, 제품 가이드, 웰니스 팁까지 — 영어와 한국어로 모두 제공됩니다.',
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
    desc: 'Upload a selfie and get instant AI analysis — Personal Color, Face Shape, Skin Score, plus AI Chat for beauty Q&A.',
    descKr: '셀카 한 장으로 퍼스널컬러, 얼굴형, 피부 점수를 분석받고, AI 상담으로 뷰티 질문도 해보세요.',
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
    title: 'K-Beauty Guide & Tools',
    titleKr: 'K-뷰티 가이드 & 도구',
    desc: 'Learn the Korean 10-step routine, analyze product ingredients, and check ingredient compatibility.',
    descKr: '10단계 한국 스킨케어 루틴을 배우고, 제품 성분을 분석하고, 성분 호환성을 확인하세요.',
    visual: [
      { emoji: '📖', label: 'Skincare Guide', labelKr: '스킨케어 가이드', sub: '10-step routine & tips', subKr: '10단계 루틴 & 팁' },
      { emoji: '🔬', label: 'Ingredient Analyzer', labelKr: '성분 분석기', sub: 'Analyze any product', subKr: '모든 제품 성분 분석' },
      { emoji: '⚡', label: 'Compatibility', labelKr: '호환성 체크', sub: 'Check conflicts', subKr: '성분 충돌 확인' },
    ],
    visualType: 'steps',
    where: 'K-Beauty tab',
    whereKr: 'K-뷰티 탭'
  },
  {
    emoji: '🧘',
    title: 'Wellness & K-Trends',
    titleKr: '웰니스 & K-트렌드',
    desc: 'Personalized nutrient recommendations for your skin, 2025-2026 K-beauty trends, and top K-beauty YouTuber picks.',
    descKr: '피부 맞춤 영양소 추천, 2025-2026 K-뷰티 트렌드, 인기 K-뷰티 유튜버 소개까지.',
    visual: [
      { emoji: '🍎', label: 'Nutrients', labelKr: '맞춤 영양소', sub: 'Skin-based food recs', subKr: '피부 기반 음식 추천' },
      { emoji: '🔥', label: 'K-Trends', labelKr: 'K-트렌드', sub: 'Ingredients & methods', subKr: '성분 & 트렌드' },
      { emoji: '📺', label: 'YouTubers', labelKr: '유튜버', sub: 'Top 7 creators', subKr: '인기 크리에이터 7인' },
    ],
    visualType: 'steps',
    where: 'Wellness tab',
    whereKr: '웰니스 탭'
  },
  {
    emoji: '🌤️',
    title: 'Daily Weather Skincare',
    titleKr: '오늘의 날씨 스킨케어',
    desc: 'A weather widget at the top of every page gives you real-time skincare tips based on UV, humidity, and temperature.',
    descKr: '모든 페이지 상단에 날씨 위젯이 실시간 자외선, 습도, 기온에 맞는 스킨케어 팁을 알려줍니다.',
    visual: [
      { emoji: '☀️', label: 'UV → SPF', labelKr: 'UV → SPF', sub: 'UV protection level', subKr: '자외선 차단 단계' },
      { emoji: '💧', label: 'Humidity → Hydrate', labelKr: '습도 → 보습', sub: 'Moisture advice', subKr: '수분 보충 조언' },
      { emoji: '🌡️', label: 'Temp → Barrier', labelKr: '기온 → 배리어', sub: 'Weather care', subKr: '온도별 케어' },
    ],
    visualType: 'tips',
    where: 'All pages, top',
    whereKr: '모든 페이지 상단'
  },
  {
    emoji: '🙋',
    title: 'My Page — Your Beauty Hub',
    titleKr: '마이페이지 — 나만의 뷰티 허브',
    desc: 'Sign up free with Google to save results, track skin changes over time, keep a diary, and manage your routine.',
    descKr: 'Google로 무료 가입하고 결과 저장, 피부 변화 추적, 일지 작성, 루틴 관리를 시작하세요.',
    visual: [
      { emoji: '🏆', label: 'Results', labelKr: '결과', sub: 'AI analysis results', subKr: 'AI 분석 결과 모아보기' },
      { emoji: '📈', label: 'Progress', labelKr: '변화추적', sub: 'Score graph + photos', subKr: '점수 그래프 + 사진 비교' },
      { emoji: '📝', label: 'Diary', labelKr: '일지', sub: 'Daily skin log', subKr: '피부 상태 매일 기록' },
      { emoji: '🧴', label: 'Routine', labelKr: '루틴', sub: 'AM/PM routine', subKr: 'AM/PM 루틴 관리' },
    ],
    visualType: 'steps',
    where: 'My Page (free sign-up)',
    whereKr: '마이페이지 (무료 가입)'
  },
  {
    emoji: '🚀',
    title: 'Ready to Glow!',
    titleKr: '이제 빛나는 피부를 만들어볼까요!',
    desc: 'Start your glow-up journey right now — everything is free, no sign-up required to explore!',
    descKr: '지금 바로 시작하세요 — 가입 없이 모든 기능을 무료로 둘러볼 수 있습니다!',
    visual: [
      { emoji: '1️⃣', label: 'Allow location', labelKr: '위치 허용', sub: 'For weather tips', subKr: '날씨 팁 받기' },
      { emoji: '2️⃣', label: 'Try AI Analysis', labelKr: 'AI 분석 체험', sub: 'Free, instant', subKr: '무료, 즉시 결과' },
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
                    <stop offset="0%" stopColor="#F4A698" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F4A698" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d="M10,60 L40,50 L70,55 L100,40 L130,35 L160,25 L190,20 L190,70 L10,70 Z" fill="url(#chartGrad)" />
                <polyline points="10,60 40,50 70,55 100,40 130,35 160,25 190,20" fill="none" stroke="#F4A698" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx="10" cy="60" r="3" fill="#F4A698" />
                <circle cx="190" cy="20" r="3" fill="#C4796A" />
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
