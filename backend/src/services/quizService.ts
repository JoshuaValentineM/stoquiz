import { PrismaClient } from '@prisma/client'
import { createError } from '../middleware/errorHandler.js'
import type { QuizResponse, QuizAnswer, QuizResult } from '../types/index.js'

const prisma = new PrismaClient()

export class QuizService {
  async generateTechnicalQuiz(): Promise<QuizResponse> {
    // Get a random stock with OHLCV data
    const stock = await prisma.stock.findFirst({
      where: {
        ohlcv: {
          some: {}
        }
      }
    })

    if (!stock) {
      throw createError('No stock data available for technical quiz', 404)
    }

    // Get historical OHLCV data (last 90 days)
    const ohlcv = await prisma.ohlcv.findMany({
      where: {
        symbol: stock.symbol,
        timeframe: '1d'
      },
      orderBy: {
        dt: 'desc'
      },
      take: 90
    })

    if (ohlcv.length < 60) {
      throw createError('Insufficient historical data for technical quiz', 404)
    }

    // Reverse to get chronological order
    const candles = ohlcv.reverse().map(candle => ({
      dt: candle.dt.toISOString().split('T')[0],
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: Number(candle.volume)
    }))

    // Use first 30-60 days as visible chart, next 10 days for prediction
    const visibleDays = Math.min(60, candles.length - 10)
    const visibleCandles = candles.slice(0, visibleDays)
    const futureCandles = candles.slice(visibleDays, visibleDays + 10)

    if (futureCandles.length < 5) {
      throw createError('Insufficient future data for prediction', 404)
    }

    // Calculate correct answer based on actual price movement
    const startPrice = visibleCandles[visibleCandles.length - 1].close
    const endPrice = futureCandles[futureCandles.length - 1].close
    const percentChange = ((endPrice - startPrice) / startPrice) * 100
    const correctAnswer = percentChange > 0 ? 'up' : 'down'

    // Create quiz record
    const quiz = await prisma.quiz.create({
      data: {
        type: 'technical',
        symbol: stock.symbol,
        correctAnswer,
        payload: JSON.stringify({
          symbol: stock.symbol,
          candles: visibleCandles,
          chartPeriod: `${visibleDays} days`,
          predictionDays: 10
        })
      }
    })

    return {
      id: quiz.id,
      type: 'technical',
      symbol: stock.symbol,
      payload: {
        symbol: stock.symbol,
        candles: visibleCandles,
        chartPeriod: `${visibleDays} days`,
        predictionDays: 10
      },
      horizonDays: 10
    }
  }

  async generateFundamentalQuiz(): Promise<QuizResponse> {
    // Get a random stock with fundamentals data
    const stock = await prisma.stock.findFirst({
      where: {
        fundamentals: {
          some: {}
        }
      }
    })

    if (!stock) {
      throw createError('No fundamental data available for quiz', 404)
    }

    // Get the most recent fundamental data
    const fundamental = await prisma.fundamentals.findFirst({
      where: {
        symbol: stock.symbol
      },
      orderBy: {
        reportDate: 'desc'
      }
    })

    if (!fundamental) {
      throw createError('No fundamental data found for stock', 404)
    }

    // Get price data 30 days after the fundamental report
    const startDate = fundamental.reportDate
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30)

    const priceData = await prisma.ohlcv.findMany({
      where: {
        symbol: stock.symbol,
        dt: {
          gte: startDate,
          lte: endDate
        },
        timeframe: '1d'
      },
      orderBy: {
        dt: 'asc'
      }
    })

    if (priceData.length < 20) {
      throw createError('Insufficient price data for fundamental quiz', 404)
    }

    // Calculate correct answer based on price movement
    const startPrice = priceData[0].close
    const endPrice = priceData[priceData.length - 1].close
    const percentChange = ((endPrice - startPrice) / startPrice) * 100
    const correctAnswer = percentChange > 0 ? 'up' : 'down'

    // Extract key fundamental metrics
    const fieldData = fundamental.field as any
    const snapshot = {
      date: fundamental.reportDate.toISOString().split('T')[0],
      pe: fieldData.peRatio || fieldData.pe,
      eps: fieldData.eps,
      revenue: fieldData.revenue,
      revenueGrowth: fieldData.revenueGrowth,
      margins: fieldData.profitMargin || fieldData.margins,
      debtToEquity: fieldData.debtToEquity,
      ...fieldData
    }

    // Create quiz record
    const quiz = await prisma.quiz.create({
      data: {
        type: 'fundamental',
        symbol: stock.symbol,
        correctAnswer,
        payload: JSON.stringify({
          symbol: stock.symbol,
          snapshot,
          predictionDays: 30
        })
      }
    })

    return {
      id: quiz.id,
      type: 'fundamental',
      symbol: stock.symbol,
      payload: {
        symbol: stock.symbol,
        snapshot,
        predictionDays: 30
      },
      horizonDays: 30
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

    // Calculate explanation based on quiz type
    if (quiz.type === 'technical') {
      const payload = JSON.parse(quiz.payload as string)
      const visibleCandles = payload.candles || []

      if (visibleCandles.length > 0) {
        const lastClose = visibleCandles[visibleCandles.length - 1].close

        // Get future price data to calculate actual outcome
        const lastVisibleDate = new Date(visibleCandles[visibleCandles.length - 1].dt)
        const futureDate = new Date(lastVisibleDate)
        futureDate.setDate(futureDate.getDate() + 10)

        const futureData = await prisma.ohlcv.findMany({
          where: {
            symbol: quiz.symbol,
            dt: {
              gt: lastVisibleDate,
              lte: futureDate
            },
            timeframe: '1d'
          },
          orderBy: {
            dt: 'desc'
          },
          take: 1
        })

        if (futureData.length > 0) {
          const futurePrice = futureData[0].close
          percentChange = ((futurePrice - lastClose) / lastClose) * 100
          explanation = `The stock moved ${percentChange >= 0 ? 'up' : 'down'} by ${Math.abs(percentChange).toFixed(2)}% over the next 10 days.`
        }
      }
    } else if (quiz.type === 'fundamental') {
      const payload = JSON.parse(quiz.payload as string)
      const snapshot = payload.snapshot || {}

      explanation = `Based on the fundamentals from ${snapshot.date}:`

      if (snapshot.pe) {
        explanation += ` P/E ratio was ${snapshot.pe},`
      }
      if (snapshot.revenueGrowth) {
        explanation += ` revenue growth was ${snapshot.revenueGrowth}%,`
      }
      if (snapshot.margins) {
        explanation += ` profit margin was ${snapshot.margins}%,`
      }

      // Get actual price movement
      const reportDate = new Date(snapshot.date)
      const futureDate = new Date(reportDate)
      futureDate.setDate(futureDate.getDate() + 30)

      const priceData = await prisma.ohlcv.findMany({
        where: {
          symbol: quiz.symbol,
          dt: {
            gte: reportDate,
            lte: futureDate
          },
          timeframe: '1d'
        },
        orderBy: {
          dt: 'asc'
        }
      })

      if (priceData.length >= 2) {
        const startPrice = priceData[0].close
        const endPrice = priceData[priceData.length - 1].close
        percentChange = ((endPrice - startPrice) / startPrice) * 100
        explanation += ` resulting in a ${percentChange >= 0 ? 'rise' : 'fall'} of ${Math.abs(percentChange).toFixed(2)}%.`
      }
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
      leaderboard.map(async (entry) => {
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
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
  }
}