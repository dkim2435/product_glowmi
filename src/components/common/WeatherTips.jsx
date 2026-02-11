import { useState, useEffect } from 'react'
import { getWeatherCache, setWeatherCache } from '../../lib/storage'

const TIPS = {
  uvHigh: {
    emoji: '☀️',
    title: 'High UV Alert',
    titleKr: '자외선 주의',
    tip: 'Apply SPF 50+ sunscreen and reapply every 2 hours. Wear a hat outdoors.',
    tipKr: 'SPF 50+ 자외선 차단제를 바르고 2시간마다 덧발라주세요.',
    products: ['Sunscreen SPF50+', 'Antioxidant Serum', 'UV Mist']
  },
  uvMod: {
    emoji: '🌤️',
    title: 'Moderate UV',
    titleKr: '자외선 보통',
    tip: 'Don\'t skip sunscreen today! SPF 30+ recommended.',
    tipKr: '오늘도 자외선 차단제를 꼭 발라주세요! SPF 30+ 추천.',
    products: ['Sunscreen SPF30+', 'Vitamin C Serum']
  },
  dryAir: {
    emoji: '🏜️',
    title: 'Dry Air Alert',
    titleKr: '건조 주의',
    tip: 'Air is very dry. Layer hydrating products and use a richer moisturizer.',
    tipKr: '공기가 매우 건조합니다. 수분 제품을 레이어링하고 리치한 보습제를 사용하세요.',
    products: ['Hyaluronic Acid', 'Ceramide Cream', 'Facial Mist']
  },
  humid: {
    emoji: '💧',
    title: 'High Humidity',
    titleKr: '습도 높음',
    tip: 'Switch to lightweight, gel-based products. Oil control is key today.',
    tipKr: '가벼운 젤 타입 제품으로 교체하세요. 유분 관리가 중요합니다.',
    products: ['Gel Moisturizer', 'BHA Toner', 'Oil-Free SPF']
  },
  cold: {
    emoji: '🥶',
    title: 'Cold Weather',
    titleKr: '추운 날씨',
    tip: 'Protect your skin barrier with rich creams. Avoid hot water when cleansing.',
    tipKr: '리치한 크림으로 피부 장벽을 보호하세요. 세안 시 뜨거운 물은 피하세요.',
    products: ['Barrier Cream', 'Facial Oil', 'Gentle Cleanser']
  },
  hot: {
    emoji: '🔥',
    title: 'Hot Weather',
    titleKr: '더운 날씨',
    tip: 'Use cooling products and keep skin hydrated. Double cleanse in the evening.',
    tipKr: '쿨링 제품을 사용하고 수분을 유지하세요. 저녁엔 이중 세안을 해주세요.',
    products: ['Cooling Mist', 'Aloe Gel', 'Light Moisturizer']
  },
  nice: {
    emoji: '🌸',
    title: 'Great Skin Weather',
    titleKr: '피부에 좋은 날씨',
    tip: 'Conditions are ideal! Stick to your regular routine.',
    tipKr: '피부에 좋은 날씨입니다! 기존 루틴을 유지하세요.',
    products: ['Regular Routine', 'Sunscreen']
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

export default function WeatherTips() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetchWeather()
  }, [])

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
        <span>Loading weather tips... 날씨 정보 불러오는 중...</span>
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
              ? 'Enable location for personalized skincare tips based on today\'s weather.'
              : 'Could not load weather data.'}
          </p>
          <p className="weather-error-msg-kr">
            {error === 'location'
              ? '위치를 허용하면 오늘 날씨에 맞는 스킨케어 팁을 받을 수 있어요.'
              : '날씨 데이터를 불러올 수 없습니다.'}
          </p>
          {error === 'location' && (
            <button className="weather-retry-btn" onClick={fetchWeather}>📍 Enable Location 위치 허용</button>
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
          <span className="weather-temp">{weather.temp}°C</span>
          <div className="weather-stats">
            <span className="weather-stat">💧 {weather.humidity}%</span>
            <span className="weather-stat">☀️ UV {weather.uvIndex}</span>
          </div>
        </div>
        <div className="weather-main-tip">
          <span className="weather-tip-emoji">{mainAdvice.emoji}</span>
          <div>
            <div className="weather-tip-title">{mainAdvice.title} <span className="weather-tip-kr">{mainAdvice.titleKr}</span></div>
            <div className="weather-tip-text">{mainAdvice.tip}</div>
          </div>
        </div>
        <span className={'weather-expand-icon' + (expanded ? ' expanded' : '')}>▾</span>
      </div>

      {expanded && (
        <div className="weather-details">
          <div className="weather-tip-kr-detail">{mainAdvice.tipKr}</div>
          <div className="weather-products">
            <span className="weather-products-label">Recommended 추천:</span>
            {mainAdvice.products.map((p, i) => (
              <span key={i} className="weather-product-tag">{p}</span>
            ))}
          </div>
          {advice.length > 1 && advice.slice(1).map((a, i) => (
            <div key={i} className="weather-extra-tip">
              <span>{a.emoji}</span>
              <div>
                <strong>{a.title}</strong> — {a.tip}
                <div className="weather-tip-kr-detail">{a.tipKr}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
