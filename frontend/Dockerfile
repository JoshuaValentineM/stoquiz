FROM node:20-alpine

WORKDIR /app

# Install OpenSSL and dependencies for Prisma (in case frontend needs it)
RUN apk add --no-cache openssl openssl-dev libc6-compat

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
COPY frontend/src ./frontend/src
COPY frontend/index.html ./frontend/
COPY frontend/vite.config.ts ./frontend/
COPY frontend/tsconfig.json ./frontend/
COPY frontend/tsconfig.node.json ./frontend/

EXPOSE 5173

CMD ["pnpm", "--filter", "@stoquiz/frontend", "dev"]