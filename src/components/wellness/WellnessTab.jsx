import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import NutrientRecs from './NutrientRecs'
import KTrends from './KTrends'
import WellnessGuide from './WellnessGuide'

const WELLNESS_TABS = [
  { id: 'nutrients', label: 'Nutrients', labelKr: '영양소', emoji: '🍎' },
  { id: 'ktrends', label: 'K-Trends', labelKr: 'K트렌드', emoji: '🔥' },
  { id: 'guide', label: 'Guide', labelKr: '가이드', emoji: '📚' }
]

export default function WellnessTab({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('nutrients')
  const { t } = useLang()

  return (
    <section className="tab-panel" id="wellness">
      <div className="wellness-intro">
        <h3>{'🧘 ' + t('Wellness & Skin Health', '웰니스 & 피부 건강')}</h3>
        <p>{t('Beautiful skin starts from within. Nutrition, trends & lifestyle guides.', '아름다운 피부는 내면에서 시작됩니다. 영양, 트렌드, 생활 가이드.')}</p>
      </div>

      <div className="ai-tool-tabs">
        {WELLNESS_TABS.map(tab => (
          <button
            key={tab.id}
            className={'sub-tab-btn' + (activeTab === tab.id ? ' active' : '')}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.emoji}</span> {t(tab.label, tab.labelKr)}
          </button>
        ))}
      </div>

      {activeTab === 'nutrients' && <NutrientRecs onNavigate={onNavigate} />}
      {activeTab === 'ktrends' && <KTrends />}
      {activeTab === 'guide' && <WellnessGuide />}
    </section>
  )
}
