import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { loadAnalysisResults } from '../../lib/db'
import { chatSkincare } from '../../lib/gemini'
import { searchRelevantContext, formatRAGContext } from '../../lib/rag'
import { runAgentChat } from '../../lib/agent'

/** Render markdown links [text](url) as clickable <a> tags */
function renderChatText(text) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (match) {
      return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer nofollow" className="chat-link">{match[1]}</a>
    }
    return part
  })
}

const SUGGESTED_QUESTIONS = [
  { en: 'Recommend a sunscreen for my skin', kr: '내 피부에 맞는 선크림 추천해줘', emoji: '☀️' },
  { en: 'Is my current routine good enough?', kr: '내 루틴 괜찮아?', emoji: '🧴' },
  { en: 'Best products for my skin concerns?', kr: '내 피부 고민에 맞는 제품은?', emoji: '🛍️' },
  { en: 'What skincare fits today\'s weather?', kr: '오늘 날씨에 맞는 스킨케어는?', emoji: '🌤️' },
  { en: 'How to reduce dark spots?', kr: '다크스팟 줄이는 방법?', emoji: '✨' },
  { en: 'Can I use retinol with niacinamide?', kr: '레티놀이랑 나이아신아마이드 같이 써도 돼?', emoji: '🧪' },
]

