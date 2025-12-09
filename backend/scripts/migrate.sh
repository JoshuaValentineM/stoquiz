#!/bin/sh

# Wait for database to be ready
echo "Waiting for database..."
sleep 5

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prod.prisma

# Push schema to database (creates tables if they don't exist)
echo "Creating database tables..."
npx prisma db push --schema=./prisma/schema.prod.prisma

# Start the application
echo "Starting application..."
npm start