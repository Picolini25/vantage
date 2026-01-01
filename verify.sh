#!/bin/bash

echo "Vantage Installation Verification"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_mark="${GREEN}[OK]${NC}"
cross_mark="${RED}[FAIL]${NC}"
warning_mark="${YELLOW}[WARN]${NC}"

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${check_mark} ${NODE_VERSION}"
else
    echo -e "${cross_mark} Not installed"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${check_mark} v${NPM_VERSION}"
else
    echo -e "${cross_mark} Not installed"
    exit 1
fi

# Check Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        echo -e "${check_mark} Running"
    else
        echo -e "${warning_mark} Installed but not running"
        echo "  Start Docker Desktop to continue"
    fi
else
    echo -e "${cross_mark} Not installed"
fi

# Check if node_modules exists
echo -n "Checking dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${check_mark} Installed"
else
    echo -e "${cross_mark} Not installed"
    echo "  Run 'npm install' to install dependencies"
fi

# Check if .env exists
echo -n "Checking .env file... "
if [ -f ".env" ]; then
    echo -e "${check_mark} Exists"
    
    # Check for API keys
    echo -n "Checking API keys... "
    if grep -q "YOUR_STEAM_KEY_HERE" .env || grep -q "your_steam_api_key_here" .env; then
        echo -e "${warning_mark} Not configured"
        echo "  Add your API keys to .env file"
    else
        echo -e "${check_mark} Configured"
    fi
else
    echo -e "${cross_mark} Not found"
    echo "  Copy .env.example to .env and add your API keys"
fi

# Check Prisma
echo -n "Checking Prisma... "
if [ -d "node_modules/@prisma/client" ]; then
    echo -e "${check_mark} Client generated"
else
    echo -e "${warning_mark} Client not generated"
    echo "  Run 'npm run db:generate' after starting Docker"
fi

# Check Docker services
echo ""
echo "Docker Services:"
if docker ps &> /dev/null; then
    echo -n "  PostgreSQL... "
    if docker ps | grep -q "vantage-postgres"; then
        echo -e "${check_mark} Running"
    else
        echo -e "${cross_mark} Not running"
        echo "    Run 'npm run docker:up'"
    fi
    
    echo -n "  Redis... "
    if docker ps | grep -q "vantage-redis"; then
        echo -e "${check_mark} Running"
    else
        echo -e "${cross_mark} Not running"
        echo "    Run 'npm run docker:up'"
    fi
else
    echo -e "  ${warning_mark} Docker not running, skipping service check"
fi

# Check ports
echo ""
echo "Port Availability:"
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  Port $1... ${cross_mark} In use"
    else
        echo -e "  Port $1... ${check_mark} Available"
    fi
}

check_port 3000
check_port 3001
check_port 5432
check_port 6379

# Project structure
echo ""
echo "Project Structure:"
check_dir() {
    if [ -d "$1" ]; then
        echo -e "  $1... ${check_mark}"
    else
        echo -e "  $1... ${cross_mark}"
    fi
}

check_dir "apps/web"
check_dir "apps/api"
check_dir "packages/shared"
check_dir "prisma"

# Summary
echo ""
echo "====================================="
echo "Next Steps:"
echo "1. Start Docker Desktop (if not running)"
echo "2. Run './setup.sh' to initialize services"
echo "3. Add API keys to .env file"
echo "4. Run 'npm run dev' to start development"
echo "5. Open http://localhost:3000"
echo ""
