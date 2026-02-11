import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { deleteAllUserData } from '../../lib/db'
import MyResults from './MyResults'
import SkinProgress from './SkinProgress'
import ProductShelf from './ProductShelf'
import SkinDiary from './SkinDiary'
import MyRoutine from './MyRoutine'
import MyPageWelcome, { shouldShowMyPageWelcome } from './MyPageWelcome'

export default function MyPageTab({ showToast, onGoToSkinAnalyzer }) {
  const { user, logout } = useAuth()
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

  async function handleDeleteAll() {
    const keyword = t('DELETE', '삭제')
    const input = window.prompt(t(
      `This will permanently delete ALL your data (results, diary, photos, routines) and sign you out.\n\nType "${keyword}" to confirm:`,
      `모든 데이터(결과, 일지, 사진, 루틴)가 영구 삭제되고 로그아웃됩니다.\n\n확인하려면 "${keyword}"을(를) 입력하세요:`
    ))
    if (input !== keyword) {
      if (input !== null) showToast(t(`Type "${keyword}" exactly to delete.`, `"${keyword}"을(를) 정확히 입력해주세요.`))
      return
    }
    try {
      await deleteAllUserData(user.id)
      showToast(t('All data deleted.', '모든 데이터가 삭제되었습니다.'))
      await logout()
    } catch {
      showToast(t('Failed to delete data.', '데이터 삭제에 실패했습니다.'))
    }
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

      {section === 'results' && <MyResults userId={user.id} />}
      {section === 'progress' && <SkinProgress userId={user.id} showToast={showToast} onGoToSkinAnalyzer={onGoToSkinAnalyzer} />}
      {section === 'shelf' && <ProductShelf showToast={showToast} />}
      {section === 'diary' && <SkinDiary userId={user.id} showToast={showToast} />}
      {section === 'routine' && <MyRoutine userId={user.id} showToast={showToast} />}

      <div className="mypage-danger-zone">
        <button className="danger-btn" onClick={handleDeleteAll}>
          🗑️ {t('Delete All My Data', '모든 데이터 삭제')}
        </button>
      </div>

      {showWelcome && <MyPageWelcome onClose={() => setShowWelcome(false)} />}
    </section>
  )
}
