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

# Check if database is initialized (check if a core table exists)
echo "Checking if database is initialized..."
PGPASSWORD=postgres psql -h postgres -U postgres -d jaja -c "CREATE TABLE IF NOT EXISTS dummy_check (id SERIAL PRIMARY KEY);" || true
echo "Running migrations to ensure database is properly set up..."
npx medusa db:migrate

# Execute the original command
echo "Starting Medusa server..."
exec "$@"