import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  console.log('👨‍💼 ProfilePage component:', {
    user: user?.username || 'NONE',
    hasUser: !!user,
    isLoading,
    isAuthenticated,
    willRedirect: !user
  })

  useEffect(() => {
    console.log('🔄 ProfilePage useEffect:', {
      user: user?.username || 'NONE',
      isLoading,
      isAuthenticated,
      willRedirect: !user && !isLoading
    })

    // Only redirect if we're certain there's no authentication happening
    if (!user && !isLoading) {
      console.log('➡️ ProfilePage: Redirecting to /auth (no user, not loading)')
      navigate('/auth')
    } else if (user) {
      console.log('✅ ProfilePage: User authenticated, showing profile')
    }
    // If loading, wait - don't redirect yet
  }, [user, isLoading, navigate, isAuthenticated])

  // Show loading while authentication is being determined
  if (isLoading) {
    console.log('⏳ ProfilePage: Showing loading while checking auth')
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('🚫 ProfilePage: Returning null (no user after loading)')
    return null
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Profile</h2>
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Username:</span> {user.username}</p>
        <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">User ID:</span> {user.id}</p>
        <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
      <button
        onClick={() => {
          console.log('🚪 ProfilePage logout button clicked')
          console.log('User before logout:', user?.username)
          logout()
          console.log('Logout called, navigating to home')
          navigate('/')
        }}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        Sign Out
      </button>
    </div>
  )
}
