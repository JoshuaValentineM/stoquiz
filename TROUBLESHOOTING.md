# StoQuiz - Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Docker Issues

#### Problem: `pnpm-lock.yaml not found`
**Cause**: Docker build context wrong in monorepo
**Solution**:
- Update docker-compose.yml build context from `./backend` to `.`
- Update Dockerfile to copy workspace files correctly

#### Problem: OpenSSL errors in Alpine containers
**Error**: `PrismaClientInitializationError: libssl.so.1.1: No such file or directory`
**Solution**: Add to Dockerfile:
```dockerfile
RUN apk add --no-cache openssl openssl-dev libc6-compat
```

#### Problem: Containers start but immediately exit
**Solution**: Check logs with `docker logs <container-name>`

### Frontend Issues

#### Problem: Unstyled text, no Tailwind CSS
**Cause**: PostCSS configuration not working
**Solution**:
1. Rename `postcss.config.js` to `postcss.config.cjs`
2. Add to docker-compose.yml volumes:
```yaml
- ./frontend/postcss.config.cjs:/app/frontend/postcss.config.cjs
- ./frontend/tailwind.config.js:/app/frontend/tailwind.config.js
```

#### Problem: Frontend not accessible from host
**Solution**: Add to vite.config.ts:
```typescript
server: {
  host: '0.0.0.0',
  proxy: {
    '/api': {
      target: 'http://backend:4000',
      changeOrigin: true
    }
  }
}
```

#### Problem: CORS errors
**Solution**: Backend CORS configured for http://localhost:5173

### Backend Issues

#### Problem: TypeScript compilation errors
**Common Solutions**:
- Add explicit types: `const router: Router = express.Router()`
- Create `express.d.ts` for Request interface extensions
- Use non-null assertions: `req.user!.userId`

#### Problem: Database tables don't exist
**Solution**: Run migrations:
```bash
docker exec stoquiz-backend pnpm --filter @stoquiz/db db:push
```

#### Problem: Quiz generation fails
**Cause**: No stock data in database
**Solution**: Ensure OHLCV data exists for stocks

### Database Issues

#### Problem: Cannot access database
**Solution**: Copy database file to host:
```bash
docker cp stoquiz-backend:/app/db/prisma/dev.db ./stoquiz.db
```

#### Problem: Database empty
**Solution**: Create demo data via API endpoints

### Authentication Issues

#### Problem: Login redirect loops
**Solution**: Check JWT_SECRET environment variable
- Set in backend/.env or use default

#### Problem: Token invalid/expired
**Solution**: Tokens expire in 7 days, re-login required

## 🔧 Debugging Commands

### Check All Services
```bash
docker-compose ps
docker-compose logs
```

### Check Individual Services
```bash
curl http://localhost:4000/health
curl http://localhost:5173
curl http://localhost:4000/api/quiz/leaderboard
```

### Database Operations
```bash
# Copy database
docker cp stoquiz-backend:/app/db/prisma/dev.db ./stoquiz.db

# Check tables (if sqlite available)
docker exec stoquiz-backend sqlite3 /app/db/prisma/dev.db ".tables"

# Reset database
docker exec stoquiz-backend pnpm --filter @stoquiz/db db:push --force-reset
```

### Frontend Development
```bash
# Check Vite config
docker exec stoquiz-frontend cat /app/frontend/vite.config.ts

# Check mounted files
docker exec stoquiz-frontend ls -la /app/frontend/
```

### Backend Development
```bash
# Check environment
docker exec stoquiz-backend env | grep NODE_ENV

# Test API endpoints
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "demo123"}'
```

## 🔄 Reset Procedures

### Full Reset
```bash
docker-compose down -v
docker system prune -f
docker-compose up --build
```

### Database Reset Only
```bash
docker exec stoquiz-backend pnpm --filter @stoquiz/db db:push --force-reset
# Re-create demo accounts via API
```

### Frontend Reset Only
```bash
docker-compose restart frontend
```

### Backend Reset Only
```bash
docker-compose restart backend
```

## 📝 Environment Setup

### Required Files
- `backend/.env` (optional, uses defaults if missing)
- Frontend uses Vite API_URL from docker-compose.yml

### Port Conflicts
- Frontend: 5173
- Backend: 4000
- Database: 5432 (PostgreSQL) or file (SQLite)
- Prisma Studio: 5555 (if using)

## 🎯 Quick Health Check

### 1. Verify Containers Running
```bash
docker ps | grep stoquiz
```

### 2. Test Endpoints
```bash
# Backend health
curl http://localhost:4000/health

# Frontend accessible
curl -I http://localhost:5173

# API working
curl http://localhost:4000/api/quiz/leaderboard
```

### 3. Test Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "demo123"}'
```

## 📞 Support Information

### Project Structure
```
StoQuiz/
├── backend/          # Node.js API server
├── frontend/         # React web app
├── db/              # Database schema and migrations
├── docker-compose.yml # Container orchestration
└── *.md            # Documentation files
```

### Key Technologies
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: SQLite with Prisma ORM
- **Infrastructure**: Docker, Docker Compose

### Common Debugging Strategy
1. Check container logs
2. Verify database connection
3. Test API endpoints directly
4. Check network connectivity between containers
5. Verify environment variables
6. Check file mounts in containers