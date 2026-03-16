import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import MyResults from './MyResults'
import SkinProgress from './SkinProgress'
import SkinDiary from './SkinDiary'
import MyRoutine from './MyRoutine'
import SkinChat from '../ai/SkinChat'
import AnalysisHistory from './AnalysisHistory'
import MyPageWelcome, { shouldShowMyPageWelcome } from './MyPageWelcome'

export default function MyPageTab({ showToast, onNavigate }) {
  const { user, loginWithGoogle } = useAuth()
  const { t } = useLang()
  const [section, setSection] = useState('results') // results | progress | diary | routine | skinChat
  const [showWelcome, setShowWelcome] = useState(() => shouldShowMyPageWelcome())

  if (!user) {
    return (
      <section className="tab-panel" id="mypage">
        <div className="mypage-signup-cta">
          <div className="signup-cta-icon">🙋</div>
          <h3>{t('Your Beauty Hub', '나만의 뷰티 허브')}</h3>
          <p className="signup-cta-desc">{t('Sign up free to unlock all features:', '무료 가입하고 모든 기능을 이용하세요:')}</p>
          <div className="signup-cta-features">
            <div className="signup-cta-feature signup-cta-feature-highlight">🤖 {t('AI Skincare Chat — personalized to YOUR skin', 'AI 스킨케어 상담 — 내 피부 맞춤 답변')}</div>
            <div className="signup-cta-feature">🏆 {t('Save AI analysis results', 'AI 분석 결과 저장')}</div>
            <div className="signup-cta-feature">📈 {t('Track skin changes over time', '피부 변화 추적')}</div>
            <div className="signup-cta-feature">📝 {t('Write daily skin diary', '매일 피부 일지 기록')}</div>
            <div className="signup-cta-feature">🧴 {t('Build your AM/PM routine', 'AM/PM 루틴 관리')}</div>
          </div>
          <button className="primary-btn signup-cta-btn" onClick={loginWithGoogle}>
            {t('Sign Up Free with Google', 'Google로 무료 가입')}
          </button>
          <p className="signup-cta-note">{t('Already have an account? Same button to log in.', '이미 계정이 있나요? 같은 버튼으로 로그인하세요.')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="tab-panel" id="mypage">
      <div className="mypage-nav">
        {[
          { id: 'results', emoji: '🏆', label: t('Results', '결과') },
          { id: 'progress', emoji: '📈', label: t('Skin Progress', '피부현황') },
          { id: 'diary', emoji: '📝', label: t('Diary', '일지') },
          { id: 'routine', emoji: '🧴', label: t('Routine', '루틴') },
          { id: 'history', emoji: '📊', label: t('Analysis Log', '분석기록') },
          { id: 'skinChat', emoji: '🤖', label: t('AI Chat', 'AI 상담'), highlight: true },
        ].map(s => (
          <button
            key={s.id}
            className={'mypage-nav-btn' + (section === s.id ? ' active' : '') + (s.highlight ? ' highlight' : '')}
            onClick={() => setSection(s.id)}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {section === 'results' && <MyResults userId={user.id} onNavigate={onNavigate} showToast={showToast} />}
      {section === 'progress' && <SkinProgress userId={user.id} showToast={showToast} onGoToSkinAnalyzer={() => onNavigate('ai', 'skinAnalyzer')} />}
      {section === 'diary' && <SkinDiary userId={user.id} showToast={showToast} />}
      {section === 'routine' && <MyRoutine userId={user.id} showToast={showToast} />}
      {section === 'history' && <AnalysisHistory showToast={showToast} />}
      {section === 'skinChat' && <SkinChat showToast={showToast} />}

      {showWelcome && <MyPageWelcome onClose={() => setShowWelcome(false)} />}
    </section>
  )
}
