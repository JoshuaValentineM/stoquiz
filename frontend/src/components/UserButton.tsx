import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'


interface UserButtonProps {
  user: any
  logout: () => void
}

export function UserButton({ user, logout }: UserButtonProps) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  console.log('👤 UserButton render:', {
    user: user?.username || 'NONE',
    hasUser: !!user,
    buttonText: user ? (user.username || 'User') : 'Sign In'
  })

  const handleClick = () => {
    console.log('🖱️ UserButton clicked:', {
      hasUser: !!user,
      username: user?.username,
      navigatingTo: user ? '/profile' : '/auth'
    })

    if (user) {
      navigate('/profile')
    } else {
      navigate('/auth')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
    >
      {user ? (user.username || 'User') : 'Sign In'}
    </button>
  )
}