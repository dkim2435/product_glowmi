/**
 * PWA Icon Generator Script
 *
 * Generates PNG icons from the SVG source for PWA and app store use.
 *
 * Prerequisites:
 *   npm install sharp --save-dev
 *
 * Usage:
 *   node scripts/generate-icons.js
 *
 * This creates:
 *   - public/favicon-32x32.png
 *   - public/apple-touch-icon.png (180x180)
 *   - public/icon-192x192.png
 *   - public/icon-512x512.png
 *   - public/icon-maskable-192x192.png (with padding)
 *   - public/icon-maskable-512x512.png (with padding)
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

async function generateIcons() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.error('sharp is not installed. Run: npm install sharp --save-dev')
    console.log('')
    console.log('Alternatively, you can create PNG icons manually:')
    console.log('  1. Open public/favicon.svg in a browser')
    console.log('  2. Take screenshots at 32x32, 180x180, 192x192, and 512x512')
    console.log('  3. Save them as the filenames listed in public/manifest.json')
    process.exit(1)
  }

  // Create a Glowmi logo SVG with brand colors
  const logoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#8B7EC8"/>
          <stop offset="100%" stop-color="#6C5FA7"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="80" fill="url(#bg)"/>
      <text x="256" y="300" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="160" fill="white">G</text>
      <circle cx="380" cy="140" r="40" fill="#E8A0BF" opacity="0.9"/>
      <path d="M380 115 L385 130 L400 130 L388 140 L392 155 L380 147 L368 155 L372 140 L360 130 L375 130 Z" fill="white" opacity="0.9"/>
    </svg>
  `

  const maskableSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#8B7EC8"/>
          <stop offset="100%" stop-color="#6C5FA7"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)"/>
      <text x="256" y="310" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="180" fill="white">G</text>
      <circle cx="370" cy="150" r="35" fill="#E8A0BF" opacity="0.9"/>
    </svg>
  `

  const sizes = [
    { name: 'favicon-32x32.png', size: 32, svg: logoSvg },
    { name: 'apple-touch-icon.png', size: 180, svg: logoSvg },
    { name: 'icon-192x192.png', size: 192, svg: logoSvg },
    { name: 'icon-512x512.png', size: 512, svg: logoSvg },
    { name: 'icon-maskable-192x192.png', size: 192, svg: maskableSvg },
    { name: 'icon-maskable-512x512.png', size: 512, svg: maskableSvg },
  ]

  for (const { name, size, svg } of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(join(publicDir, name))
    console.log(`✓ ${name} (${size}x${size})`)
  }

  console.log('\nAll icons generated!')
}

generateIcons().catch(console.error)
