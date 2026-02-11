import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { deleteAllUserData } from '../../lib/db'
import SkinProgress from './SkinProgress'
import ProductShelf from './ProductShelf'
import SkinDiary from './SkinDiary'
import MyRoutine from './MyRoutine'

export default function MyPageTab({ showToast, onGoToSkinAnalyzer }) {
  const { user, logout } = useAuth()
  const [section, setSection] = useState('progress') // progress | shelf | diary | routine

  if (!user) {
    return (
      <section className="tab-panel" id="mypage">
        <div className="mypage-empty">
          <p>Please login to access My Page. 로그인 후 이용해주세요.</p>
        </div>
      </section>
    )
  }

  async function handleDeleteAll() {
    if (window.confirm('Are you sure you want to delete ALL your data? This cannot be undone.\n\n정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await deleteAllUserData(user.id)
        showToast('All data deleted. 모든 데이터가 삭제되었습니다.')
        await logout()
      } catch {
        showToast('Failed to delete data. 데이터 삭제에 실패했습니다.')
      }
    }
  }

  return (
    <section className="tab-panel" id="mypage">
      <div className="mypage-nav">
        {[
          { id: 'progress', emoji: '📈', label: 'Progress' },
          { id: 'shelf', emoji: '💄', label: 'My Shelf' },
          { id: 'diary', emoji: '📝', label: 'Diary' },
          { id: 'routine', emoji: '🧴', label: 'Routine' },
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

      {section === 'progress' && <SkinProgress userId={user.id} showToast={showToast} onGoToSkinAnalyzer={onGoToSkinAnalyzer} />}
      {section === 'shelf' && <ProductShelf showToast={showToast} />}
      {section === 'diary' && <SkinDiary userId={user.id} showToast={showToast} />}
      {section === 'routine' && <MyRoutine userId={user.id} showToast={showToast} />}

      <div className="mypage-danger-zone">
        <button className="danger-btn" onClick={handleDeleteAll}>
          🗑️ Delete All My Data 모든 데이터 삭제
        </button>
      </div>
    </section>
  )
}
