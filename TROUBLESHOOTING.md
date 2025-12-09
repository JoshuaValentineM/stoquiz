# StoQuiz - Troubleshooting Guide

## 🚨 Production Deployment Issues

### Vercel Deployment Errors

#### Problem: TypeScript Build Failures
**Error Messages**:
- `TS6133: 'React' is declared but its value is never read`
- `TS2345: Argument of type '() => () => boolean' is not assignable to parameter of type 'EffectCallback'`
- `TS2339: Property 'env' does not exist on type 'ImportMeta'`

**Solutions**:
1. Create `frontend/src/vite-env.d.ts`:
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

2. Update `frontend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

3. Fix useEffect return type in `frontend/src/hooks/useAuth.tsx`:
```typescript
useEffect(() => {
  const update = () => forceUpdate({})
  globalAuthState.listeners.add(update)
  return () => {
    globalAuthState.listeners.delete(update)
  }
}, [])
```

### Railway Deployment Errors

#### Problem: Build Fails - Missing Script
**Error**: `npm error Missing script: "railway:start"`
**Solution**: Railway.toml had duplicate deploy sections. Ensure only one `[deploy]` section exists.

#### Problem: Database Connection Errors
**Error Messages**:
- `The table 'public.users' does not exist in the current database`
- `FATAL: the database system is starting up`

**Solution**: The database migration was integrated into the application startup. Ensure `backend/src/utils/migrate.ts` exists and is imported in `index.ts`.

#### Problem: CORS Errors
**Error**: `Access-Control-Allow-Origin` header has a value 'http://localhost:5173'`
**Solution**: Update Railway environment variables:
```
CORS_ORIGIN=https://stoquiz.vercel.app
```

#### Problem: Trust Proxy Warning
**Error**: `ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false`
**Solution**: Add to `backend/src/index.ts`:
```typescript
app.set('trust proxy', 1)
```

### Environment Variable Issues

#### Problem: API Calls to Wrong URL
**Symptoms**: API calls going to `https://stoquiz.vercel.app/api/...` instead of Railway backend
**Solution**: Check Vercel environment variable:
```
VITE_API_URL=https://stoquiz-backend-production.up.railway.app
```
- Must include `https://`
- No trailing slash
- Exact Railway URL

#### Problem: DATABASE_URL Format
**Solution**: Use Railway's private networking for production:
```
postgresql://postgres:YOUR_PASSWORD@postgres.railway.internal:5432/railway
```

## 🔍 Debugging Production Issues

### Check Vercel Configuration
1. Go to Vercel → StoQuiz → Settings → Environment Variables
2. Verify `VITE_API_URL` is set correctly
3. Check deployment logs for build errors

### Check Railway Configuration
1. Go to Railway → Backend Service → Settings → Variables
2. Verify all required variables:
   - `NODE_ENV=production`
   - `DATABASE_URL` (from PostgreSQL service)
   - `JWT_SECRET` (secure secret)
   - `CORS_ORIGIN=https://stoquiz.vercel.app`
   - `PORT=8080`

### Check Railway Logs
1. Go to Railway → Backend Service → Logs
2. Look for migration logs:
   - `=== Starting Migration Script ===`
   - `Database connected successfully!`
   - `Database schema created successfully!`

### Test API Endpoints
```bash
# Test backend health
curl https://stoquiz-backend-production.up.railway.app/health

# Expected response
{"status":"OK","timestamp":"2024-12-09T...Z"}
```

### Database Verification
1. Go to Railway → PostgreSQL service
2. Click "Console" tab
3. Run:
```sql
-- Check tables exist
\dt

-- Check users
SELECT COUNT(*) FROM users;

-- Check recent scores
SELECT * FROM user_scores ORDER BY createdAt DESC LIMIT 5;
```

## 🐛 Common Development Issues

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

### Authentication Issues

#### Problem: UI flickers between "Sign In" and username on page load
**Cause**: Multiple useAuth instances with inconsistent state timing
**Symptoms**:
- Button shows "Sign In" briefly then changes to username
- Multiple API calls to `/api/auth/me` (5+ calls)
- Race conditions between component initialization

**Solution**: Implemented global auth state management in `useAuth.tsx`

