import axios from 'axios'
import toast from 'react-hot-toast'
import type {
  QuizResponse,
  QuizAnswer,
  QuizResult,
  AuthToken,
  User,
  LeaderboardEntry
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/auth'
      toast.error('Your session has expired. Please log in again.')
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error)
    } else {
      toast.error('An unexpected error occurred')
    }
    return Promise.reject(error)
  }
)

// Quiz API
export const quizAPI = {
  getQuiz: async (type: 'technical' | 'fundamental' = 'technical'): Promise<QuizResponse> => {
    const response = await apiClient.get(`/api/quiz?type=${type}`)
    return response.data
  },

  submitAnswer: async (quizId: string, answer: QuizAnswer): Promise<QuizResult> => {
    const response = await apiClient.post(`/api/quiz/${quizId}/answer`, answer)
    return response.data
  },

  getLeaderboard: async (limit: number = 50): Promise<LeaderboardEntry[]> => {
    const response = await apiClient.get(`/api/quiz/leaderboard?limit=${limit}`)
    return response.data
  },

  getHistory: async (): Promise<any> => {
    const response = await apiClient.get('/api/quiz/history')
    return response.data
  },
}

// Auth API
export const authAPI = {
  login: async (credentials: { username: string; password: string }): Promise<AuthToken> => {
    const response = await apiClient.post('/api/auth/login', credentials)
    return response.data
  },

  signup: async (credentials: { username: string; password: string }): Promise<AuthToken> => {
    const response = await apiClient.post('/api/auth/signup', credentials)
    return response.data
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/api/auth/me')
    return response.data
  },
}

// Health check
export const healthAPI = {
  check: async (): Promise<{ status: string }> => {
    const response = await apiClient.get('/health')
    return response.data
  },
}