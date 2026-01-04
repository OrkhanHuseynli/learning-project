#!/bin/bash

echo "🚀 Starting infrastructure setup..."

# Start Docker services
echo "📦 Starting Docker containers..."
docker compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

# Wait for PostgreSQL
echo "🔍 Checking PostgreSQL..."
until docker exec postgres-db pg_isready -U fileuser -d filedb > /dev/null 2>&1; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done
echo "✓ PostgreSQL is ready"

# Wait for Kafka
echo "🔍 Checking Kafka..."
until docker exec kafka kafka-broker-api-versions --bootstrap-server kafka:9092 > /dev/null 2>&1; do
  echo "Waiting for Kafka..."
  sleep 2
done
echo "✓ Kafka is ready"

# Wait for LocalStack
echo "🔍 Checking LocalStack..."
until docker exec localstack-s3 awslocal s3 ls > /dev/null 2>&1; do
  echo "Waiting for LocalStack..."
  sleep 2
done
echo "✓ LocalStack is ready"

# Create S3 bucket
echo "📦 Creating S3 bucket..."
docker exec localstack awslocal s3 mb s3://file-storage-bucket 2>/dev/null || echo "Bucket already exists"
docker exec localstack awslocal s3 ls
echo "✓ S3 bucket created"

# Create Kafka topics
echo "📡 Creating Kafka topics..."
docker exec kafka kafka-topics --bootstrap-server kafka:9092 --create --topic file.create --partitions 1 --replication-factor 1 --if-not-exists
docker exec kafka kafka-topics --bootstrap-server kafka:9092 --create --topic file.created --partitions 1 --replication-factor 1 --if-not-exists
echo "✓ Kafka topics created"

echo ""
echo "✅ Infrastructure setup complete!"
echo ""
echo "📋 Services:"
echo "   - Kafka: localhost:29092"
echo "   - PostgreSQL: localhost:5432"
echo "   - LocalStack (S3): localhost:4566"
echo ""
echo "📋 Next steps:"
echo "   1. cd api-service && npm install"
echo "   2. cd api-service && npm run migration:run"
echo "   3. cd api-service && npm run start:dev"
echo "   4. cd file-service && npm install"
echo "   5. cd file-service && npm run start:dev"
echo ""