#### Problem: Can't access /profile page directly via URL
**Cause**: Profile page redirects to /auth before authentication completes
**Solution**: Proper loading state management

#### Problem: Logout button on profile page doesn't work
**Cause**: Logout function not imported from useAuth hook
**Solution**: Add logout to destructured imports:
```typescript
const { user, isLoading, isAuthenticated, logout } = useAuth()
```

## 🔧 Debugging Commands

### Production
```bash
# Test Vercel frontend
curl -I https://stoquiz.vercel.app

# Test Railway backend
curl https://stoquiz-backend-production.up.railway.app/health

# Test API with auth
curl -X POST https://stoquiz-backend-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"youruser","password":"yourpass"}'
```

### Development
```bash
# Check all services
docker-compose ps
docker-compose logs

# Check individual services
curl http://localhost:4000/health
curl http://localhost:5173
curl http://localhost:4000/api/quiz/leaderboard

# Database operations
docker-compose exec postgres psql -U postgres -d stoquiz
```

## 🔄 Reset Procedures

### Production Reset
**⚠️ WARNING: This deletes all user data**
1. Go to Railway → PostgreSQL service
2. Click "Settings" → "Danger Zone" → "Reset Database"
3. Redeploy backend to recreate tables

### Development Full Reset
```bash
docker-compose down -v
docker system prune -f
docker-compose up --build
```

### Database Reset Only (Development)
```bash
# WARNING: Deletes all data including users and quiz history
docker-compose down -v
docker-compose up --build --force-recreate
```

## 📝 Environment Setup Checklist

### Production Checklist
- [ ] Vercel: `VITE_API_URL` set to Railway backend URL
- [ ] Railway: `NODE_ENV=production`
- [ ] Railway: `DATABASE_URL` from PostgreSQL service
- [ ] Railway: `JWT_SECRET` (secure, not default)
- [ ] Railway: `CORS_ORIGIN=https://stoquiz.vercel.app`
- [ ] Railway: `PORT=8080`
- [ ] Frontend builds without TypeScript errors
- [ ] Backend connects to database
- [ ] Database tables created automatically
- [ ] CORS properly configured
- [ ] API endpoints accessible
- [ ] Authentication working end-to-end

### Development Checklist
- [ ] Docker containers running
- [ ] Frontend accessible at localhost:5173
- [ ] Backend accessible at localhost:4000
- [ ] Database accessible at localhost:5433
- [ ] API endpoints responding
- [ ] Authentication flow working

## 🎯 Quick Health Checks

### Production Health Check
1. **Frontend**: Visit https://stoquiz.vercel.app
2. **Backend API**: Check /health endpoint
3. **Database**: Verify tables exist in Railway console
4. **Auth**: Test signup/login flow
5. **CORS**: Check browser network tab for CORS errors

### Development Health Check
```bash
# 1. Verify containers running
docker ps | grep stoquiz

# 2. Test endpoints
curl http://localhost:4000/health
curl -I http://localhost:5173

# 3. Test database
docker-compose exec postgres psql -U postgres -d stoquiz -c "\dt"
```

## 📞 Support Information

### Project Repository
- **URL**: https://github.com/JoshuaValentineM/stoquiz
- **Branch**: main
- **Documentation**: Check `.md` files in repository

### Key Technologies
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lightweight Charts
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL with Prisma ORM
- **Infrastructure**: Docker, Docker Compose
- **Production**: Vercel (frontend), Railway (backend + database)

### Where to Get Help
1. Check this troubleshooting guide
2. Review [DEPLOYMENT-STEP-BY-STEP.md](DEPLOYMENT-STEP-BY-STEP.md)
3. Check GitHub issues for known problems
4. Review application logs in Vercel/Railway dashboards

### Common Debugging Strategy
1. **Check logs first** - Vercel build logs, Railway logs, browser console
2. **Verify environment variables** - Ensure all required variables are set
3. **Test API endpoints directly** - Use curl or Postman
4. **Check database connection** - Verify tables exist and are accessible
5. **Monitor network requests** - Browser DevTools Network tab
6. **Clear cache/cookies** - Sometimes stale data causes issues
7. **Redeploy** - Often fixes transient issues

---
*Last Updated: December 9, 2024*