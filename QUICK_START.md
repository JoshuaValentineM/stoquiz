# StoQuiz - Quick Start Guide

## 🚀 5-Minute Startup

### 1. Start the Application
```bash
cd D:\Kuliah-Coding\StoQuiz
docker-compose up -d
```

### 2. Verify Services
- Frontend: http://localhost:5173
- Backend Health: http://localhost:4000/health

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
- Apple (AAPL) stock data included

### ✅ User System
- Sign up / Login
- JWT authentication
- User profiles
- Quiz tracking

### ✅ Modern Web App
- Responsive design
- Dark mode support
- PWA capabilities
- Beautiful Tailwind CSS styling

## 🐛 Known Issues & Solutions

### Issue: Frontend shows unstyled text
**Solution**: Ensure `postcss.config.cjs` is mounted in docker-compose.yml

### Issue: Backend OpenSSL errors
**Solution**: Dockerfile includes OpenSSL dependencies

### Issue: Database empty
**Solution**: Demo accounts and stock data pre-created

## 📊 Database Access

### Method 1: SQLite Browser (Recommended)
1. Download: https://sqlitebrowser.org/
2. Open file: `stoquiz.db` in project root
3. Browse all tables visually

### Method 2: Command Line
```bash
sqlite3 stoquiz.db ".tables"
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
```

### Access Container Shell
```bash
docker exec -it stoquiz-backend sh
docker exec -it stoquiz-frontend sh
```

## 🎮 Test the Full Flow

1. **Sign up** with new account
2. **Login** with credentials
3. **Take Technical Analysis quiz**
4. **Submit answer** (Up/Down)
5. **View results** and explanation
6. **Check leaderboard**
7. **View quiz history**

## 📱 Demo Credentials

| Username | Password |
|----------|----------|
| demo     | demo123  |
| trader1  | trader123 |
| analyst  | analyst123 |

## 🎨 Features Working

- ✅ User authentication
- ✅ Technical analysis quiz generation
- ✅ Chart display with real stock data
- ✅ Answer submission and validation
- ✅ Score calculation
- ✅ Leaderboard (empty until users play)
- ✅ Responsive UI design
- ✅ Dark mode toggle
- ✅ Docker containerization

## 🚀 Next Development Steps

1. Add more stock symbols
2. Implement fundamental analysis quizzes
3. Add quiz history for users
4. Implement streak tracking
5. Add real-time data integration
6. Deploy to production

---
**Project Status**: ✅ Fully functional demo version ready!