import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { deleteAllUserData } from '../../lib/db'
import MyResults from './MyResults'
import SkinDiary from './SkinDiary'
import MyRoutine from './MyRoutine'

export default function MyPageTab({ showToast }) {
  const { user, logout } = useAuth()
  const [section, setSection] = useState('results') // results | diary | routine

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
        {['results', 'diary', 'routine'].map(s => (
          <button
            key={s}
            className={'mypage-nav-btn' + (section === s ? ' active' : '')}
            onClick={() => setSection(s)}
          >
            {s === 'results' && '📊 My Results'}
            {s === 'diary' && '📝 Skin Diary'}
            {s === 'routine' && '🧴 My Routine'}
          </button>
        ))}
      </div>

      {section === 'results' && <MyResults userId={user.id} showToast={showToast} />}
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
