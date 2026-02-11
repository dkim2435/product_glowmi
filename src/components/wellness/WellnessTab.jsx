import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'

const WELLNESS_CARDS = [
  {
    id: 'diet',
    title: '🥗 Diet & Skin Health',
    titleKr: '🥗 식단과 피부 건강',
    content: [
      { subtitle: 'Skin-Friendly Foods', text: 'Salmon (omega-3), berries (antioxidants), sweet potatoes (vitamin A), green tea (EGCG), avocado (healthy fats), tomatoes (lycopene), dark chocolate (flavanols).' },
      { subtitle: 'Korean Superfoods', text: 'Kimchi (probiotics for gut-skin axis), gochujang (capsaicin for circulation), ginseng (anti-aging), green tea (polyphenols), seaweed (minerals), fermented soy (isoflavones).' },
      { subtitle: 'Foods to Avoid', text: 'Excessive sugar (glycation damages collagen), dairy (may trigger breakouts in some people), processed foods (inflammation), alcohol (dehydrates skin).' }
    ]
  },
  {
    id: 'sleep',
    title: '😴 Sleep & Recovery',
    titleKr: '😴 수면과 회복',
    content: [
      { subtitle: 'Why Sleep Matters', text: 'During deep sleep, your body increases blood flow to the skin, rebuilds collagen, and repairs UV damage. Growth hormone peaks during sleep, accelerating cell turnover.' },
      { subtitle: 'Sleep Tips for Better Skin', text: 'Aim for 7-9 hours. Sleep on a silk pillowcase to reduce friction. Apply sleeping mask or heavy moisturizer before bed. Keep bedroom cool (18-20°C) and dark. Avoid screens 1 hour before sleep.' },
      { subtitle: 'Korean Beauty Sleep', text: 'The Korean concept of 수면팩 (sleeping mask) maximizes nighttime repair. Apply after your evening routine to lock in all active ingredients.' }
    ]
  },
  {
    id: 'stress',
    title: '🧘 Stress Management',
    titleKr: '🧘 스트레스 관리',
    content: [
      { subtitle: 'Stress-Skin Connection', text: 'Cortisol (stress hormone) increases oil production, triggers inflammation, breaks down collagen, and weakens skin barrier. Chronic stress can cause acne, eczema flares, and premature aging.' },
      { subtitle: 'Stress Relief Techniques', text: '10 minutes of deep breathing daily. Regular exercise (30 min, 3x/week). Meditation or yoga. Nature walks. Journaling. Social connections.' },
      { subtitle: 'Korean Wellness Practices', text: 'Jjimjilbang (찜질방) sauna culture for relaxation and detox. Forest bathing (산림욕). Tea ceremony mindfulness. Facial massage (gua sha / jade roller).' }
    ]
  },
  {
    id: 'habits',
    title: '✨ Daily Habits',
    titleKr: '✨ 일상 습관',
    content: [
      { subtitle: 'Hydration', text: 'Drink 8+ glasses of water daily. Your skin is 64% water — dehydration shows as dullness, fine lines, and tightness. Add cucumber, lemon, or mint for variety.' },
      { subtitle: 'Sun Protection', text: 'UV damage causes 80% of visible aging. Apply SPF 50+ PA++++ daily, even on cloudy days. Reapply every 2 hours outdoors. Korean sunscreens are lightweight and cosmetically elegant.' },
      { subtitle: 'Exercise', text: 'Regular exercise boosts blood circulation, delivering oxygen and nutrients to skin. Aim for 150 minutes per week. Always cleanse after sweating to prevent breakouts.' },
      { subtitle: 'Avoid', text: 'Touching your face (transfers bacteria). Sleeping with makeup on. Using hot water to wash face (damages barrier). Over-exfoliating (1-2x/week max).' }
    ]
  }
]

export default function WellnessTab() {
  const [openCard, setOpenCard] = useState(null)
  const { t } = useLang()

  return (
    <section className="tab-panel" id="wellness">
      <div className="wellness-intro">
        <h3>{'🧘 ' + t('Wellness & Skin Health', '웰니스 & 피부 건강')}</h3>
        <p>{t('Beautiful skin starts from within. Learn how lifestyle factors affect your skin health.', '아름다운 피부는 내면에서 시작됩니다. 생활 습관이 피부 건강에 미치는 영향을 알아보세요.')}</p>
      </div>

      <div className="wellness-cards">
        {WELLNESS_CARDS.map(card => (
          <div
            key={card.id}
            className={'content-card' + (openCard === card.id ? ' open' : '')}
            onClick={() => setOpenCard(openCard === card.id ? null : card.id)}
          >
            <div className="content-card-header">
              <h4>{t(card.title, card.titleKr)}</h4>
              <span className="content-card-chevron">{openCard === card.id ? '▲' : '▼'}</span>
            </div>
            {openCard === card.id && (
              <div className="content-card-body" onClick={e => e.stopPropagation()}>
                {card.content.map((section, i) => (
                  <div key={i} className="wellness-section">
                    <h5>{section.subtitle}</h5>
                    <p>{section.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
