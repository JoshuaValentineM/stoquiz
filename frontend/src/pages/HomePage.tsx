import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Test Your
          <span className="text-blue-600 dark:text-blue-400"> Stock</span>
          <span className="text-[#ed8eb8] dark:text-[#ed8eb8]"> Analysis</span>
          <br />
          Skills
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Challenge yourself with real historical market data. Practice technical analysis
          with candlestick charts and test your fundamental analysis skills with real company financials.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/quiz/technical"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg"
          >
            📈 Technical Analysis
          </Link>
          <Link
            to="/quiz/fundamental"
            className="bg-[#ed8eb8] hover:bg-[#d97aa3] text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg"
          >
            💰 Fundamental Analysis
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-8 py-16"
      >
        <div className="quiz-card text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Real Market Data
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Practice with actual historical OHLCV data and company financials from real stocks.
          </p>
        </div>

        <div className="quiz-card text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Two Quiz Types
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Test both technical chart reading skills and fundamental analysis knowledge.
          </p>
        </div>

        <div className="quiz-card text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏆</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Track Progress
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Compete on the leaderboard and track your accuracy over time.
          </p>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="py-16 border-t border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: 1, title: 'Choose Quiz Type', description: 'Select Technical or Fundamental analysis quiz' },
            { step: 2, title: 'Analyze Data', description: 'Review charts or financial data' },
            { step: 3, title: 'Make Prediction', description: 'Predict if the stock will go UP or DOWN' },
            { step: 4, title: 'Get Results', description: 'See if you were right and learn why' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                {item.step}
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center py-16 border-t border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to test your skills?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Sign up to track your progress and compete on the leaderboard
          </p>
          <Link
            to="/auth"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg"
          >
            Get Started Now
          </Link>
        </motion.div>
      )}
    </div>
  )
}