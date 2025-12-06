import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { quizAPI } from '../utils/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { CandlestickChart } from '../components/CandlestickChart'
import { QuizInterface } from '../components/QuizInterface'
import type { QuizResponse } from '../types'

export function QuizPage() {
  const { type = 'technical' } = useParams()
  const navigate = useNavigate()

  const {
    data: quiz,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['quiz', type],
    () => quizAPI.getQuiz(type as 'technical' | 'fundamental'),
    {
      retry: 2,
      staleTime: 0, // Always fetch fresh quiz
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="quiz-card text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Failed to load quiz
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Unable to generate a quiz at the moment. Please try again.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="quiz-card text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No quiz available
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Try selecting a different quiz type.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <QuizInterface quiz={quiz} />
    </div>
  )
}