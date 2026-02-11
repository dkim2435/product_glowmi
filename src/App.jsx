import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import Header from './components/layout/Header'
import TabNav from './components/layout/TabNav'
import Footer from './components/layout/Footer'
import Toast from './components/common/Toast'
import AiBeautyTab from './components/ai/AiBeautyTab'
import QuizTab from './components/quiz/QuizTab'
import ProductsTab from './components/products/ProductsTab'
import ProceduresTab from './components/procedures/ProceduresTab'
import WellnessTab from './components/wellness/WellnessTab'
import MyPageTab from './components/mypage/MyPageTab'

export default function App() {
  const [activeTab, setActiveTab] = useState('ai')
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="main-content">
          {activeTab === 'ai' && <AiBeautyTab showToast={showToast} />}
          {activeTab === 'quiz' && <QuizTab showToast={showToast} />}
          {activeTab === 'products' && <ProductsTab showToast={showToast} />}
          {activeTab === 'procedures' && <ProceduresTab />}
          {activeTab === 'wellness' && <WellnessTab />}
          {activeTab === 'mypage' && <MyPageTab showToast={showToast} />}
        </main>

        <Footer />
        {toast && <Toast message={toast} />}
      </div>
    </AuthProvider>
  )
}
