import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Sample stock data
const sampleStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE' },
]

// Generate sample OHLCV data
function generateOHLCVData(symbol: string, days: number = 90) {
  const data = []
  let basePrice = 100 + Math.random() * 400 // Base price between $100-$500
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    // Generate random price movement
    const changePercent = (Math.random() - 0.5) * 0.1 // +/- 5% daily change
    basePrice = basePrice * (1 + changePercent)

    const open = basePrice * (0.995 + Math.random() * 0.01)
    const close = basePrice * (0.995 + Math.random() * 0.01)
    const high = Math.max(open, close) * (1 + Math.random() * 0.02)
    const low = Math.min(open, close) * (1 - Math.random() * 0.02)
    const volume = Math.floor(1000000 + Math.random() * 10000000) // 1M-11M shares

    data.push({
      symbol,
      dt: date,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      timeframe: '1d',
    })
  }

  return data
}

// Generate sample fundamental data
function generateFundamentals(symbol: string) {
  const pe = 15 + Math.random() * 25 // PE ratio 15-40
  const eps = 2 + Math.random() * 8 // EPS $2-$10
  const revenue = 100000 + Math.random() * 900000 // Revenue $100B-$1000B
  const revenueGrowth = -10 + Math.random() * 40 // Revenue growth -10% to +30%
  const margins = 5 + Math.random() * 25 // Profit margin 5%-30%
  const debtToEquity = 0 + Math.random() * 2 // Debt/Equity 0-2

  return [
    {
      symbol,
      reportDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      field: JSON.stringify({
        peRatio: parseFloat(pe.toFixed(2)),
        eps: parseFloat(eps.toFixed(2)),
        revenue: parseFloat(revenue.toFixed(2)),
        revenueGrowth: parseFloat(revenueGrowth.toFixed(2)),
        profitMargin: parseFloat(margins.toFixed(2)),
        debtToEquity: parseFloat(debtToEquity.toFixed(2)),
        marketCap: revenue * pe,
        dividendYield: Math.random() * 4, // 0-4% dividend
        roe: 10 + Math.random() * 20, // ROE 10-30%
        currentRatio: 1 + Math.random() * 2, // Current ratio 1-3
      }),
    },
    {
      symbol,
      reportDate: new Date(new Date().setMonth(new Date().getMonth() - 15)),
      field: JSON.stringify({
        peRatio: parseFloat((pe * (0.8 + Math.random() * 0.4)).toFixed(2)), // Previous PE
        eps: parseFloat((eps * (0.9 + Math.random() * 0.2)).toFixed(2)), // Previous EPS
        revenue: parseFloat((revenue * (0.9 + Math.random() * 0.2)).toFixed(2)),
        revenueGrowth: parseFloat((revenueGrowth * (0.8 + Math.random() * 0.4)).toFixed(2)),
        profitMargin: parseFloat((margins * (0.9 + Math.random() * 0.2)).toFixed(2)),
        debtToEquity: parseFloat((debtToEquity * (0.9 + Math.random() * 0.2)).toFixed(2)),
      }),
    },
  ]
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...')
  await prisma.userScore.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.fundamentals.deleteMany()
  await prisma.ohlcv.deleteMany()
  await prisma.stock.deleteMany()
  await prisma.user.deleteMany()

  // Create sample users
  console.log('👤 Creating sample users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'demo_user',
        passwordHash: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'trader_joe',
        passwordHash: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'analyst_jane',
        passwordHash: hashedPassword,
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create stocks
  console.log('📊 Creating stocks and market data...')
  for (const stock of sampleStocks) {
    // Create stock
    await prisma.stock.create({
      data: stock,
    })

    // Create OHLCV data
    const ohlcvData = generateOHLCVData(stock.symbol)
    await prisma.ohlcv.createMany({
      data: ohlcvData,
    })

    // Create fundamental data
    const fundamentalData = generateFundamentals(stock.symbol)
    await prisma.fundamentals.createMany({
      data: fundamentalData,
    })

    console.log(`✅ Created ${stock.symbol} with ${ohlcvData.length} days of data`)
  }

  // Create sample quizzes
  console.log('🎯 Creating sample quizzes...')
  const quizPromises = []

  for (const stock of sampleStocks) {
    // Create technical quizzes
    for (let i = 0; i < 3; i++) {
      quizPromises.push(
        prisma.quiz.create({
          data: {
            type: 'technical',
            symbol: stock.symbol,
            correctAnswer: Math.random() > 0.5 ? 'up' : 'down',
            payload: JSON.stringify({
              symbol: stock.symbol,
              chartPeriod: '30 days',
              predictionDays: 10,
              // This would normally contain actual candle data
              candles: [], // Empty for now, will be populated by quiz service
            }),
          },
        })
      )
    }

    // Create fundamental quizzes
    for (let i = 0; i < 2; i++) {
      quizPromises.push(
        prisma.quiz.create({
          data: {
            type: 'fundamental',
            symbol: stock.symbol,
            correctAnswer: Math.random() > 0.5 ? 'up' : 'down',
            payload: JSON.stringify({
              symbol: stock.symbol,
              predictionDays: 30,
              // This would normally contain actual fundamental snapshot
              snapshot: {}, // Empty for now, will be populated by quiz service
            }),
          },
        })
      )
    }
  }

  const quizzes = await Promise.all(quizPromises)
  console.log(`✅ Created ${quizzes.length} sample quizzes`)

  // Create some sample user scores
  console.log('📈 Creating sample user scores...')
  const scorePromises = []

  for (const user of users) {
    for (let i = 0; i < 20; i++) {
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)]
      const correct = Math.random() > 0.4 // 60% accuracy

      scorePromises.push(
        prisma.userScore.create({
          data: {
            userId: user.id,
            quizId: randomQuiz.id,
            answer: correct ? randomQuiz.correctAnswer : (randomQuiz.correctAnswer === 'up' ? 'down' : 'up'),
            correct,
          },
        })
      )
    }
  }

  await Promise.all(scorePromises)
  console.log(`✅ Created sample user scores`)

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`- Users: ${users.length}`)
  console.log(`- Stocks: ${sampleStocks.length}`)
  console.log(`- Quizzes: ${quizzes.length}`)
  console.log('- Sample market data generated')
  console.log('\n🔑 Demo credentials:')
  console.log('Username: demo_user')
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })