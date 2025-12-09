FROM node:20-alpine

WORKDIR /app

# Install OpenSSL and dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Copy package.json replacement and source code
COPY . .

# Replace package.json with Railway version (no pnpm)
RUN cp package.railway.json package.json

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prod.prisma

# Build the application
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]