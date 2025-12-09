// Dynamic import to handle Railway build issues
let prisma: any

try {
  // Try named import first
  const { PrismaClient } = require('@prisma/client')
  prisma = new PrismaClient()
} catch (error) {
  console.error('Failed to initialize PrismaClient:', error)
  // If that fails, try importing the module directly
  try {
    const PrismaModule = require('@prisma/client')
    prisma = new PrismaModule.PrismaClient()
  } catch (fallbackError) {
    console.error('Failed to initialize PrismaClient with fallback:', fallbackError)
    throw new Error('Could not initialize PrismaClient')
  }
}

export { prisma }
export default prisma