{
  "$schema": "https://schema.railway.app/railfile.schema.json",
  "root": "backend",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && pnpm run build",
    "watchPatterns": ["backend/**"]
  },
  "deploy": {
    "startCommand": "cd backend && node dist/index.js",
    "healthcheckPath": "/health"
  }
}