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

#### Problem: Cannot access PostgreSQL database
**Solution**: Access via Docker container:
```bash
docker-compose exec postgres psql -U postgres -d stoquiz
```

#### Problem: Database empty
**Solution**: Create demo data via API endpoints

### Authentication Issues (Current Session Fixes)

#### Problem: UI flickers between "Sign In" and username on page load
**Cause**: Multiple useAuth instances with inconsistent state timing
**Symptoms**:
- Button shows "Sign In" briefly then changes to username
- Multiple API calls to `/api/auth/me` (5+ calls)
- Race conditions between component initialization

**Solution**: Implemented global auth state management in `useAuth.tsx`
```typescript
// Global auth state to share across components
let globalAuthState = {
  user: null as User | null,
  token: null as string | null,
  isLoading: true as boolean, // Start with true to ensure auth check completes
  listeners: new Set<() => void>(),
  initialized: false as boolean,
  fetchingUser: false as boolean,
}
```

#### Problem: Can't access /profile page directly via URL
**Cause**: Profile page redirects to /auth before authentication completes
**Symptoms**:
- Direct navigation to `/profile` redirects to `/auth`
- Works when clicking navbar button but not URL entry
- Race condition between auth loading and route protection

**Solution**: Proper loading state management
```typescript
// Only redirect if definitely no user and not loading
if (!user && !isLoading) {
  navigate('/auth')
}
```

#### Problem: Logout button on profile page doesn't work
**Cause**: Logout function not imported from useAuth hook
**Solution**: Add logout to destructured imports:
```typescript
const { user, isLoading, isAuthenticated, logout } = useAuth()
```

#### Problem: Page shows "Loading StoQuiz..." forever
**Cause**: Over-aggressive duplicate prevention in fetchUser function
**Solution**: Balance between deduplication and allowing actual API calls

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

### Database Operations (PostgreSQL)
```bash
# Access database
docker-compose exec postgres psql -U postgres -d stoquiz

# Check tables
\dt

# View users
SELECT * FROM "User";

# View quizzes
SELECT * FROM "Quiz" LIMIT 10;

# Reset database (DANGEROUS - deletes all data)
docker-compose down -v
docker-compose up --build
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
# WARNING: Deletes all data including users and quiz history
docker-compose down -v
docker-compose up --build --force-recreate
```

### Frontend Reset Only
```bash
docker-compose restart frontend
# Clear browser localStorage if needed
```

### Backend Reset Only
```bash
docker-compose restart backend
```

## 📝 Environment Setup

### Required Files
- `backend/.env` (optional, uses defaults if missing)
- Frontend uses VITE_API_URL from docker-compose.yml

### Port Conflicts
- Frontend: 5173
- Backend: 4000
- Database: 5433 (PostgreSQL)

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
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lightweight Charts
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL with Prisma ORM
- **Infrastructure**: Docker, Docker Compose

### Common Debugging Strategy
1. Check container logs for errors
2. Verify database connection with PostgreSQL commands
3. Test API endpoints directly
4. Check browser console for auth state logs
5. Monitor network tab for duplicate API calls
6. Verify localStorage for authToken presence
7. Check file mounts in containers

### Debugging Authentication Issues
1. **Check browser console** for auth state logs:
   - Look for `🔍 useAuth hook initialized`
   - Check for `✅ fetchUser success` messages
2. **Check localStorage**:
   ```javascript
   localStorage.getItem('authToken') // Should return token string
   ```
3. **Monitor Network tab**:
   - Should see only 1 call to `/api/auth/me` on page load
   - Check for 401 responses indicating expired tokens
4. **Test API endpoints directly**:
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:4000/api/auth/me
   ```

### Debugging Chart Issues
1. **Check console for chart initialization logs**:
   - Look for `📊 Initializing chart with container width`
   - Check for `📊 Resizing chart to width` messages
2. **Verify container dimensions**:
   - Chart should fit within parent container
   - No overflow into sidebar area
3. **Test responsive behavior**:
   - Window resize should trigger chart resize
   - Zoom in/out should fix sizing issues