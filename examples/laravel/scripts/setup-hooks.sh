#!/bin/bash

echo "🔧 Setting up Git hooks for Laravel project..."

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy pre-commit hook
cp .githooks/pre-commit .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit

echo "✅ Pre-commit hook installed successfully!"
echo ""
echo "📖 Usage:"
echo "  - The hook will automatically run on 'git commit'"
echo "  - It will check code formatting with Pint and run Larastan analysis"
echo "  - If any issues are found, the commit will be blocked"
echo ""
echo "🛠️  Manual commands:"
echo "  - Fix formatting: composer pint"
echo "  - Check formatting: composer pint-check"
echo "  - Run analysis: composer larastan"