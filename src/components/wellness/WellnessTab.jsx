import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { TrendingUp, Monitor, Apple, BookOpen, Heart } from 'lucide-react'
import KTrends from './KTrends'
import KYoutubers from './KYoutubers'
import NutrientRecs from './NutrientRecs'
import WellnessGuide from './WellnessGuide'

const WELLNESS_TABS = [
  { id: 'ktrends', label: 'K-Trends', labelKr: 'K트렌드', icon: TrendingUp },
  { id: 'kyoutubers', label: 'K-YouTubers', labelKr: 'K유튜버', icon: Monitor },
  { id: 'nutrients', label: 'Nutrients', labelKr: '영양소', icon: Apple },
  { id: 'guide', label: 'Guide', labelKr: '가이드', icon: BookOpen }
]

export default function WellnessTab({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('ktrends')
  const { t } = useLang()

  return (
    <section className="tab-panel" id="wellness">
      <div className="wellness-intro">
        <h3><Heart size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('Wellness & Skin Health', '웰니스 & 피부 건강')}</h3>
        <p>{t('Beautiful skin starts from within. Trends, nutrition & lifestyle guides.', '아름다운 피부는 내면에서 시작됩니다. 트렌드, 영양, 생활 가이드.')}</p>
      </div>

      <div className="ai-tool-tabs">
        {WELLNESS_TABS.map(tab => (
          <button
            key={tab.id}
            className={'sub-tab-btn' + (activeTab === tab.id ? ' active' : '')}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} /> {t(tab.label, tab.labelKr)}
          </button>
        ))}
      </div>

      {activeTab === 'ktrends' && <KTrends />}
      {activeTab === 'kyoutubers' && <KYoutubers />}
      {activeTab === 'nutrients' && <NutrientRecs onNavigate={onNavigate} />}
      {activeTab === 'guide' && <WellnessGuide />}
    </section>
  )
}
