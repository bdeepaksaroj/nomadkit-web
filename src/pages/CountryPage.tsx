import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

const tabs = ['Emergency', 'Food', 'Scams', 'Transport', 'Visa']

export default function CountryPage() {
  const { code } = useParams<{ code: string }>()
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">Country not found</div>
          <Link to="/dashboard" className="text-sm text-gray-900 underline">Back to dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Back</Link>
        <span className="text-lg font-bold text-gray-900">NomadKit</span>
      </nav>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{country.name}</h1>
              <span className="text-sm text-gray-400">{country.code}</span>
            </div>
          </div>

          <div className="flex gap-1 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {activeTab === 'Emergency' && country.emergency && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Police', value: country.emergency.police, emoji: '👮' },
              { label: 'Ambulance', value: country.emergency.ambulance, emoji: '🚑' },
              { label: 'Fire', value: country.emergency.fire, emoji: '🚒' },
              { label: 'Tourist helpline', value: country.emergency.tourist, emoji: '📞' },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="text-2xl mb-2">{item.emoji}</div>
                <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Food' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            {country.food ? (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                {JSON.stringify(country.food, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-400">No food data available.</p>
            )}
          </div>
        )}

        {activeTab === 'Scams' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            {country.scams ? (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                {JSON.stringify(country.scams, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-400">No scam data available.</p>
            )}
          </div>
        )}

        {activeTab === 'Transport' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            {country.transport ? (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                {JSON.stringify(country.transport, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-400">No transport data available.</p>
            )}
          </div>
        )}

        {activeTab === 'Visa' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            {country.visa ? (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                {JSON.stringify(country.visa, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-400">No visa data available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}