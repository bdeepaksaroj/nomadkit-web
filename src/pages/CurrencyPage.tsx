import { useState, lazy, Suspense } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

const CountryMap = lazy(() => import('../components/CountryMap'))

const tabs = ['Emergency', 'Food', 'Scams', 'Transport', 'Visa', 'Map']

export default function CountryPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Emergency')

  const { data: country, isLoading } = useQuery({
    queryKey: ['country', code],
    queryFn: async () => {
      const res = await api.get(`/api/countries/${code}`)
      const raw = res.data.data
      return (typeof raw === 'string' ? JSON.parse(raw) : raw) as any
    },
  })

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#06060a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading...</div>
      </div>
    )
  }

  if (!country) {
    return (
      <div style={{ minHeight: '100vh', background: '#06060a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>Country not found</div>
        <Link to="/dashboard" style={{ color: '#7c3aed', fontSize: 14 }}>← Back to dashboard</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06060a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{ padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(6,6,10,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>← Back</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✈️</div>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700 }}>NomadKit</span>
          </div>
        </div>
        <Link to="/currency" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>💱 Currency</Link>
      </nav>

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '40px 40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
            <span style={{ fontSize: 64 }}>{country.flag}</span>
            <div>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 40, fontWeight: 900, letterSpacing: -2, marginBottom: 4 }}>{country.name}</h1>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: 1 }}>{country.code}</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: '10px 18px', borderRadius: '10px 10px 0 0', cursor: 'pointer', border: 'none', background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? '#06060a' : 'rgba(255,255,255,0.45)', transition: 'all 0.2s' }}>
                {tab === 'Emergency' ? '🚨' : tab === 'Food' ? '🍜' : tab === 'Scams' ? '⚠️' : tab === 'Transport' ? '🚌' : tab === 'Visa' ? '🛂' : '🗺️'} {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 40px' }}>

        {/* EMERGENCY */}
        {activeTab === 'Emergency' && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Emergency numbers</h2>
            {country.emergency ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
                {[
                  { label: 'Police', value: country.emergency.police, icon: '👮', color: '#3b82f6' },
                  { label: 'Ambulance', value: country.emergency.ambulance, icon: '🚑', color: '#ef4444' },
                  { label: 'Fire', value: country.emergency.fire, icon: '🚒', color: '#f97316' },
                  { label: 'Tourist helpline', value: country.emergency.tourist, icon: '📞', color: '#22c55e' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 28, fontFamily: "'Fraunces',serif", fontWeight: 700 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: 'rgba(255,255,255,0.4)' }}>No emergency data available.</p>}
            <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              ⚠️ Save these numbers before you travel. Emergency numbers work even without a SIM card in most countries.
            </div>
          </div>
        )}

        {/* FOOD */}
        {activeTab === 'Food' && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Food guide</h2>
            {country.food ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {country.food.must_try && (
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#22c55e', marginBottom: 12 }}>Must try</div>
                    {Array.isArray(country.food.must_try) ? country.food.must_try.map((item: any, i: number) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
                        🍽️ {typeof item === 'string' ? item : item.name || JSON.stringify(item)}
                      </div>
                    )) : <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{String(country.food.must_try)}</p>}
                  </div>
                )}
                {country.food.avoid && (
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#ef4444', marginBottom: 12 }}>Avoid</div>
                    {Array.isArray(country.food.avoid) ? country.food.avoid.map((item: any, i: number) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
                        ⚠️ {typeof item === 'string' ? item : item.name || JSON.stringify(item)}
                      </div>
                    )) : <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{String(country.food.avoid)}</p>}
                  </div>
                )}
                {country.food.tips && (
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#3b82f6', marginBottom: 12 }}>Tips</div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{typeof country.food.tips === 'string' ? country.food.tips : JSON.stringify(country.food.tips)}</p>
                  </div>
                )}
                {!country.food.must_try && !country.food.avoid && !country.food.tips && (
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' }}>
                    <pre style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{JSON.stringify(country.food, null, 2)}</pre>
                  </div>
                )}
              </div>
            ) : <p style={{ color: 'rgba(255,255,255,0.4)' }}>No food data available.</p>}
          </div>
        )}

        {/* SCAMS */}
        {activeTab === 'Scams' && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Scam alerts</h2>
            {country.scams ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array.isArray(country.scams.scams) ? country.scams.scams.map((scam: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: scam.severity === 'high' ? '#ef4444' : scam.severity === 'medium' ? '#f59e0b' : '#22c55e', flexShrink: 0 }} />
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{scam.name || scam.title || `Scam ${i + 1}`}</div>
                      {scam.severity && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: scam.severity === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: scam.severity === 'high' ? '#ef4444' : '#f59e0b', textTransform: 'uppercase' }}>{scam.severity}</span>}
                    </div>
                    {scam.description && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 10 }}>{scam.description}</p>}
                    {scam.tip && <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>✓ {scam.tip}</div>}
                  </div>
                )) : (
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' }}>
                    <pre style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{JSON.stringify(country.scams, null, 2)}</pre>
                  </div>
                )}
              </div>
            ) : <p style={{ color: 'rgba(255,255,255,0.4)' }}>No scam data available.</p>}
          </div>
        )}

        {/* TRANSPORT */}
        {activeTab === 'Transport' && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Transport info</h2>
            {country.transport ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(country.transport).filter(([k]) => k !== 'code' && k !== 'name').map(([key, value]) => (
                  <div key={key} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#3b82f6', marginBottom: 10 }}>🚌 {key.replace(/_/g, ' ')}</div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: 'rgba(255,255,255,0.4)' }}>No transport data available.</p>}
          </div>
        )}

        {/* VISA */}
        {activeTab === 'Visa' && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Visa requirements</h2>
            {country.visa ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(country.visa).filter(([k]) => k !== 'code' && k !== 'name').map(([key, value]) => (
                  <div key={key} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7c3aed', marginBottom: 10 }}>🛂 {key.replace(/_/g, ' ')}</div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: 'rgba(255,255,255,0.4)' }}>No visa data available.</p>}
          </div>
        )}

        {/* MAP */}
        {activeTab === 'Map' && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Map</h2>
            <Suspense fallback={<div style={{ height: 300, background: 'rgba(255,255,255,0.04)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading map...</div>}>
              <CountryMap countryCode={country.code} countryName={country.name} flag={country.flag} />
            </Suspense>
            <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              🗺️ Map data from OpenStreetMap. Scroll to zoom, drag to pan.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}