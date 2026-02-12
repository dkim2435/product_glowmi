import { useLang } from '../../context/LanguageContext'
import WeatherTips from '../common/WeatherTips'

export default function WeatherWellness() {
  const { t } = useLang()

  return (
    <div className="weather-wellness">
      <h3 className="nutrient-section-title">
        {t('Weather-Based Skincare', '날씨 기반 스킨케어')}
      </h3>
      <p className="nutrient-section-desc">
        {t(
          'Real-time skincare tips and product recommendations based on your local weather conditions.',
          '현재 위치의 날씨를 기반으로 실시간 스킨케어 팁과 제품을 추천합니다.'
        )}
      </p>
      <WeatherTips />
    </div>
  )
}
