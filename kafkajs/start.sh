#!/bin/bash

# Complete setup script for the distributed file creation system
# This script starts all infrastructure and services

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== Distributed File Creation System - Complete Setup ===${NC}\n"

# Step 1: Start infrastructure services
echo -e "${BLUE}Step 1: Starting infrastructure services (Kafka, PostgreSQL, LocalStack)...${NC}"
docker compose up -d kafka postgres-db localstack-s3

# Step 2: Wait for services to be healthy
echo -e "\n${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Step 2: Create Kafka topics with 3 partitions for round-robin distribution
echo -e "\n${BLUE}Step 2: Creating Kafka topics (3 partitions each)...${NC}"
docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --create --if-not-exists --topic file.create --partitions 3 --replication-factor 1
docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --create --if-not-exists --topic file.created --partitions 3 --replication-factor 1
docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --create --if-not-exists --topic file.create.dlq --partitions 1 --replication-factor 1

echo -e "${GREEN}✓ Topics created: file.create, file.created, file.create.dlq${NC}"

# Step 5: Build and start application services
echo -e "\n${BLUE}Step 3: Building application services...${NC}"
docker compose build api-service file-service file-creation-ui

# Step 6: Run database migrations
echo -e "\n${BLUE}Step 4: Running database migrations...${NC}"
cd api-service
npm install
npm run migration:run
cd ..

# Step 7: Start all services
echo -e "\n${BLUE}Step 5: Starting all application services...${NC}"
docker compose up -d

echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
echo -e "\n${YELLOW}Services running:${NC}"
echo -e "  • API Service:      http://localhost:3006"
echo -e "  • File Service:     http://localhost:3001"
echo -e "  • UI:               http://localhost:3004"
echo -e "  • Kafka:            localhost:29092"
echo -e "  • PostgreSQL:       localhost:5432"
echo -e "  • LocalStack S3:    localhost:4566"

echo -e "\n${YELLOW}Useful commands:${NC}"
echo -e "  • View all logs:              docker compose logs -f"
echo -e "  • View specific service logs: docker compose logs -f api-service"
echo -e "  • Check service status:       docker compose ps"
echo -e "  • Stop all services:          docker compose down"
echo -e "  • Rebuild after code change:  ./rebuild.sh [service-name]"

echo -e "\n${GREEN}✓ Ready to use! Visit http://localhost:3004 to create files${NC}\n"
