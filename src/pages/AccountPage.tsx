import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const { data: subData } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await api.get('/api/subscription/status')
      return res.data
    },
  })

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch {}
    clearAuth()
    navigate('/')
    toast.success('Logged out')
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return
    try {
      await api.post('/api/subscription/cancel')
      toast.success('Subscription cancelled')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Back</Link>
        <span className="text-lg font-bold text-gray-900">NomadKit</span>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Account</h1>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <div className="text-xs text-gray-400 mb-1">Name</div>
          <div className="text-sm font-medium text-gray-900 mb-4">{user?.name}</div>
          <div className="text-xs text-gray-400 mb-1">Email</div>
          <div className="text-sm font-medium text-gray-900">{user?.email}</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <div className="text-sm font-medium text-gray-900 mb-4">Subscription</div>
          {subData?.subscribed ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Active — $4.99/month</span>
              </div>
              <div className="text-xs text-gray-400 mb-4">
                Renews: {new Date(subData.currentPeriodEnd).toLocaleDateString()}
              </div>
              <button
                onClick={handleCancel}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Cancel subscription
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">No active subscription</span>
              </div>
              <Link
                to="/subscribe"
                className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Subscribe for $4.99/month
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full text-sm text-red-500 hover:text-red-700 py-3"
        >
          Log out
        </button>
      </div>
    </div>
  )
}