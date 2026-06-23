#!/bin/sh

set -e

echo "Running database schema sync..."
if [ -n "$DATABASE_URL" ]; then
  ./node_modules/.bin/prisma db push || echo "Prisma db push failed, continuing startup..."
else
  echo "DATABASE_URL not set, skipping database sync."
fi

echo "Starting Next.js application..."
exec node server.js
