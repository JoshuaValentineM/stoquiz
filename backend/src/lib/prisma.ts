import { PrismaClient as PrismaClientType } from '@prisma/client'

let prisma: PrismaClientType

try {
  prisma = new PrismaClientType()
} catch (error) {
  console.error('Failed to initialize PrismaClient:', error)
  // Fallback for production environments
  const { PrismaClient } = require('@prisma/client')
  prisma = new PrismaClient()
}

export { prisma }
export default prisma