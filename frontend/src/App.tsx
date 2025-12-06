import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { HomePage } from './pages/HomePage'
import { QuizPage } from './pages/QuizPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { AuthPage } from './pages/AuthPage'
import { Navbar } from './components/Navbar'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ProfilePage } from './pages/ProfilePage'


function App() {
  const { user, isLoading, logout } = useAuth()

  console.log('🏠 App component render:', {
    user: user?.username || 'NONE',
    isLoading,
    isAuthenticated: !!user
  })

  if (isLoading) {
    console.log('⏳ App: Showing loading spinner')
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading StoQuiz...</p>
        </div>
      </div>
    )
  }

  console.log('🎯 App: Rendering main app with user:', user?.username || 'NOT LOGGED IN')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar user={user} logout={logout} />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:type" element={<QuizPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App