import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Virtual keyboard detection + auto-scroll focused input into view
if (window.visualViewport) {
  let wasKeyboardOpen = false
  let scrollTimer = null
  const updateVh = () => {
    const vv = window.visualViewport
    document.documentElement.style.setProperty('--vh', `${vv.height * 0.01}px`)
    const keyboardOpen = vv.height < window.innerHeight * 0.75
    document.documentElement.classList.toggle('keyboard-open', keyboardOpen)

    // Keyboard just opened — scroll focused element into view
    if (keyboardOpen && !wasKeyboardOpen) {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        const el = document.activeElement
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
    wasKeyboardOpen = keyboardOpen
  }
  window.visualViewport.addEventListener('resize', updateVh)
  updateVh()
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

// Load Userback widget after initial render
setTimeout(() => {
  import('@userback/widget').then(({ default: Userback }) => {
    Userback('A-MXzicq08vb2diWzj2mUQEFdQ5')
  })
}, 3000)
