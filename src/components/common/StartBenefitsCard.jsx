import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { Save, LineChart, Bot } from 'lucide-react'

/**
 * Shows sign-up benefits for non-logged-in users on analysis start screens.
 *
 * @param {Array<{icon, en, ko}>} benefits - List of benefits to display
 */
const DEFAULT_BENEFITS = [
  { icon: Save, en: 'Save results', ko: '결과 저장' },
  { icon: LineChart, en: 'Track progress', ko: '변화 추적' },
  { icon: Bot, en: 'AI Chat', ko: 'AI 상담' },
]

export default function StartBenefitsCard({ benefits = DEFAULT_BENEFITS }) {
  const { user } = useAuth()
  const { t } = useLang()

  if (user) return null

  return (
    <div className="start-benefits-card">
      <p className="start-benefits-title">{t('100% Free — Sign up to unlock:', '완전 무료 — 가입하면:')}</p>
      <div className="start-benefits-list">
        {benefits.map((b, i) => (
          <span key={i}>{b.icon ? <b.icon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} /> : b.emoji ? (b.emoji + ' ') : null}{t(b.en, b.ko)}</span>
        ))}
      </div>
    </div>
  )
}
