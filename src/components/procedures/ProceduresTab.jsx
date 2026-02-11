import { useState } from 'react'
import { proceduresData } from '../../data/procedures'
import { clinicsData } from '../../data/clinics'

export default function ProceduresTab() {
  const [activeSub, setActiveSub] = useState('procedures')

  return (
    <section className="tab-panel" id="procedures">
      <div className="ai-tool-tabs">
        <button className={'sub-tab-btn' + (activeSub === 'procedures' ? ' active' : '')} onClick={() => setActiveSub('procedures')}>
          💉 Procedures 시술
        </button>
        <button className={'sub-tab-btn' + (activeSub === 'clinics' ? ' active' : '')} onClick={() => setActiveSub('clinics')}>
          🏥 Clinics 클리닉
        </button>
      </div>

      {activeSub === 'procedures' && <ProceduresList />}
      {activeSub === 'clinics' && <ClinicFinder />}
    </section>
  )
}

function ProceduresList() {
  const [expanded, setExpanded] = useState(null)

  function toggle(i) {
    setExpanded(prev => prev === i ? null : i)
  }

  return (
    <div className="proc-grid">
      {proceduresData.map((p, i) => {
        const isOpen = expanded === i
        const medal = i === 0 ? ' proc-gold' : i === 1 ? ' proc-silver' : i === 2 ? ' proc-bronze' : ''
        return (
          <div key={i} className={'proc-card' + medal + (isOpen ? ' proc-expanded' : '')} onClick={() => toggle(i)}>
            {i < 3 && <div className="proc-medal">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>}
            <div className="proc-icon">{p.emoji}</div>
            <div className="proc-title">{p.english}</div>
            <div className="proc-sub">{p.korean}</div>
            <div className="proc-rank">{p.rank}</div>
            <div className="proc-tags-row">
              {p.tags.slice(0, 2).map((t, j) => <span key={j} className="proc-tag">{t}</span>)}
            </div>

            {isOpen && (
              <div className="proc-details" onClick={e => e.stopPropagation()}>
                <div className="proc-desc">{p.description}</div>
                <div className="proc-desc-kr">{p.descriptionKr}</div>

                <div className="proc-info-grid">
                  <div className="proc-info-item">
                    <span className="proc-info-label">Price 가격</span>
                    <span className="proc-info-val">{p.priceKRW}</span>
                    <span className="proc-info-sub">{p.priceUSD}</span>
                  </div>
                  <div className="proc-info-item">
                    <span className="proc-info-label">Duration 시간</span>
                    <span className="proc-info-val">{p.duration}</span>
                  </div>
                  <div className="proc-info-item">
                    <span className="proc-info-label">Downtime 회복</span>
                    <span className="proc-info-val">{p.downtime}</span>
                  </div>
                  <div className="proc-info-item">
                    <span className="proc-info-label">Lasts 유지기간</span>
                    <span className="proc-info-val">{p.lasts}</span>
                  </div>
                </div>

                <button className="proc-close-btn" onClick={() => setExpanded(null)}>Close ▴</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ClinicFinder() {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filters = ['all', 'botox', 'filler', 'laser', 'skincare', 'lifting']
  const filtered = filter === 'all' ? clinicsData : clinicsData.filter(c => c.specialties.includes(filter))

  function toggle(i) {
    setExpanded(prev => prev === i ? null : i)
  }

  return (
    <div className="clinics-section">
      <div className="clinic-filter">
        {filters.map(f => (
          <button
            key={f}
            className={'filter-btn' + (filter === f ? ' active' : '')}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="clinics-grid">
        {filtered.map((c, i) => {
          const isOpen = expanded === i
          const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.korean + ' ' + c.areaKr)
          const naverMapUrl = 'https://map.naver.com/p/search/' + encodeURIComponent(c.korean)
          const googleReviewUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.korean + ' ' + c.areaKr + ' 리뷰')

          return (
            <div key={i} className={'clinic-card' + (isOpen ? ' clinic-expanded' : '')} onClick={() => toggle(i)}>
              <div className="clinic-icon">🏥</div>
              <div className="clinic-title">{c.name}</div>
              <div className="clinic-sub">{c.korean}</div>
              <div className="clinic-rating-big">{c.rating}</div>
              <div className="clinic-stars">{'★'.repeat(Math.floor(c.rating))}{'☆'.repeat(5 - Math.floor(c.rating))}</div>
              <div className="clinic-meta-line">📍 {c.area} · {c.priceRange}</div>
              {c.englishOk && <span className="english-badge">EN OK</span>}

              {isOpen && (
                <div className="clinic-details" onClick={e => e.stopPropagation()}>
                  <div className="clinic-detail-row">
                    <span className="clinic-detail-label">Location</span>
                    <span>{c.area} {c.areaKr}</span>
                  </div>
                  <div className="clinic-detail-row">
                    <span className="clinic-detail-label">Popular</span>
                    <span>{c.popular}</span>
                  </div>
                  <div className="clinic-detail-row">
                    <span className="clinic-detail-label">Reviews</span>
                    <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="clinic-review-link">{c.reviews} reviews →</a>
                  </div>
                  <div className="clinic-map-btns">
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="map-btn google-btn">Google Maps</a>
                    <a href={naverMapUrl} target="_blank" rel="noopener noreferrer" className="map-btn naver-btn">네이버 지도</a>
                  </div>
                  <button className="clinic-close-btn" onClick={() => setExpanded(null)}>Close ▴</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
