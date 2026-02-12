#!/usr/bin/env node

/**
 * Glowmi Pre-Push Checklist
 * Run: npm run pre-push
 *
 * Automatically verifies all items from CLAUDE.md checklist:
 * 1. Version sync (3 places)
 * 2. Build success
 * 3. No hardcoded API keys
 * 4. JSON-LD validity
 * 5. robots.txt AI bot rules
 * 6. llms.txt sync
 * 7. UX guidance text (한/영 empty states, helper text)
 */

import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

let passed = 0
let failed = 0
let warnings = 0

function read(relPath) {
  const full = resolve(ROOT, relPath)
  if (!existsSync(full)) return null
  return readFileSync(full, 'utf-8')
}

function pass(msg) {
  console.log(`  \x1b[32m✓\x1b[0m ${msg}`)
  passed++
}

function fail(msg) {
  console.log(`  \x1b[31m✗\x1b[0m ${msg}`)
  failed++
}

function warn(msg) {
  console.log(`  \x1b[33m⚠\x1b[0m ${msg}`)
  warnings++
}

function section(title) {
  console.log(`\n\x1b[1m[${title}]\x1b[0m`)
}

// ─── 1. Version Sync ────────────────────────────────────────────

section('1. Version Sync (3곳 동기화)')

const pkg = JSON.parse(read('package.json'))
const pkgVersion = pkg.version

const headerSrc = read('src/components/layout/Header.jsx')
const headerMatch = headerSrc?.match(/v(\d+\.\d+\.\d+)/)
const headerVersion = headerMatch ? headerMatch[1] : null

const releaseSrc = read('src/components/common/ReleaseNotesModal.jsx')
const releaseMatch = releaseSrc?.match(/APP_VERSION\s*=\s*'(\d+\.\d+\.\d+)'/)
const releaseVersion = releaseMatch ? releaseMatch[1] : null

if (pkgVersion && pkgVersion === headerVersion && pkgVersion === releaseVersion) {
  pass(`All 3 files: v${pkgVersion}`)
} else {
  fail(`Version mismatch! package.json=${pkgVersion}, Header=${headerVersion}, ReleaseNotes=${releaseVersion}`)
}

// ─── 2. Build ───────────────────────────────────────────────────

section('2. Build (npm run build)')

try {
  execSync('npm run build', { cwd: ROOT, stdio: 'pipe', timeout: 120_000 })
  pass('Build succeeded')
} catch (e) {
  const output = e.stdout?.toString() || e.stderr?.toString() || ''
  fail('Build failed!')
  console.log(`    ${output.slice(0, 500)}`)
}

// ─── 3. No Hardcoded API Keys ───────────────────────────────────

section('3. Hardcoded API Keys')

