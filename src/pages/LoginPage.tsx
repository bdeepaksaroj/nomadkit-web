import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', data)
      setAuth(res.data.user, res.data.accessToken)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: '100vh',
      background: '#06060a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(0px, 4vw, 24px) clamp(0px, 4vw, 16px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }

        .login-card { animation: fadeUp 0.55s ease both; }

        .nk-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          -webkit-appearance: none;
        }
        .nk-input::placeholder { color: rgba(255,255,255,0.25); }
        .nk-input:hover { border-color: rgba(255,255,255,0.16); }
        .nk-input:focus { border-color: rgba(124,58,237,0.6); background: rgba(124,58,237,0.05); }
        .nk-input:-webkit-autofill,
        .nk-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0d0b14 inset !important;
          -webkit-text-fill-color: #fff !important;
          border-color: rgba(124,58,237,0.5) !important;
        }
        .nk-input.has-error { border-color: rgba(239,68,68,0.55); background: rgba(239,68,68,0.04); }
        .nk-input.has-error:focus { border-color: rgba(239,68,68,0.7); }

        .nk-btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 13px 0;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          letter-spacing: 0.01em;
        }
        .nk-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(124,58,237,0.4); }
        .nk-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .nk-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .show-pwd-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          padding: 4px;
          transition: color 0.2s;
          letter-spacing: 0.04em;
        }
        .show-pwd-btn:hover { color: rgba(255,255,255,0.7); }

        .pulse-dot { animation: pulse 2.2s ease-in-out infinite; }
      `}</style>

      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(37,99,235,0.06) 0%, transparent 65%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '0 clamp(0px, 3vw, 0px)' }}>

        {/* Card */}
        <div className="login-card" style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: 'clamp(28px, 5vw, 40px)',
          backdropFilter: 'blur(24px)',
        }}>

          {/* X close button — pinned top-right inside card */}
          <Link to="/"
            style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s', zIndex: 10 }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </Link>

          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 20 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
              </svg>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: -0.2 }}>NomadKit</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', marginLeft: 2 }} className="pulse-dot" />
            </div>

            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 900, letterSpacing: -1, color: '#fff', lineHeight: 1.15, marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              Sign in to access your travel toolkit.
            </p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 7, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className={`nk-input${errors.email ? ' has-error' : ''}`}
                placeholder="you@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <a href="/forgot-password" style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#c4b5fd')}
                  onMouseOut={e => (e.currentTarget.style.color = '#a78bfa')}>
                  Forgot?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`nk-input${errors.password ? ' has-error' : ''}`}
                  placeholder="Your password"
                  autoComplete="current-password"
                  style={{ paddingRight: 52 }}
                />
                <button
                  type="button"
                  className="show-pwd-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="nk-btn-primary"
              style={{ marginTop: 6 }}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in →'}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 24 }}>
            No account yet?{' '}
            <Link to="/register" style={{ color: '#a78bfa', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = '#c4b5fd')}
              onMouseOut={e => (e.currentTarget.style.color = '#a78bfa')}>
              Create one free
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
          {['🔒 Secure login', '✈️ 194 countries', '⚡ Instant access'].map(t => (
            <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}