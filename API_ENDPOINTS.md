# StoQuiz API Documentation

## Base URL
`http://localhost:4000`

## Authentication Endpoints

### POST /api/auth/signup
**Description**: Create a new user account
```json
{
  "username": "string (min 3, max 50)",
  "password": "string (min 6)"
}
```

**Response**:
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "createdAt": "string (ISO date)"
  },
  "token": "string (JWT)"
}
```

### POST /api/auth/login
**Description**: Authenticate user and get token
```json
{
  "username": "string",
  "password": "string"
}
```

**Response**: Same as signup

### GET /api/auth/me
**Description**: Get current user info (requires auth header)
**Headers**: `Authorization: Bearer <token>`

## Quiz Endpoints

### GET /api/quiz
**Description**: Generate a new quiz
**Query Parameters**:
- `type`: "technical" | "fundamental" (default: "technical")

**Response**:
```json
{
  "id": "string",
  "type": "technical|fundamental",
  "symbol": "string (stock symbol)",
  "payload": {
    "symbol": "string",
    "candles": [Array of OHLCV data for technical],
    "snapshot": [Financial data for fundamental],
    "chartPeriod": "string",
    "predictionDays": "number"
  },
  "horizonDays": "number"
}
```

### POST /api/quiz/:id/answer
**Description**: Submit answer to a quiz (requires auth)
**Headers**: `Authorization: Bearer <token>`
```json
{
  "answer": "up" | "down"
}
```

**Response**:
```json
{
  "correct": "boolean",
  "explanation": "string",
  "actualOutcome": {
    "percentChange": "number",
    "direction": "up" | "down"
  },
  "score": "number"
}
```

### GET /api/quiz/leaderboard
**Description**: Get leaderboard
**Query Parameters**:
- `limit`: "number" (default: 50, max: 100)

**Response**: Array of leaderboard entries

### GET /api/quiz/history
**Description**: Get user's quiz history (requires auth)
**Headers**: `Authorization: Bearer <token>`

## Health Check

### GET /health
**Description**: Check if backend is running
**Response**:
```json
{
  "status": "OK",
  "timestamp": "string (ISO date)"
}
```

## Error Responses
All errors return JSON with:
```json
{
  "error": "string message"
}
```

## Sample Usage

### Sign Up
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "test123"}'
```

### Get Quiz
```bash
curl http://localhost:4000/api/quiz?type=technical
```

### Submit Answer
```bash
curl -X POST http://localhost:4000/api/quiz/quiz123/answer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"answer": "up"}'
```