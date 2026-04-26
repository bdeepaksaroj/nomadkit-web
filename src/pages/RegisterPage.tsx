import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import api from '../lib/api'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' }
  const score =
    (password.length >= 6 ? 1 : 0) +
    (password.length >= 10 ? 1 : 0) +
    (/[^a-zA-Z0-9]/.test(password) ? 1 : 0)
  const map = [
    { score: 1, label: 'Weak', color: '#ef4444' },
    { score: 2, label: 'Fair', color: '#f59e0b' },
    { score: 3, label: 'Strong', color: '#22c55e' },
  ]
  return map[score - 1] ?? { score: 0, label: '', color: '' }
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const passwordValue = watch('password', '')
  const strength = getPasswordStrength(passwordValue)

  const goNext = async () => {
    const fields: (keyof FormData)[] = ['name', 'email', 'password']
    const valid = await trigger(fields[step])
    if (valid) setStep((s) => s + 1)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await api.post('/api/auth/register', data)
      toast.success('Check your email for the verification code')
      navigate('/verify-email', { state: { email: data.email } })
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const stepLabels = ['Your name', 'Email address', 'Password']

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: '100vh',
        background: '#06060a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(12px, 4vw, 24px) clamp(12px, 4vw, 16px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }

        .reg-card { animation: fadeUp 0.55s ease both; }
        .step-field { animation: slideIn 0.3s ease both; }

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
        .nk-input::placeholder { color: rgba(255,255,255,0.22); }
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

        .nk-btn-secondary {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 13px 18px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .nk-btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }

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

        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          transition: background 0.3s, transform 0.3s;
        }
        .step-dot.active { background: #7c3aed; transform: scale(1.2); }
        .step-dot.done { background: #22c55e; }

        .nk-link { color: #a78bfa; font-weight: 600; transition: color 0.2s; }
        .nk-link:hover { color: #c4b5fd; }

        .strength-bar {
          height: 3px;
          flex: 1;
          border-radius: 2px;
          background: rgba(255,255,255,0.1);
          transition: background 0.3s;
        }
      `}</style>

      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '55%', height: '55%', background: 'radial-gradient(ellipse, rgba(37,99,235,0.09) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-5%', width: '55%', height: '55%', background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 65%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>

        {/* Card */}
        <div
          className="reg-card"
          style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: 'clamp(28px, 5vw, 40px)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* X close */}
          <Link
            to="/"
            style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s', zIndex: 10 }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </Link>

          {/* Header */}
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 18 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
              </svg>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: -0.2 }}>NomadKit</span>
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', marginLeft: 2 }} />
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 25, fontWeight: 900, letterSpacing: -0.8, color: '#fff', lineHeight: 1.15, marginBottom: 8 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
              Join thousands of nomads worldwide.
            </p>
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 28 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  className={`step-dot${i < step ? ' done' : i === step ? ' active' : ''}`}
                />
                {i < 2 && (
                  <div style={{ height: 1, width: 28, background: i < step ? '#22c55e' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                )}
              </div>
            ))}
          </div>

          {/* Step label */}
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
            Step {step + 1} of 3 — {stepLabels[step]}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Step 0 — Name */}
            {step === 0 && (
              <div className="step-field" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Full name
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className={`nk-input${errors.name ? ' has-error' : ''}`}
                    placeholder="Alex Johnson"
                    autoComplete="name"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && goNext()}
                  />
                  {errors.name && (
                    <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <button type="button" className="nk-btn-primary" onClick={goNext}>
                  Continue →
                </button>
              </div>
            )}

            {/* Step 1 — Email */}
            {step === 1 && (
              <div className="step-field" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Email address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className={`nk-input${errors.email ? ' has-error' : ''}`}
                    placeholder="you@email.com"
                    autoComplete="email"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && goNext()}
                  />
                  {errors.email && (
                    <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="nk-btn-secondary" onClick={() => setStep(0)}>←</button>
                  <button type="button" className="nk-btn-primary" style={{ flex: 1 }} onClick={goNext}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Password */}
            {step === 2 && (
              <div className="step-field" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={`nk-input${errors.password ? ' has-error' : ''}`}
                      placeholder="Min 6 characters"
                      autoComplete="new-password"
                      autoFocus
                      style={{ paddingRight: 52 }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(onSubmit)()}
                    />
                    <button
                      type="button"
                      className="show-pwd-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Password strength */}
                  {passwordValue && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="strength-bar"
                            style={{ background: i < strength.score ? strength.color : 'rgba(255,255,255,0.1)' }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>
                        {strength.label}
                      </span>
                    </div>
                  )}

                  {errors.password && (
                    <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="nk-btn-secondary" onClick={() => setStep(1)}>←</button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="nk-btn-primary"
                    style={{ flex: 1 }}
                  >
                    {loading ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                          <path d="M21 12a9 9 0 11-6.219-8.56" />
                        </svg>
                        Creating account…
                      </span>
                    ) : 'Create account →'}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 24 }}>
            Already have an account?{' '}
            <Link to="/login" className="nk-link">Sign in</Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 10, lineHeight: 1.6 }}>
            By continuing you agree to our{' '}
            <a href="/terms" style={{ color: 'rgba(255,255,255,0.35)' }}>Terms</a>
            {' & '}
            <a href="/privacy" style={{ color: 'rgba(255,255,255,0.35)' }}>Privacy Policy</a>
          </p>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
          {['Free forever plan', 'No credit card needed', 'Cancel anytime'].map((t) => (
            <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}