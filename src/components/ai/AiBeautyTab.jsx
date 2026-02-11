import { useState } from 'react'
import PersonalColorAnalysis from './PersonalColorAnalysis'
import FaceShapeDetector from './FaceShapeDetector'
import SkinAnalyzer from './SkinAnalyzer'

const AI_TOOLS = [
  { id: 'personalColor', label: 'Personal Color', labelKr: '퍼스널컬러', emoji: '🎨' },
  { id: 'faceShape', label: 'Face Shape', labelKr: '얼굴형', emoji: '💎' },
  { id: 'skinAnalyzer', label: 'Skin Analyzer', labelKr: '피부 분석', emoji: '🔬' }
]

export default function AiBeautyTab({ showToast }) {
  const [activeTool, setActiveTool] = useState('personalColor')

  return (
    <section className="tab-panel" id="ai">
      <div className="ai-tool-tabs">
        {AI_TOOLS.map(tool => (
          <button
            key={tool.id}
            className={'sub-tab-btn' + (activeTool === tool.id ? ' active' : '')}
            onClick={() => setActiveTool(tool.id)}
          >
            <span>{tool.emoji}</span> {tool.label}
          </button>
        ))}
      </div>

      {activeTool === 'personalColor' && <PersonalColorAnalysis showToast={showToast} />}
      {activeTool === 'faceShape' && <FaceShapeDetector showToast={showToast} />}
      {activeTool === 'skinAnalyzer' && <SkinAnalyzer showToast={showToast} />}
    </section>
  )
}
