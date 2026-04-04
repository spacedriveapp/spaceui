#!/bin/bash

# build-watch.sh - Build packages in watch mode for development
# Usage: ./scripts/build-watch.sh [package-name]

set -e

PKG=$1

if [ -z "$PKG" ]; then
  echo "📦 Building all packages in watch mode..."
  bun run dev
else
  if [ -d "packages/$PKG" ]; then
    echo "📦 Building @spacedrive/$PKG in watch mode..."
    cd "packages/$PKG"
    bun run dev
  else
    echo "❌ Package 'packages/$PKG' not found"
    echo "Available packages:"
    ls packages/
    exit 1
  fi
fi
