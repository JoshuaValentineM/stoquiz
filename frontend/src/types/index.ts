export interface QuizResponse {
  id: string
  type: 'technical' | 'fundamental'
  symbol: string
  payload: {
    symbol: string
    snapshot?: {
      date: string
      pe?: number
      eps?: number
      revenue?: number
      revenueGrowth?: number
      margins?: number
      debtToEquity?: number
      [key: string]: any
    }
    candles?: Array<{
      dt: string
      open: number
      high: number
      low: number
      close: number
      volume: number
    }>
    chartPeriod?: string
    predictionDays?: number
  }
  horizonDays: number
}

export interface QuizAnswer {
  answer: 'up' | 'down'
}

export interface QuizResult {
  correct: boolean
  explanation: string
  actualOutcome: {
    percentChange: number
    direction: 'up' | 'down'
  }
  score: number
}

export interface User {
  id: string
  username?: string
  createdAt: string
}

export interface AuthToken {
  user: User
  token: string
}

export interface LeaderboardEntry {
  user: {
    id: string
    username?: string
  }
  totalScore: number
  totalQuizzes: number
  accuracy: number
  currentStreak: number
  bestStreak: number
}

export interface Candle {
  time: string
  open: number
  high: number
  low: number
  close: number
  value?: number
}