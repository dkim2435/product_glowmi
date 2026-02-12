import { useLang } from '../../context/LanguageContext'

export default function WeatherWellness() {
  const { t } = useLang()

  return (
    <div className="weather-wellness">
      <h3 className="nutrient-section-title">
        {t('Weather-Based Skincare', '날씨 기반 스킨케어')}
      </h3>
      <p className="nutrient-section-desc">
        {t(
          'Check the weather widget at the top of every page for real-time skincare tips and product recommendations based on your local conditions.',
          '모든 페이지 상단의 날씨 위젯에서 현재 위치의 날씨에 맞는 실시간 스킨케어 팁과 제품 추천을 확인하세요.'
        )}
      </p>
      <div className="weather-wellness-hint">
        <span>☝️</span>
        <p>{t('The weather widget is always visible at the top — tap it for product recommendations!', '날씨 위젯은 항상 상단에 표시됩니다 — 탭하면 추천 제품을 볼 수 있어요!')}</p>
      </div>
    </div>
  )
}
