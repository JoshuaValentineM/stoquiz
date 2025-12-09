#!/bin/bash

# StoQuiz Production Setup Script
# This script helps prepare your project for Railway + Vercel deployment

echo "🚀 Setting up StoQuiz for Production Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root of the StoQuiz project"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend && npm install
cd ../backend && npm install
cd ..

# Generate production Prisma client
echo "🗄️  Generating production Prisma client..."
cd backend
npx prisma generate --schema=./prisma/schema.prod.prisma
cd ..

# Check if .env.production exists
if [ ! -f "backend/.env.production" ]; then
    echo "⚠️  Warning: backend/.env.production not found"
    echo "Please create it with your production environment variables"
fi

# Check if railway.toml exists
if [ ! -f "railway.toml" ]; then
    echo "⚠️  Warning: railway.toml not found"
    echo "Please create it for Railway deployment"
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "⚠️  Warning: vercel.json not found"
    echo "Please create it for Vercel deployment"
fi

echo ""
echo "✅ Production setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub"
echo "2. Create Railway project and deploy backend"
echo "3. Create Vercel project and deploy frontend"
echo "4. Configure environment variables"
echo "5. Test your production deployment"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"