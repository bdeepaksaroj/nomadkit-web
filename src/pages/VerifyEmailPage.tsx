import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)
  const email = location.state?.email || ''
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Enter the 6-digit code')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/api/auth/verify-email', { email, otp })
      setAuth(res.data.user, res.data.accessToken)
      toast.success('Email verified! Welcome to NomadKit.')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await api.post('/api/auth/resend-otp', { email })
      toast.success('New code sent to your email')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to resend')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-bold text-gray-900">NomadKit</Link>
          <p className="text-gray-500 text-sm mt-2">Check your email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-sm text-gray-500 text-center mb-6">
            We sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>
          </p>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4"
            placeholder="000000"
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 mb-3"
          >
            {loading ? 'Verifying...' : 'Verify email'}
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  )
}