import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export default function CurrencyPage() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const [amount, setAmount] = useState('100')
  const [result, setResult] = useState<any>(null)
  const [converting, setConverting] = useState(false)

  const { data: ratesData, isLoading } = useQuery({
    queryKey: ['currency-rates'],
    queryFn: async () => {
      const res = await api.get('/api/currency/rates')
      const raw = res.data.data
      return (typeof raw === 'string' ? JSON.parse(raw) : raw)
    },
  })

  const currencies = ratesData?.rates ? Object.keys(ratesData.rates).sort() : ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'AED']

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount))) return
    setConverting(true)
    try {
      const res = await api.get(`/api/currency/convert?from=${from}&to=${to}&amount=${amount}`)
      setResult(res.data)
    } catch {
      setResult(null)
    } finally {
      setConverting(false)
    }
  }

  const swap = () => {
    setFrom(to)
    setTo(from)
    setResult(null)
  }

  const popularPairs = [
    { from: 'USD', to: 'INR', label: 'USD → INR' },
    { from: 'USD', to: 'EUR', label: 'USD → EUR' },
    { from: 'GBP', to: 'INR', label: 'GBP → INR' },
    { from: 'USD', to: 'JPY', label: 'USD → JPY' },
    { from: 'EUR', to: 'GBP', label: 'EUR → GBP' },
    { from: 'USD', to: 'AED', label: 'USD → AED' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#06060a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap" rel="stylesheet" />
      <style>{`
        select { cursor: pointer; }
        select option { background: #1a1a2e; color: #fff; }
        .pair-btn { transition: all 0.18s; cursor: pointer; }
        .pair-btn:hover { background: rgba(124,58,237,0.15) !important; border-color: rgba(124,58,237,0.4) !important; }
        .convert-btn { transition: all 0.2s; }
        .convert-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(124,58,237,0.4); }
        .close-btn { transition: all 0.18s; }
        .close-btn:hover { background: rgba(255,255,255,0.12) !important; transform: scale(1.05); }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { outline: none; border-color: rgba(124,58,237,0.5) !important; }
        select:focus { outline: none; border-color: rgba(124,58,237,0.5) !important; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease both; }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 clamp(16px,4vw,40px)', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6,6,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✈️</div>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700 }}>NomadKit</span>
        </div>
        <button
          className="close-btn"
          onClick={() => navigate('/dashboard')}
          style={{ fontFamily: 'inherit', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
        >
          ×
        </button>
      </nav>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px clamp(16px,4vw,24px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 2, color: '#7c3aed', marginBottom: 10 }}>Live rates</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(28px,5vw,42px)', fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>
            Currency{' '}
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>converter</em>
          </h1>
          {ratesData?.lastUpdated && (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              Last updated: {new Date(ratesData.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        {/* Popular pairs */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>Popular pairs</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {popularPairs.map(p => (
              <button
                key={p.label}
                className="pair-btn"
                onClick={() => { setFrom(p.from); setTo(p.to); setResult(null) }}
                style={{ fontFamily: 'inherit', fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 8, border: `1px solid ${from === p.from && to === p.to ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`, background: from === p.from && to === p.to ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', color: from === p.from && to === p.to ? '#a78bfa' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Converter card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 24px', marginBottom: 20 }}>

          {/* Amount */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8 }}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => { setAmount(e.target.value); setResult(null) }}
              style={{ fontFamily: 'inherit', width: '100%', fontSize: 28, fontWeight: 700, padding: '16px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff', letterSpacing: -0.5 }}
            />
          </div>

          {/* From / Swap / To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'end', marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8 }}>From</label>
              <select
                value={from}
                onChange={e => { setFrom(e.target.value); setResult(null) }}
                style={{ fontFamily: 'inherit', width: '100%', fontSize: 15, fontWeight: 600, padding: '13px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button
              onClick={swap}
              style={{ fontFamily: 'inherit', width: 42, height: 42, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s', marginBottom: 2 }}
              title="Swap currencies"
            >
              ⇄
            </button>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8 }}>To</label>
              <select
                value={to}
                onChange={e => { setTo(e.target.value); setResult(null) }}
                style={{ fontFamily: 'inherit', width: '100%', fontSize: 15, fontWeight: 600, padding: '13px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Convert button */}
          <button
            className="convert-btn"
            onClick={handleConvert}
            disabled={converting || isLoading}
            style={{ fontFamily: 'inherit', width: '100%', fontSize: 15, fontWeight: 700, padding: '16px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', cursor: converting ? 'not-allowed' : 'pointer', opacity: converting ? 0.7 : 1 }}
          >
            {converting ? 'Converting...' : `Convert ${amount || '0'} ${from} to ${to}`}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="fade-in" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(37,99,235,0.08))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: '28px 24px', textAlign: 'center' as const, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
              {result.amount} {result.from} equals
            </div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 52, fontWeight: 900, letterSpacing: -2, marginBottom: 8, background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {result.converted.toLocaleString()} {result.to}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              1 {result.from} = {result.rate} {result.to}
            </div>
          </div>
        )}

        {/* Live rates table */}
        {ratesData?.rates && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Live rates (1 {from})</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#22c55e', fontWeight: 600 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
                Live
              </div>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto' as const }}>
              {['INR', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'AED', 'SGD', 'THB', 'MXN', 'BRL', 'ZAR', 'TRY', 'KRW', 'HKD', 'NOK', 'SEK', 'DKK'].filter(c => c !== from && ratesData.rates[c]).map((currency) => {
                const fromRate = ratesData.rates[from] || 1
                const toRate = ratesData.rates[currency]
                const rate = (toRate / fromRate).toFixed(4)
                return (
                  <div
                    key={currency}
                    onClick={() => { setTo(currency); setResult(null) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: to === currency ? 'rgba(124,58,237,0.08)' : 'transparent', transition: 'background 0.15s' }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{currency}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: to === currency ? '#a78bfa' : 'rgba(255,255,255,0.7)' }}>{rate}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {isLoading && (
          <div style={{ textAlign: 'center' as const, padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Loading rates...
          </div>
        )}
      </div>
    </div>
  )
}
