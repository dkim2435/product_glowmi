import { useState, useEffect } from 'react'
import { proceduresData } from '../../data/procedures'
import { clinicsData } from '../../data/clinics'
import { useLang } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { loadAnalysisResults } from '../../lib/db'
import { Syringe, Bot, Hospital, Microscope } from 'lucide-react'

/** Map skin concerns to procedure tags */
const CONCERN_TAG_MAP = {
  redness: { tags: ['Regeneration', 'Glass Skin', 'Hydration'], label: 'Redness', labelKr: '홍조' },
  oiliness: { tags: ['Pores', 'Hydration', 'Beginner-Friendly'], label: 'Oiliness', labelKr: '유분' },
  dryness: { tags: ['Hydration', 'Glass Skin', 'Regeneration'], label: 'Dryness', labelKr: '건조' },
  darkSpots: { tags: ['Brightening', 'Pigmentation', 'Acne Scars'], label: 'Dark Spots', labelKr: '잡티' },
  texture: { tags: ['Pores', 'Acne Scars', 'Brightening', 'Beginner-Friendly'], label: 'Texture', labelKr: '피부결' },
}

function getRecommendedProcedures(skinScores) {
  if (!skinScores) return []
  const scored = new Map()

  // Sort concerns by score (highest first)
  const concerns = Object.entries(skinScores)
    .filter(([k]) => CONCERN_TAG_MAP[k])
    .sort((a, b) => b[1] - a[1])

  for (const [concern, score] of concerns) {
    const map = CONCERN_TAG_MAP[concern]
    if (!map || score < 15) continue
    for (const proc of proceduresData) {
      const matchCount = proc.tags.filter(t => map.tags.includes(t)).length
      if (matchCount > 0) {
        const existing = scored.get(proc.english) || { proc, score: 0, reasons: [] }
        existing.score += matchCount * score
        if (!existing.reasons.find(r => r.concern === concern)) {
          existing.reasons.push({ concern, score, label: map.label, labelKr: map.labelKr })
        }
        scored.set(proc.english, existing)
      }
    }
  }

  return [...scored.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

export default function ProceduresTab() {
  const [activeSub, setActiveSub] = useState('procedures')
  const { t } = useLang()
  const { user, loginWithGoogle } = useAuth()

  function handleAIRecClick() {
    if (!user) {
      if (confirm(t(
        'Sign up (free) to get personalized procedure recommendations! Continue to login?',
        '맞춤 시술 추천은 무료 가입 후 이용 가능해요! 로그인할까요?'
      ))) {
        loginWithGoogle()
      }
      return
    }
    setActiveSub('aiRec')
  }

  return (
    <section className="tab-panel" id="procedures">
      <div className="ai-tool-tabs">
        <button className={'sub-tab-btn' + (activeSub === 'procedures' ? ' active' : '')} onClick={() => setActiveSub('procedures')}>
          <Syringe size={16} /> {t('Procedures', '시술')}
        </button>
        <button className={'sub-tab-btn sub-tab-highlight' + (activeSub === 'aiRec' ? ' active' : '')} onClick={handleAIRecClick}>
          <Bot size={16} /> {t('AI Rec', 'AI 추천')}
        </button>
        <button className={'sub-tab-btn' + (activeSub === 'clinics' ? ' active' : '')} onClick={() => setActiveSub('clinics')}>
          <Hospital size={16} /> {t('Clinics', '클리닉')}
        </button>
      </div>

      {activeSub === 'procedures' && <ProceduresList />}
      {activeSub === 'aiRec' && <ProcedureRec />}
      {activeSub === 'clinics' && <ClinicFinder />}
    </section>
  )
}

function ProcedureRec() {
  const { user } = useAuth()
  const { t } = useLang()
  const [skinScores, setSkinScores] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (user) {
      loadAnalysisResults(user.id).then(data => {
        if (data && data.skin_redness) {
          setSkinScores({
            redness: data.skin_redness,
            oiliness: data.skin_oiliness,
            dryness: data.skin_dryness,
            darkSpots: data.skin_dark_spots,
            texture: data.skin_texture,
          })
        }
        setLoading(false)
      }).catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <div className="proc-rec-empty">
        <span className="proc-rec-spinner" />
        <p>{t('Loading your skin data...', '피부 데이터를 불러오는 중...')}</p>
      </div>
    )
  }

  if (!skinScores) {
    return (
      <div className="proc-rec-empty">
        <span className="proc-rec-icon"><Microscope size={32} /></span>
        <h4>{t('Skin analysis needed', '피부 분석이 필요해요')}</h4>
        <p>{t(
          'Take a skin analysis first in the AI Beauty tab, then come back here to see personalized procedure recommendations!',
          'AI 뷰티 탭에서 피부 분석을 먼저 해주세요. 그 결과를 바탕으로 맞춤 시술을 안내해드릴게요!'
        )}</p>
      </div>
    )
  }

  const recs = getRecommendedProcedures(skinScores)

  // Top 2 concerns for summary
  const topConcerns = Object.entries(skinScores)
    .filter(([k]) => CONCERN_TAG_MAP[k])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)

  return (
    <div className="proc-rec-section">
      <div className="proc-rec-header">
        <h4>{t('Procedures for Your Skin', '내 피부에 맞는 시술')}</h4>
        <p className="proc-rec-subtitle">
          {t('Based on your skin analysis:', '피부 분석 결과 기반:')}
          {' '}
          {topConcerns.map(([k, v]) => {
            const map = CONCERN_TAG_MAP[k]
            return map ? `${t(map.label, map.labelKr)} ${v}` : ''
          }).filter(Boolean).join(' · ')}
        </p>
      </div>

      <div className="proc-rec-disclaimer">
        {t(
          'For reference only. Please consult a dermatologist before any procedure.',
          '참고용 정보입니다. 시술 전 반드시 전문의와 상담하세요.'
        )}
      </div>

      <div className="proc-rec-list">
        {recs.map(({ proc, reasons }, i) => {
          const isOpen = expanded === i
          return (
            <div key={i} className={'proc-rec-card' + (isOpen ? ' proc-rec-expanded' : '')} onClick={() => setExpanded(isOpen ? null : i)}>
              <div className="proc-rec-card-top">
                <span className="proc-rec-rank">#{i + 1}</span>
                <span className="proc-rec-emoji">{proc.emoji}</span>
                <div className="proc-rec-info">
                  <div className="proc-rec-name">{t(proc.english, proc.korean)}</div>
                  <div className="proc-rec-reasons">
                    {reasons.map((r, j) => (
                      <span key={j} className="proc-rec-reason-tag">
                        {t(r.label, r.labelKr)} {r.score}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="proc-rec-chevron">{isOpen ? '▴' : '▾'}</span>
              </div>

              {isOpen && (
                <div className="proc-rec-detail" onClick={e => e.stopPropagation()}>
                  <p className="proc-rec-desc">{t(proc.description, proc.descriptionKr)}</p>
                  <div className="proc-info-grid">
                    <div className="proc-info-item">
                      <span className="proc-info-label">{t('Price', '가격')}</span>
                      <span className="proc-info-val">{proc.priceKRW}</span>
                      <span className="proc-info-sub">{proc.priceUSD}</span>
                    </div>
                    <div className="proc-info-item">
                      <span className="proc-info-label">{t('Duration', '시간')}</span>
                      <span className="proc-info-val">{proc.duration}</span>
                    </div>
                    <div className="proc-info-item">
                      <span className="proc-info-label">{t('Downtime', '회복')}</span>
                      <span className="proc-info-val">{proc.downtime}</span>
                    </div>
                    <div className="proc-info-item">
                      <span className="proc-info-label">{t('Lasts', '유지기간')}</span>
                      <span className="proc-info-val">{proc.lasts}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {recs.length === 0 && (
        <div className="proc-rec-empty">
          <p>{t('Your skin scores are great! No specific procedures needed.', '피부 상태가 좋아서 특별히 추천할 시술이 없어요!')}</p>
        </div>
      )}
    </div>
  )
}

function ProceduresList() {
  const [expanded, setExpanded] = useState(null)
  const { t } = useLang()
  const { user, loginWithGoogle } = useAuth()

  function toggle(i) {
    if (i < 3 && !user) return
    setExpanded(prev => prev === i ? null : i)
  }

  return (
    <div className="proc-grid">
      {proceduresData.map((p, i) => {
        const isOpen = expanded === i
        const medal = i === 0 ? ' proc-gold' : i === 1 ? ' proc-silver' : i === 2 ? ' proc-bronze' : ''
        const isGated = i < 3 && !user
        return (
          <div key={i} className={'proc-card' + medal + (isOpen ? ' proc-expanded' : '') + (isGated ? ' proc-gated' : '')} onClick={() => toggle(i)}>
            {i < 3 && <div className="proc-medal">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>}
            <div className="proc-icon">{p.emoji}</div>
            <div className="proc-title">{t(p.english, p.korean)}</div>
            <div className="proc-rank">{p.rank}</div>
            <div className="proc-tags-row">
              {p.tags.slice(0, 2).map((tag, j) => <span key={j} className="proc-tag">{tag}</span>)}
            </div>

            {isGated && (
              <div className="proc-gated-overlay" onClick={e => e.stopPropagation()}>
                <button className="primary-btn" onClick={loginWithGoogle}>{t('Sign up free to unlock', '무료 가입하고 보기')}</button>
              </div>
            )}

            {isOpen && (
              <div className="proc-details" onClick={e => e.stopPropagation()}>
                <div className="proc-desc">{t(p.description, p.descriptionKr)}</div>

                <div className="proc-info-grid">
                  <div className="proc-info-item">
                    <span className="proc-info-label">{t('Price', '가격')}</span>
                    <span className="proc-info-val">{p.priceKRW}</span>
                    <span className="proc-info-sub">{p.priceUSD}</span>
                  </div>
                  <div className="proc-info-item">
                    <span className="proc-info-label">{t('Duration', '시간')}</span>
                    <span className="proc-info-val">{p.duration}</span>
                  </div>
                  <div className="proc-info-item">
                    <span className="proc-info-label">{t('Downtime', '회복')}</span>
                    <span className="proc-info-val">{p.downtime}</span>
                  </div>
                  <div className="proc-info-item">
                    <span className="proc-info-label">{t('Lasts', '유지기간')}</span>
                    <span className="proc-info-val">{p.lasts}</span>
                  </div>
                </div>

                <button className="proc-close-btn" onClick={() => setExpanded(null)}>{t('Close', '닫기')} ▴</button>
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
  const { t } = useLang()

  const FILTER_LABELS = {
    all: { en: 'All', kr: '전체' },
    botox: { en: 'Botox', kr: '보톡스' },
    filler: { en: 'Filler', kr: '필러' },
    laser: { en: 'Laser', kr: '레이저' },
    lifting: { en: 'Lifting', kr: '리프팅' },
    pico: { en: 'Pico', kr: '피코' },
    skinbooster: { en: 'Skin Booster', kr: '스킨부스터' },
    thread: { en: 'Thread', kr: '실리프팅' },
    aquapeel: { en: 'Aqua Peel', kr: '아쿠아필' },
  }
  const filters = Object.keys(FILTER_LABELS)
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
            {t(FILTER_LABELS[f].en, FILTER_LABELS[f].kr)}
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
              <div className="clinic-icon"><Hospital size={20} /></div>
              <div className="clinic-title">{t(c.name, c.korean)}</div>
              <div className="clinic-rating-big">{c.rating}</div>
              <div className="clinic-stars">{'★'.repeat(Math.floor(c.rating))}{'☆'.repeat(5 - Math.floor(c.rating))}</div>
              <div className="clinic-meta-line">📍 {t(c.area, c.areaKr)} · {c.priceRange}</div>
              {c.englishOk && <span className="english-badge">EN OK</span>}

              {isOpen && (
                <div className="clinic-details" onClick={e => e.stopPropagation()}>
                  <div className="clinic-detail-row">
                    <span className="clinic-detail-label">{t('Location', '위치')}</span>
                    <span>{t(c.area, c.areaKr)}</span>
                  </div>
                  <div className="clinic-detail-row">
                    <span className="clinic-detail-label">{t('Popular', '인기')}</span>
                    <span>{c.popular}</span>
                  </div>
                  <div className="clinic-detail-row">
                    <span className="clinic-detail-label">{t('Reviews', '리뷰')}</span>
                    <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="clinic-review-link">{c.reviews} {t('reviews', '리뷰')} →</a>
                  </div>
                  <div className="clinic-map-btns">
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="map-btn google-btn">{t('Google Maps', '구글 지도')}</a>
                    <a href={naverMapUrl} target="_blank" rel="noopener noreferrer" className="map-btn naver-btn">네이버 지도</a>
                  </div>
                  <button className="clinic-close-btn" onClick={() => setExpanded(null)}>{t('Close', '닫기')} ▴</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
