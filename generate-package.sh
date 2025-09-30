#!/bin/bash

# Version bump and package generation script
# Usage: ./generate-package.sh [fix|patch|version]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if argument is provided
if [ $# -eq 0 ]; then
    print_error "No argument provided. Usage: $0 [fix|patch|version]"
    exit 1
fi

BUMP_TYPE=$1

# Validate argument
if [[ "$BUMP_TYPE" != "fix" && "$BUMP_TYPE" != "patch" && "$BUMP_TYPE" != "version" ]]; then
    print_error "Invalid argument. Use: fix, patch, or version"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in current directory"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository"
    exit 1
fi

# Check if vsce is installed
if ! command -v vsce &> /dev/null; then
    print_error "vsce is not installed. Please install it with: npm install -g vsce"
    exit 1
fi

print_info "Reading current version from package.json..."

# Extract current version from package.json
CURRENT_VERSION=$(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')

if [ -z "$CURRENT_VERSION" ]; then
    print_error "Could not extract version from package.json"
    exit 1
fi

print_info "Current version: $CURRENT_VERSION"

# Split version into components
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"

if [ ${#VERSION_PARTS[@]} -ne 3 ]; then
    print_error "Version format is invalid. Expected format: x.y.z"
    exit 1
fi

MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

print_info "Current version components: Major=$MAJOR, Minor=$MINOR, Patch=$PATCH"

# Calculate new version based on bump type
case $BUMP_TYPE in
    "fix")
        NEW_PATCH=$((PATCH + 1))
        NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
        ;;
    "patch")
        NEW_MINOR=$((MINOR + 1))
        NEW_VERSION="$MAJOR.$NEW_MINOR.0"
        ;;
    "version")
        NEW_MAJOR=$((MAJOR + 1))
        NEW_VERSION="$NEW_MAJOR.0.0"
        ;;
esac

print_info "New version will be: $NEW_VERSION"

# Update package.json
print_info "Updating package.json with new version..."

# Create backup
cp package.json package.json.backup

# Update version in package.json using sed
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS version of sed
    sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
else
    # Linux version of sed
    sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
fi

# Verify the change was made
UPDATED_VERSION=$(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')

if [ "$UPDATED_VERSION" != "$NEW_VERSION" ]; then
    print_error "Failed to update version in package.json"
    # Restore backup
    mv package.json.backup package.json
    exit 1
fi

# Remove backup
rm package.json.backup

print_info "Successfully updated package.json to version $NEW_VERSION"

# Git operations
print_info "Adding all changes to git..."
git add .

print_info "Creating commit..."
COMMIT_MESSAGE="Changed by script: version $NEW_VERSION"
git commit -m "$COMMIT_MESSAGE"

print_info "Pushing to main branch..."
git push origin main

print_info "Creating tag v$NEW_VERSION..."
git tag "v$NEW_VERSION"

print_info "Pushing tag to origin..."
git push origin "v$NEW_VERSION"

print_info "Creating package with vsce..."
vsce package

print_info "✅ Successfully completed all operations!"
print_info "   - Updated version from $CURRENT_VERSION to $NEW_VERSION"
print_info "   - Committed and pushed changes"
print_info "   - Created and pushed tag v$NEW_VERSION"
print_info "   - Generated package file"

# List generated package files
PACKAGE_FILES=$(ls *.vsix 2>/dev/null | tail -1)
if [ -n "$PACKAGE_FILES" ]; then
    print_info "   - Package file: $PACKAGE_FILES"
fi