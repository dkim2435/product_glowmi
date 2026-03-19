const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const DIR = path.join(__dirname, '..', 'public', 'illustrations')
const BLOCK = 8 // block size for analysis

async function fixImage(filePath) {
  const img = sharp(filePath)
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels: ch } = info
  const out = Buffer.from(data)

  const bw = Math.ceil(width / BLOCK)
  const bh = Math.ceil(height / BLOCK)

  // Step 1: Compute average color per block
  const blockAvg = new Float32Array(bw * bh)
  const blockR = new Float32Array(bw * bh)
  const blockG = new Float32Array(bw * bh)
  const blockB = new Float32Array(bw * bh)
  const blockOpaque = new Uint32Array(bw * bh)
  const blockPurple = new Uint8Array(bw * bh) // is this block purple-ish?

  for (let by = 0; by < bh; by++) {
    for (let bx = 0; bx < bw; bx++) {
      let sumR = 0, sumG = 0, sumB = 0, cnt = 0
      for (let dy = 0; dy < BLOCK; dy++) {
        for (let dx = 0; dx < BLOCK; dx++) {
          const px = bx * BLOCK + dx, py = by * BLOCK + dy
          if (px >= width || py >= height) continue
          const idx = (py * width + px) * ch
          if (data[idx + 3] === 0) continue
          sumR += data[idx]; sumG += data[idx + 1]; sumB += data[idx + 2]
          cnt++
        }
      }
      const bi = by * bw + bx
      blockOpaque[bi] = cnt
      if (cnt > 0) {
        blockR[bi] = sumR / cnt
        blockG[bi] = sumG / cnt
        blockB[bi] = sumB / cnt
        blockAvg[bi] = (sumR + sumG + sumB) / (cnt * 3)
        // Purple-ish: blue channel noticeably higher than red/green average
        const purpleness = blockB[bi] - (blockR[bi] + blockG[bi]) / 2
        const grayRange = blockAvg[bi] >= 185 && blockAvg[bi] <= 250
        // Also detect light gray checkerboard (neutral)
        const maxChDiff = Math.max(Math.abs(blockR[bi] - blockG[bi]), Math.abs(blockG[bi] - blockB[bi]))
        blockPurple[bi] = (grayRange && (purpleness > 5 || maxChDiff < 15)) ? 1 : 0
      }
    }
  }

  // Step 2: Find checkerboard regions - blocks that alternate with neighbors
  const isChecker = new Uint8Array(bw * bh)

  for (let by = 1; by < bh - 1; by++) {
    for (let bx = 1; bx < bw - 1; bx++) {
      const bi = by * bw + bx
      if (!blockPurple[bi] || blockOpaque[bi] < BLOCK * BLOCK * 0.3) continue

      const myAvg = blockAvg[bi]
      let alternateCount = 0
      let sameRangeCount = 0

      // Check 8 neighbors
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue
          const ni = (by + dy) * bw + (bx + dx)
          if (!blockPurple[ni] || blockOpaque[ni] < BLOCK * BLOCK * 0.3) continue

          const nAvg = blockAvg[ni]
          const diff = Math.abs(myAvg - nAvg)

          if (diff >= 10 && diff <= 50) alternateCount++
          if (diff < 60) sameRangeCount++
        }
      }

      // Checkerboard: has alternating neighbors AND they're all in purple range
      if (alternateCount >= 2 && sameRangeCount >= 4) {
        isChecker[bi] = 1
      }
    }
  }

  // Step 3: Expand - fill gaps between detected checkerboard blocks
  for (let pass = 0; pass < 5; pass++) {
    for (let by = 1; by < bh - 1; by++) {
      for (let bx = 1; bx < bw - 1; bx++) {
        const bi = by * bw + bx
        if (isChecker[bi] || !blockPurple[bi]) continue

        let checkerNeighbors = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            if (isChecker[(by + dy) * bw + (bx + dx)]) checkerNeighbors++
          }
        }
        if (checkerNeighbors >= 3) isChecker[bi] = 1
      }
    }
  }

  // Step 4: Compute target fill color (average of all checkerboard blocks)
  let totalR = 0, totalG = 0, totalB = 0, totalCnt = 0
  for (let i = 0; i < bw * bh; i++) {
    if (isChecker[i] && blockOpaque[i] > 0) {
      totalR += blockR[i] * blockOpaque[i]
      totalG += blockG[i] * blockOpaque[i]
      totalB += blockB[i] * blockOpaque[i]
      totalCnt += blockOpaque[i]
    }
  }

  if (totalCnt > 0) {
    // Blend average with brand lavender for consistency
    const fillR = Math.round((totalR / totalCnt) * 0.5 + 0xE8 * 0.5)
    const fillG = Math.round((totalG / totalCnt) * 0.5 + 0xE0 * 0.5)
    const fillB = Math.round((totalB / totalCnt) * 0.5 + 0xF5 * 0.5)

    // Step 5: Replace checkerboard pixels
    let replaced = 0
    for (let by = 0; by < bh; by++) {
      for (let bx = 0; bx < bw; bx++) {
        if (!isChecker[by * bw + bx]) continue
        for (let dy = 0; dy < BLOCK; dy++) {
          for (let dx = 0; dx < BLOCK; dx++) {
            const px = bx * BLOCK + dx, py = by * BLOCK + dy
            if (px >= width || py >= height) continue
            const idx = (py * width + px) * ch
            if (out[idx + 3] === 0) continue

            const r = out[idx], g = out[idx + 1], b = out[idx + 2]
            const avg = (r + g + b) / 3
            const purpleness = b - (r + g) / 2
            const maxChDiff = Math.max(Math.abs(r - g), Math.abs(g - b))

            // Only replace pixels that are in the purple/gray background range
            if (avg >= 180 && avg <= 255 && (purpleness > 3 || maxChDiff < 20)) {
              out[idx] = fillR
              out[idx + 1] = fillG
              out[idx + 2] = fillB
              replaced++
            }
          }
        }
      }
    }
    console.log('  Replaced ' + replaced + ' pixels → RGB(' + fillR + ',' + fillG + ',' + fillB + ')')
  }

  await sharp(out, { raw: { width, height, channels: ch } })
    .png()
    .toFile(filePath + '.tmp')

  fs.renameSync(filePath + '.tmp', filePath)
  console.log('✓ Fixed:', path.basename(filePath))
}

async function main() {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.png'))
  for (const file of files) {
    await fixImage(path.join(DIR, file))
  }
  console.log('\nDone! ' + files.length + ' images fixed.')
}

main().catch(e => console.error(e))
