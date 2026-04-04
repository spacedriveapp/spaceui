#!/bin/bash

# unlink-packages.sh - Unlink packages from local development
# Usage: ./scripts/unlink-packages.sh

set -e

echo "🔗 Unlinking SpaceUI packages..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Unlink each package
for pkg in packages/*; do
  if [ -d "$pkg" ]; then
    pkg_name=$(basename "$pkg")
    echo -e "${YELLOW}Unlinking @spacedrive/$pkg_name...${NC}"
    cd "$pkg"
    bun unlink 2>/dev/null || true
    cd - > /dev/null
  fi
done

echo ""
echo -e "${GREEN}✅ All packages unlinked!${NC}"
echo ""
echo "To restore npm versions in your projects:"
echo "  cd /path/to/project"
echo "  bun install @spacedrive/primitives@latest"
