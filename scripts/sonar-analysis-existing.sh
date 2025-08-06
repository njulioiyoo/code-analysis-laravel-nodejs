#!/bin/bash

# SonarQube Analysis Script untuk Instance yang Sudah Ada
# Menggunakan SonarQube instance existing tanpa membuat container baru

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 SonarQube Analysis - Using Existing Instance${NC}"
echo "=================================================="
echo ""

# Configuration
SONAR_HOST="http://sonarqube:9000"
PROJECT_KEY="code-analysis-laravel-nodejs"
PROJECT_NAME="Code Analysis - Laravel & Node.js"

echo -e "${BLUE}📊 Configuration:${NC}"
echo "   Host: $SONAR_HOST"
echo "   Project: $PROJECT_KEY"
echo ""

# Check if SonarQube is accessible from within Docker network
echo -e "${BLUE}🔍 Checking SonarQube accessibility...${NC}"
if docker run --rm --network postgresql_default sonarsource/sonar-scanner-cli:latest curl -s "$SONAR_HOST/api/system/status" | grep -q "UP"; then
    echo -e "${GREEN}✅ SonarQube is accessible at $SONAR_HOST${NC}"
else
    echo -e "${RED}❌ Cannot access SonarQube at $SONAR_HOST${NC}"
    echo ""
    echo -e "${YELLOW}💡 Solutions:${NC}"
    echo "   1. Check if SonarQube container is running: docker ps | grep sonar"
    echo "   2. Verify host configuration in /etc/hosts or Docker networks"
    echo "   3. Try accessing: http://localhost:9000 (if different port mapping)"
    echo ""
    exit 1
fi

echo ""
echo -e "${BLUE}🔑 Authentication:${NC}"
echo "⚠️  Manual steps required:"
echo "   1. Open: $SONAR_HOST"
echo "   2. Login with your credentials"
echo "   3. Go to: Administration > Security > Users > Tokens"
echo "   4. Generate new token for 'code-analysis-scanner'"
echo "   5. Copy token and set environment variable:"
echo "      export SONAR_TOKEN=your_token_here"
echo ""

# Check if token is provided
if [ -z "$SONAR_TOKEN" ]; then
    echo -e "${YELLOW}⏸️  Waiting for SONAR_TOKEN environment variable...${NC}"
    echo ""
    echo "To proceed:"
    echo "   1. Generate token from SonarQube UI"
    echo "   2. Run: export SONAR_TOKEN=your_generated_token"
    echo "   3. Run this script again"
    echo ""
    exit 0
fi

echo -e "${GREEN}✅ Token provided${NC}"
echo ""

# Create temporary scanner script
echo -e "${BLUE}📊 Running SonarQube analysis...${NC}"

# Use standalone sonar-scanner (assuming it's available in the project)
# or use docker with network access to existing SonarQube
MSYS_NO_PATHCONV=1 docker run --rm \
    --network postgresql_default \
    -v "$(pwd):/usr/src" \
    -w /usr/src \
    sonarsource/sonar-scanner-cli:latest \
    sonar-scanner \
    -Dsonar.host.url=$SONAR_HOST \
    -Dsonar.token=$SONAR_TOKEN \
    -Dsonar.projectKey=$PROJECT_KEY \
    -Dsonar.projectName="$PROJECT_NAME" \
    -Dsonar.projectVersion=1.0 \
    -Dsonar.sources=examples/laravel/app,examples/nodejs \
    -Dsonar.exclusions="**/vendor/**,**/node_modules/**,**/storage/**,**/bootstrap/cache/**,**/hooks/**,**/.git/**,**/.docker/**" \
    -Dsonar.sourceEncoding=UTF-8

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 SonarQube analysis completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Results:${NC}"
    echo "   Dashboard: $SONAR_HOST/dashboard?id=$PROJECT_KEY"
    echo "   Project:   $PROJECT_KEY"
    echo ""
    echo -e "${YELLOW}💡 Next Steps:${NC}"
    echo "   1. Open dashboard to review results"
    echo "   2. Check code quality metrics"
    echo "   3. Review security hotspots"
    echo "   4. Address any issues found"
    echo ""
else
    echo ""
    echo -e "${RED}❌ SonarQube analysis failed!${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
    echo "   1. Verify token is valid and has scan permissions"
    echo "   2. Check network connectivity to $SONAR_HOST"
    echo "   3. Verify project structure and source paths"
    echo ""
    exit 1
fi