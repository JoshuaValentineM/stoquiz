import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample stock data
const sampleStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' },
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

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...')
  await prisma.userScore.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.fundamentals.deleteMany()
  await prisma.ohlcv.deleteMany()
  await prisma.stock.deleteMany()

  // Create stocks and OHLCV data
  console.log('📊 Creating stocks and market data...')
  for (const stock of sampleStocks) {
    await prisma.stock.create({
      data: {
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
      },
    })

    // Generate OHLCV data
    const ohlcvData = generateOHLCVData(stock.symbol, 90)
    await prisma.ohlcv.createMany({
      data: ohlcvData,
    })

    console.log(`✅ Created ${stock.symbol} with ${ohlcvData.length} days of data`)
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })