// Pure functions for face shape classification — no DOM dependencies
import { dist, angleBetween } from '../../../lib/mediapipe'

export function classifyFaceShape(landmarks) {
  const p = landmarks
  const faceHeight = dist(p[10], p[152])
  const faceWidth = dist(p[234], p[454])
  const foreheadWidth = dist(p[67], p[297])
  const jawWidth = dist(p[172], p[397])
  const cheekWidth = dist(p[116], p[345])

  const jawLeft = p[132]
  const jawRight = p[361]
  const chin = p[152]
  const jawAngleLeft = angleBetween(p[234], jawLeft, chin)
  const jawAngleRight = angleBetween(p[454], jawRight, chin)
  const avgJawAngle = (jawAngleLeft + jawAngleRight) / 2

  const lengthWidthRatio = faceHeight / faceWidth
  const foreheadJawRatio = foreheadWidth / jawWidth
  const cheekFaceRatio = cheekWidth / faceWidth

  const scores = { oval: 0, round: 0, square: 0, diamond: 0, heart: 0, long: 0 }

  if (lengthWidthRatio > 1.55) {
    scores.long += 35; scores.oval += 10
  } else if (lengthWidthRatio > 1.35) {
    scores.oval += 30; scores.diamond += 15; scores.heart += 10
  } else if (lengthWidthRatio > 1.15) {
    scores.oval += 15; scores.square += 20; scores.round += 15
  } else {
    scores.round += 35; scores.square += 15
  }

  if (foreheadJawRatio > 1.25) {
    scores.heart += 30; scores.diamond += 10
  } else if (foreheadJawRatio > 1.05) {
    scores.oval += 15; scores.heart += 15
  } else if (foreheadJawRatio > 0.9) {
    scores.square += 20; scores.round += 15; scores.oval += 10
  } else {
    scores.square += 15; scores.round += 10
  }

  if (cheekFaceRatio > 0.95) {
    scores.diamond += 25; scores.round += 10
  } else if (cheekFaceRatio > 0.85) {
    scores.oval += 15; scores.round += 10
  } else {
    scores.long += 10; scores.square += 5
  }

  if (avgJawAngle > 155) {
    scores.square += 25
  } else if (avgJawAngle > 140) {
    scores.square += 15; scores.oval += 10
  } else if (avgJawAngle > 120) {
    scores.oval += 15; scores.round += 10
  } else {
    scores.heart += 15; scores.diamond += 10
  }

  let maxShape = 'oval'
  let maxScore = 0
  let totalScore = 0
  const keys = Object.keys(scores)
  for (let i = 0; i < keys.length; i++) {
    totalScore += scores[keys[i]]
    if (scores[keys[i]] > maxScore) {
      maxScore = scores[keys[i]]
      maxShape = keys[i]
    }
  }

  let confidence = Math.min(Math.round((maxScore / totalScore) * 100 * 1.5), 95)
  confidence = Math.max(confidence, 55)

  return { shape: maxShape, confidence, scores }
}
