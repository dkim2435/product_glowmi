import { useState, useEffect } from 'react'
import { getWeatherCache, setWeatherCache } from '../../lib/storage'
import { getRecommendations } from '../../data/products'
import { useLang } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { loadAnalysisResults } from '../../lib/db'
import ProductCard from './ProductCard'

const TIPS = {
  uvHigh: {
    emoji: '☀️',
    title: 'High UV Alert',
    titleKr: '자외선 주의',
    tip: 'Apply SPF 50+ sunscreen and reapply every 2 hours. Wear a hat outdoors.',
    tipKr: 'SPF 50+ 자외선 차단제를 바르고 2시간마다 덧발라주세요.',
    productQuery: { categories: ['sunscreen', 'serum'], concerns: ['aging', 'dark_spots'] }
  },
  uvMod: {
    emoji: '🌤️',
    title: 'Moderate UV',
    titleKr: '자외선 보통',
    tip: 'Don\'t skip sunscreen today! SPF 30+ recommended.',
    tipKr: '오늘도 자외선 차단제를 꼭 발라주세요! SPF 30+ 추천.',
    productQuery: { categories: ['sunscreen'], concerns: ['aging'] }
  },
  dryAir: {
    emoji: '🏜️',
    title: 'Dry Air Alert',
    titleKr: '건조 주의',
    tip: 'Air is very dry. Layer hydrating products and use a richer moisturizer.',
    tipKr: '공기가 매우 건조합니다. 수분 제품을 레이어링하고 리치한 보습제를 사용하세요.',
    productQuery: { categories: ['toner', 'moisturizer', 'essence'], concerns: ['dryness'] }
  },
  humid: {
    emoji: '💧',
    title: 'High Humidity',
    titleKr: '습도 높음',
    tip: 'Switch to lightweight, gel-based products. Oil control is key today.',
    tipKr: '가벼운 젤 타입 제품으로 교체하세요. 유분 관리가 중요합니다.',
    productQuery: { categories: ['toner', 'moisturizer', 'sunscreen'], concerns: ['oiliness', 'pores'] }
  },
  cold: {
    emoji: '🥶',
    title: 'Cold Weather',
    titleKr: '추운 날씨',
    tip: 'Protect your skin barrier with rich creams. Avoid hot water when cleansing.',
    tipKr: '리치한 크림으로 피부 장벽을 보호하세요. 세안 시 뜨거운 물은 피하세요.',
    productQuery: { categories: ['moisturizer', 'cleanser', 'essence'], concerns: ['dryness', 'redness'] }
  },
  hot: {
    emoji: '🔥',
    title: 'Hot Weather',
    titleKr: '더운 날씨',
    tip: 'Use cooling products and keep skin hydrated. Double cleanse in the evening.',
    tipKr: '쿨링 제품을 사용하고 수분을 유지하세요. 저녁엔 이중 세안을 해주세요.',
    productQuery: { categories: ['cleanser', 'toner', 'moisturizer'], concerns: ['oiliness', 'dryness'] }
  },
  nice: {
    emoji: '🌸',
    title: 'Great Skin Weather',
    titleKr: '피부에 좋은 날씨',
    tip: 'Conditions are ideal! Stick to your regular routine.',
    tipKr: '피부에 좋은 날씨입니다! 기존 루틴을 유지하세요.',
    productQuery: { categories: ['sunscreen', 'moisturizer'] }
  }
}

function getSkincareAdvice(temp, humidity, uvIndex) {
  const advice = []

  if (uvIndex >= 6) advice.push(TIPS.uvHigh)
  else if (uvIndex >= 3) advice.push(TIPS.uvMod)

  if (humidity < 35) advice.push(TIPS.dryAir)
  else if (humidity > 75) advice.push(TIPS.humid)

  if (temp < 5) advice.push(TIPS.cold)
  else if (temp > 30) advice.push(TIPS.hot)

  if (advice.length === 0) advice.push(TIPS.nice)

  return advice
}

/** Build a personal note linking weather + skin scores */
function getSkinWeatherNote(advice, skinData, t) {
  if (!skinData) return null
  const links = []
  for (const a of advice) {
    if (a === TIPS.dryAir && skinData.skin_dryness >= 40) {
      links.push(t(
        `Your dryness score is ${skinData.skin_dryness} — extra moisture is key today!`,
        `건조 점수 ${skinData.skin_dryness}점 — 오늘 보습이 특히 중요해요!`
      ))
    }
    if ((a === TIPS.uvHigh || a === TIPS.uvMod) && skinData.skin_dark_spots >= 40) {
      links.push(t(
        `Your dark spots score is ${skinData.skin_dark_spots} — sunscreen is extra important!`,
        `잡티 점수 ${skinData.skin_dark_spots}점 — 자외선 차단이 더욱 중요해요!`
      ))
    }
    if (a === TIPS.humid && skinData.skin_oiliness >= 40) {
      links.push(t(
        `Your oiliness score is ${skinData.skin_oiliness} — oil control matters today!`,
        `유분 점수 ${skinData.skin_oiliness}점 — 오늘 유분 관리에 신경 쓰세요!`
      ))
    }
    if (a === TIPS.cold && skinData.skin_redness >= 40) {
      links.push(t(
        `Your redness score is ${skinData.skin_redness} — protect your skin barrier!`,
        `홍조 점수 ${skinData.skin_redness}점 — 피부 장벽 보호가 중요해요!`
      ))
    }
  }
  return links.length > 0 ? links[0] : null
}

