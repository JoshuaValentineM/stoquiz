import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useState, useEffect } from 'react'
import { authAPI } from '../utils/api'
import type { AuthToken, User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: { username: string; password: string }) => Promise<void>
  signup: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => void
}

export function useAuth(): AuthState {
  const queryClient = useQueryClient()
  const [isInitialized, setIsInitialized] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'))

  useEffect(() => {
    // Check for token and update state
    const currentToken = localStorage.getItem('authToken')
    setToken(currentToken)
    setIsInitialized(true)

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('authToken')
      setToken(newToken)
      if (!newToken) {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const { isLoading } = useQuery(
    'user',
    async () => {
      if (!token) return null
      try {
        const response = await authAPI.getMe()
        setUser(response.user)
        return response.user
      } catch (error) {
        localStorage.removeItem('authToken')
        setUser(null)
        return null
      }
    },
    {
      enabled: !!token && isInitialized,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 10, // 10 minutes
    }
  )

  const loginMutation = useMutation(
    async (credentials: { username: string; password: string }) => {
      const response = await authAPI.login(credentials)
      localStorage.setItem('authToken', response.token)
      setToken(response.token) // Update token state
      setUser(response.user)
      return response.user
    },
    {
      onSuccess: (userData) => {
        queryClient.setQueryData('user', userData)
      },
    }
  )

  const signupMutation = useMutation(
    async (credentials: { username: string; password: string }) => {
      const response = await authAPI.signup(credentials)
      localStorage.setItem('authToken', response.token)
      setToken(response.token) // Update token state
      setUser(response.user)
      return response.user
    },
    {
      onSuccess: (userData) => {
        queryClient.setQueryData('user', userData)
      },
    }
  )

  const logout = () => {
    localStorage.removeItem('authToken')
    setToken(null) // Update token state
    setUser(null)
    queryClient.setQueryData('user', null)
    queryClient.invalidateQueries()
  }

  const actualLoading = !isInitialized || (token && isLoading && !user)

  return {
    user,
    token,
    isLoading: actualLoading,
    isAuthenticated: !!user && !!token,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout,
  }
}