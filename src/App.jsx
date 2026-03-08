import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'

import Landing        from './pages/Landing'
import Login          from './pages/Login'
import Signup         from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'
import TakeQuiz       from './pages/TakeQuiz'
import Dashboard      from './pages/Dashboard'
import CreateQuiz     from './pages/CreateQuiz'
import EditQuiz       from './pages/EditQuiz'
import Results        from './pages/Results'

function Private({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-warm-gray font-dm">
      Loading...
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                element={<Landing />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/signup"          element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password"  element={<ResetPassword />} />
      <Route path="/quiz/:shareId"   element={<TakeQuiz />} />
      <Route path="/dashboard"       element={<Private><Dashboard /></Private>} />
      <Route path="/create"          element={<Private><CreateQuiz /></Private>} />
      <Route path="/edit/:id"        element={<Private><EditQuiz /></Private>} />
      <Route path="/results/:id"     element={<Private><Results /></Private>} />
      <Route path="*"                element={<Navigate to="/" replace />} />
    </Routes>
  )
}