#!/bin/bash

# Script to update existing Kafka topics to have 3 partitions
# Run this if you already have topics with fewer partitions

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== Updating Kafka Topics to 3 Partitions ===${NC}\n"

# Check if Kafka is running
if ! docker ps | grep -q kafka; then
  echo -e "${YELLOW}Kafka container is not running. Starting it...${NC}"
  docker compose up -d kafka
  sleep 10
fi

# Update file.create topic
echo -e "${BLUE}Updating 'file.create' topic to 3 partitions...${NC}"
docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --alter --topic file.create --partitions 3

# Update file.created topic
echo -e "${BLUE}Updating 'file.created' topic to 3 partitions...${NC}"
docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --alter --topic file.created --partitions 3

# Describe topics to verify
echo -e "\n${BLUE}Verifying topic configurations:${NC}\n"
docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --describe --topic file.create

echo ""
docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --describe --topic file.created

echo -e "\n${GREEN}✓ Topics updated successfully!${NC}"
echo -e "${YELLOW}Note: Existing messages will stay in their original partitions.${NC}"
echo -e "${YELLOW}New messages will be distributed round-robin across all 3 partitions.${NC}\n"
