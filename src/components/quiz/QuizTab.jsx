import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { saveQuizResult } from '../../lib/db'
import { summerQuizQuestions, winterQuizQuestions, skinTypeResults } from '../../data/quiz'
import { getRecommendations } from '../../data/products'
import ProductCard from '../common/ProductCard'
import ShareButtons from '../common/ShareButtons'
import SaveResultBtn from '../common/SaveResultBtn'
import Confetti from '../common/Confetti'

export default function QuizTab({ showToast }) {
  const { user } = useAuth()
  const { t } = useLang()
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
      showToast(t('Quiz result saved!', '퀴즈 결과가 저장되었습니다!'))
    } catch {
      showToast(t('Failed to save. Please try again.', '저장에 실패했습니다.'))
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
          <h3>{t('Choose Your Season', '계절을 선택하세요')}</h3>
          <p>{t(
            'Your skin behaves differently in summer and winter. Choose a season for tailored questions!',
            '여름과 겨울에 피부가 다르게 반응합니다. 맞춤 질문을 위해 계절을 선택하세요!'
          )}</p>
          <div className="season-cards">
            <button className="season-card" onClick={() => selectSeason('summer')}>
              <span className="season-icon">☀️</span>
              <span className="season-name">{t('Summer', '여름')}</span>
            </button>
            <button className="season-card" onClick={() => selectSeason('winter')}>
              <span className="season-icon">❄️</span>
              <span className="season-name">{t('Winter', '겨울')}</span>
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Quiz Start
  if (screen === 'start') {
    const icon = season === 'summer' ? '☀️' : '❄️'
    const title = season === 'summer'
      ? t('Summer Skin Quiz', '여름 피부 퀴즈')
      : t('Winter Skin Quiz', '겨울 피부 퀴즈')

    return (
      <section className="tab-panel" id="quiz">
        <div className="quiz-start-card">
          <span className="quiz-start-icon">{icon}</span>
          <h3>{title}</h3>
          <p>{t(
            `Answer ${questions.length} questions to discover your skin type with personalized K-Beauty recommendations.`,
            `${questions.length}개의 질문에 답하고 맞춤 K-뷰티 추천과 함께 피부 타입을 알아보세요.`
          )}</p>
          <button className="primary-btn" onClick={startQuiz}>{t('Start Quiz', '시작하기')}</button>
          <button className="secondary-btn" onClick={() => setScreen('seasonSelect')}>{t('← Back', '← 뒤로')}</button>
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
          <p className="question-text">{t(q.english, q.korean)}</p>
          <div className="options-list">
            {q.options.map((opt, i) => (
              <button key={i} className="option-btn" onClick={() => selectOption(i)}>
                <span>{t(opt.english, opt.korean)}</span>
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

  const seasonBadge = season === 'summer'
    ? t('☀️ Summer Result', '☀️ 여름 결과')
    : t('❄️ Winter Result', '❄️ 겨울 결과')
  const seasonTip = season === 'summer'
    ? t('☀️ Summer tip: Use lightweight products and reapply sunscreen!', '☀️ 여름 팁: 가벼운 제품을 사용하고 자외선 차단제를 덧발라주세요!')
    : t('❄️ Winter tip: Layer hydrating products and use occlusive creams!', '❄️ 겨울 팁: 수분 제품을 겹겹이 바르고 밀폐 크림을 사용하세요!')

  return (
    <section className="tab-panel" id="quiz">
      {showConfetti && <Confetti />}
      <div className="result-content animated">
        <div className="result-emoji">{r.emoji}</div>
        <h2 className="result-type">{t(r.english, r.korean)}</h2>
        <div className="season-badge">{seasonBadge}</div>

        <div className="result-description">
          <h4>{t('About Your Skin', '피부 타입 소개')}</h4>
          <p>{r.description}</p>
          <div className="season-tip">{seasonTip}</div>
          <h4>{t('Care Tips', '관리 팁')}</h4>
          <ul>{r.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
        </div>

        <div className="recommended-products">
          <h4>{t('🛒 Recommended K-Beauty Products', '🛒 추천 K-뷰티 제품')}</h4>
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
        <button className="secondary-btn" onClick={retakeQuiz}>{t('Retake Quiz', '다시하기')}</button>
      </div>
    </section>
  )
}
