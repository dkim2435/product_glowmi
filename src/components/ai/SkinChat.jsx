import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { loadAnalysisResults } from '../../lib/db'
import { chatSkincare } from '../../lib/gemini'
import { searchRelevantContext, formatRAGContext } from '../../lib/rag'

const SUGGESTED_QUESTIONS = [
  { en: 'What ingredients suit my skin?', kr: '내 피부에 맞는 성분은?' },
  { en: 'How should I build my routine?', kr: '루틴을 어떻게 짜야 해?' },
  { en: 'Is retinol safe for sensitive skin?', kr: '레티놀 민감성 피부에 괜찮아?' },
  { en: 'What SPF should I use daily?', kr: '매일 선크림 어떤거?' }
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

      // RAG: 관련 제품/성분 검색 (실패해도 기존 대화 유지)
      let ragContext = ''
      try {
        const results = await searchRelevantContext(text.trim())
        ragContext = formatRAGContext(results)
      } catch (ragErr) {
        console.warn('RAG search skipped:', ragErr.message)
      }

      const response = await chatSkincare(history, userContext || 'No skin data available.', ragContext || undefined)
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }])
    } catch (e) {
      console.error('Chat error:', e)
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: t('Sorry, I had trouble responding. Please try again.', '죄송합니다, 응답에 문제가 있었습니다. 다시 시도해주세요.') }], isError: true }])
    }
    setLoading(false)
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
      <div className="chat-login-prompt">
        <span className="chat-login-icon">💬</span>
        <p>{t('Sign up to chat with your AI skincare advisor!', '가입하고 AI 스킨케어 상담을 받아보세요!')}</p>
        <button className="primary-btn" onClick={loginWithGoogle} style={{ marginTop: '0.8rem' }}>
          {t('Sign up / Login', '가입 / 로그인')}
        </button>
      </div>
    )
  }

  return (
    <div className="skin-chat" ref={chatRef}>
      <div className="chat-header">
        <h4>{'💬 ' + t('AI Skincare Chat', 'AI 스킨케어 상담')}</h4>
        {userContext && userContext !== 'No skin data available yet.' && (
          <span className="chat-context-badge">{t('Using your skin data', '피부 데이터 활용 중')}</span>
        )}
      </div>

      <div className="chat-messages">
        <div className="chat-bubble ai">
          {t('Hi! Ask me anything about skincare. I can give personalized advice based on your skin analysis.', '안녕하세요! 스킨케어에 대해 무엇이든 물어보세요. 피부 분석 결과를 바탕으로 맞춤 조언을 드릴게요.')}
        </div>

        {messages.length === 0 && (
          <div className="chat-suggestions">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button key={i} className="chat-suggestion-chip" onClick={() => sendMessage(t(q.en, q.kr))}>
                {t(q.en, q.kr)}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={'chat-bubble ' + (msg.role === 'user' ? 'user' : 'ai')}>
            {msg.parts[0].text}
          </div>
        ))}

        {loading && (
          <div className="chat-bubble ai chat-typing">
            <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
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
      </div>
    </div>
  )
}
