#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Checking database status and running migrations..."
if [ -n "$DATABASE_URL" ]; then
  echo "Running Prisma db push..."
  npx prisma db push || echo "Prisma push failed, continuing startup..."
  
  echo "Running Prisma database seeding..."
  npx prisma db seed || echo "Prisma seed failed, continuing startup..."
else
  echo "DATABASE_URL not set, skipping database push and seed."
fi

echo "Starting Next.js application..."
exec node server.js
