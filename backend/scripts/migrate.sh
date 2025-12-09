#!/bin/sh

echo "=== Starting Migration Script ==="
echo "Environment: $NODE_ENV"
echo "Full Database URL: $DATABASE_URL"

# Wait for database to be ready
echo "Waiting for database to be ready..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    # Try to connect to database
    if npx prisma db execute --stdin --schema=./prisma/schema.prod.prisma <<< "SELECT 1;" 2>/dev/null; then
        echo "Database is ready!"
        break
    fi

    attempt=$((attempt + 1))
    echo "Attempt $attempt/$max_attempts: Database not ready, waiting 2 seconds..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "Error: Database is not ready after 60 seconds"
    exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prod.prisma

# Push schema to database (creates tables if they don't exist)
echo "Creating database tables..."
npx prisma db push --schema=./prisma/schema.prod.prisma

# Verify tables were created
echo "Verifying tables exist..."
npx prisma db execute --stdin --schema=./prisma/schema.prod.prisma <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

# Start the application
echo "Starting application..."
npm start