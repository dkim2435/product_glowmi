import { useState, useEffect } from 'react'
import { loadAnalysisResults } from '../../lib/db'
import { personalColorResults } from '../../data/personalColor'
import { fsShapeData } from '../../data/faceShape'
import { skinTypeResults } from '../../data/quiz'

export default function MyResults({ userId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalysisResults(userId)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [userId])

  if (loading) return <p className="mypage-loading">Loading... 불러오는 중...</p>

  if (!data || (!data.pc_type && !data.fs_shape && !data.skin_overall_score && !data.quiz_type)) {
    return (
      <div className="mypage-empty">
        <p>No saved results yet. 저장된 결과가 없습니다.</p>
        <p className="mypage-empty-hint">Use AI Beauty tools and save your results! AI 뷰티 분석 후 결과를 저장해보세요!</p>
      </div>
    )
  }

  return (
    <div className="mypage-results-grid">
      {data.pc_type && personalColorResults[data.pc_type] && (() => {
        const pc = personalColorResults[data.pc_type]
        return (
          <div className="mypage-result-card">
            <div className="mypage-card-icon">{pc.emoji}</div>
            <div className="mypage-card-title">Personal Color 퍼스널컬러</div>
            <div className="mypage-card-value">{pc.english}</div>
            <div className="mypage-card-sub">{pc.korean}</div>
            <div className="mypage-card-meta">Confidence: {data.pc_confidence}%</div>
          </div>
        )
      })()}

      {data.fs_shape && fsShapeData[data.fs_shape] && (() => {
        const fs = fsShapeData[data.fs_shape]
        return (
          <div className="mypage-result-card">
            <div className="mypage-card-icon">{fs.emoji}</div>
            <div className="mypage-card-title">Face Shape 얼굴형</div>
            <div className="mypage-card-value">{fs.name}</div>
            <div className="mypage-card-sub">{fs.korean}</div>
            <div className="mypage-card-meta">Confidence: {data.fs_confidence}%</div>
          </div>
        )
      })()}

      {data.skin_overall_score && (() => {
        let gradeText = ''
        if (data.skin_overall_score >= 80) gradeText = 'Excellent 우수'
        else if (data.skin_overall_score >= 60) gradeText = 'Good 양호'
        else if (data.skin_overall_score >= 40) gradeText = 'Fair 보통'
        else gradeText = 'Needs Care 관리필요'
        return (
          <div className="mypage-result-card">
            <div className="mypage-card-icon">🔬</div>
            <div className="mypage-card-title">Skin Score 피부 점수</div>
            <div className="mypage-card-value">{data.skin_overall_score} / 100</div>
            <div className="mypage-card-sub">{gradeText}</div>
          </div>
        )
      })()}

      {data.quiz_type && skinTypeResults[data.quiz_type] && (() => {
        const q = skinTypeResults[data.quiz_type]
        return (
          <div className="mypage-result-card">
            <div className="mypage-card-icon">{q.emoji}</div>
            <div className="mypage-card-title">Skin Type 피부타입</div>
            <div className="mypage-card-value">{q.english}</div>
            <div className="mypage-card-sub">{q.korean}</div>
            {data.quiz_season && <div className="mypage-card-meta">{data.quiz_season === 'summer' ? '☀️ Summer' : '❄️ Winter'}</div>}
          </div>
        )
      })()}
    </div>
  )
}
