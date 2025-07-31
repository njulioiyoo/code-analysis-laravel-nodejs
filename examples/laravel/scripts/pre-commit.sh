#!/bin/bash

set -e

echo "🚀 Running Laravel pre-commit hooks..."

# Skip staged file checking in Docker environment, just run full checks
echo "📝 Running code quality checks on all PHP files..."

# Check code formatting with Pint
echo ""
echo "🎨 Checking code formatting with Laravel Pint..."
if ! ./vendor/bin/pint --test; then
    echo "❌ Code formatting issues found!"
    echo "💡 Run './vendor/bin/pint' to fix formatting issues."
    exit 1
fi
echo "✅ Code formatting looks good!"

# Run static analysis with Larastan
echo ""
echo "🔍 Running static analysis with Larastan..."
if ! ./vendor/bin/phpstan analyse --no-progress; then
    echo "❌ Static analysis issues found!"
    echo "💡 Please fix the issues reported by Larastan."
    exit 1
fi
echo "✅ Static analysis passed!"

echo ""
echo "🎉 All pre-commit checks passed! Ready to commit."