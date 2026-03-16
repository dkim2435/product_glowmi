import fs from 'fs'

const TAG = 'glowmi07-20'
const ASIN_MAP = {
  'banila-co-clean-it-zero-original': 'B0CW7LGBB6',
  'heimish-all-clean-balm': 'B01CJ639SM',
  'anua-heartleaf-pore-control-cleansing-oil': 'B0BN2PX8V3',
  'cosrx-low-ph-good-morning-gel-cleanser': 'B016NRXO06',
  'round-lab-1025-dokdo-cleanser': 'B08FMCMGN6',
  'cosrx-advanced-snail-96-mucin-power-essence': 'B00PBX3L7K',
  'missha-time-revolution-first-treatment-essence-5x': 'B09646RFWJ',
  'numbuzin-no3-skin-softening-serum': 'B0915K6WD3',
  'sulwhasoo-first-care-activating-serum-vi': 'B00AHTK5WC',
  'beauty-of-joseon-glow-serum-propolis-niacinamide': 'B0BX8YWFH1',
  'beauty-of-joseon-glow-deep-serum-rice-arbutin': 'B09DLFCB69',
  'cosrx-bha-blackhead-power-liquid': 'B00OZEJ8R8',
  'cosrx-aha-7-whitehead-power-liquid': 'B07N81CDCN',
  'cosrx-propolis-light-ampoule': 'B07ZGJQZ8G',
  'klairs-freshly-juiced-vitamin-drop': 'B010FOFSH0',
  'numbuzin-no5-vitamin-concentrated-serum': 'B0C61FD7P9',
  'torriden-dive-in-low-molecular-hyaluronic-acid-serum': 'B07WZ2YTDP',
  'skin1004-madagascar-centella-ampoule': 'B06Y15D1LH',
  'beauty-of-joseon-revive-eye-serum-ginseng-retinal': 'B0B45LL4DD',
  'purito-centella-green-level-buffet-serum': 'B078HLN8VF',
  'some-by-mi-aha-bha-pha-miracle-serum': 'B07K371NJ4',
  'cosrx-advanced-snail-92-all-in-one-cream': 'B01LEJ5MSK',
  'laneige-water-bank-blue-hyaluronic-cream': 'B0CNJ1Z2GL',
  'dr-jart-ceramidin-cream': 'B015RYQBIS',
  'dr-jart-cicapair-tiger-grass-cream': 'B07DR5816K',
  'beauty-of-joseon-dynasty-cream': 'B08WJQ3XJD',
  'innisfree-green-tea-seed-cream': 'B0CW7M2VBN',
  'klairs-midnight-blue-calming-cream': 'B01GR1O1NC',
  'pyunkang-yul-nutrition-cream': 'B06ZZVBQKM',
  'sulwhasoo-concentrated-ginseng-rejuvenating-cream': 'B09VCQN5V3',
  'round-lab-birch-juice-moisturizing-cream': 'B081VS3F27',
  'beauty-of-joseon-relief-sun-rice-probiotics': 'B0B5PJ41ZT',
  'skin1004-madagascar-centella-hyalu-cica-sun-serum': 'B0FXH5LHN8',
  'isntree-hyaluronic-acid-watery-sun-gel': 'B0C7B55GS3',
  'innisfree-daily-uv-defense-sunscreen': 'B08WZS7LVN',
  'laneige-water-sleeping-mask': 'B09HN8JBFP',
  'laneige-lip-sleeping-mask': 'B07XXPHQZK',
  'medicube-zero-pore-pad': 'B09V7Z4TJG',
  'neogen-bio-peel-gauze-peeling-wine': 'B019RTEKO6',
  'cosrx-acne-pimple-master-patch': 'B01N8XCGIO',
  'klairs-supple-preparation-facial-toner': 'B00PGOFYG0',
  'anua-heartleaf-77-soothing-toner': 'B08CMS8P67',
  'round-lab-1025-dokdo-toner': 'B08FM5BTF6',
  'pyunkang-yul-essence-toner': 'B06ZZK3YJY',
  'etude-soonjung-ph55-relief-toner': 'B0921NXR2V',
  'some-by-mi-aha-bha-pha-miracle-toner': 'B07BYJF7L7',
  'isntree-hyaluronic-acid-toner': 'B084D6Y99H',
  'torriden-dive-in-low-molecular-hyaluronic-acid-toner': 'B08TBG2T2C',
  'purito-centella-green-level-recovery-cream': 'B078HKHYT2',
  'etude-soonjung-2x-barrier-intensive-cream': 'B091PN6NPT',
  'laneige-cream-skin-cerapeptide-refiner': 'B09P54X2NS',
  'tirtir-milk-skin-toner': 'B0CG1H8YRS',
  'medicube-pdrn-pink-peptide-ampoule': 'B0DCJ7952P',
  'im-from-mugwort-essence': 'B07FP453RC',
  'anua-niacinamide-10-txa-4-serum': 'B0CLLV2T1P',
  'mary-and-may-tranexamic-acid-glutathione-eye-cream': 'B0987DJDSG',
  'illiyoon-ceramide-ato-concentrate-cream': 'B077RTL1HJ',
  'beauty-of-joseon-ginseng-essence-water': 'B08RLZ28QK',
  'mixsoon-bean-essence': 'B08ZXVVY8M',
  'vt-cica-exosome-moisture-mask': 'B0F9VP6JPX',
}

let src = fs.readFileSync('src/data/products.js', 'utf8')
let count = 0

for (const [id, asin] of Object.entries(ASIN_MAP)) {
  const url = `https://www.amazon.com/dp/${asin}?tag=${TAG}`
  // Match the id line and add amazonUrl after the rating line
  const idEscaped = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(`(id:\\s*"${idEscaped}"[\\s\\S]*?rating:\\s*[\\d.]+)`)
  if (regex.test(src)) {
    src = src.replace(regex, `$1,\n    amazonUrl: "${url}"`)
    count++
  }
}

fs.writeFileSync('src/data/products.js', src)
console.log(`Added amazonUrl to ${count} products`)
