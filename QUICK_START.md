# StoQuiz - Quick Start Guide

## 🚀 Project Overview

StoQuiz is a stock market quiz application that tests users' knowledge of technical and fundamental analysis using real historical market data. The app consists of a React frontend and Node.js backend deployed on Vercel and Railway respectively.

## 🌐 Live Application

- **Frontend**: https://stoquiz.vercel.app
- **Backend API**: https://stoquiz-backend-production.up.railway.app

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite (deployed on Vercel)
- **Backend**: Node.js + Express + TypeScript (deployed on Railway)
- **Database**: PostgreSQL (hosted on Railway)
- **Authentication**: JWT-based auth system
- **Quiz Engine**: Dynamic quiz generation with real stock data

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm/pnpm
- GitHub account
- Railway account
- Vercel account

### Local Development

```bash
# Clone the repository
git clone https://github.com/JoshuaValentineM/stoquiz.git
cd stoquiz

# Install all dependencies (from root)
pnpm install

# Start development servers
pnpm dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Environment Variables

Create these files for local development:

**backend/.env**
```env
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/stoquiz"
JWT_SECRET="your-jwt-secret-here"
CORS_ORIGIN="http://localhost:5173"
PORT=4000
```

**frontend/.env**
```env
VITE_API_URL="http://localhost:4000"
```

## 🚀 Production Deployment

### 1. Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Import your GitHub repository
3. Railway will auto-detect Node.js project
4. Add PostgreSQL database service
5. Configure environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=[from PostgreSQL service]
   JWT_SECRET=[generate secure secret]
   CORS_ORIGIN=https://stoquiz.vercel.app
   PORT=8080
   ```
6. Deploy - Railway will automatically run database migrations

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://stoquiz-backend-production.up.railway.app
   ```
5. Deploy

## 🎯 Key Features

### User Management
- User registration and login
- JWT-based authentication
- Profile management
- Score tracking

### Quiz System
- Two quiz types: Technical Analysis & Fundamental Analysis
- Real stock market data integration
- Dynamic quiz generation
- Timer-based questions
- Immediate feedback

### Leaderboard
- Global leaderboard
- Score sorting by highest first
- User rankings

### Stock Data
- Real OHLCV (Open, High, Low, Close, Volume) data
- Fundamental metrics (PE ratio, EPS, etc.)
- Multiple exchanges support

## 🗂️ Project Structure

```
StoQuiz/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── CandlestickChart.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── UserButton.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── AuthPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── QuizPage.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useAuth.tsx
│   │   ├── utils/           # Utility functions
│   │   │   └── api.ts
│   │   └── types/           # TypeScript types
│   ├── public/
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── auth.ts
│   │   │   └── quiz.ts
│   │   ├── services/        # Business logic
│   │   │   ├── authService.ts
│   │   │   └── quizService.ts
│   │   ├── middleware/      # Express middleware
│   │   │   └── errorHandler.ts
│   │   ├── utils/           # Utility functions
│   │   │   └── migrate.ts   # Database migration
│   │   └── config/          # Configuration files
│   │       └── production.ts
│   ├── prisma/              # Database schema
│   │   └── schema.prod.prisma
│   └── package.json
├── DEPLOYMENT-STEP-BY-STEP.md # Detailed deployment guide
├── railway.toml              # Railway configuration
└── package.json              # Root package.json
```

## 🔧 Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts
- `quizzes` - Quiz questions and data
- `user_scores` - User quiz results
- `stocks` - Stock information
- `ohlcv` - Price data (candlestick charts)
- `fundamentals` - Fundamental metrics

## 🛠️ Development Commands

```bash
# Frontend
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 📝 Recent Updates (Latest Session - December 9, 2024)

### Fixes Applied:
1. **TypeScript Build Errors** - Fixed compilation issues for Vercel deployment
   - Created `frontend/src/vite-env.d.ts` for environment variable types
   - Disabled `noUnusedLocals` and `noUnusedParameters` in tsconfig.json
   - Fixed useEffect return type in useAuth hook

2. **CORS Configuration** - Properly configured for Vercel frontend
   - Updated CORS_ORIGIN to `https://stoquiz.vercel.app`
   - Fixed trust proxy for Railway's reverse proxy

3. **Database Migration** - Added automatic database setup on deployment
   - Created `backend/src/utils/migrate.ts` for automatic migrations
   - Integrated migration into application startup
   - Added database connection wait logic

4. **Environment Variables** - Configured for production environment
   - Fixed VITE_API_URL configuration (removed trailing slash)
   - Added debugging logs to verify API URL

5. **Deployment Configuration** - Fixed Railway deployment
   - Updated railway.toml configuration
   - Fixed duplicate deploy sections
   - Removed unnecessary migration script

### Key Changes:
- Frontend now builds successfully on Vercel
- Backend automatically creates database tables on startup
- CORS properly configured for cross-origin requests
- Database connection waits for PostgreSQL to be ready

## 🎮 How to Test

1. **Sign up** with a new account
2. **Login** with credentials
3. **Take a Technical Analysis Quiz**: Study chart and predict movement
4. **Take a Fundamental Analysis Quiz**: Analyze financial metrics
5. **Check Leaderboard**: See how you rank against others
6. **View Profile**: Manage your account and logout

## 🆘 Getting Help

- Check [DEPLOYMENT-STEP-BY-STEP.md](DEPLOYMENT-STEP-BY-STEP.md) for detailed deployment instructions
- Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- Check the [GitHub repository](https://github.com/JoshuaValentineM/stoquiz) for the latest code

## 🎉 Project Status

**Status**: ✅ Production Ready!
- Frontend deployed on Vercel
- Backend deployed on Railway
- Database automatically configured
- All core features working

## 🔍 Key Technical Files

- `frontend/src/hooks/useAuth.tsx` - Global auth state management
- `frontend/src/utils/api.ts` - API client with interceptors
- `frontend/src/vite-env.d.ts` - TypeScript environment types
- `backend/src/utils/migrate.ts` - Database migration utility
- `backend/src/index.ts` - Express server with auto-migration
- `railway.toml` - Railway deployment configuration

## 🚀 Next Steps

1. Set up monitoring and analytics
2. Add more quiz categories
3. Implement social features
4. Add real-time leaderboards
5. Create admin dashboard for quiz management