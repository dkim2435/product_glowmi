import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Load Userback widget after initial render
setTimeout(() => {
  import('@userback/widget').then(({ default: Userback }) => {
    Userback('A-MXzicq08vb2diWzj2mUQEFdQ5')
  })
}, 3000)
