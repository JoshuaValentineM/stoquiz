import React from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { quizAPI } from '../utils/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { LeaderboardEntry } from '../types'

export function LeaderboardPage() {
  const {
    data: leaderboard = [],
    isLoading,
    error
  } = useQuery(
    'leaderboard',
    () => quizAPI.getLeaderboard(50),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="quiz-card text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Failed to load leaderboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Unable to fetch leaderboard data at the moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          🏆 Leaderboard
        </h1>

        {leaderboard.length === 0 ? (
          <div className="quiz-card text-center">
            <p className="text-gray-600 dark:text-gray-300">
              No scores yet. Be the first to play and set a record!
            </p>
          </div>
        ) : (
          <div className="quiz-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Player</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Score</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Quizzes</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <motion.tr
                      key={entry.user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                          {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                          {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                          {!index && index > 2 && (
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {index + 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {entry.user.username || 'Anonymous'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {entry.totalScore.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="text-gray-600 dark:text-gray-300">
                          {entry.totalQuizzes}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className={`font-medium ${
                          entry.accuracy >= 70 ? 'text-green-600 dark:text-green-400' :
                          entry.accuracy >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {entry.accuracy.toFixed(1)}%
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leaderboard.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Total Players
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leaderboard.reduce((sum, entry) => sum + entry.totalQuizzes, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Total Quizzes
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leaderboard.length > 0
                      ? (leaderboard.reduce((sum, entry) => sum + entry.accuracy, 0) / leaderboard.length).toFixed(1)
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Average Accuracy
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}