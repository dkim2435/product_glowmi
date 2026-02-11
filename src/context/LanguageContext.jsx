import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('glowmi_lang') || 'en')

  function changeLang(newLang) {
    setLang(newLang)
    localStorage.setItem('glowmi_lang', newLang)
  }

  const t = (en, ko) => lang === 'ko' ? ko : en

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLang must be used within LanguageProvider')
  return context
}
