let faceLandmarker = null

async function waitForMediaPipe(maxWait) {
  const start = Date.now()
  while (!window.FaceLandmarker || !window.FilesetResolver) {
    if (Date.now() - start > maxWait) {
      throw new Error('MediaPipe failed to load. Please refresh and try again.')
    }
    await new Promise(r => setTimeout(r, 200))
  }
}

export async function initFaceLandmarker() {
  if (faceLandmarker) return faceLandmarker

  // Dynamic import of MediaPipe vision tasks
  if (!window.FaceLandmarker || !window.FilesetResolver) {
    const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs')
    window.FaceLandmarker = vision.FaceLandmarker
    window.FilesetResolver = vision.FilesetResolver
  }

  const filesetResolver = await window.FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
  )

  // Try GPU first, fall back to CPU
  try {
    faceLandmarker = await window.FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'IMAGE',
      numFaces: 1
    })
  } catch (gpuErr) {
    console.warn('GPU delegate failed, falling back to CPU:', gpuErr)
    faceLandmarker = await window.FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'CPU'
      },
      runningMode: 'IMAGE',
      numFaces: 1
    })
  }

  return faceLandmarker
}

export function dist(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function angleBetween(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y }
  const cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y)
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y)
  let cosAngle = dot / (magAB * magCB)
  cosAngle = Math.max(-1, Math.min(1, cosAngle))
  return Math.acos(cosAngle) * (180 / Math.PI)
}
