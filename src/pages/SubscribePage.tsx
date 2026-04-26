import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    badge: 'Most Popular',
    planId: import.meta.env.VITE_PAYPAL_PLAN_PRO,
    features: ['All 194 countries', 'Emergency, food, scams, visa', 'Live currency rates', 'Maps + attractions', 'Weekly scam updates', 'Offline emergency access'],
    color: '#7c3aed',
  },
  {
    id: 'chat',
    name: 'Pro + Chat',
    price: '$7.99',
    period: '/month',
    badge: '💬 Includes Chat',
    planId: import.meta.env.VITE_PAYPAL_PLAN_CHAT,
    features: ['Everything in Pro', 'Travel group chats', 'Country chat rooms', 'Meet fellow travelers', 'Real-time messaging'],
    color: '#2563eb',
  },
]

declare global {
  interface Window { paypal: any }
}

export default function SubscribePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [loading, setLoading] = useState(false)
  const paypalRef = useRef<HTMLDivElement>(null)
  const paypalRendered = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadPayPal()
  }, [])

  useEffect(() => {
    if (window.paypal && paypalRef.current) {
      renderPayPalButton()
    }
  }, [selectedPlan])

  const loadPayPal = () => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`
    script.setAttribute('data-sdk-integration-source', 'button-factory')
    script.onload = () => renderPayPalButton()
    document.body.appendChild(script)
  }

  const renderPayPalButton = () => {
    if (!paypalRef.current || !window.paypal) return
    paypalRef.current.innerHTML = ''
    paypalRendered.current = false

    const plan = PLANS.find(p => p.id === selectedPlan)
    if (!plan) return

    window.paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'blue',
        layout: 'vertical',
        label: 'subscribe',
      },
      createSubscription: (_data: any, actions: any) => {
        return actions.subscription.create({ plan_id: plan.planId })
      },
      onApprove: async (data: any) => {
        setLoading(true)
        try {
          await api.post('/api/subscription/activate', {
            subscriptionId: data.subscriptionID,
            plan: selectedPlan,
          })
          toast.success('Subscription activated! Welcome to NomadKit Pro.')
          navigate('/dashboard')
        } catch (err: any) {
          toast.error(err.response?.data?.error || 'Failed to activate subscription')
        } finally {
          setLoading(false)
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err)
        toast.error('Payment failed. Please try again.')
      },
    }).render(paypalRef.current)
  }

  const plan = PLANS.find(p => p.id === selectedPlan)!

  return (
    <div style={{ minHeight: '100vh', background: '#06060a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{ padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✈️</div>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700 }}>NomadKit</span>
        </Link>
        <Link to="/dashboard" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>← Back to dashboard</Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#7c3aed', marginBottom: 14 }}>Upgrade your plan</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 12 }}>Choose your plan</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>Cancel anytime. No hidden fees.</p>
        </div>

        {/* Plan selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          {PLANS.map(p => (
            <div key={p.id} onClick={() => setSelectedPlan(p.id)} style={{ background: selectedPlan === p.id ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${selectedPlan === p.id ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: '24px 20px', cursor: 'pointer', transition: 'all 0.2s' }}>
              {p.badge && (
                <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', marginBottom: 14 }}>{p.badge}</div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 40, fontWeight: 900, letterSpacing: -2, marginBottom: 4 }}>{p.price}<span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>{p.period}</span></div>
              <ul style={{ listStyle: 'none', marginTop: 16 }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Selected plan summary */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Selected plan</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>NomadKit {plan.name} — {plan.price}/month</div>
          </div>
          <div style={{ fontSize: 12, color: '#22c55e' }}>✓ Cancel anytime</div>
        </div>

        {/* PayPal button */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 16, textAlign: 'center' }}>Pay securely with PayPal</div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Activating your subscription...</div>
          ) : (
            <div ref={paypalRef} />
          )}
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 16 }}>
            🔒 Secured by PayPal. NomadKit never sees your payment details.
          </p>
        </div>
      </div>
    </div>
  )
}