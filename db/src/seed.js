const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Sample stock data
const sampleStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
]

// Generate sample OHLCV data for AAPL only
function generateOHLCVData(symbol, days = 90) {
  const data = []
  let basePrice = 150 // Starting price for AAPL
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    // Generate random price movement
    const changePercent = (Math.random() - 0.5) * 0.02 // +/- 1% daily change
    basePrice = basePrice * (1 + changePercent)

    const open = basePrice * (0.995 + Math.random() * 0.01)
    const close = basePrice * (0.995 + Math.random() * 0.01)
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)
    const volume = Math.floor(2000000 + Math.random() * 2000000) // 2M-4M shares

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

  try {
    // Clean up existing data
    console.log('🧹 Cleaning up existing data...')
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

      // Generate OHLCV data for AAPL only (for simplicity)
      if (stock.symbol === 'AAPL') {
        const ohlcvData = generateOHLCVData(stock.symbol, 90)
        await prisma.ohlcv.createMany({
          data: ohlcvData,
        })
        console.log(`✅ Created ${stock.symbol} with ${ohlcvData.length} days of data`)
      } else {
        console.log(`✅ Created ${stock.symbol} stock (no OHLCV data)`)
      }
    }

    console.log('🎉 Database seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })