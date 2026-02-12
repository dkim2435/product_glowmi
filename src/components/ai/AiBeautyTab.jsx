import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'
import PersonalColorAnalysis from './PersonalColorAnalysis'
import FaceShapeDetector from './FaceShapeDetector'
import SkinAnalyzer from './SkinAnalyzer'
import SkinChat from './SkinChat'
import WeatherTips from '../common/WeatherTips'

const AI_TOOLS = [
  { id: 'skinAnalyzer', label: 'Skin', labelKr: '피부 분석', emoji: '🔬' },
  { id: 'personalColor', label: 'Color', labelKr: '퍼스널컬러', emoji: '🎨' },
  { id: 'faceShape', label: 'Face', labelKr: '얼굴형', emoji: '💎' },
  { id: 'skinChat', label: 'Chat', labelKr: '상담', emoji: '💬' }
]

export default function AiBeautyTab({ showToast }) {
  const { t } = useLang()
  const [activeTool, setActiveTool] = useState('skinAnalyzer')

  useEffect(() => {
    function handleToolSelect(e) {
      if (e.detail && AI_TOOLS.find(t => t.id === e.detail)) {
        setActiveTool(e.detail)
      }
    }
    window.addEventListener('glowmi-select-tool', handleToolSelect)
    return () => window.removeEventListener('glowmi-select-tool', handleToolSelect)
  }, [])

  return (
    <section className="tab-panel" id="ai">
      <WeatherTips />

      <div className="ai-tool-tabs">
        {AI_TOOLS.map(tool => (
          <button
            key={tool.id}
            className={'sub-tab-btn' + (activeTool === tool.id ? ' active' : '')}
            onClick={() => setActiveTool(tool.id)}
          >
            <span>{tool.emoji}</span> {t(tool.label, tool.labelKr)}
          </button>
        ))}
      </div>

      {activeTool === 'personalColor' && <PersonalColorAnalysis showToast={showToast} />}
      {activeTool === 'faceShape' && <FaceShapeDetector showToast={showToast} />}
      {activeTool === 'skinAnalyzer' && <SkinAnalyzer showToast={showToast} />}
      {activeTool === 'skinChat' && <SkinChat showToast={showToast} />}
    </section>
  )
}