export default function SkinChat({ showToast }) {
  const { user, loginWithGoogle } = useAuth()
  const { t } = useLang()
  const CHAT_STORAGE_KEY = 'glowmi_chat_history'
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [toolStatus, setToolStatus] = useState(null)
  const [userContext, setUserContext] = useState(null)

  useEffect(() => {
    try { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages)) } catch {}
  }, [messages])
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatRef = useRef(null)

  useEffect(() => {
    if (user) {
      loadAnalysisResults(user.id).then(analysis => {
        if (analysis) {
          const parts = []
          if (analysis.skin_redness) {
            parts.push(`Skin scores - Redness: ${analysis.skin_redness}, Oiliness: ${analysis.skin_oiliness}, Dryness: ${analysis.skin_dryness}, Dark Spots: ${analysis.skin_dark_spots}, Texture: ${analysis.skin_texture}, Overall: ${analysis.skin_overall_score || '?'}`)
          }
          if (analysis.pc_type) parts.push(`Personal color: ${analysis.pc_type}`)
          if (analysis.quiz_type) parts.push(`Skin type: ${analysis.quiz_type}`)
          setUserContext(parts.length > 0 ? parts.join('\n') : 'No skin data available yet.')
        } else {
          setUserContext('No skin data available yet.')
        }
      }).catch(() => setUserContext('No skin data available yet.'))
    }
  }, [user])

  useEffect(() => {
    // Scroll inside chat-messages only, not the whole page
    const el = chatEndRef.current
    if (el) el.parentElement.scrollTop = el.parentElement.scrollHeight
  }, [messages])

  async function sendMessage(text) {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', parts: [{ text: text.trim() }] }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = newMessages.filter(m => !m.isError).slice(-10)

      // Try agentic approach first (AI decides which tools to call)
      let responseText
      let responseProducts = []
      try {
        const agentResult = await runAgentChat(history, user?.id, userContext, {
          onToolCall: (label) => setToolStatus(t(label.en, label.kr))
        })
        responseText = agentResult.text
        responseProducts = agentResult.products || []
      } catch (agentErr) {
        console.warn('Agent mode failed, falling back to RAG:', agentErr.message)
        setToolStatus(null)
        // Fallback: existing RAG pipeline
        let ragContext = ''
        try {
          const results = await searchRelevantContext(text.trim())
          ragContext = formatRAGContext(results)
        } catch (ragErr) {
          console.warn('RAG search skipped:', ragErr.message)
        }
        responseText = await chatSkincare(history, userContext || 'No skin data available.', ragContext || undefined)
      }

      setToolStatus(null)
      const aiMsg = { role: 'model', parts: [{ text: responseText }] }
      if (responseProducts.length > 0) aiMsg.products = responseProducts
      setMessages(prev => [...prev, aiMsg])
    } catch (e) {
      console.error('Chat error:', e)
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: t('Sorry, I had trouble responding. Please try again.', '죄송합니다, 응답에 문제가 있었습니다. 다시 시도해주세요.') }], isError: true }])
    }
    setLoading(false)
    setToolStatus(null)
  }

  function handleInputFocus() {
    // iOS keyboard takes ~400ms to animate. Scroll input into view after it settles.
    const scrollToInput = () => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    }
    setTimeout(scrollToInput, 400)
    setTimeout(scrollToInput, 700)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  if (!user) {
    return (
      <div className="chat-login-prompt chat-login-enhanced">
        <div className="chat-promo-header">
          <span className="chat-promo-icon">🤖</span>
          <h3>{t('AI Skincare Advisor', 'AI 스킨케어 상담사')}</h3>
          <p className="chat-promo-desc">
            {t(
              'Get personalized skincare advice based on YOUR skin analysis results — powered by AI.',
              'AI가 내 피부 분석 결과를 바탕으로 맞춤 스킨케어 조언을 해줘요.'
            )}
          </p>
        </div>
        <div className="chat-promo-examples">
          <p className="chat-promo-label">{t('Try asking:', '이런 질문을 해보세요:')}</p>
          {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
            <div key={i} className="chat-promo-example">
              <span>{q.emoji}</span> {t(q.en, q.kr)}
            </div>
          ))}
        </div>
        <button className="primary-btn signup-cta-btn" onClick={loginWithGoogle}>
          {t('Start Free AI Chat', '무료 AI 상담 시작하기')}
        </button>
        <p className="signup-cta-note">{t('Free with Google sign-up — no credit card needed.', 'Google 가입으로 무료 — 카드 정보 불필요.')}</p>
      </div>
    )
  }

  return (
    <div className="skin-chat" ref={chatRef}>
      <div className="chat-header">
        <h4>{'🤖 ' + t('AI Skincare Advisor', 'AI 스킨케어 상담사')}</h4>
        {userContext && userContext !== 'No skin data available yet.' ? (
          <span className="chat-context-badge chat-context-active">{t('Personalized to YOUR skin', '내 피부 맞춤 답변 중')}</span>
        ) : (
          <span className="chat-context-badge chat-context-hint">{t('Analyze skin first for personalized advice', '피부 분석하면 맞춤 답변 가능!')}</span>
        )}
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <>
            <div className="chat-welcome-card">
              <div className="chat-welcome-title">{t('Hi! I\'m your AI skincare advisor.', '안녕하세요! AI 스킨케어 상담사예요.')}</div>
              <div className="chat-welcome-desc">
                {userContext && userContext !== 'No skin data available yet.'
                  ? t('I\'m using your skin analysis to give personalized answers!', '피부 분석 결과를 활용해서 맞춤 답변을 드릴게요!')
                  : t('Ask me anything about skincare, ingredients, or routines.', '스킨케어, 성분, 루틴에 대해 뭐든 물어보세요.')
                }
              </div>
              {(!userContext || userContext === 'No skin data available yet.') && (
                <div className="chat-best-result-tip">
                  {t(
                    '💡 Tip: For the best results, try Skin / Color / Face analysis first — the AI will personalize answers to YOUR skin!',
                    '💡 팁: 피부/컬러/얼굴형 분석을 먼저 하면 AI가 내 피부에 딱 맞는 답변을 해줘요!'
                  )}
                </div>
              )}
            </div>
            <div className="chat-suggestions">
              <div className="chat-suggestions-label">{t('Popular questions:', '자주 묻는 질문:')}</div>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} className="chat-suggestion-chip" onClick={() => sendMessage(t(q.en, q.kr))}>
                  {q.emoji} {t(q.en, q.kr)}
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={'chat-bubble ' + (msg.role === 'user' ? 'user' : 'ai')}>
            {msg.role === 'model' ? renderChatText(msg.parts[0].text) : msg.parts[0].text}
            {msg.products?.length > 0 && (
              <div className="chat-product-cards">
                <div className="chat-product-label">{t('🛒 Related Products', '🛒 관련 제품')}</div>
                {msg.products.map((p, j) => (
                  <a key={j} href={p.amazonUrl} target="_blank" rel="noopener noreferrer nofollow" className="chat-product-card">
                    <span className="chat-product-name">{p.name}</span>
                    {p.nameKr && <span className="chat-product-name-kr">{p.nameKr}</span>}
                    <span className="chat-product-brand">{p.brand}</span>
                    <span className="chat-product-buy">{t('View on Amazon →', '아마존에서 보기 →')}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-bubble ai chat-typing">
            {toolStatus
              ? <span className="tool-status">{toolStatus}</span>
              : <><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></>
            }
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder={t('Ask about skincare...', '스킨케어에 대해 질문하세요...')}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          disabled={loading}
        />
        <button className="chat-send-btn" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
          {t('Send', '전송')}
        </button>
        {messages.length > 0 && (
          <button
            className="chat-clear-btn"
            onClick={() => { setMessages([]); localStorage.removeItem(CHAT_STORAGE_KEY) }}
            disabled={loading}
            aria-label={t('Clear chat', '대화 지우기')}
          >
            {t('Clear', '지우기')}
          </button>
        )}
      </div>
    </div>
  )
}
