# StoQuiz - Stock Analysis Quiz Game

Test your stock analysis skills with real historical market data! StoQuiz is a Progressive Web App (PWA) that challenges you to predict stock movements using both technical and fundamental analysis.

## 🚀 Quick Start (Docker)

```bash
git clone <repository-url>
cd StoQuiz
docker-compose up -d
```

Visit http://localhost:5173 and login with demo account:
- **Username**: `demo`
- **Password**: `demo123`

## ✅ Current Status: FULLY FUNCTIONAL

### Working Features
- ✅ User authentication (signup/login)
- ✅ Technical Analysis quizzes with real stock charts
- ✅ Responsive design with Tailwind CSS
- ✅ PWA support
- ✅ Docker containerization
- ✅ Real AAPL stock data (90 days of OHLCV data)
- ✅ Score calculation and quiz results

### 🎮 Try It Now
1. Go to http://localhost:5173
2. Login with demo account (`demo`/`demo123`)
3. Click "Technical Analysis"
4. Study the chart and predict if price goes "Up" or "Down"

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS (PWA)
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: SQLite with Prisma ORM (for easy development)
- **Infrastructure**: Docker + Docker Compose
- **Charts**: TradingView Lightweight Charts

## 📁 Project Structure

```
StoQuiz/
├── backend/          # Node.js API server
├── frontend/         # React web app
├── db/              # Database schema and migrations
├── docker-compose.yml # Container orchestration
├── PROJECT_SUMMARY.md # Complete development summary
├── QUICK_START.md   # 5-minute startup guide
├── TROUBLESHOOTING.md # Common issues and solutions
└── API_ENDPOINTS.md # API documentation
```

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query
- React Router
- Framer Motion
- TradingView Lightweight Charts
- PWA with Workbox

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- JWT Authentication
- bcryptjs
- CORS & Helmet for security
- Express Rate Limiting

### Database
- PostgreSQL
- Prisma as ORM
- Neon for serverless deployment

## 📋 Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 15+ (or use Neon)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd StoQuiz
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configurations

# Frontend (optional - for local development)
echo "VITE_API_URL=http://localhost:4000" > frontend/.env.local
```

### 4. Set up the database
```bash
# Generate Prisma client
pnpm --filter @stoquiz/db generate

# Set up your PostgreSQL database and update DATABASE_URL in backend/.env

# Run migrations
pnpm --filter @stoquiz/db migrate:deploy

# Seed the database with sample data
pnpm --filter @stoquiz/db db:seed
```

### 5. Start the development servers
```bash
# Start both frontend and backend
pnpm dev

# Or start individually:
pnpm --filter backend dev     # Backend on http://localhost:4000
pnpm --filter frontend dev    # Frontend on http://localhost:5173
```

### 6. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Health check: http://localhost:4000/health

## 🐳 Docker Development

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🎯 Usage

### Playing Quizzes

1. **Technical Analysis Quiz**:
   - View a candlestick chart showing historical price data
   - Predict if the stock will go UP or DOWN in the next N days
   - Get instant feedback with explanations

2. **Fundamental Analysis Quiz**:
   - Review company financials (P/E, EPS, revenue growth, etc.)
   - Make your prediction based on the fundamentals
   - Learn how the stock actually performed

### Demo Account
- Username: `demo_user`
- Password: `password123`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### Quizzes
- `GET /api/quiz?type=technical|fundamental` - Get a quiz
- `POST /api/quiz/:id/answer` - Submit answer
- `GET /api/quiz/leaderboard` - Get leaderboard

## 🚀 Deployment

### Production Deployment

1. **Database (Neon)**:
   - Create a new PostgreSQL database
   - Get the connection string
   - Set `DATABASE_URL` in your backend environment

2. **Backend (Render)**:
   - Connect your GitHub repository
   - Set build command: `pnpm --filter backend build`
   - Set start command: `pnpm --filter backend start`
   - Add environment variables

3. **Frontend (Netlify)**:
   - Connect your GitHub repository
   - Set build command: `pnpm --filter frontend build`
   - Set publish directory: `frontend/dist`
   - Add redirect rule for API calls

### Environment Variables

#### Backend
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
FINNHUB_API_KEY=your-api-key
ALPHA_VANTAGE_API_KEY=your-api-key
POLYGON_API_KEY=your-api-key
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

#### Frontend
```
VITE_API_URL=https://your-backend-url.com
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter backend test
pnpm --filter frontend test
```

## 📝 Scripts

```bash
# Development
pnpm dev              # Start all development servers
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint all packages

# Database
pnpm --filter @stoquiz/db generate     # Generate Prisma client
pnpm --filter @stoquiz/db migrate:dev  # Run migrations in dev
pnpm --filter @stoquiz/db db:seed      # Seed database
pnpm --filter @stoquiz/db studio       # Open Prisma Studio
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TradingView for the lightweight charts library
- Prisma for the amazing ORM
- Netlify & Render for hosting credits
- All the open source projects that make this possible

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.