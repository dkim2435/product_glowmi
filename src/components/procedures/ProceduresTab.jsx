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
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <div className="procedures-grid">
      {proceduresData.map((p, i) => (
        <div
          key={i}
          className={'procedure-card' + (i === 0 ? ' procedure-card-top' : '') + (openIdx === i ? ' open' : '')}
          onClick={() => setOpenIdx(openIdx === i ? null : i)}
        >
          <div className="procedure-header">
            <div>
              <div className="procedure-title">{p.english}</div>
              <div className="procedure-title-korean">{p.korean}</div>
            </div>
            <div className="procedure-header-right">
              <span className="procedure-rank">{p.rank}</span>
              <span className="procedure-chevron">&#9660;</span>
            </div>
          </div>
          <div className="procedure-tags">
            {p.tags.map((tag, j) => <span key={j} className="tag">{tag}</span>)}
          </div>
          <div className="procedure-body">
            <p className="procedure-description">{p.description}</p>
            <div className="procedure-details">
              <div className="detail-item"><div className="detail-label">Price</div><div className="detail-value">{p.priceKRW}</div><div className="detail-value-sub">{p.priceUSD}</div></div>
              <div className="detail-item"><div className="detail-label">Duration</div><div className="detail-value">{p.duration}</div></div>
              <div className="detail-item"><div className="detail-label">Downtime</div><div className="detail-value">{p.downtime}</div></div>
              <div className="detail-item"><div className="detail-label">Lasts</div><div className="detail-value">{p.lasts}</div></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ClinicFinder() {
  const [filter, setFilter] = useState('all')

  const filters = ['all', 'botox', 'filler', 'laser', 'skincare', 'lifting']
  const filtered = filter === 'all' ? clinicsData : clinicsData.filter(c => c.specialties.includes(filter))

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
          const stars = Array.from({ length: 5 }, (_, s) => s < Math.floor(c.rating) ? '★' : '☆').join('')
          const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.korean + ' ' + c.areaKr)
          const naverMapUrl = 'https://map.naver.com/p/search/' + encodeURIComponent(c.korean)
          const googleReviewUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.korean + ' ' + c.areaKr + ' 리뷰')

          return (
            <div key={i} className="clinic-card">
              <div className="clinic-header">
                <div className="clinic-name">{c.name}{c.englishOk && <span className="english-badge">EN</span>}</div>
                <div className="clinic-name-kr">{c.korean}</div>
              </div>
              <div className="clinic-location">📍 {c.area} {c.areaKr}</div>
              <div className="clinic-rating">
                <span className="stars">{stars}</span> {c.rating}{' '}
                <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="review-link" onClick={e => e.stopPropagation()}>
                  ({c.reviews} reviews)
                </a>
              </div>
              <div className="clinic-popular">✨ {c.popular}</div>
              <div className="clinic-price">{c.priceRange}</div>
              <div className="clinic-maps">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="map-btn google-btn">Google Maps</a>
                <a href={naverMapUrl} target="_blank" rel="noopener noreferrer" className="map-btn naver-btn">네이버 지도</a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