export default function WeatherTips() {
  const { t } = useLang()
  const { user } = useAuth()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [skinData, setSkinData] = useState(null)

  useEffect(() => {
    fetchWeather()
  }, [])

  useEffect(() => {
    if (user) {
      loadAnalysisResults(user.id).then(data => {
        if (data && data.skin_redness) setSkinData(data)
      }).catch(() => {})
    }
  }, [user])

  async function fetchWeather() {
    // Check cache first
    const cached = getWeatherCache()
    if (cached) {
      setWeather(cached)
      setLoading(false)
      return
    }

    try {
      // Get location
      const pos = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('no-geo'))
          return
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
      })

      const { latitude, longitude } = pos.coords

      // Fetch from Open-Meteo (free, no API key)
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,uv_index,weather_code&timezone=auto`
      )
      const data = await res.json()

      if (!data.current) throw new Error('No weather data')

      const weatherData = {
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        uvIndex: data.current.uv_index,
        weatherCode: data.current.weather_code,
        lat: latitude,
        lng: longitude,
      }

      setWeatherCache(weatherData)
      setWeather(weatherData)
    } catch (err) {
      if (err.message === 'no-geo' || err.code === 1) {
        setError('location')
      } else {
        setError('fetch')
      }
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="weather-card weather-loading">
        <span className="weather-loading-icon">🌤️</span>
        <span>{t('Loading weather tips...', '날씨 정보 불러오는 중...')}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="weather-card weather-error">
        <span className="weather-error-icon">📍</span>
        <div>
          <p className="weather-error-msg">
            {error === 'location'
              ? t('Enable location for personalized skincare tips based on today\'s weather.', '위치를 허용하면 오늘 날씨에 맞는 스킨케어 팁을 받을 수 있어요.')
              : t('Could not load weather data.', '날씨 데이터를 불러올 수 없습니다.')}
          </p>
          {error === 'location' && (
            <>
              <button className="weather-retry-btn" onClick={fetchWeather}>📍 {t('Enable Location', '위치 허용')}</button>
              <p className="weather-perm-hint">{t('If the button doesn\'t work, enable location in your browser settings.', '버튼이 작동하지 않으면 브라우저 설정에서 위치 권한을 켜주세요.')}</p>
            </>
          )}
        </div>
      </div>
    )
  }

  if (!weather) return null

  const advice = getSkincareAdvice(weather.temp, weather.humidity, weather.uvIndex)
  const mainAdvice = advice[0]

  function getWeatherEmoji(code) {
    if (code <= 1) return '☀️'
    if (code <= 3) return '⛅'
    if (code <= 49) return '☁️'
    if (code <= 69) return '🌧️'
    if (code <= 79) return '🌨️'
    if (code <= 82) return '🌧️'
    if (code <= 86) return '❄️'
    if (code <= 99) return '⛈️'
    return '🌤️'
  }

  return (
    <div className="weather-card">
      <div className="weather-header" onClick={() => setExpanded(!expanded)}>
        <div className="weather-current">
          <span className="weather-temp-emoji">{getWeatherEmoji(weather.weatherCode)}</span>
          <span className="weather-temp">{weather.temp}°C / {Math.round(weather.temp * 9 / 5 + 32)}°F</span>
          <div className="weather-stats">
            <span className="weather-stat">💧 {weather.humidity}%</span>
            <span className="weather-stat">☀️ UV {weather.uvIndex}</span>
          </div>
        </div>
        <div className="weather-main-tip">
          <span className="weather-tip-emoji">{mainAdvice.emoji}</span>
          <div>
            <div className="weather-tip-title">{t(mainAdvice.title, mainAdvice.titleKr)}</div>
            <div className="weather-tip-text">{t(mainAdvice.tip, mainAdvice.tipKr)}</div>
          </div>
        </div>
        <span className={'weather-expand-icon' + (expanded ? ' expanded' : '')}>▾</span>
      </div>
      {skinData && (() => {
        const note = getSkinWeatherNote(advice, skinData, t)
        return note ? <div className="weather-skin-note">{note}</div> : null
      })()}
      {!expanded && (
        <div className="weather-tap-hint" onClick={() => setExpanded(true)}>{t('Tap for product recommendations', '탭하여 추천 제품 보기')}</div>
      )}

      {expanded && (
        <div className="weather-details">
          {mainAdvice.productQuery && (
            <div className="weather-products">
              <span className="weather-products-label">{t('Recommended Products', '추천 제품')}:</span>
              <div className="product-card-list">
                {getRecommendations({
                  concerns: mainAdvice.productQuery.concerns || [],
                  categories: mainAdvice.productQuery.categories || []
                }).slice(0, 3).map(p => (
                  <ProductCard key={p.id} product={p} compact />
                ))}
              </div>
            </div>
          )}
          {advice.length > 1 && advice.slice(1).map((a, i) => (
            <div key={i} className="weather-extra-tip">
              <span>{a.emoji}</span>
              <div>
                <strong>{t(a.title, a.titleKr)}</strong> — {t(a.tip, a.tipKr)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
