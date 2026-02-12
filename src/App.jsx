import { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/layout/Header'
import TabNav from './components/layout/TabNav'
import Footer from './components/layout/Footer'
import Toast from './components/common/Toast'
import OnboardingModal, { shouldShowOnboarding } from './components/common/OnboardingModal'
import ReleaseNotesModal, { shouldShowReleaseNotes, seedVersionForNewUser } from './components/common/ReleaseNotesModal'
import AiBeautyTab from './components/ai/AiBeautyTab'
import ProductsTab from './components/products/ProductsTab'
import ProceduresTab from './components/procedures/ProceduresTab'
import WellnessTab from './components/wellness/WellnessTab'
import MyPageTab from './components/mypage/MyPageTab'

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
              {activeTab === 'ai' && <AiBeautyTab showToast={showToast} />}
              {activeTab === 'products' && <ProductsTab showToast={showToast} />}
              {activeTab === 'procedures' && <ProceduresTab />}
              {activeTab === 'wellness' && <WellnessTab onNavigate={navigateTo} />}
              {activeTab === 'mypage' && <MyPageTab showToast={showToast} onNavigate={navigateTo} />}
            </main>

            <Footer />

            {/* Help / Tutorial button */}
            <button className="help-fab" onClick={() => setShowOnboarding(true)} title="Tutorial">
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
