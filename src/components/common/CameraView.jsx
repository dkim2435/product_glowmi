import { useRef } from 'react'
import { useLang } from '../../context/LanguageContext'

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
  const { t } = useLang()

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  return (
    <div className="camera-view">
      <div className="camera-preview-area">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
          style={{
            display: (cameraActive && !capturedImage) ? 'block' : 'none'
          }}
        />
        {cameraActive && !capturedImage && showFaceGuide && (
          <>
            <div className="face-guide" />
            <div className="camera-tip">{t('Center your face. Use natural light. Remove makeup & filters for best results.', '얼굴을 원 안에 맞춰주세요. 자연광 추천. 정확한 분석을 위해 화장과 필터를 제거하세요.')}</div>
          </>
        )}
        {capturedImage && (
          <img src={capturedImage} alt="Preview" className="camera-preview-img" />
        )}
        {!cameraActive && !capturedImage && (
          <div className="camera-placeholder">
            <span className="camera-placeholder-icon">📷</span>
            <span className="camera-placeholder-text">{t('Camera Preview', '카메라 미리보기')}</span>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {cameraError && <p className="fs-error">{cameraError}</p>}

      <div className="camera-controls">
        {!cameraActive && !capturedImage && (
          <>
            <button className="primary-btn" onClick={onStartCamera}>
              📷 {t('Start Camera', '카메라 시작')}
            </button>
            <button className="secondary-btn" onClick={() => fileInputRef.current?.click()}>
              📁 {t('Upload Photo', '사진 업로드')}
            </button>
          </>
        )}

        {cameraActive && !capturedImage && (
          <>
            <button className="primary-btn" onClick={onCapture}>
              📸 {t('Capture', '촬영')}
            </button>
            <button className="secondary-btn" onClick={onCancel}>
              {t('Cancel', '취소')}
            </button>
          </>
        )}

        {capturedImage && (
          <>
            <button className="primary-btn" onClick={onAnalyze}>
              {analyzeLabel}
            </button>
            <button className="secondary-btn" onClick={onRetake}>
              {t('Retake', '다시찍기')}
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
