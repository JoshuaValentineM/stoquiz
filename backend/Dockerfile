FROM node:20-alpine

WORKDIR /app

# Install OpenSSL and dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat sqlite

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy packages
COPY backend/package.json ./backend/
COPY db/package.json ./db/
COPY frontend/package.json ./frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY backend/src ./backend/src
COPY backend/tsconfig.json ./backend/
COPY backend/prisma ./backend/prisma
COPY db/src ./db/src
COPY db/prisma ./db/prisma

# Generate Prisma client
RUN pnpm --filter @stoquiz/db generate

# Build the application
RUN pnpm --filter @stoquiz/backend build

EXPOSE 4000

CMD ["pnpm", "--filter", "@stoquiz/backend", "start"]