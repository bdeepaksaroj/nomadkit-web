import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

const FREE_LIMIT = 3

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const storageKey = `freeCountries_${user?.id || 'guest'}`
  const [savedFree, setSavedFree] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
  })
  const [search, setSearch] = useState('')

  const { data: subData } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await api.get('/api/subscription/status')
      return res.data
    },
  })

  const { data: countriesData, isLoading } = useQuery({
    queryKey: ['countries'],
queryFn: async () => {
  const res = await api.get('/api/countries')
  const raw = res.data.data
  const parsed = (typeof raw === 'string' ? JSON.parse(raw) : raw) as any[]
  return parsed.filter((c: any) => c && c.code)
},
  })

  const isSubscribed = subData?.subscribed
  const countries = countriesData || []
  const filtered = search
    ? countries.filter((c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : countries

  const handleLogout = async () => {
    try { await api.post('/api/auth/logout') } catch {}
    clearAuth()
    navigate('/')
    toast.success('Logged out')
  }

  const toggleFreeCountry = (code: string) => {
    setSavedFree(prev => {
      if (prev.includes(code)) {
        toast.error('🔒 This country is permanently locked. Upgrade to Pro to change your selection.')
        return prev
      }
      if (prev.length >= FREE_LIMIT) {
        toast.error(`Free plan allows only ${FREE_LIMIT} countries. Upgrade to Pro for all 194.`)
        return prev
      }
      const next = [...prev, code]
      localStorage.setItem(storageKey, JSON.stringify(next))
      const remaining = FREE_LIMIT - next.length
      if (remaining === 0) {
        toast.success('🔒 All 3 countries locked in permanently!')
      } else {
        toast.success(`✓ ${code} added — you can still pick ${remaining} more`)
      }
      return next
    })
  }

  const isFullyLocked = !isSubscribed && savedFree.length >= FREE_LIMIT
  const displayCountries = isSubscribed
    ? filtered
    : countries.filter((c: any) => savedFree.includes(c.code))

  return (
    <div style={{ minHeight: '100vh', background: '#06060a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap" rel="stylesheet" />
      <style>{`
        .country-card { transition: all 0.2s; }
        .country-card:hover { background: rgba(124,58,237,0.1) !important; border-color: rgba(124,58,237,0.3) !important; transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
        .select-card { transition: all 0.2s; cursor: pointer; }
        .select-card:hover { border-color: rgba(124,58,237,0.4) !important; transform: translateY(-2px); }
        .locked-card { cursor: not-allowed; }
        .nav-btn { transition: all 0.2s; }
        .nav-btn:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { outline: none; border-color: rgba(124,58,237,0.5) !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 clamp(16px,4vw,40px)', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6,6,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>✈️</div>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700 }}>NomadKit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/currency" className="nav-btn" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', display: 'inline-block' }}>💱 Currency</Link>
          {!isSubscribed && (
            <Link to="/subscribe" className="nav-btn" style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)', display: 'inline-block' }}>⚡ Upgrade</Link>
          )}
          <Link to="/account" className="nav-btn" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', display: 'inline-block' }}>{user?.name}</Link>
          <button onClick={handleLogout} className="nav-btn" style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.4)', padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px,4vw,48px) clamp(16px,4vw,40px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#7c3aed', marginBottom: 10 }}>Your travel companion</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>
            Where to next,{' '}
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}?</em>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>
            {isSubscribed
              ? 'Search any of the 194 countries for emergency contacts, food guides, scam alerts and more.'
              : isFullyLocked
                ? '🔒 Your countries are permanently locked. Upgrade to access all 194.'
                : `Free plan — pick up to ${FREE_LIMIT} countries. Once picked, a country is locked forever.`}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 36 }}>
          {[
            { icon: '🌍', label: 'Countries', value: isSubscribed ? '194' : `${savedFree.length}/${FREE_LIMIT}` },
            { icon: '🚨', label: 'Emergency', value: 'Always on' },
            { icon: '💱', label: 'Currencies', value: '150+' },
            { icon: '⚠️', label: 'Scam alerts', value: 'Live' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FREE PLAN ── */}
        {!isSubscribed && (
          <>
            {/* Info banner */}
            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>
                  {isFullyLocked
                    ? `🔒 All ${FREE_LIMIT} slots used — countries locked permanently`
                    : `Free plan — ${savedFree.length}/${FREE_LIMIT} countries selected`}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  {isFullyLocked
                    ? 'Upgrade to Pro to access all 194 countries and change your selection anytime.'
                    : `You can pick up to ${FREE_LIMIT} countries. Once selected, each country is permanently locked.`}
                </div>
              </div>
              <Link to="/subscribe" style={{ fontFamily: 'inherit', fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', padding: '8px 18px', borderRadius: 8, display: 'inline-block', whiteSpace: 'nowrap' }}>
                Upgrade to Pro →
              </Link>
            </div>

            {/* Selected countries */}
            {savedFree.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Your locked countries
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 10 }}>
                  {displayCountries.map((country: any) => (
                    <Link
                      key={country.code}
                      to={`/country/${country.code}`}
                      className="country-card"
                      style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: '18px 10px', textAlign: 'center', display: 'block', position: 'relative' }}
                    >
                      <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 10 }}>🔒</div>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{country.flag}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#c4b5fd', lineHeight: 1.3 }}>{country.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{country.code}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Pick more countries — only if not fully locked */}
            {!isFullyLocked && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Pick from all countries ({FREE_LIMIT - savedFree.length} slot{FREE_LIMIT - savedFree.length !== 1 ? 's' : ''} remaining)
                </div>

                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>🔍</span>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search countries..."
                    style={{ fontFamily: 'inherit', width: '100%', fontSize: 15, padding: '13px 16px 13px 44px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                  />
                  {search && (
                    <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>×</button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 10 }}>
                  {filtered.filter((c: any) => !savedFree.includes(c.code)).map((country: any) => (
                    <div
                      key={country.code}
                      className="select-card"
                      onClick={() => toggleFreeCountry(country.code)}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 10px', textAlign: 'center', position: 'relative' }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{country.flag}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>{country.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{country.code}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upgrade banner */}
            <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(37,99,235,0.08))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🌍</div>
              <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 10 }}>Unlock all 194 countries</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.7 }}>
                Upgrade to Pro to access all countries with emergency contacts,<br />
                food guides, scam alerts, visa info, maps and live currency.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/subscribe" style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', padding: '13px 28px', borderRadius: 12, display: 'inline-block' }}>
                  Get Pro — $4.99/month →
                </Link>
                <Link to="/subscribe" style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 600, background: 'rgba(124,58,237,0.15)', color: '#a78bfa', padding: '13px 22px', borderRadius: 12, display: 'inline-block', border: '1px solid rgba(124,58,237,0.3)' }}>
                  Pro + Chat — $7.99/month
                </Link>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>Cancel anytime · Instant access · No hidden fees</p>
            </div>
          </>
        )}

        {/* ── SUBSCRIBED ── */}
        {isSubscribed && (
          <>
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search 194 countries..."
                style={{ fontFamily: 'inherit', width: '100%', fontSize: 15, padding: '14px 16px 14px 44px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>×</button>
              )}
            </div>

            {search && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
              </div>
            )}

            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 10 }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, height: 90 }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 10 }}>
                {filtered.map((country: any) => (
                  <Link
                    key={country.code}
                    to={`/country/${country.code}`}
                    className="country-card"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 10px', textAlign: 'center', display: 'block' }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{country.flag}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>{country.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{country.code}</div>
                  </Link>
                ))}
              </div>
            )}

            {filtered.length === 0 && !isLoading && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>No countries found for "{search}"</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}