const dangerPatterns = [
  /VITE_\w+\s*=\s*['"][A-Za-z0-9_-]{20,}['"]/,
  /AIzaSy[A-Za-z0-9_-]{33}/,
  /sk-[A-Za-z0-9]{20,}/,
  /eyJ[A-Za-z0-9_-]{50,}/,
]

const srcFiles = execSync('git ls-files -- "src/**/*.js" "src/**/*.jsx"', { cwd: ROOT, encoding: 'utf-8' })
  .trim().split('\n').filter(Boolean)

let keyFound = false
for (const f of srcFiles) {
  const content = read(f)
  if (!content) continue
  for (const pat of dangerPatterns) {
    if (pat.test(content)) {
      fail(`Possible API key in ${f}`)
      keyFound = true
    }
  }
}
if (!keyFound) pass('No hardcoded API keys found in src/')

// ─── 4. JSON-LD Validity ────────────────────────────────────────

section('4. JSON-LD Structured Data')

const indexHtml = read('index.html')
const ldBlocks = indexHtml?.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []

if (ldBlocks.length === 0) {
  fail('No JSON-LD blocks found in index.html')
} else {
  let allValid = true
  for (let i = 0; i < ldBlocks.length; i++) {
    const json = ldBlocks[i].replace(/<\/?script[^>]*>/g, '').trim()
    try {
      const obj = JSON.parse(json)
      const type = obj['@type'] || 'unknown'
      pass(`JSON-LD #${i + 1}: ${type} — valid`)
    } catch (e) {
      fail(`JSON-LD #${i + 1}: invalid JSON — ${e.message}`)
      allValid = false
    }
  }
}

// ─── 5. robots.txt AI Bot Rules ─────────────────────────────────

section('5. robots.txt AI Bot Rules')

const robots = read('public/robots.txt')
if (!robots) {
  fail('public/robots.txt not found')
} else {
  const searchBots = ['OAI-SearchBot', 'PerplexityBot', 'ChatGPT-User']
  const trainBots = ['GPTBot', 'CCBot', 'Google-Extended']

  for (const bot of searchBots) {
    if (robots.includes(`User-agent: ${bot}`) && robots.includes('Allow: /')) {
      pass(`Search bot ${bot} — Allow`)
    } else {
      fail(`Search bot ${bot} — not properly allowed`)
    }
  }
  for (const bot of trainBots) {
    const idx = robots.indexOf(`User-agent: ${bot}`)
    if (idx !== -1) {
      const after = robots.slice(idx, idx + 200)
      if (after.includes('Disallow: /')) {
        pass(`Training bot ${bot} — Disallow`)
      } else {
        fail(`Training bot ${bot} — not properly blocked`)
      }
    } else {
      warn(`Training bot ${bot} — not listed`)
    }
  }
}

// ─── 6. llms.txt Sync ──────────────────────────────────────────

section('6. llms.txt Sync')

const llms = read('public/llms.txt')
if (!llms) {
  fail('public/llms.txt not found')
} else {
  const requiredSections = ['AI Beauty', 'K-Beauty Tools', 'Treatments', 'Wellness', 'Blog']
  for (const s of requiredSections) {
    if (llms.includes(s)) {
      pass(`Section "${s}" present`)
    } else {
      warn(`Section "${s}" missing — may need update`)
    }
  }
}

// ─── 7. UX Guidance Text ────────────────────────────────────────

section('7. UX Guidance Text (안내 문구)')

const uxChecks = [
  {
    file: 'src/components/products/ProductBrowser.jsx',
    name: 'ProductBrowser',
    patterns: [
      { desc: 'Empty state message', regex: /필터에 맞는|No products/i },
      { desc: 'Search placeholder', regex: /placeholder/ },
      { desc: 'Helper description', regex: /필터를 조합|Browse|찾아보세요/i },
    ]
  },
  {
    file: 'src/components/mypage/AnalysisHistory.jsx',
    name: 'AnalysisHistory',
    patterns: [
      { desc: 'Empty state message', regex: /분석 기록이 없|No history/i },
      { desc: 'Trend legend', regex: /개선|improved|변화 없|stable/i },
      { desc: 'Feature description', regex: /추적|변화를|track/i },
    ]
  },
  {
    file: 'src/components/mypage/SkinDiary.jsx',
    name: 'SkinDiary',
    patterns: [
      { desc: 'Empty state message', regex: /일지가 없|no entries|시작해/i },
      { desc: 'Field helper text', regex: /당기|벗겨|정도|수분|스트레스/i },
    ]
  },
  {
    file: 'src/components/products/CompatibilityChecker.jsx',
    name: 'CompatibilityChecker',
    patterns: [
      { desc: 'Usage guide', regex: /사용법|How to/i },
      { desc: 'Severity legend', regex: /고위험|주의|안전|위험|심각/i },
      { desc: 'Comparison helper', regex: /공통|shared|고유|unique/i },
    ]
  },
  {
    file: 'src/components/products/IngredientAnalyzer.jsx',
    name: 'IngredientAnalyzer',
    patterns: [
      { desc: 'Usage guide', regex: /사용법|How to/i },
      { desc: 'Safety legend', regex: /안전|good|caution|avoid|범례|legend/i },
      { desc: 'OCR stage labels', regex: /로딩|인식|처리|loading|recognizing/i },
    ]
  },
  {
    file: 'src/components/mypage/ReminderSettings.jsx',
    name: 'ReminderSettings',
    patterns: [
      { desc: 'Feature description', regex: /알림을 받|receive notification/i },
      { desc: 'Permission guide', regex: /허용|allow|차단|blocked/i },
    ]
  },
  {
    file: 'src/components/common/ShareCard.jsx',
    name: 'ShareCard',
    patterns: [
      { desc: 'Download button label', regex: /다운로드|download/i },
      { desc: 'Share button label', regex: /공유|share/i },
    ]
  },
]

for (const check of uxChecks) {
  const content = read(check.file)
  if (!content) {
    fail(`${check.name}: file not found`)
    continue
  }
  let allFound = true
  for (const p of check.patterns) {
    if (!p.regex.test(content)) {
      warn(`${check.name}: missing "${p.desc}"`)
      allFound = false
    }
  }
  if (allFound) pass(`${check.name}: all guidance text present`)
}

// ─── Summary ────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(50))
console.log(`\x1b[1mResults:\x1b[0m  \x1b[32m${passed} passed\x1b[0m  \x1b[31m${failed} failed\x1b[0m  \x1b[33m${warnings} warnings\x1b[0m`)

if (failed > 0) {
  console.log('\n\x1b[31m✗ Pre-push check FAILED. Fix issues before pushing.\x1b[0m\n')
  process.exit(1)
} else if (warnings > 0) {
  console.log('\n\x1b[33m⚠ Passed with warnings. Review before pushing.\x1b[0m\n')
  process.exit(0)
} else {
  console.log('\n\x1b[32m✓ All checks passed! Ready to push.\x1b[0m\n')
  process.exit(0)
}
