import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'

const WELLNESS_CARDS = [
  {
    emoji: '🥗',
    title: 'Diet & Nutrition',
    titleKr: '식단 & 영양',
    points: [
      { text: 'Eat the rainbow — colorful fruits and vegetables provide diverse antioxidants that protect skin from free radical damage.', textKr: '다양한 색의 과일과 채소를 섭취하세요 — 다양한 항산화제가 활성산소로부터 피부를 보호합니다.' },
      { text: 'Omega-3 rich foods (salmon, walnuts, flaxseed) strengthen your skin barrier and reduce inflammation.', textKr: '오메가-3가 풍부한 음식(연어, 호두, 아마씨)이 피부 장벽을 강화하고 염증을 줄입니다.' },
      { text: 'Limit sugar and processed foods — they trigger glycation, which breaks down collagen and accelerates aging.', textKr: '설탕과 가공식품을 줄이세요 — 당화 반응이 콜라겐을 파괴하고 노화를 촉진합니다.' },
      { text: 'Fermented foods like kimchi and yogurt support gut health, which directly impacts skin clarity.', textKr: '김치, 요거트 같은 발효식품이 장 건강을 지원하고, 이는 피부 투명도에 직접 영향을 줍니다.' }
    ]
  },
  {
    emoji: '😴',
    title: 'Sleep & Recovery',
    titleKr: '수면 & 회복',
    points: [
      { text: '7-9 hours of quality sleep is when your skin does most of its repair and collagen production.', textKr: '7-9시간의 양질의 수면 동안 피부의 대부분의 복구와 콜라겐 생성이 이루어집니다.' },
      { text: 'Sleep on a silk pillowcase to reduce friction and prevent sleep lines and hair breakage.', textKr: '실크 베개 커버를 사용하면 마찰을 줄여 수면 주름과 모발 손상을 방지합니다.' },
      { text: 'Apply your richest skincare products at night — skin absorption peaks during sleep.', textKr: '가장 영양 있는 스킨케어 제품은 밤에 사용하세요 — 수면 중 피부 흡수력이 최고조에 달합니다.' },
      { text: 'Avoid screens 1 hour before bed — blue light disrupts melatonin and sleep quality.', textKr: '취침 1시간 전 스크린을 피하세요 — 블루라이트가 멜라토닌과 수면의 질을 방해합니다.' }
    ]
  },
  {
    emoji: '🧘',
    title: 'Stress Management',
    titleKr: '스트레스 관리',
    points: [
      { text: 'Chronic stress raises cortisol, which triggers acne, sensitivity, and premature aging.', textKr: '만성 스트레스는 코르티솔을 높여 여드름, 민감성, 조기 노화를 유발합니다.' },
      { text: 'Even 10 minutes of daily meditation or deep breathing can measurably lower cortisol levels.', textKr: '하루 10분의 명상이나 심호흡만으로도 코르티솔 수치를 측정 가능할 만큼 낮출 수 있습니다.' },
      { text: 'Regular exercise improves circulation, delivering more oxygen and nutrients to skin cells.', textKr: '규칙적인 운동은 혈액 순환을 개선하여 피부 세포에 더 많은 산소와 영양분을 전달합니다.' },
      { text: 'Facial massage and gua sha help release tension and promote lymphatic drainage for a de-puffed look.', textKr: '페이셜 마사지와 괄사가 긴장을 풀고 림프 배출을 촉진하여 부기를 줄입니다.' }
    ]
  },
  {
    emoji: '✨',
    title: 'Daily Habits',
    titleKr: '일상 습관',
    points: [
      { text: 'Never skip sunscreen — UV damage is the #1 cause of premature skin aging (photoaging).', textKr: '자외선 차단제를 절대 건너뛰지 마세요 — UV 손상이 조기 피부 노화의 1위 원인입니다.' },
      { text: 'Change your pillowcase every 2-3 days to prevent bacteria buildup that causes breakouts.', textKr: '2-3일마다 베개 커버를 교체하여 트러블을 유발하는 세균 축적을 방지하세요.' },
      { text: 'Drink 8+ glasses of water daily — even mild dehydration makes skin look dull and tired.', textKr: '하루 8잔 이상의 물을 마시세요 — 가벼운 탈수도 피부를 칙칙하고 피곤해 보이게 합니다.' },
      { text: 'Don\'t touch your face — hands transfer oil and bacteria that clog pores and cause breakouts.', textKr: '얼굴을 만지지 마세요 — 손이 유분과 세균을 옮겨 모공을 막고 트러블을 유발합니다.' }
    ]
  }
]

export default function WellnessGuide() {
  const { t } = useLang()
  const [expanded, setExpanded] = useState(0)

  return (
    <div className="wellness-guide">
      <h3 className="nutrient-section-title">
        {t('Skin Wellness Guide', '피부 웰니스 가이드')}
      </h3>
      <p className="nutrient-section-desc">
        {t(
          'Healthy skin starts from within. Build better habits for lasting results.',
          '건강한 피부는 내면에서 시작됩니다. 지속적인 결과를 위한 좋은 습관을 만드세요.'
        )}
      </p>

      <div className="wellness-guide-grid">
        {WELLNESS_CARDS.map((card, i) => {
          const isOpen = expanded === i
          return (
            <div
              key={i}
              className={'wellness-guide-card' + (isOpen ? ' wellness-guide-expanded' : '')}
              onClick={() => setExpanded(isOpen ? -1 : i)}
            >
              <div className="wellness-guide-card-header">
                <span className="wellness-guide-emoji">{card.emoji}</span>
                <h4>{t(card.title, card.titleKr)}</h4>
                <span className="content-card-chevron">{isOpen ? '▲' : '▼'}</span>
              </div>

              {isOpen && (
                <ul className="wellness-guide-points">
                  {card.points.map((point, j) => (
                    <li key={j}>{t(point.text, point.textKr)}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
