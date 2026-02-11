import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import MyResults from './MyResults'
import SkinProgress from './SkinProgress'
import ProductShelf from './ProductShelf'
import SkinDiary from './SkinDiary'
import MyRoutine from './MyRoutine'
import MyPageWelcome, { shouldShowMyPageWelcome } from './MyPageWelcome'

export default function MyPageTab({ showToast, onNavigate }) {
  const { user } = useAuth()
  const { t } = useLang()
  const [section, setSection] = useState('results') // results | progress | shelf | diary | routine
  const [showWelcome, setShowWelcome] = useState(() => shouldShowMyPageWelcome())

  if (!user) {
    return (
      <section className="tab-panel" id="mypage">
        <div className="mypage-empty">
          <p>{t('Please login to access My Page.', '로그인 후 이용해주세요.')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="tab-panel" id="mypage">
      <div className="mypage-nav">
        {[
          { id: 'results', emoji: '🏆', label: t('Results', '결과') },
          { id: 'progress', emoji: '📈', label: t('Progress', '진행현황') },
          { id: 'shelf', emoji: '💄', label: t('My Shelf', '화장대') },
          { id: 'diary', emoji: '📝', label: t('Diary', '일지') },
          { id: 'routine', emoji: '🧴', label: t('Routine', '루틴') },
        ].map(s => (
          <button
            key={s.id}
            className={'mypage-nav-btn' + (section === s.id ? ' active' : '')}
            onClick={() => setSection(s.id)}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {section === 'results' && <MyResults userId={user.id} onNavigate={onNavigate} />}
      {section === 'progress' && <SkinProgress userId={user.id} showToast={showToast} onGoToSkinAnalyzer={() => onNavigate('ai', 'skinAnalyzer')} />}
      {section === 'shelf' && <ProductShelf showToast={showToast} />}
      {section === 'diary' && <SkinDiary userId={user.id} showToast={showToast} />}
      {section === 'routine' && <MyRoutine userId={user.id} showToast={showToast} />}

      {showWelcome && <MyPageWelcome onClose={() => setShowWelcome(false)} />}
    </section>
  )
}
