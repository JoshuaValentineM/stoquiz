import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { UserButton } from './UserButton'

interface NavbarProps {
  user: any
}

export function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate()

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SQ</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              StoQuiz
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/quiz"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Play
            </Link>
            <Link
              to="/leaderboard"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Leaderboard
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <UserButton user={user} />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
            >
              Home
            </Link>
            <Link
              to="/quiz"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
            >
              Play
            </Link>
            <Link
              to="/leaderboard"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}