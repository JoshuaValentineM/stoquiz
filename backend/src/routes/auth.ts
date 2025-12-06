import express, { type Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { createError, errorHandler } from '../middleware/errorHandler.js'
import type { AuthToken, User } from '../types/index.js'

const router: Router = express.Router()
const prisma = new PrismaClient()

// Schemas
const signupSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6)
})

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this'

const generateToken = (user: User): string => {
  return jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = decoded
    next()
  })
}

// Sign up
router.post('/signup', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { username, password } = signupSchema.parse(req.body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      throw createError('Username already exists', 409)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash
      }
    })

    const token = generateToken({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.toISOString()
    })

    const response: AuthToken = {
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.toISOString()
      },
      token
    }

    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
})

// Login
router.post('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { username, password } = loginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user || !user.passwordHash) {
      throw createError('Invalid credentials', 401)
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash)

    if (!validPassword) {
      throw createError('Invalid credentials', 401)
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.toISOString()
    })

    const response: AuthToken = {
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.toISOString()
      },
      token
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
})

// Get current user
router.get('/me', authenticateToken, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    })

    if (!user) {
      throw createError('User not found', 404)
    }

    res.json({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.toISOString()
    })
  } catch (error) {
    next(error)
  }
})

export { router as authRoutes, authenticateToken }