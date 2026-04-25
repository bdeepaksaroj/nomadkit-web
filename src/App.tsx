import { Routes, Route, Navigate } from 'react-router-dom'

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">NomadKit</h1>
        <p className="text-gray-500">Frontend is alive.</p>
        <p className="text-sm text-gray-400 mt-4">
          API: {import.meta.env.VITE_API_URL}
        </p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}