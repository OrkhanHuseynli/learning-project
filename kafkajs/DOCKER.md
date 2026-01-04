# Docker Containerization Summary

## What Was Done

All services in the distributed file creation system have been containerized and can now run in Docker containers.

## Files Created

### Dockerfiles

- `api-service/Dockerfile` - API service container
- `file-service/Dockerfile` - File processor service container
- `file-creation-ui/Dockerfile` - Next.js UI container

### Docker Ignore Files

- `api-service/.dockerignore` - Excludes node_modules, dist, etc.
- `file-service/.dockerignore` - Excludes node_modules, dist, etc.
- `file-creation-ui/.dockerignore` - Excludes node_modules, .next, etc.

### Scripts

- `start.sh` - Complete setup script (infrastructure + services + migrations)
- `rebuild.sh` - Quick rebuild script for updating images after code changes
- `.env.example` - Environment variables documentation

### Configuration Updates

- Updated `docker-compose.yaml` with all three application services
- Modified all services to use environment variables for configuration
- Added production npm scripts (`start:prod`)
- API service automatically creates S3 bucket on startup via S3Service

## Configuration Changes

### API Service

- Database config now uses individual env vars (HOST, PORT, USER, etc.)
- Kafka broker reads from `KAFKA_BROKER` env var
- S3 endpoint reads from `S3_ENDPOINT` env var
- Automatically creates S3 bucket on startup using OnModuleInit hook

### File Service

- Kafka broker reads from `KAFKA_BROKER` env var
- S3 endpoint reads from `S3_ENDPOINT` env var

### All Services

- Default values work for local development (localhost)
- Docker values use service names (kafka, postgres-db, localstack-s3)
- Services communicate via Docker network

## Usage

### First Time Setup

```bash
./start.sh
```

### After Code Changes

```bash
# Rebuild all services
./rebuild.sh

# Rebuild specific service
./rebuild.sh api-service
```

### Other Commands

```bash
# View logs
docker compose logs -f [service-name]

# Check status
docker compose ps

# Stop everything
docker compose down

# Stop and remove volumes
docker compose down -v
```

## Service URLs

- **UI**: http://localhost:3004
- **API**: http://localhost:3006
- **File Service**: http://localhost:3001 (internal)
- **Kafka**: localhost:29092
- **PostgreSQL**: localhost:5432
- **LocalStack**: localhost:4566

## Environment Variables

Services can be configured via environment variables in `docker-compose.yaml` or by creating a `.env` file (see `.env.example`).

## Network Architecture

All containers run in the same Docker network and communicate using service names:

- `kafka` (not `localhost`)
- `postgres-db` (not `localhost`)
- `localstack-s3` (not `localhost`)

External access from host machine still uses `localhost` on exposed ports.
