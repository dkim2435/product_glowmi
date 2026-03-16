import fs from 'fs'

const TAG = 'glowmi07-20'
const ASIN_MAP = {
  'etude-soonjung-ph65-whip-cleanser': 'B092PTSDB4',
  'innisfree-volcanic-pore-cleansing-foam': 'B006XAG1U4',
  'round-lab-birch-juice-moisturizing-cleanser': 'B093W78YWZ',
  'some-by-mi-aha-bha-pha-miracle-acne-cleanser': 'B07Q34Y99J',
  'skin1004-madagascar-centella-toning-toner': 'B07NS3T4W2',
  'innisfree-green-tea-foam-cleanser': 'B0CX2QR1HR',
  'sulwhasoo-concentrated-ginseng-rejuvenating-serum': 'B0BS769YGX',
  'missha-all-around-safe-block-essence-sun': 'B00ENTM3FY',
  'cosrx-ultimate-nourishing-rice-overnight-mask': 'B01N13W31F',
  'cosrx-ultimate-moisturizing-honey-overnight-mask': 'B01MZCQM0V',
  'sulwhasoo-first-care-activating-mask': 'B0CKWN8FQP',
  'sulwhasoo-concentrated-ginseng-renewing-eye-cream': 'B09F3VSQG1',
  'innisfree-jeju-orchid-eye-cream': 'B08WZRDXK8',
  'missha-misa-geum-sul-vitalizing-eye-cream': 'B07ST4J39W',
  'cosrx-aha-bha-clarifying-treatment-toner': 'B073P6BPF5',
  'cosrx-centella-blemish-cream': 'B00XY0ONRY',
  'innisfree-green-tea-seed-hyaluronic-serum': 'B09CQHJB4M',
  'pyunkang-yul-moisture-serum': 'B06ZZ8ND68',
  'round-lab-1025-dokdo-lotion': 'B077Z13WKC',
  'isntree-chestnut-aha-8-clear-essence': 'B07VZY8KYB',
  'numbuzin-no9-secret-lifting-ampoule': 'B0DLKGLBPG',
  'anua-heartleaf-70-daily-lotion': 'B0CHZ6KJGQ',
  'some-by-mi-snail-truecica-miracle-repair-serum': 'B07RT4JZQG',
  'anua-pdrn-hyaluronic-acid-capsule-100-serum': 'B0DLB58CWR',
  'mixsoon-pdrn-collagen-cream': 'B0FJ8NWZZS',
  'sungboon-editor-alaska-pdrn-barrier-cream': 'B0F8Q2S9HG',
  'medicube-zero-one-day-exosome-shot-7500': 'B0D137TMRB',
  'medicube-zero-one-day-exosome-shot-2000': 'B0D16L5F2M',
  'medicube-exosome-cica-calming-pad': 'B0DFG4MRC9',
  'vt-pdrn-cica-exosome-ampoule': 'B0F4QRGK2N',
  'im-from-mugwort-cream': 'B07TY8S6TZ',
  'im-from-mugwort-mask': 'B07FPG3NQ7',
  'bringgreen-artemisia-cera-calming-repair-cream': 'B0CL3RQBHC',
  'bringgreen-artemisia-calming-ex-water-cream': 'B0DKFJGN2H',
  'bringgreen-artemisia-cera-calming-toner': 'B0CL3R5YW5',
  'aestura-atobarrier-365-cream': 'B09YDCCJBJ',
  'aestura-a-cica-365-soothing-repair-cream': 'B09Z6L1FDC',
  'im-from-mugwort-serum': 'B0CM37532R',
  'bringgreen-artemisia-cera-calming-cleanser': 'B0CL3S7V3H',
  'aestura-a-cica-365-hydrating-relief-toner': 'B0BZ3R8F9V',
  'aestura-a-cica-365-soothing-relief-serum': 'B09Z6L7NRC',
  'anua-heartleaf-80-moisture-soothing-ampoule': 'B08CMVXQ9W',
  'skin1004-centella-tone-brightening-capsule-ampoule': 'B09C29LSCY',
  'illiyoon-ceramide-ato-soothing-gel': 'B081PXPDQ9',
  'round-lab-birch-juice-moisturizing-sun-cream': 'B0DNDL1CY9',
}

let src = fs.readFileSync('src/data/products.js', 'utf8')
let count = 0

for (const [id, asin] of Object.entries(ASIN_MAP)) {
  const url = `https://www.amazon.com/dp/${asin}?tag=${TAG}`
  const idEscaped = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(`(id:\\s*"${idEscaped}"[\\s\\S]*?rating:\\s*[\\d.]+)`)
  if (regex.test(src)) {
    src = src.replace(regex, `$1,\n    amazonUrl: "${url}"`)
    count++
  } else {
    console.log(`NOT FOUND: ${id}`)
  }
}

fs.writeFileSync('src/data/products.js', src)
console.log(`Added amazonUrl to ${count} more products`)
