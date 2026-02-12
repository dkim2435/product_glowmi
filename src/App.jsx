import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/layout/Header'
import TabNav from './components/layout/TabNav'
import Footer from './components/layout/Footer'
import Toast from './components/common/Toast'
import OnboardingModal, { shouldShowOnboarding } from './components/common/OnboardingModal'
import ReleaseNotesModal, { shouldShowReleaseNotes, seedVersionForNewUser } from './components/common/ReleaseNotesModal'
import WeatherTips from './components/common/WeatherTips'

const AiBeautyTab = lazy(() => import('./components/ai/AiBeautyTab'))
const ProductsTab = lazy(() => import('./components/products/ProductsTab'))
const ProceduresTab = lazy(() => import('./components/procedures/ProceduresTab'))
const WellnessTab = lazy(() => import('./components/wellness/WellnessTab'))
const MyPageTab = lazy(() => import('./components/mypage/MyPageTab'))

const LOADING_TIPS = [
  { en: 'Sunscreen is the #1 anti-aging product — apply daily, even on cloudy days!', kr: '자외선 차단제는 최고의 안티에이징 제품 — 흐린 날에도 매일 바르세요!' },
  { en: 'The Korean 10-step routine is flexible — adapt it to your skin\'s needs.', kr: '한국식 10단계 루틴은 유연해요 — 내 피부에 맞게 조정하세요.' },
  { en: 'Double cleansing removes sunscreen and makeup more effectively than single cleansing.', kr: '이중 세안은 단일 세안보다 자외선 차단제와 메이크업을 더 효과적으로 제거해요.' },
  { en: 'Hydration from inside out — drinking enough water improves skin texture.', kr: '안에서 밖으로 수분 보충 — 충분한 수분 섭취가 피부결을 개선해요.' },
  { en: 'Niacinamide and Vitamin C are powerhouse ingredients for brightening.', kr: '나이아신아마이드와 비타민 C는 브라이트닝의 핵심 성분이에요.' },
  { en: 'Apply skincare from thinnest to thickest consistency for best absorption.', kr: '스킨케어는 묽은 것부터 걸쭉한 순서로 발라야 흡수가 잘 돼요.' },
]

function TabLoadingFallback() {
  const tip = useMemo(() => LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)], [])
  return (
    <div className="tab-loading">
      <span className="tab-loading-spinner" />
      <p className="tab-loading-tip">{tip.en}</p>
      <p className="tab-loading-tip tab-loading-tip-kr">{tip.kr}</p>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('ai')
  const [toast, setToast] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showReleaseNotes, setShowReleaseNotes] = useState(false)

  useEffect(() => {
    if (shouldShowOnboarding()) {
      setShowOnboarding(true)
      seedVersionForNewUser()
    } else if (shouldShowReleaseNotes()) {
      setShowReleaseNotes(true)
    }
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function navigateTo(tab, toolId) {
    setActiveTab(tab)
    if (toolId) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('glowmi-select-tool', { detail: toolId }))
      }, 100)
    }
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="app-container">
            <Header onLogoClick={() => setActiveTab('ai')} />
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="main-content">
              <WeatherTips />
              <Suspense fallback={<TabLoadingFallback />}>
                {activeTab === 'ai' && <AiBeautyTab showToast={showToast} />}
                {activeTab === 'products' && <ProductsTab showToast={showToast} />}
                {activeTab === 'procedures' && <ProceduresTab />}
                {activeTab === 'wellness' && <WellnessTab onNavigate={navigateTo} />}
                {activeTab === 'mypage' && <MyPageTab showToast={showToast} onNavigate={navigateTo} />}
              </Suspense>
            </main>

            <Footer />

            {/* Help / Tutorial button */}
            <button className="help-fab" onClick={() => setShowOnboarding(true)} title="Tutorial / 튜토리얼">
              ?
            </button>

            {toast && <Toast message={toast} />}
            {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
            {showReleaseNotes && <ReleaseNotesModal onClose={() => setShowReleaseNotes(false)} />}
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
