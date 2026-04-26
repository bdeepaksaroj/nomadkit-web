import { useState, lazy, Suspense } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

const CountryMap = lazy(() => import('../components/CountryMap'))

const tabs = [
  { id: 'Emergency', icon: '🚨', color: '#ef4444' },
  { id: 'Food', icon: '🍜', color: '#f59e0b' },
  { id: 'Scams', icon: '⚠️', color: '#f97316' },
  { id: 'Transport', icon: '🚌', color: '#3b82f6' },
  { id: 'Visa', icon: '🛂', color: '#8b5cf6' },
  { id: 'Map', icon: '🗺️', color: '#22c55e' },
]

function StringList({ items }: { items: any[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
      {items.map((item, i) => (
        <div key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, lineHeight: 1.5, border: '1px solid rgba(255,255,255,0.05)' }}>
          {typeof item === 'string' ? item : item.name || item.type || JSON.stringify(item)}
        </div>
      ))}
    </div>
  )
}

function TransportModes({ modes }: { modes: any[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
      {modes.map((m: any, i: number) => (
        <div key={i} style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 14, padding: '18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>{m.icon || '🚌'}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{m.type || m.name}</span>
          </div>
          {m.description && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 10 }}>{m.description}</p>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {m.avgCost && <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>💰 {m.avgCost}</span>}
            {m.tips && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' as const }}>💡 {m.tips}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

function Section({ label, color, icon, children }: { label: string, color: string, icon: string, children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{icon}</div>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.2, color }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

export default function CountryPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Emergency')

  const { data: country, isLoading } = useQuery({
    queryKey: ['country', code],
    queryFn: async () => {
      if (!code) throw new Error('No code')
      const res = await api.get(`/api/countries/${code}`)
      const raw = res.data.data
      return (typeof raw === 'string' ? JSON.parse(raw) : raw) as any
    },
    enabled: !!code,
  })

  if (!code || (!isLoading && !country)) {
    return (
      <div style={{ minHeight: '100vh', background: '#06060a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const, gap: 16 }}>
        <div style={{ fontSize: 48 }}>🌍</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>Country not found</div>
        <button onClick={() => navigate('/dashboard')} style={{ fontFamily: 'inherit', color: '#7c3aed', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', padding: '10px 22px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>← Back to dashboard</button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#06060a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(124,58,237,0.3)', borderTopColor: '#7c3aed', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading {code}...</div>
      </div>
    )
  }

  const food = country.food || {}
  const scams = country.scams || {}
  const transport = country.transport || {}
  const visa = country.visa || {}
  const activeTabData = tabs.find(t => t.id === activeTab)!

  return (
    <div style={{ minHeight: '100vh', background: '#06060a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .tab-item { transition: all 0.18s; cursor: pointer; }
        .tab-item:hover { background: rgba(255,255,255,0.06) !important; }
        .close-btn:hover { background: rgba(255,255,255,0.12) !important; transform: scale(1.05); }
        .fade-in { animation: fadeIn 0.3s ease both; }
      `}</style>

      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 200, background: 'rgba(6,6,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 clamp(16px,4vw,40px)', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✈️</div>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700 }}>NomadKit</span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/currency" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>💱</Link>
          {/* X close button */}
          <button
            className="close-btn"
            onClick={() => navigate('/dashboard')}
            style={{ fontFamily: 'inherit', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Hero banner */}
      <div style={{ position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${activeTabData.color}10 0%, rgba(6,6,10,0) 60%)`, borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '40px clamp(16px,4vw,40px) 0' }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: `radial-gradient(ellipse, ${activeTabData.color}15 0%, transparent 65%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* Country info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, flexShrink: 0 }}>
              {country.flag}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, letterSpacing: -2, marginBottom: 6, lineHeight: 1 }}>{country.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>{country.code}</span>
                {visa.currency && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>💱 {visa.currency}</span>}
                {visa.language && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>🗣️ {visa.language}</span>}
                {visa.timezone && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>🕐 {visa.timezone}</span>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#22c55e', fontWeight: 600 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
                  Live data
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 3, overflowX: 'auto' as const, paddingBottom: 0 }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  className="tab-item"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '10px 18px',
                    borderRadius: '10px 10px 0 0',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap' as const,
                    background: isActive ? '#fff' : 'rgba(255,255,255,0.04)',
                    color: isActive ? '#06060a' : 'rgba(255,255,255,0.4)',
                    borderBottom: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
                    transition: 'all 0.18s',
                  }}
                >
                  {tab.icon} {tab.id}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px clamp(16px,4vw,40px)' }} className="fade-in" key={activeTab}>

        {/* EMERGENCY */}
        {activeTab === 'Emergency' && (
          <div>
            {country.emergency ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 20 }}>
                  {[
                    { label: 'Police', value: country.emergency.police, icon: '👮', color: '#3b82f6', bg: '#3b82f618' },
                    { label: 'Ambulance', value: country.emergency.ambulance, icon: '🚑', color: '#ef4444', bg: '#ef444418' },
                    { label: 'Fire', value: country.emergency.fire, icon: '🚒', color: '#f97316', bg: '#f9731618' },
                    { label: 'Tourist helpline', value: country.emergency.tourist, icon: '📞', color: '#22c55e', bg: '#22c55e18' },
                  ].map(item => (
                    <div key={item.label} style={{ background: item.bg, border: `1px solid ${item.color}28`, borderRadius: 18, padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 18 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: item.bg, border: `1.5px solid ${item.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 0.7 }}>{item.label}</div>
                        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 900, color: item.color, letterSpacing: -1 }}>{item.value || 'N/A'}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px 20px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
                  <span>Save these numbers <strong style={{ color: 'rgba(255,255,255,0.8)' }}>before you travel</strong>. Emergency numbers work even without a SIM card in most countries. Screenshot this page for offline access.</span>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' as const, padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>No emergency data available.</div>
            )}
          </div>
        )}

        {/* FOOD */}
        {activeTab === 'Food' && (
          <div>
            {country.food ? (
              <>
                {food.must_try && Array.isArray(food.must_try) && food.must_try.length > 0 && (
                  <Section label="Must try" color="#22c55e" icon="🍽️">
                    <StringList items={food.must_try} />
                  </Section>
                )}
                {food.avoid && Array.isArray(food.avoid) && food.avoid.length > 0 && (
                  <Section label="Avoid" color="#ef4444" icon="⚠️">
                    <StringList items={food.avoid} />
                  </Section>
                )}
                {food.tips && (
                  <Section label="Tips" color="#3b82f6" icon="💡">
                    {Array.isArray(food.tips)
                      ? <StringList items={food.tips} />
                      : <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>{String(food.tips)}</p>}
                  </Section>
                )}
                {food.dietary && (
                  <Section label="Dietary info" color="#a78bfa" icon="🥗">
                    {Array.isArray(food.dietary)
                      ? <StringList items={food.dietary} />
                      : <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>{String(food.dietary)}</p>}
                  </Section>
                )}
                {food.restaurants && (
                  <Section label="Where to eat" color="#f59e0b" icon="🏪">
                    {Array.isArray(food.restaurants)
                      ? <StringList items={food.restaurants} />
                      : <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>{String(food.restaurants)}</p>}
                  </Section>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center' as const, padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>No food data available.</div>
            )}
          </div>
        )}

        {/* SCAMS */}
        {activeTab === 'Scams' && (
          <div>
            {country.scams ? (
              <>
                {Array.isArray(scams.scams) && scams.scams.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 16 }}>
                    {scams.scams.map((scam: any, i: number) => {
                      const sevColor = scam.severity === 'high' ? '#ef4444' : scam.severity === 'medium' ? '#f59e0b' : '#22c55e'
                      return (
                        <div key={i} style={{ background: `${sevColor}08`, border: `1px solid ${sevColor}20`, borderRadius: 16, padding: '20px 22px', borderLeft: `3px solid ${sevColor}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>{scam.name || scam.title || `Scam ${i + 1}`}</div>
                            {scam.severity && <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${sevColor}18`, color: sevColor, textTransform: 'uppercase' as const, border: `1px solid ${sevColor}25` }}>{scam.severity}</span>}
                          </div>
                          {scam.description && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: scam.tip ? 12 : 0 }}>{scam.description}</p>}
                          {scam.tip && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, padding: '10px 12px' }}>
                              <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>✓</span>
                              <span style={{ fontSize: 13, color: '#22c55e', lineHeight: 1.5 }}>{scam.tip}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 14, padding: '24px', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>
                    ✅ No major scams reported for this country.
                  </div>
                )}
                {scams.general_tips && Array.isArray(scams.general_tips) && scams.general_tips.length > 0 && (
                  <Section label="General tips" color="#22c55e" icon="💡">
                    <StringList items={scams.general_tips} />
                  </Section>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center' as const, padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>No scam data available.</div>
            )}
          </div>
        )}

        {/* TRANSPORT */}
        {activeTab === 'Transport' && (
          <div>
            {country.transport ? (
              <>
                {transport.overview && (
                  <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 16, padding: '20px 22px', marginBottom: 20, fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
                    🚌 {transport.overview}
                  </div>
                )}
                {transport.modes && Array.isArray(transport.modes) && transport.modes.length > 0 && (
                  <Section label="Transport modes" color="#3b82f6" icon="🚌">
                    <TransportModes modes={transport.modes} />
                  </Section>
                )}
                {transport.apps && Array.isArray(transport.apps) && transport.apps.length > 0 && (
                  <Section label="Useful apps" color="#a78bfa" icon="📱">
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                      {transport.apps.map((app: any, i: number) => (
                        <div key={i} style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '10px 16px', fontSize: 13 }}>
                          <span style={{ fontWeight: 700 }}>{app.name}</span>
                          {app.use && <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>— {app.use}</span>}
                          {app.free && <span style={{ marginLeft: 8, fontSize: 10, color: '#22c55e', fontWeight: 700, background: 'rgba(34,197,94,0.1)', padding: '2px 6px', borderRadius: 4 }}>FREE</span>}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
                {transport.airportToCity && (
                  <Section label="Airport to city" color="#f59e0b" icon="✈️">
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, padding: '12px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10 }}>
                      {transport.airportToCity}
                    </div>
                  </Section>
                )}
                {transport.tips && Array.isArray(transport.tips) && transport.tips.length > 0 && (
                  <Section label="Tips" color="#22c55e" icon="💡">
                    <StringList items={transport.tips} />
                  </Section>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center' as const, padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>No transport data available.</div>
            )}
          </div>
        )}

        {/* VISA */}
        {activeTab === 'Visa' && (
          <div>
            {country.visa ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10, marginBottom: 20 }}>
                  {[
                    { label: 'Currency', value: visa.currency, icon: '💱', color: '#f59e0b' },
                    { label: 'Language', value: visa.language, icon: '🗣️', color: '#3b82f6' },
                    { label: 'Timezone', value: visa.timezone, icon: '🕐', color: '#8b5cf6' },
                    { label: 'Plug type', value: visa.plugType, icon: '🔌', color: '#22c55e' },
                    { label: 'Voltage', value: visa.voltage, icon: '⚡', color: '#ef4444' },
                  ].filter(i => i.value).map(item => (
                    <div key={item.label} style={{ background: `${item.color}08`, border: `1px solid ${item.color}20`, borderRadius: 14, padding: '16px' }}>
                      <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                {visa.visaFree && Array.isArray(visa.visaFree) && visa.visaFree.length > 0 && (
                  <Section label="Visa free for" color="#22c55e" icon="✅">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                      {visa.visaFree.map((c: string, i: number) => (
                        <span key={i} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 600, border: '1px solid rgba(34,197,94,0.2)' }}>{c}</span>
                      ))}
                    </div>
                  </Section>
                )}
                {visa.visaOnArrival && Array.isArray(visa.visaOnArrival) && visa.visaOnArrival.length > 0 && (
                  <Section label="Visa on arrival" color="#f59e0b" icon="🛬">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                      {visa.visaOnArrival.map((c: string, i: number) => (
                        <span key={i} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 600, border: '1px solid rgba(245,158,11,0.2)' }}>{c}</span>
                      ))}
                    </div>
                  </Section>
                )}
                {visa.eVisa && Array.isArray(visa.eVisa) && visa.eVisa.length > 0 && (
                  <Section label="e-Visa available" color="#3b82f6" icon="💻">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                      {visa.eVisa.map((c: string, i: number) => (
                        <span key={i} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)' }}>{c}</span>
                      ))}
                    </div>
                  </Section>
                )}
                {visa.requirements && Array.isArray(visa.requirements) && visa.requirements.length > 0 && (
                  <Section label="Requirements" color="#a78bfa" icon="📋">
                    <StringList items={visa.requirements} />
                  </Section>
                )}
                {visa.customsRules && Array.isArray(visa.customsRules) && visa.customsRules.length > 0 && (
                  <Section label="Customs rules" color="#f97316" icon="🛃">
                    <StringList items={visa.customsRules} />
                  </Section>
                )}
                {visa.importantNotes && Array.isArray(visa.importantNotes) && visa.importantNotes.length > 0 && (
                  <Section label="Important notes" color="#ef4444" icon="⚠️">
                    <StringList items={visa.importantNotes} />
                  </Section>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center' as const, padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>No visa data available.</div>
            )}
          </div>
        )}

        {/* MAP */}
        {activeTab === 'Map' && (
          <div>
            <Suspense fallback={
              <div style={{ height: 360, background: 'rgba(255,255,255,0.04)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
                Loading map...
              </div>
            }>
              <CountryMap countryCode={country.code} countryName={country.name} flag={country.flag} />
            </Suspense>
            <div style={{ marginTop: 14, padding: '14px 18px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>🗺️</span>
              <span>Powered by OpenStreetMap. Free forever. Scroll to zoom, drag to pan.</span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}