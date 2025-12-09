FROM node:20-alpine

WORKDIR /app

# Install OpenSSL and dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Copy Railway package.json (without workspace dependencies)
COPY package.railway.json temp-package.json
RUN rm -f package.json && mv temp-package.json package.json

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prod.prisma

# Build the application
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]