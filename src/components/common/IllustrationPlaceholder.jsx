const CONFIGS = {
  onboarding: { emoji: '✨', bgFrom: '#8B7EC8', bgTo: '#6C5FA7' },
  empty: { emoji: '📭', bgFrom: '#B8B0E0', bgTo: '#8B7EC8' },
  start: { emoji: '🚀', bgFrom: '#8B7EC8', bgTo: '#A78BFA' },
  success: { emoji: '🎉', bgFrom: '#6C5FA7', bgTo: '#8B7EC8' },
}

const SIZES = {
  sm: { width: 120, height: 100, fontSize: 40, radius: 16 },
  md: { width: 200, height: 160, fontSize: 56, radius: 20 },
  lg: { width: 280, height: 200, fontSize: 72, radius: 24 },
}

export default function IllustrationPlaceholder({ type = 'start', size = 'md', emoji }) {
  const config = CONFIGS[type] || CONFIGS.start
  const dim = SIZES[size] || SIZES.md
  const displayEmoji = emoji || config.emoji

  return (
    <div
      className="illustration-placeholder"
      style={{
        width: dim.width,
        height: dim.height,
        borderRadius: dim.radius,
        background: `linear-gradient(135deg, ${config.bgFrom} 0%, ${config.bgTo} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: dim.fontSize,
        margin: '0 auto',
        opacity: 0.85,
      }}
      aria-hidden="true"
    >
      {displayEmoji}
    </div>
  )
}
