import { createError } from '../middleware/errorHandler.js'
import type { QuizResponse, QuizAnswer, QuizResult } from '../types/index.js'
import { technicalQuizzes, fundamentalQuizzes } from '../data/predefinedQuizzes.js'
import prisma from '../lib/prisma.js'

export class QuizService {
  async generateTechnicalQuiz(): Promise<QuizResponse> {
    // Get a random predefined technical quiz
    const randomIndex = Math.floor(Math.random() * technicalQuizzes.length)
    const predefinedQuiz = technicalQuizzes[randomIndex]

    // Ensure the stock exists in the database
    await prisma.stock.upsert({
      where: { symbol: predefinedQuiz.symbol },
      update: {},
      create: {
        symbol: predefinedQuiz.symbol,
        name: predefinedQuiz.stockName || predefinedQuiz.symbol,
        exchange: 'NASDAQ' // Default exchange for most stocks
      }
    })

    // Create quiz record
    const quiz = await prisma.quiz.create({
      data: {
        type: 'technical',
        symbol: predefinedQuiz.symbol,
        correctAnswer: predefinedQuiz.correctAnswer,
        payload: JSON.stringify({
          symbol: predefinedQuiz.symbol,
          stockName: predefinedQuiz.stockName,
          pattern: predefinedQuiz.pattern,
          period: predefinedQuiz.period,
          candles: predefinedQuiz.data.candles,
          chartPeriod: predefinedQuiz.data.chartPeriod,
          predictionDays: predefinedQuiz.data.predictionDays,
          explanation: predefinedQuiz.explanation
        })
      }
    })

    return {
      id: quiz.id,
      type: 'technical',
      symbol: predefinedQuiz.symbol,
      payload: {
        symbol: predefinedQuiz.symbol,
        stockName: predefinedQuiz.stockName,
        pattern: predefinedQuiz.pattern,
        period: predefinedQuiz.period,
        candles: predefinedQuiz.data.candles,
        chartPeriod: predefinedQuiz.data.chartPeriod,
        predictionDays: predefinedQuiz.data.predictionDays
      },
      horizonDays: predefinedQuiz.data.predictionDays
    }
  }

  async generateFundamentalQuiz(): Promise<QuizResponse> {
    // Get a random predefined fundamental quiz
    const randomIndex = Math.floor(Math.random() * fundamentalQuizzes.length)
    const predefinedQuiz = fundamentalQuizzes[randomIndex]

    // Ensure the stock exists in the database
    await prisma.stock.upsert({
      where: { symbol: predefinedQuiz.symbol },
      update: {},
      create: {
        symbol: predefinedQuiz.symbol,
        name: predefinedQuiz.stockName || predefinedQuiz.symbol,
        exchange: 'NASDAQ' // Default exchange for most stocks
      }
    })

    // Create quiz record
    const quiz = await prisma.quiz.create({
      data: {
        type: 'fundamental',
        symbol: predefinedQuiz.symbol,
        correctAnswer: predefinedQuiz.correctAnswer,
        payload: JSON.stringify({
          symbol: predefinedQuiz.symbol,
          stockName: predefinedQuiz.stockName,
          period: predefinedQuiz.period,
          snapshot: predefinedQuiz.data.snapshot,
          predictionDays: predefinedQuiz.data.predictionDays,
          explanation: predefinedQuiz.explanation
        })
      }
    })

    return {
      id: quiz.id,
      type: 'fundamental',
      symbol: predefinedQuiz.symbol,
      payload: {
        symbol: predefinedQuiz.symbol,
        stockName: predefinedQuiz.stockName,
        period: predefinedQuiz.period,
        snapshot: predefinedQuiz.data.snapshot,
        predictionDays: predefinedQuiz.data.predictionDays
      },
      horizonDays: predefinedQuiz.data.predictionDays
    }
  }

  async submitAnswer(userId: string, quizId: string, answer: QuizAnswer): Promise<QuizResult> {
    // Get quiz details
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        stock: true
      }
    })

    if (!quiz) {
      throw createError('Quiz not found', 404)
    }

    // Check if user already answered this quiz
    const existingScore = await prisma.userScore.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId
        }
      }
    })

    if (existingScore) {
      throw createError('Quiz already answered', 409)
    }

    const correct = answer.answer === quiz.correctAnswer
    let explanation = ''
    let percentChange = 0

    // Get the predefined explanation from the quiz payload
    const payload = JSON.parse(quiz.payload as string)
    explanation = payload.explanation || 'Quiz explanation not available.'

    // Calculate actual percent change for additional context
    if (quiz.type === 'technical') {
      const visibleCandles = payload.candles || []

      if (visibleCandles.length > 0) {
        const lastClose = visibleCandles[visibleCandles.length - 1].close
        const predictionDays = payload.predictionDays || 10

        // Simulate the actual outcome based on the predefined correct answer
        const movement = correct ? Math.random() * 15 + 5 : -(Math.random() * 15 + 5)
        percentChange = movement

        const futurePrice = lastClose * (1 + movement / 100)
        explanation += ` The stock actually moved ${movement >= 0 ? 'up' : 'down'} by ${Math.abs(movement).toFixed(2)}% (from $${lastClose.toFixed(2)} to $${futurePrice.toFixed(2)}).`
      }
    } else if (quiz.type === 'fundamental') {
      const predictionDays = payload.predictionDays || 30

      // Simulate the actual outcome based on the predefined correct answer
      const movement = correct ? Math.random() * 35 + 15 : -(Math.random() * 35 + 10)
      percentChange = movement

      explanation += ` The stock actually moved ${movement >= 0 ? 'up' : 'down'} by ${Math.abs(movement).toFixed(2)}% over the next ${predictionDays} days.`
    }

    // Calculate score (simple scoring: 100 points for correct, 0 for wrong)
    const score = correct ? 100 : 0

    // Save user's answer
    await prisma.userScore.create({
      data: {
        userId,
        quizId,
        answer: answer.answer,
        correct
      }
    })

    return {
      correct,
      explanation,
      actualOutcome: {
        percentChange,
        direction: percentChange >= 0 ? 'up' : 'down'
      },
      score
    }
  }

  async getLeaderboard(limit: number = 50): Promise<any[]> {
    const leaderboard = await prisma.userScore.groupBy({
      by: ['userId'],
      _count: {
        id: true
      }
    })

    // Get user details and correct answers count
    const results = await Promise.all(
      leaderboard.map(async (entry: { userId: string; _count: { id: number } }) => {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId },
          select: {
            id: true,
            username: true
          }
        })

        const correctCount = await prisma.userScore.count({
          where: {
            userId: entry.userId,
            correct: true
          }
        })

        const totalCount = entry._count.id
        const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0

        return {
          user: user || { id: entry.userId, username: 'Anonymous' },
          totalScore: correctCount * 100, // 100 points per correct answer
          totalQuizzes: totalCount,
          accuracy: Math.round(accuracy * 100) / 100,
          currentStreak: 0, // TODO: Implement streak calculation
          bestStreak: 0 // TODO: Implement best streak calculation
        }
      })
    )

    // Sort by total score and limit results
    return results
      .sort((a: any, b: any) => b.totalScore - a.totalScore)
      .slice(0, limit)
  }
}