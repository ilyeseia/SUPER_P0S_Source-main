# =====================================================
# ULTRA_POS Cashier System - Docker Build Environment
# Electron v22 with better-sqlite3 support
# =====================================================

# Stage 1: Build environment
FROM node:18-bullseye AS builder

LABEL maintainer="ULTRA_POS Developer"
LABEL description="Build environment for ULTRA_POS Electron application"
LABEL version="2.0.4"

# Set environment variables
ENV NODE_ENV=development
ENV ELECTRON_CACHE=/root/.cache/electron
ENV ELECTRON_BUILDER_CACHE=/root/.cache/electron-builder

# Install build dependencies for native modules
# better-sqlite3 and canvas require these
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    libsqlite3-dev \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpixman-1-dev \
    pkg-config \
    wget \
    curl \
    git \
    wine \
    wine64 \
    mono-complete \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --include=dev

# Copy source code
COPY . .

# Rebuild native modules for Electron
RUN npm rebuild better-sqlite3 --runtime=electron --target=22.3.27 --disturl=https://electronjs.org/headers

# Build the application
RUN npm run build:win64

# Stage 2: Production image (for testing purposes)
# Note: Electron apps typically run on the host, not in containers
# This stage is for CI/testing only
FROM node:18-slim AS production

ENV NODE_ENV=production

WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Create a minimal entrypoint
RUN echo '#!/bin/bash\n\
echo "ULTRA_POS Build Artifacts"\n\
echo "=========================="\n\
ls -la dist/\n' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

# =====================================================
# Usage Instructions:
# 
# Build the image:
#   docker build -t ultra-pos-builder:latest .
#
# Build with specific target:
#   docker build --target builder -t ultra-pos-builder:latest .
#
# Run build and extract artifacts:
#   docker run --rm -v $(pwd)/dist:/app/dist ultra-pos-builder
#
# For development environment:
#   docker-compose up -d
# =====================================================
