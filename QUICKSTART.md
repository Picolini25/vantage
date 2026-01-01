# Quick Start Guide

## Initial Setup (First Time Only)

```bash
# 1. Navigate to project
cd /Users/drwn/Documents/Projects/vantage

# 2. Run automated setup
./setup.sh
```

**Or manually:**

```bash
# Copy environment template
cp .env.example .env

# Start Docker services
npm run docker:up

# Setup database
npm run db:generate
npm run db:push
```

## Configure API Keys

Edit `.env` file:

```env
STEAM_API_KEY="YOUR_STEAM_KEY_HERE"
FACEIT_API_KEY="YOUR_FACEIT_KEY_HERE"
LEETIFY_API_KEY="YOUR_LEETIFY_KEY_HERE"  # Optional
```

### Getting API Keys

1. **Steam**: https://steamcommunity.com/dev/apikey
2. **Faceit**: https://developers.faceit.com/
3. **Leetify**: Contact their team

## Start Development

```bash
# Start everything (recommended)
npm run dev

# Or start individually:
npm run dev:web    # Frontend only (port 3000)
npm run dev:api    # Backend only (port 3001)
npm run worker     # Background jobs
```

## Access Points

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001/health
- **Database UI**: `npm run db:studio`

## Test the Platform

Try searching for:
- Your Steam profile URL
- `76561198012345678` (SteamID64 format)
- `s1mple` (pro player vanity name)

## Common Commands

```bash
# Development
npm run dev              # Start all services
npm run dev:web          # Frontend only
npm run dev:api          # Backend only
npm run worker           # BullMQ worker

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:studio        # Open database UI

# Docker
npm run docker:up        # Start PostgreSQL + Redis
npm run docker:down      # Stop services
docker-compose logs -f   # View logs

# Production
npm run build            # Build all
npm run build:web        # Build frontend
npm run build:api        # Build backend
```

## Troubleshooting

### Docker not running
```bash
# macOS: Start Docker Desktop
open -a Docker

# Verify Docker is running
docker info
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database connection error
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check if running
docker-compose ps
```

### Redis connection error
```bash
# Restart Redis
docker-compose restart redis

# Test connection
redis-cli ping
# Should return: PONG
```

### Prisma errors
```bash
# Regenerate client
npm run db:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Development Workflow

1. **Make changes** to code
2. **Hot reload** automatically updates
3. **Check errors** in terminal
4. **Test** in browser
5. **Commit** changes

## File Locations

**Frontend**:
- Pages: `apps/web/src/pages/`
- Components: `apps/web/src/components/`
- Styles: `apps/web/src/styles/`

**Backend**:
- Routes: `apps/api/src/routes/`
- Services: `apps/api/src/services/`

**Shared**:
- Types: `packages/shared/src/types.ts`
- Risk Logic: `packages/shared/src/risk-calculator.ts`

**Database**:
- Schema: `prisma/schema.prisma`

## Next Steps

1. Set up API keys in `.env`
2. Start development servers
3. Test with real Steam profiles
4. Customize risk weights in `risk-calculator.ts`
5. Adjust UI colors in `tailwind.config.js`
6. Add more data sources
7. Deploy to production

## Resources

- [Main README](./README.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Development Notes](./DEVELOPMENT.md)

---

**Need help?** Check the troubleshooting section in README.md
