import { useRef } from 'react'

export default function CameraView({
  videoRef,
  canvasRef,
  capturedImage,
  cameraActive,
  cameraError,
  onStartCamera,
  onCapture,
  onUpload,
  onAnalyze,
  onRetake,
  onCancel,
  analyzeLabel = 'Analyze',
  showFaceGuide = true
}) {
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  return (
    <div className="camera-view">
      <div className="camera-preview-area">
        {/* Always render video so videoRef is available when stream arrives */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
          style={{
            transform: 'scaleX(-1)',
            display: (cameraActive && !capturedImage) ? 'block' : 'none'
          }}
        />
        {cameraActive && !capturedImage && showFaceGuide && <div className="face-guide" />}
        {capturedImage && (
          <img src={capturedImage} alt="Preview" className="camera-preview-img" />
        )}
        {!cameraActive && !capturedImage && (
          <div className="camera-placeholder">
            <span className="camera-placeholder-icon">📷</span>
            <span className="camera-placeholder-text">Camera Preview</span>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {cameraError && <p className="fs-error">{cameraError}</p>}

      <div className="camera-controls">
        {!cameraActive && !capturedImage && (
          <>
            <button className="primary-btn" onClick={onStartCamera}>
              📷 Start Camera 카메라 시작
            </button>
            <button className="secondary-btn" onClick={() => fileInputRef.current?.click()}>
              📁 Upload Photo 사진 업로드
            </button>
          </>
        )}

        {cameraActive && !capturedImage && (
          <>
            <button className="primary-btn" onClick={onCapture}>
              📸 Capture 촬영
            </button>
            <button className="secondary-btn" onClick={onCancel}>
              Cancel 취소
            </button>
          </>
        )}

        {capturedImage && (
          <>
            <button className="primary-btn" onClick={onAnalyze}>
              {analyzeLabel}
            </button>
            <button className="secondary-btn" onClick={onRetake}>
              Retake 다시찍기
            </button>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}
