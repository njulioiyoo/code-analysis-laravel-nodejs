#!/bin/bash

# SonarQube Analysis Script for Code Analysis Project
# Runs comprehensive analysis on Laravel and Node.js code

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 SonarQube Code Analysis for Laravel & Node.js${NC}"
echo "=================================================="
echo ""

# Check if SonarQube is running
if ! docker ps | grep -q sonarqube-codeanalysis; then
    echo -e "${YELLOW}🚀 Starting SonarQube services...${NC}"
    docker-compose -f docker-compose.sonarqube.yml up -d
    
    echo -e "${YELLOW}⏳ Waiting for SonarQube to be ready...${NC}"
    # Wait for SonarQube to be healthy
    until curl -s http://localhost:9000/api/system/status | grep -q '"status":"UP"'; do
        echo "   Waiting for SonarQube startup..."
        sleep 10
    done
    echo -e "${GREEN}✅ SonarQube is ready!${NC}"
else
    echo -e "${GREEN}✅ SonarQube is already running${NC}"
fi

echo ""
echo -e "${BLUE}📊 Running SonarQube analysis...${NC}"

# Get or create authentication token
echo -e "${BLUE}🔑 Getting authentication token...${NC}"
SONAR_TOKEN=${SONAR_TOKEN:-$(curl -s -u admin:admin -X POST "http://localhost:9000/api/user_tokens/generate?name=scanner-$(date +%s)" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)}

if [ -z "$SONAR_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get authentication token${NC}"
    echo "💡 Make sure SonarQube is running and accessible"
    exit 1
fi

# Run SonarQube analysis
if docker-compose -f docker-compose.sonarqube.yml run --rm sonar-scanner sonar-scanner \
    -Dsonar.host.url=http://sonarqube.web.local:9000 \
    -Dsonar.token=$SONAR_TOKEN \
    -Dsonar.projectKey=code-analysis-laravel-nodejs \
    -Dsonar.projectName="Code Analysis - Laravel & Node.js" \
    -Dsonar.projectVersion=1.0 \
    -Dsonar.sources=examples/laravel/app,examples/nodejs \
    -Dsonar.exclusions="**/vendor/**,**/node_modules/**,**/storage/**,**/bootstrap/cache/**,**/hooks/**,**/.git/**,**/.docker/**,examples/laravel/hooks/**,hooks/**" \
    -Dsonar.sourceEncoding=UTF-8; then
    
    echo ""
    echo -e "${GREEN}🎉 SonarQube analysis completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Analysis Results:${NC}"
    echo "   Dashboard: http://localhost:9000/dashboard?id=code-analysis-laravel-nodejs"
    echo "   Project:   code-analysis-laravel-nodejs"
    echo ""
    echo -e "${YELLOW}💡 Next Steps:${NC}"
    echo "   1. Open SonarQube dashboard in browser"
    echo "   2. Review code quality issues"
    echo "   3. Check security hotspots"
    echo "   4. Monitor code coverage"
    echo ""
else
    echo ""
    echo -e "${RED}❌ SonarQube analysis failed!${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
    echo "   1. Check SonarQube logs: docker logs sonarqube-codeanalysis"
    echo "   2. Verify project structure and exclusions"
    echo "   3. Check SonarQube server status: curl http://localhost:9000/api/system/status"
    echo ""
    exit 1
fi