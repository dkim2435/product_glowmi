import { useEffect } from 'react'

const COLORS = ['#CF8BA9', '#A66A85', '#ff9500', '#00bcd4', '#4caf50', '#ffeb3b']

export default function Confetti() {
  useEffect(() => {
    const container = document.createElement('div')
    container.className = 'confetti-container'
    document.body.appendChild(container)

    for (let i = 0; i < 50; i++) {
      const c = document.createElement('div')
      c.className = 'confetti'
      c.style.left = Math.random() * 100 + '%'
      c.style.background = COLORS[Math.floor(Math.random() * COLORS.length)]
      c.style.animationDelay = Math.random() * 2 + 's'
      c.style.animationDuration = (Math.random() * 2 + 2) + 's'
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%'
      container.appendChild(c)
    }

    const timer = setTimeout(() => container.remove(), 4000)
    return () => { clearTimeout(timer); container.remove() }
  }, [])

  return null
}
