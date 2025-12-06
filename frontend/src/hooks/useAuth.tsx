import { useState, useEffect, useCallback } from 'react'
import { authAPI } from '../utils/api'
import type { AuthToken, User } from '../types'

// Global auth state to share across components
let globalAuthState = {
  user: null as User | null,
  token: null as string | null,
  isLoading: true as boolean, // Start with true to ensure auth check completes
  listeners: new Set<() => void>(),
  initialized: false as boolean,
  fetchingUser: false as boolean, // Track if we're currently fetching user data
}

const notifyListeners = () => {
  globalAuthState.listeners.forEach(listener => listener())
}

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
  const [, forceUpdate] = useState({})

  // Subscribe to global auth state changes
  useEffect(() => {
    const update = () => forceUpdate({})
    globalAuthState.listeners.add(update)
    return () => globalAuthState.listeners.delete(update)
  }, [])

  const setUser = useCallback((user: User | null) => {
    globalAuthState.user = user
    notifyListeners()
  }, [])

  const setToken = useCallback((token: string | null) => {
    globalAuthState.token = token
    notifyListeners()
  }, [])

  const setIsLoading = useCallback((isLoading: boolean) => {
    globalAuthState.isLoading = isLoading
    notifyListeners()
  }, [])

  console.log('🔍 useAuth hook initialized', {
    hasToken: !!globalAuthState.token,
    hasUser: !!globalAuthState.user,
    user: globalAuthState.user?.username,
    isLoading: globalAuthState.isLoading
  })

  // Function to fetch user data
  const fetchUser = useCallback(async (authToken: string) => {
    console.log('🔄 fetchUser called with token:', authToken ? 'PRESENT' : 'MISSING')

    // If user already exists and token matches, return cached user
    if (globalAuthState.user && globalAuthState.token === authToken && !globalAuthState.isLoading) {
      console.log('✅ User already cached, returning:', globalAuthState.user.username)
      return globalAuthState.user
    }

    // Prevent duplicate API calls when we're already fetching
    if (globalAuthState.fetchingUser) {
      console.log('⏳ Already fetching user data, waiting...')
      // Wait for the current fetch to complete
      while (globalAuthState.fetchingUser) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return globalAuthState.user
    }

    try {
      console.log('🌐 Making API call to get user data...')
      globalAuthState.fetchingUser = true
      const response = await authAPI.getMe()
      console.log('✅ fetchUser API response:', response)

      // The API returns user directly, not wrapped in a user object
      const userData = response.user || response // Handle both response formats
      console.log('✅ fetchUser success:', userData.username)

      // Update global state
      globalAuthState.user = userData
      globalAuthState.token = authToken
      globalAuthState.isLoading = false
      globalAuthState.fetchingUser = false
      notifyListeners()

      return userData
    } catch (error) {
      console.log('❌ fetchUser error:', error)
      localStorage.removeItem('authToken')
      globalAuthState.token = null
      globalAuthState.user = null
      globalAuthState.isLoading = false
      globalAuthState.fetchingUser = false
      notifyListeners()
      return null
    }
  }, [])

  // Initialize auth state on mount (only once)
  useEffect(() => {
    // If already initialized, don't run again
    if (globalAuthState.initialized) {
      return
    }

    console.log('🚀 useAuth initialization effect running')
    globalAuthState.initialized = true // Mark as initialized immediately to prevent race conditions

    const initAuth = async () => {
      const currentToken = localStorage.getItem('authToken')
      console.log('📱 Token from localStorage:', currentToken ? 'EXISTS' : 'MISSING')

      if (currentToken) {
        console.log('💾 Setting token state')
        globalAuthState.token = currentToken
        console.log('🔄 Fetching user data...')
        await fetchUser(currentToken)
      } else {
        console.log('🚫 No token found in localStorage')
        globalAuthState.isLoading = false
        notifyListeners()
      }
    }

    initAuth()
  }, [fetchUser])

  // Update user when token changes (for login/signup)
  useEffect(() => {
    if (globalAuthState.token && !globalAuthState.user) {
      console.log('🔄 Fetching user due to token change')
      fetchUser(globalAuthState.token)
    }
  }, [fetchUser])

  const login = async (credentials: { username: string; password: string }) => {
    console.log('🔐 Login attempt:', credentials.username)
    const response = await authAPI.login(credentials)
    console.log('✅ Login successful, response:', response)

    // Handle both response formats (user object or user wrapped)
    const userData = response.user || response
    console.log('✅ Login user data:', userData.username)

    localStorage.setItem('authToken', response.token)
    globalAuthState.token = response.token
    globalAuthState.user = userData
    globalAuthState.isLoading = false
    notifyListeners()
  }

  const signup = async (credentials: { username: string; password: string }) => {
    console.log('📝 Signup attempt:', credentials.username)
    const response = await authAPI.signup(credentials)
    console.log('✅ Signup successful, response:', response)

    // Handle both response formats (user object or user wrapped)
    const userData = response.user || response
    console.log('✅ Signup user data:', userData.username)

    localStorage.setItem('authToken', response.token)
    globalAuthState.token = response.token
    globalAuthState.user = userData
    globalAuthState.isLoading = false
    notifyListeners()
  }

  const logout = () => {
    console.log('🚪 Logout called - starting logout process')
    console.log('🔍 Before logout:', {
      user: globalAuthState.user?.username,
      hasToken: !!globalAuthState.token,
      tokenPreview: globalAuthState.token?.substring(0, 20) + '...'
    })

    localStorage.removeItem('authToken')
    globalAuthState.token = null
    globalAuthState.user = null
    globalAuthState.isLoading = false
    notifyListeners()

    console.log('✅ Logout completed - new state:', {
      user: globalAuthState.user?.username,
      hasToken: !!globalAuthState.token,
      hasTokenValue: globalAuthState.token
    })
  }

  const result = {
    user: globalAuthState.user,
    token: globalAuthState.token,
    isLoading: globalAuthState.isLoading,
    isAuthenticated: !!globalAuthState.user && !!globalAuthState.token,
    login,
    signup,
    logout,
  }

  console.log('📤 useAuth return state:', {
    user: globalAuthState.user?.username || 'NONE',
    hasToken: !!globalAuthState.token,
    isLoading: globalAuthState.isLoading,
    isAuthenticated: result.isAuthenticated
  })

  return result
}