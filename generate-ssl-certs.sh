#!/bin/bash
set -e

# Create a directory for SSL certificates
mkdir -p ./ssl

# Generate a self-signed certificate
openssl req -new -x509 -days 365 -nodes \
  -out ./ssl/server.crt \
  -keyout ./ssl/server.key \
  -subj "/C=SK/ST=State/L=City/O=Organization/CN=localhost"

# Set appropriate permissions - PostgreSQL requires very strict permissions
chmod 600 ./ssl/server.key  # Only owner can read/write
chmod 644 ./ssl/server.crt  # World readable but only owner can write

echo "SSL certificates created successfully in ./ssl directory"