#!/bin/bash

echo "Vantage Setup Script"
echo "===================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "Creating .env file from template..."
  cp .env.example .env
  echo "IMPORTANT: Edit .env and add your API keys!"
  echo ""
else
  echo ".env file already exists"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker Desktop."
  exit 1
fi

echo "Docker is running"
echo ""

# Start Docker services
echo "Starting PostgreSQL and Redis..."
npm run docker:up

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 5

# Generate Prisma client
echo "Generating Prisma client..."
npm run db:generate

# Push database schema
echo "Pushing database schema..."
npm run db:push

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your API keys"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Useful commands:"
echo "  npm run dev          - Start frontend & backend"
echo "  npm run dev:web      - Start only frontend"
echo "  npm run dev:api      - Start only backend"
echo "  npm run worker       - Start background worker"
echo "  npm run db:studio    - Open Prisma Studio"
echo ""
