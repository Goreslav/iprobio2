#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
RETRIES=30
until [ $RETRIES -eq 0 ] || nc -z postgres 5432; do
  echo "Waiting for PostgreSQL server, $((RETRIES--)) remaining attempts..."
  sleep 3
done

if [ $RETRIES -eq 0 ]; then
  echo "PostgreSQL not available, exiting"
  exit 1
fi

# Give PostgreSQL a bit more time to initialize
sleep 5

# Create database if it doesn't exist
echo "Checking if database exists and creating if needed..."
PGPASSWORD=postgres psql -h postgres -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'iprobioDb'" | grep -q 1 || PGPASSWORD=postgres psql -h postgres -U postgres -c "CREATE DATABASE iprobioDb"

# Create dummy table to check if we can connect
echo "Checking if database is initialized..."
PGPASSWORD=postgres psql -h postgres -U postgres -d iprobioDb -c "CREATE TABLE IF NOT EXISTS dummy_check (id SERIAL PRIMARY KEY);" || true

# Find and store available modules
echo "Checking available modules..."
MODULES=$(npx medusa db:list-modules 2>&1 | grep -A 100 "Available modules:" | grep -v "Available modules:" | awk '{print $3}' | tr -d '-')

# Generate migrations for all modules if they don't exist
echo "Generating migrations for modules if needed..."
for MODULE in $MODULES; do
  if [ ! -d "/app/src/modules/$MODULE/migrations" ] || [ -z "$(ls -A /app/src/modules/$MODULE/migrations 2>/dev/null)" ]; then
    echo "Generating migrations for $MODULE..."
    npx medusa db:generate $MODULE || echo "Could not generate migrations for $MODULE, it might be a core module"
  fi
done

# Run migrations
echo "Running migrations to ensure database is properly set up..."
npx medusa db:migrate

# Sync database links
echo "Syncing database links..."
npx medusa db:sync-links

# Execute the original command
echo "Starting Medusa server..."
exec "$@"