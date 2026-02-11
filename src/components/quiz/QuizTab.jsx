import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { saveQuizResult } from '../../lib/db'
import { summerQuizQuestions, winterQuizQuestions, skinTypeResults } from '../../data/quiz'
import { getRecommendations } from '../../data/products'
import ProductCard from '../common/ProductCard'
import ShareButtons from '../common/ShareButtons'
import SaveResultBtn from '../common/SaveResultBtn'
import Confetti from '../common/Confetti'

export default function QuizTab({ showToast }) {
  const { user } = useAuth()
  const [screen, setScreen] = useState('seasonSelect') // seasonSelect | start | questions | result
  const [season, setSeason] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState({ dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 })
  const [resultType, setResultType] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const questions = season === 'summer' ? summerQuizQuestions : winterQuizQuestions

  function selectSeason(s) {
    setSeason(s)
    setScreen('start')
  }

  function startQuiz() {
    setCurrentQ(0)
    setScores({ dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 })
    setScreen('questions')
  }

  function selectOption(idx) {
    const q = questions[currentQ]
    const s = q.options[idx].scores
    const newScores = {
      dry: scores.dry + s.dry,
      oily: scores.oily + s.oily,
      combination: scores.combination + s.combination,
      sensitive: scores.sensitive + s.sensitive,
      normal: scores.normal + s.normal
    }
    setScores(newScores)

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1)
    } else {
      // Determine result
      let maxType = 'normal'
      let maxScore = 0
      for (const type in newScores) {
        if (newScores[type] > maxScore) {
          maxScore = newScores[type]
          maxType = type
        }
      }
      setResultType(maxType)
      setScreen('result')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    }
  }

  async function handleSave() {
    if (!user || !resultType) return
    try {
      await saveQuizResult(user.id, resultType, season, scores)
      showToast('Quiz result saved! 퀴즈 결과가 저장되었습니다!')
    } catch {
      showToast('Failed to save. Please try again. 저장에 실패했습니다.')
    }
  }

  function retakeQuiz() {
    setResultType(null)
    setSeason(null)
    setScreen('seasonSelect')
  }

  // Season Select
  if (screen === 'seasonSelect') {
    return (
      <section className="tab-panel" id="quiz">
        <div className="quiz-season-select">
          <h3>Choose Your Season 계절을 선택하세요</h3>
          <p>Your skin behaves differently in summer and winter. Choose a season for tailored questions!</p>
          <div className="season-cards">
            <button className="season-card" onClick={() => selectSeason('summer')}>
              <span className="season-icon">☀️</span>
              <span className="season-name">Summer 여름</span>
            </button>
            <button className="season-card" onClick={() => selectSeason('winter')}>
              <span className="season-icon">❄️</span>
              <span className="season-name">Winter 겨울</span>
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Quiz Start
  if (screen === 'start') {
    const icon = season === 'summer' ? '☀️' : '❄️'
    const title = season === 'summer' ? 'Summer Skin Quiz' : 'Winter Skin Quiz'
    const subtitle = season === 'summer' ? '여름 피부 퀴즈' : '겨울 피부 퀴즈'

    return (
      <section className="tab-panel" id="quiz">
        <div className="quiz-start-card">
          <span className="quiz-start-icon">{icon}</span>
          <h3>{title}</h3>
          <p className="quiz-start-subtitle">{subtitle}</p>
          <p>Answer {questions.length} questions to discover your skin type with personalized K-Beauty recommendations.</p>
          <button className="primary-btn" onClick={startQuiz}>Start Quiz 시작하기</button>
          <button className="secondary-btn" onClick={() => setScreen('seasonSelect')}>← Back 뒤로</button>
        </div>
      </section>
    )
  }

  // Questions
  if (screen === 'questions') {
    const q = questions[currentQ]
    const progress = ((currentQ + 1) / questions.length) * 100

    return (
      <section className="tab-panel" id="quiz">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: progress + '%' }} />
          </div>
          <span className="progress-text">{currentQ + 1} / {questions.length}</span>
        </div>
        <div className="question-container">
          <p className="question-text">{q.english}</p>
          <p className="question-text-korean">{q.korean}</p>
          <div className="options-list">
            {q.options.map((opt, i) => (
              <button key={i} className="option-btn" onClick={() => selectOption(i)}>
                <span className="english">{opt.english}</span>
                <span className="korean">{opt.korean}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Result
  const r = skinTypeResults[resultType]
  if (!r) return null

  const seasonBadge = season === 'summer' ? '☀️ Summer Result' : '❄️ Winter Result'
  const seasonTip = season === 'summer'
    ? '☀️ Summer tip: Use lightweight products and reapply sunscreen!'
    : '❄️ Winter tip: Layer hydrating products and use occlusive creams!'

  return (
    <section className="tab-panel" id="quiz">
      {showConfetti && <Confetti />}
      <div className="result-content animated">
        <div className="result-emoji">{r.emoji}</div>
        <h2 className="result-type">{r.english}</h2>
        <p className="result-type-korean">{r.korean}</p>
        <div className="season-badge">{seasonBadge}</div>

        <div className="result-description">
          <h4>About Your Skin</h4>
          <p>{r.description}</p>
          <div className="season-tip">{seasonTip}</div>
          <h4>Care Tips</h4>
          <ul>{r.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
        </div>

        <div className="recommended-products">
          <h4>🛒 Recommended K-Beauty Products</h4>
          <div className="product-card-list">
            {getRecommendations({
              skinType: resultType,
              categories: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen']
            })
              .filter((p, i, arr) => arr.findIndex(x => x.category === p.category) === i)
              .slice(0, 5)
              .map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

        <SaveResultBtn onSave={handleSave} />
        <button className="secondary-btn" onClick={retakeQuiz}>Retake Quiz 다시하기</button>
      </div>
    </section>
  )
}
