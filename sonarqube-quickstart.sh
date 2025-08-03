#!/bin/bash

# SonarQube Quick Start Script
# Sets up SonarQube with PostgreSQL and runs initial analysis

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 SonarQube Quick Start for Code Analysis Project${NC}"
echo "=================================================="
echo ""

# Function to check if service is ready
wait_for_service() {
    local service_name=$1
    local check_command=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for $service_name to be ready...${NC}"
    while [ $attempt -le $max_attempts ]; do
        if eval $check_command > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi
        echo "   Attempt $attempt/$max_attempts - waiting..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to start after $max_attempts attempts${NC}"
    return 1
}

# Step 1: Start services
echo -e "${BLUE}📦 Starting SonarQube services...${NC}"
docker-compose -f docker-compose.sonarqube.yml up -d

# Step 2: Wait for PostgreSQL
wait_for_service "PostgreSQL" "docker exec postgres-sonar pg_isready -U sonar"

# Step 3: Wait for SonarQube
wait_for_service "SonarQube" "curl -s http://sonarqube.web.local:9000/api/system/status | grep -q UP"

echo ""
echo -e "${BLUE}🔧 Setting up SonarQube project...${NC}"

# Step 4: Create project (if not exists)
PROJECT_EXISTS=$(curl -s -u admin:admin "http://localhost:9000/api/projects/search?projects=code-analysis-laravel-nodejs" | grep -o '"total":[0-9]*' | cut -d: -f2)

if [ "$PROJECT_EXISTS" = "0" ]; then
    echo "Creating SonarQube project..."
    curl -s -u admin:admin -X POST \
        "http://localhost:9000/api/projects/create?project=code-analysis-laravel-nodejs&name=Code%20Analysis%20Laravel%20NodeJS" > /dev/null
    echo -e "${GREEN}✅ Project created successfully${NC}"
else
    echo -e "${GREEN}✅ Project already exists${NC}"
fi

# Step 5: Generate token (if needed)
echo ""
echo -e "${BLUE}🔑 Generating authentication token...${NC}"
# Always generate a new token for reliability
SONAR_TOKEN=$(curl -s -u admin:admin -X POST \
    "http://localhost:9000/api/user_tokens/generate?name=scanner-$(date +%s)" | \
    grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$SONAR_TOKEN" ]; then
    echo -e "${GREEN}✅ Token generated: ${SONAR_TOKEN}${NC}"
    echo -e "${YELLOW}💡 Save this token for GitHub Actions: SONAR_TOKEN=${SONAR_TOKEN}${NC}"
else
    echo -e "${RED}❌ Failed to generate token${NC}"
    exit 1
fi

# Step 6: Run initial analysis
echo ""
echo -e "${BLUE}📊 Running initial code analysis...${NC}"
if docker-compose -f docker-compose.sonarqube.yml run --rm sonar-scanner sonar-scanner \
    -Dsonar.host.url=http://sonarqube:9000 \
    -Dsonar.token=$SONAR_TOKEN \
    -Dsonar.projectKey=code-analysis-laravel-nodejs \
    -Dsonar.projectName="Code Analysis - Laravel & Node.js" \
    -Dsonar.sources=examples/laravel/app,examples/nodejs \
    -Dsonar.exclusions="**/vendor/**,**/node_modules/**,**/storage/**,**/bootstrap/cache/**,**/hooks/**,**/.git/**" \
    -Dsonar.sourceEncoding=UTF-8; then
    
    echo ""
    echo -e "${GREEN}🎉 SonarQube setup completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Quick Access:${NC}"
    echo "   🌐 Dashboard: http://localhost:9000"
    echo "   👤 Username: admin"
    echo "   🔑 Password: admin (change on first login)"
    echo "   📊 Project: code-analysis-laravel-nodejs"
    echo ""
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    echo "   1. Open dashboard: http://localhost:9000/dashboard?id=code-analysis-laravel-nodejs"
    echo "   2. Change default password"
    echo "   3. Review analysis results"
    echo "   4. Configure quality gates"
    echo "   5. Set up IDE integration (SonarLint)"
    echo ""
    echo -e "${YELLOW}💡 For future analysis, run: ./scripts/sonar-analysis.sh${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Initial analysis failed!${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
    echo "   1. Check SonarQube logs: docker logs sonarqube-codeanalysis"
    echo "   2. Verify services: docker-compose -f docker-compose.sonarqube.yml ps"
    echo "   3. Check network: docker network ls"
    echo "   4. Manual browser test: http://localhost:9000"
    echo ""
    exit 1
fi