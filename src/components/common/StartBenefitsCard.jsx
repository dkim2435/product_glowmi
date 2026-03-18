import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'

/**
 * Shows sign-up benefits for non-logged-in users on analysis start screens.
 *
 * @param {Array<{emoji, en, ko}>} benefits - List of benefits to display
 */
const DEFAULT_BENEFITS = [
  { emoji: '💾', en: 'Save results', ko: '결과 저장' },
  { emoji: '📈', en: 'Track progress', ko: '변화 추적' },
  { emoji: '🤖', en: 'AI Chat', ko: 'AI 상담' },
]

export default function StartBenefitsCard({ benefits = DEFAULT_BENEFITS }) {
  const { user } = useAuth()
  const { t } = useLang()

  if (user) return null

  return (
    <div className="start-benefits-card">
      <p className="start-benefits-title">{'🆓 ' + t('100% Free — Sign up to unlock:', '완전 무료 — 가입하면:')}</p>
      <div className="start-benefits-list">
        {benefits.map((b, i) => (
          <span key={i}>{b.emoji} {t(b.en, b.ko)}</span>
        ))}
      </div>
    </div>
  )
}
