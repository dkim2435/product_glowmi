import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'fs'

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="50%" style="stop-color:#16213e"/>
      <stop offset="100%" style="stop-color:#0f3460"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e94560"/>
      <stop offset="100%" style="stop-color:#ff6b6b"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="950" cy="120" r="200" fill="#e94560" opacity="0.06"/>
  <circle cx="1050" cy="400" r="150" fill="#ff6b6b" opacity="0.05"/>
  <circle cx="150" cy="500" r="180" fill="#e94560" opacity="0.04"/>

  <!-- Accent bar -->
  <rect x="100" y="200" width="60" height="4" rx="2" fill="url(#accent)"/>

  <!-- Logo -->
  <text x="100" y="280" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="#ffffff" letter-spacing="-1">
    ✨ Glowmi
  </text>

  <!-- Tagline -->
  <text x="100" y="340" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#a0aec0">
    AI-Driven K-Beauty Skin Analysis Platform
  </text>

  <!-- Feature pills -->
  <rect x="100" y="400" width="200" height="44" rx="22" fill="#e94560" opacity="0.15"/>
  <text x="200" y="428" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#ff6b6b" text-anchor="middle">
    🔬 Skin Analysis
  </text>

  <rect x="320" y="400" width="210" height="44" rx="22" fill="#e94560" opacity="0.15"/>
  <text x="425" y="428" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#ff6b6b" text-anchor="middle">
    🎨 Personal Color
  </text>

  <rect x="550" y="400" width="190" height="44" rx="22" fill="#e94560" opacity="0.15"/>
  <text x="645" y="428" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#ff6b6b" text-anchor="middle">
    🛒 K-Beauty
  </text>

  <rect x="760" y="400" width="200" height="44" rx="22" fill="#e94560" opacity="0.15"/>
  <text x="860" y="428" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#ff6b6b" text-anchor="middle">
    🏥 Clinic Finder
  </text>

  <!-- Domain -->
  <text x="100" y="560" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#4a5568">
    glowmi.org
  </text>
</svg>
`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
})

const pngData = resvg.render()
const pngBuffer = pngData.asPng()

writeFileSync('public/og-image.png', pngBuffer)
console.log('OG image generated: public/og-image.png (' + (pngBuffer.length / 1024).toFixed(1) + ' KB)')
