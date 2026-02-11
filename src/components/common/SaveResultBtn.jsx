import { useAuth } from '../../context/AuthContext'

export default function SaveResultBtn({ onSave, label = 'Save My Result 결과 저장하기' }) {
  const { user } = useAuth()

  if (!user) return null

  return (
    <button className="save-result-btn" onClick={onSave}>
      💾 {label}
    </button>
  )
}
