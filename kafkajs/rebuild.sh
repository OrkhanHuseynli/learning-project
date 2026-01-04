#!/bin/bash

# Script to rebuild and update Docker images for all services
# Usage: ./rebuild.sh [service-name]
# If no service is specified, all services will be rebuilt

set -e

SERVICES=("api-service" "file-service" "file-creation-ui")

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Docker Services Rebuild Script ===${NC}\n"

# Check if a specific service was provided
if [ $# -eq 1 ]; then
  SERVICE=$1
  if [[ " ${SERVICES[@]} " =~ " ${SERVICE} " ]]; then
    echo -e "${YELLOW}Rebuilding service: ${SERVICE}${NC}\n"
    
    echo -e "${BLUE}Step 1: Stopping ${SERVICE} container...${NC}"
    docker compose stop ${SERVICE} || true
    
    echo -e "\n${BLUE}Step 2: Removing ${SERVICE} container...${NC}"
    docker compose rm -f ${SERVICE} || true
    
    echo -e "\n${BLUE}Step 3: Rebuilding ${SERVICE} image...${NC}"
    docker compose build --no-cache ${SERVICE}
    
    echo -e "\n${BLUE}Step 4: Starting ${SERVICE}...${NC}"
    docker compose up -d ${SERVICE}
    
    echo -e "\n${GREEN}✓ ${SERVICE} has been rebuilt and restarted!${NC}"
    echo -e "\n${YELLOW}View logs with: docker compose logs -f ${SERVICE}${NC}"
  else
    echo -e "${YELLOW}Error: Unknown service '${SERVICE}'${NC}"
    echo -e "Available services: ${SERVICES[@]}"
    exit 1
  fi
else
  echo -e "${YELLOW}Rebuilding all application services...${NC}\n"
  
  echo -e "${BLUE}Step 1: Stopping all application services...${NC}"
  docker compose stop api-service file-service file-creation-ui
  
  echo -e "\n${BLUE}Step 2: Removing old containers...${NC}"
  docker compose rm -f api-service file-service file-creation-ui
  
  echo -e "\n${BLUE}Step 3: Rebuilding all images (no cache)...${NC}"
  docker compose build --no-cache api-service file-service file-creation-ui
  
  echo -e "\n${BLUE}Step 4: Starting all services...${NC}"
  docker compose up -d
  
  echo -e "\n${GREEN}✓ All services have been rebuilt and restarted!${NC}"
  echo -e "\n${YELLOW}View logs with: docker compose logs -f${NC}"
fi

echo -e "\n${BLUE}Container Status:${NC}"
docker compose ps
