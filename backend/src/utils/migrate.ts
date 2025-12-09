import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' })
}

export async function runMigrations() {
  console.log('=== Running Database Migrations ===')
  console.log('DATABASE_URL:', process.env.DATABASE_URL)

  const prisma = new PrismaClient()

  try {
    // Wait for database to be ready
    console.log('Waiting for database connection...')
    const maxAttempts = 30
    let attempts = 0

    while (attempts < maxAttempts) {
      try {
        await prisma.$queryRaw`SELECT 1`
        console.log('Database connected successfully!')
        break
      } catch (error: any) {
        attempts++
        console.log(`Attempt ${attempts}/${maxAttempts}: Database not ready, waiting 2 seconds...`)

        if (attempts >= maxAttempts) {
          console.error('Database connection failed after 60 seconds')
          throw error
        }

        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    // Check if tables exist
    console.log('Checking if tables exist...')
    try {
      const result = await prisma.$queryRaw`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
      ` as Array<{ table_name: string }>

      console.log('Existing tables:', result.map(r => r.table_name))

      // If users table doesn't exist, create schema
      if (!result.some(r => r.table_name === 'users')) {
        console.log('Creating database schema...')

        // Use Prisma's push command
        const { execSync } = require('child_process')
        execSync('npx prisma db push --schema=./prisma/schema.prod.prisma', {
          stdio: 'inherit',
          cwd: process.cwd()
        })

        console.log('Database schema created successfully!')
      } else {
        console.log('Tables already exist, skipping migration')
      }
    } catch (error) {
      console.error('Error checking tables:', error)

      // Try to push schema anyway
      const { execSync } = require('child_process')
      execSync('npx prisma db push --schema=./prisma/schema.prod.prisma', {
        stdio: 'inherit',
        cwd: process.cwd()
      })
    }

  } finally {
    await prisma.$disconnect()
  }
}