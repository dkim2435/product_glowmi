import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import PersonalColorAnalysis from './PersonalColorAnalysis'
import FaceShapeDetector from './FaceShapeDetector'
import SkinAnalyzer from './SkinAnalyzer'
import SkinChat from './SkinChat'

const AI_TOOLS = [
  { id: 'skinAnalyzer', label: 'Skin', labelKr: '피부 분석', emoji: '🔬' },
  { id: 'personalColor', label: 'Color', labelKr: '퍼스널컬러', emoji: '🎨' },
  { id: 'faceShape', label: 'Face', labelKr: '얼굴형', emoji: '💎' },
  { id: 'aiChat', label: 'AI Chat', labelKr: 'AI 상담', emoji: '🤖', highlight: true }
]

export default function AiBeautyTab({ showToast }) {
  const { t } = useLang()
  const { user, loginWithGoogle } = useAuth()
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

  function handleToolClick(toolId) {
    if (toolId === 'aiChat' && !user) {
      if (confirm(t(
        'Sign up (free) to use AI Chat! Continue to login?',
        'AI 상담은 무료 가입 후 이용 가능해요! 로그인할까요?'
      ))) {
        loginWithGoogle()
      }
      return
    }
    setActiveTool(toolId)
  }

  return (
    <section className="tab-panel" id="ai">
      <div className="ai-tool-tabs">
        {AI_TOOLS.map(tool => (
          <button
            key={tool.id}
            className={'sub-tab-btn' + (activeTool === tool.id ? ' active' : '') + (tool.highlight ? ' sub-tab-highlight' : '')}
            onClick={() => handleToolClick(tool.id)}
          >
            <span>{tool.emoji}</span> {t(tool.label, tool.labelKr)}
          </button>
        ))}
      </div>

      <div style={{ display: activeTool === 'skinAnalyzer' ? 'block' : 'none' }}>
        <SkinAnalyzer showToast={showToast} />
      </div>
      <div style={{ display: activeTool === 'personalColor' ? 'block' : 'none' }}>
        <PersonalColorAnalysis showToast={showToast} />
      </div>
      <div style={{ display: activeTool === 'faceShape' ? 'block' : 'none' }}>
        <FaceShapeDetector showToast={showToast} />
      </div>
      {activeTool === 'aiChat' && <SkinChat showToast={showToast} />}
    </section>
  )
}
