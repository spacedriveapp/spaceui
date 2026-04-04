#!/bin/bash

# link-packages.sh - Link packages for local development
# Usage: ./scripts/link-packages.sh

set -e

echo "🔗 Linking SpaceUI packages for local development..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Link each package
for pkg in packages/*; do
  if [ -d "$pkg" ]; then
    pkg_name=$(basename "$pkg")
    echo -e "${YELLOW}Linking @spacedrive/$pkg_name...${NC}"
    cd "$pkg"
    bun link
    cd - > /dev/null
  fi
done

echo ""
echo -e "${GREEN}✅ All packages linked!${NC}"
echo ""
echo "To use in another project:"
echo "  cd /path/to/project"
echo "  bun link @spacedrive/tokens"
echo "  bun link @spacedrive/primitives"
echo "  bun link @spacedrive/forms"
echo "  bun link @spacedrive/ai"
echo "  bun link @spacedrive/explorer"
