#!/bin/bash

# PHPStan Performance Optimization Script
# Creates persistent Docker container for faster analysis

CONTAINER_NAME="phpstan-laravel-persistent"
IMAGE_NAME="codeanalysis-laravel"

echo "🚀 Setting up persistent PHPStan container for faster analysis..."

# Check if container already exists and is running
if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ Container $CONTAINER_NAME is already running"
    exit 0
fi

# Check if container exists but stopped
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo "🔄 Starting existing container $CONTAINER_NAME..."
    docker start $CONTAINER_NAME
    exit 0
fi

# Create new persistent container
echo "🆕 Creating new persistent container $CONTAINER_NAME..."
docker run -d \
    --name $CONTAINER_NAME \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    $IMAGE_NAME \
    tail -f /dev/null

echo "✅ Persistent container created and running!"
echo ""
echo "💡 Now you can run fast PHPStan analysis with:"
echo "   docker exec $CONTAINER_NAME ./vendor/bin/phpstan analyse --parallel"
echo ""
echo "🛑 To stop the container when done:"
echo "   docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME"