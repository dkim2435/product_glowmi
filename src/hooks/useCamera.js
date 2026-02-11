import { useState, useRef, useCallback } from 'react'

export function useCamera({ facingMode = 'user', idealWidth = 640, idealHeight = 480 } = {}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [isMirrored, setIsMirrored] = useState(facingMode === 'user')
  const [capturedImage, setCapturedImage] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)

  const startCamera = useCallback(async () => {
    setCameraError(null)
    setCapturedImage(null)
    setIsMirrored(facingMode === 'user')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: idealWidth }, height: { ideal: idealHeight } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch (e) {
      setCameraError('Camera not available. Please use image upload. 카메라를 사용할 수 없습니다. 이미지 업로드를 이용해주세요.')
      setCameraActive(false)
    }
  }, [facingMode, idealWidth, idealHeight])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }, [])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')

    if (isMirrored) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    stopCamera()
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(dataUrl)
    return dataUrl
  }, [isMirrored, stopCamera])

  const handleUpload = useCallback((file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file'))
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Please upload an image file. 이미지 파일을 업로드해주세요.'))
      }
      if (file.size > 10 * 1024 * 1024) {
        return reject(new Error('File is too large (max 10MB). 파일이 너무 큽니다 (최대 10MB).'))
      }

      setIsMirrored(false)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target.result)
        stopCamera()
        resolve(e.target.result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [stopCamera])

  const reset = useCallback(() => {
    stopCamera()
    setCapturedImage(null)
    setCameraError(null)
  }, [stopCamera])

  return {
    videoRef,
    canvasRef,
    isMirrored,
    capturedImage,
    cameraError,
    cameraActive,
    startCamera,
    stopCamera,
    capturePhoto,
    handleUpload,
    reset
  }
}
