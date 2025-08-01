#!/bin/bash

# Unused Variable Analysis Script
# Scans PHP files for unused variables using custom detector

echo "🔍 Laravel Unused Variable Analysis"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counter for issues
total_files=0
files_with_issues=0
total_issues=0

# Function to analyze a directory
analyze_directory() {
    local dir=$1
    echo -e "${BLUE}📁 Analyzing directory: $dir${NC}"
    echo ""
    
    # Find all PHP files
    find "$dir" -name "*.php" -type f | while read -r file; do
        total_files=$((total_files + 1))
        
        echo -e "${YELLOW}📄 Checking: $file${NC}"
        
        # Run our custom detector
        result=$(php detect-unused-vars.php "$file" 2>/dev/null)
        
        if echo "$result" | grep -q "Found.*unused variable"; then
            files_with_issues=$((files_with_issues + 1))
            issue_count=$(echo "$result" | grep -o "Found [0-9]*" | grep -o "[0-9]*")
            total_issues=$((total_issues + issue_count))
            
            echo -e "${RED}❌ Issues found in $file${NC}"
            echo "$result" | grep -A 10 "Found.*unused variable"
            echo ""
        else
            echo -e "${GREEN}✅ No issues found${NC}"
        fi
        echo "---"
    done
}

# Analyze app directory
if [ -d "app" ]; then
    analyze_directory "app"
else
    echo "❌ app/ directory not found. Are you in Laravel root?"
    exit 1
fi

echo ""
echo "📊 Analysis Summary"
echo "==================="
echo "Total files analyzed: $total_files"
echo "Files with issues: $files_with_issues"  
echo "Total unused variables: $total_issues"

if [ $total_issues -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}💡 Recommendations:${NC}"
    echo "1. Remove unused variables to clean up code"
    echo "2. Consider if variables are needed for future use"
    echo "3. Use IDE warnings to catch these during development"
    
    exit 1
else
    echo ""
    echo -e "${GREEN}🎉 No unused variables found! Code is clean.${NC}"
    exit 0
fi