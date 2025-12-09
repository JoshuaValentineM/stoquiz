import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { quizAPI } from '../utils/api'
import { CandlestickChart } from './CandlestickChart'
import { LoadingSpinner } from './LoadingSpinner'
import type { QuizResponse, QuizResult, QuizAnswer } from '../types'

interface QuizInterfaceProps {
  quiz: QuizResponse
}

export function QuizInterface({ quiz }: QuizInterfaceProps) {
  const navigate = useNavigate()
  const [selectedAnswer, setSelectedAnswer] = useState<'up' | 'down' | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)

  const submitAnswerMutation = useMutation(
    async (answer: QuizAnswer) => {
      console.log('🎯 Submitting quiz answer:', { quizId: quiz.id, answer })
      const result = await quizAPI.submitAnswer(quiz.id, answer)
      console.log('✅ Quiz answer submitted successfully:', result)
      return result
    },
    {
      onSuccess: (data) => {
        console.log('🎉 Quiz submission success:', data)
        setResult(data)
        setShowResult(true)
        toast.success(`Answer submitted! ${data.correct ? '✅ Correct!' : '❌ Incorrect'}`)
      },
      onError: (error: any) => {
        console.log('❌ Quiz submission error:', error)
        if (error.response?.status === 401) {
          console.log('🚫 Authentication error during quiz submission!')
          toast.error('You were logged out. Please sign in again.')
          // Don't navigate here, let the error interceptor handle it
        } else {
          toast.error(error.response?.data?.error || 'Failed to submit answer')
        }
      }
    }
  )

  const handleAnswer = (answer: 'up' | 'down') => {
    setSelectedAnswer(answer)
    submitAnswerMutation.mutate({ answer })
  }

  const handleNewQuiz = () => {
    // Navigate to the same quiz type with timestamp to force new quiz
    const quizType = quiz.type || 'technical'
    const timestamp = Date.now()
    navigate(`/quiz/${quizType}?t=${timestamp}`, { replace: true })
  }

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return 'N/A'
    return num.toFixed(2)
  }

  const formatCurrency = (num: number | undefined) => {
    if (num === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatPercent = (num: number | undefined) => {
    if (num === undefined) return 'N/A'
    return `${num.toFixed(2)}%`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Quiz Header */}
      <div className="quiz-card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {quiz.type === 'technical' ? '📈 Technical Analysis' : '💰 Fundamental Analysis'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Analyze the data and predict if {quiz.payload.stockName || quiz.symbol} will go UP or DOWN in the next {quiz.horizonDays} days
            </p>
            {quiz.payload.period && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Period: {quiz.payload.period}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Stock</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {quiz.payload.stockName || quiz.symbol}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{quiz.symbol}</div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {quiz.type === 'technical' ? (
            <div className="quiz-card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Candlestick Chart - {quiz.payload.chartPeriod}
                {quiz.payload.pattern && (
                  <span className="ml-2 text-sm font-normal text-blue-600 dark:text-blue-400">
                    Pattern: {quiz.payload.pattern}
                  </span>
                )}
              </h2>
              {quiz.payload.candles && (
                <CandlestickChart
                  data={quiz.payload.candles.map(candle => ({
                    time: candle.dt,
                    open: candle.open,
                    high: candle.high,
                    low: candle.low,
                    close: candle.close
                  }))}
                  symbol={quiz.payload.stockName || quiz.symbol}
                />
              )}
            </div>
          ) : (
            <div className="quiz-card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Fundamentals Snapshot - {quiz.payload.snapshot?.date}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatNumber(quiz.payload.snapshot?.pe)}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">EPS</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(quiz.payload.snapshot?.eps)}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(quiz.payload.snapshot?.revenue)}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Revenue Growth</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatPercent(quiz.payload.snapshot?.revenueGrowth)}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Profit Margin</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatPercent(quiz.payload.snapshot?.margins)}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Debt/Equity</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatNumber(quiz.payload.snapshot?.debtToEquity)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Answer Section */}
          <div className="quiz-card mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Prediction
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Will {quiz.symbol} go UP or DOWN in the next {quiz.horizonDays} days?
            </p>

            {showResult ? (
              <div className="text-center py-8">
                <div className={`text-2xl font-bold mb-4 ${
                  result?.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {result?.correct ? '✅ Correct!' : '❌ Incorrect!'}
                </div>
                <div className="text-gray-700 dark:text-gray-300 mb-6">
                  {result?.explanation}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Score: {result?.score} points
                </div>
                <button
                  onClick={handleNewQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Next Quiz
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer('up')}
                  disabled={submitAnswerMutation.isLoading}
                  className="answer-button up"
                >
                  📈 UP
                </button>
                <button
                  onClick={() => handleAnswer('down')}
                  disabled={submitAnswerMutation.isLoading}
                  className="answer-button down"
                >
                  📉 DOWN
                </button>
              </div>
            )}

            {submitAnswerMutation.isLoading && (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner />
                <span className="ml-2 text-gray-600 dark:text-gray-400">Submitting answer...</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="quiz-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quiz Info
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Type</div>
                <div className="font-medium text-gray-900 dark:text-white capitalize">
                  {quiz.type} Analysis
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Symbol</div>
                <div className="font-medium text-gray-900 dark:text-white">{quiz.symbol}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Time Horizon</div>
                <div className="font-medium text-gray-900 dark:text-white">{quiz.horizonDays} days</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Scoring</div>
                <div className="font-medium text-gray-900 dark:text-white">100 points for correct answer</div>
              </div>
            </div>
          </div>

          <div className="quiz-card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pattern Analysis Tips
            </h3>
            {quiz.type === 'technical' && quiz.payload.pattern ? (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>• <strong>Pattern:</strong> {quiz.payload.pattern}</p>
                {quiz.payload.pattern === 'Head and Shoulders' && (
                  <>
                    <p>• Look for three peaks with the middle one highest</p>
                    <p>• Breaking the neckline suggests downtrend continuation</p>
                    <p>• Volume typically decreases as pattern forms</p>
                  </>
                )}
                {quiz.payload.pattern === 'Bull Flag' && (
                  <>
                    <p>• Sharp rise (pole) followed by consolidation (flag)</p>
                    <p>• Breakout above flag resistance suggests continuation</p>
                    <p>• Pattern duration is typically short (1-3 weeks)</p>
                  </>
                )}
                {quiz.payload.pattern === 'Double Bottom' && (
                  <>
                    <p>• W-shaped pattern with equal lows</p>
                    <p>• Breakout above middle peak confirms reversal</p>
                    <p>• Shows exhaustion of selling pressure</p>
                  </>
                )}
                {quiz.payload.pattern === 'Cup and Handle' && (
                  <>
                    <p>• U-shaped cup followed by small pullback (handle)</p>
                    <p>• Handle should be small relative to cup depth</p>
                    <p>• Breakout from handle signals continuation</p>
                  </>
                )}
                {quiz.payload.pattern === 'Ascending Triangle' && (
                  <>
                    <p>• Flat resistance with rising support</p>
                    <p>• Buying pressure building up over time</p>
                    <p>• Breakout above resistance typically explosive</p>
                  </>
                )}
                {!['Head and Shoulders', 'Bull Flag', 'Double Bottom', 'Cup and Handle', 'Ascending Triangle'].includes(quiz.payload.pattern) && (
                  <>
                    <p>• Analyze the chart structure carefully</p>
                    <p>• Consider trend direction and momentum</p>
                    <p>• Watch for volume confirmation</p>
                    <p>• Remember: past performance doesn't guarantee future results</p>
                  </>
                )}
              </div>
            ) : quiz.type === 'fundamental' ? (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>• Analyze all financial metrics holistically</p>
                <p>• Compare with historical performance</p>
                <p>• Consider broader market conditions</p>
                <p>• Management guidance is often a key indicator</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>• Look for patterns like support/resistance levels</p>
                <p>• Consider trend direction and momentum</p>
                <p>• Watch for candlestick patterns and volume spikes</p>
                <p>• Remember: past performance doesn't guarantee future results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}