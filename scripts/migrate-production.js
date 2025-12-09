#!/usr/bin/env node

// Production database migration script for Railway
// Run this in Railway console after deployment

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🗄️  Running Production Database Migration...')

try {
  // Check if production schema exists
  const schemaPath = './prisma/schema.prod.prisma'
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Production schema not found at:', schemaPath)
    process.exit(1)
  }

  // Generate Prisma client for production
  console.log('📦 Generating Prisma client...')
  execSync('npx prisma generate --schema=./prisma/schema.prod.prisma', { stdio: 'inherit' })

  // Run migrations
  console.log('🔄 Running database migrations...')
  execSync('npx prisma migrate deploy --schema=./prisma/schema.prod.prisma', { stdio: 'inherit' })

  // Optional: Reset database if needed (uncomment if you want a fresh start)
  // console.log('🗑️  Resetting database...')
  // execSync('npx prisma db push --force-reset --schema=./prisma/schema.prod.prisma', { stdio: 'inherit' })
  // execSync('npx prisma db push --schema=./prisma/schema.prod.prisma', { stdio: 'inherit' })

  console.log('✅ Production migration completed successfully!')

} catch (error) {
  console.error('❌ Migration failed:', error.message)
  process.exit(1)
}