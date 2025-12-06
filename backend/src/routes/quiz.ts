import express, { type Router } from 'express'
import { z } from 'zod'
import { QuizService } from '../services/quizService.js'
import { authenticateToken } from './auth.js'
import { createError } from '../middleware/errorHandler.js'
import type { QuizAnswer } from '../types/index.js'

const router: Router = express.Router()
const quizService = new QuizService()

// Schemas
const quizTypeSchema = z.enum(['technical', 'fundamental'])
const answerSchema = z.object({
  answer: z.enum(['up', 'down'])
})
const leaderboardSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50)
})

// Get a quiz
router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const result = quizTypeSchema.safeParse(req.query.type)
    const type = result.success ? result.data : 'technical'

    let quiz
    if (type === 'technical') {
      quiz = await quizService.generateTechnicalQuiz()
    } else {
      quiz = await quizService.generateFundamentalQuiz()
    }

    res.json(quiz)
  } catch (error) {
    next(error)
  }
})

// Submit answer to a quiz
router.post('/:id/answer', authenticateToken, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params
    const { answer } = answerSchema.parse(req.body)
    const userId = req.user!.userId

    const result = await quizService.submitAnswer(userId, id, { answer })
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// Get leaderboard
router.get('/leaderboard', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { limit } = leaderboardSchema.parse(req.query)

    const leaderboard = await quizService.getLeaderboard(limit)
    res.json(leaderboard)
  } catch (error) {
    next(error)
  }
})

// Get user's quiz history (requires authentication)
router.get('/history', authenticateToken, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const userId = req.user!.userId

    // This would require implementing a more detailed query with the Prisma client
    // For now, return a simple response
    res.json({
      message: 'User history endpoint - to be implemented with detailed scoring',
      userId
    })
  } catch (error) {
    next(error)
  }
})

export { router as quizRoutes }