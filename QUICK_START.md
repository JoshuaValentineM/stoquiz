# StoQuiz - Quick Start Guide

## 🚀 5-Minute Startup

### 1. Start the Application
```bash
cd D:\Kuliah-Coding\StoQuiz
docker-compose up --build --force-recreate
```

### 2. Verify Services
- Frontend: http://localhost:5173
- Backend Health: http://localhost:4000/health
- Database: PostgreSQL on port 5433

### 3. Login with Demo Account
- **URL**: http://localhost:5173
- **Username**: `demo`
- **Password**: `demo123`

### 4. Try a Quiz
1. Click "Technical Analysis"
2. Study the chart
3. Click "Up" or "Down"
4. See your results!

## 🎯 What We Built

StoQuiz is a **stock prediction quiz game** with:

### ✅ Technical Analysis Quizzes
- Real stock charts with OHLCV data
- 60 days of visible data
- Predict next 10 days movement
- Multiple stock symbols available

### ✅ Fundamental Analysis Quizzes
- Real company financial data
- P/E ratios, EPS, revenue, margins
- Compare fundamentals to make predictions

### ✅ Robust User System
- Sign up / Login with JWT authentication
- Persistent auth state across page refreshes
- User profiles with logout functionality
- Direct URL navigation to protected pages

### ✅ Modern Web App
- Responsive design with mobile support
- Dark mode support
- Beautiful Tailwind CSS styling
- Chart rendering with proper responsive sizing

## 🐛 Recent Fixes & Improvements

### ✅ Authentication System (Current Session)
- **Fixed**: Multiple useAuth instances causing state inconsistency
- **Fixed**: API call deduplication (from 5 calls to 1 call on page load)
- **Fixed**: Profile page access from direct URLs
- **Fixed**: Logout button functionality
- **Fixed**: Initial loading state preventing UI flicker
- **Implementation**: Global auth state sharing across components

### ✅ Chart Rendering (Current Session)
- **Fixed**: Candlestick chart overflow on initial load
- **Fixed**: Chart responsive sizing with proper container detection
- **Implementation**: Delayed chart initialization with dynamic width detection

### 📊 Database (PostgreSQL)
```bash
# Access database
docker-compose exec postgres psql -U postgres -d stoquiz

# Common queries
\dt                    # List tables
SELECT * FROM "User";  # View users
SELECT * FROM "Quiz";  # View quizzes
```

## 🔧 Development Commands

### Rebuild Everything
```bash
docker-compose up --build --force-recreate
```

### Check Container Logs
```bash
docker logs stoquiz-backend
docker logs stoquiz-frontend
docker logs stoquiz-postgres
```

### Access Container Shell
```bash
docker exec -it stoquiz-backend sh
docker exec -it stoquiz-frontend sh
docker exec -it stoquiz-postgres psql -U postgres -d stoquiz
```

## 🎮 Test the Full Flow

1. **Sign up** with new account
2. **Login** with credentials
3. **Technical Analysis**: Take chart-based quiz
4. **Fundamental Analysis**: Take financial data quiz
5. **Submit answers** and view results
6. **Navigate directly** to /profile (should work now)
7. **Check leaderboard** and progress
8. **Logout** from profile page

## 📱 Demo Credentials

| Username | Password |
|----------|----------|
| demo     | demo123  |
| abcde    | abcde123 |

## 🎨 Features Working

### Core Features
- ✅ User authentication with persistent state
- ✅ Technical analysis quiz with responsive charts
- ✅ Fundamental analysis quiz with real financials
- ✅ Answer submission and validation
- ✅ Score calculation (100 points per correct answer)
- ✅ Leaderboard system
- ✅ User profile management

### UI/UX Features
- ✅ Responsive design for all screen sizes
- ✅ Dark mode toggle
- ✅ Chart rendering without overflow
- ✅ Loading states and proper error handling
- ✅ Direct URL navigation to protected routes
- ✅ Docker containerization

### Technical Improvements (Current Session)
- ✅ Global auth state management with listener pattern
- ✅ API call optimization and deduplication
- ✅ Proper loading state implementation
- ✅ Chart responsive sizing fixes
- ✅ Component isolation prevention

## 🚀 Next Development Steps

1. Add quiz history tracking
2. Implement streak tracking and badges
3. Add more stock symbols and sectors
4. Create advanced quiz types
5. Add real-time leaderboard updates
6. Implement social features
7. Deploy to production

## 🔍 Key Technical Files

- `frontend/src/hooks/useAuth.tsx` - Centralized auth state management
- `frontend/src/components/CandlestickChart.tsx` - Responsive chart component
- `frontend/src/pages/ProfilePage.tsx` - User profile with logout
- `frontend/src/utils/api.ts` - API client with auth interceptors

---
**Project Status**: ✅ Production-ready with robust authentication and responsive UI!