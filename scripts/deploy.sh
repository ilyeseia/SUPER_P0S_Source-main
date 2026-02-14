#!/bin/bash

# =====================================================
# ULTRA_POS Cashier System - Deployment Script
# Cross-platform deployment automation
# =====================================================
# 
# Usage:
#   ./scripts/deploy.sh [OPTIONS]
#
# Options:
#   --dry-run        Simulate deployment without making changes
#   --skip-backup    Skip backup creation (not recommended)
#   --skip-verify    Skip post-deployment verification
#   --build-only     Only build, don't deploy
#   --target=TARGET  Build target (win64, win32, portable, all)
#   --help           Show this help message
#
# =====================================================

set -e  # Exit on error
set -o pipefail  # Catch errors in pipes

# =====================================================
# Configuration
# =====================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Default values
DRY_RUN=false
SKIP_BACKUP=false
SKIP_VERIFY=false
BUILD_ONLY=false
BUILD_TARGET="all"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backup"
DIST_DIR="$PROJECT_ROOT/dist"
LOGS_DIR="$PROJECT_ROOT/logs"

# =====================================================
# Utility Functions
# =====================================================

# Print colored message
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Print phase header
print_phase() {
    local number=$1
    local name=$2
    echo ""
    echo "============================================================"
    print_color "$CYAN" "  PHASE $number: $name"
    echo "============================================================"
}

# Print step message
print_step() {
    local type=$1
    local message=$2
    case $type in
        "success") print_color "$GREEN" "  [✓] $message" ;;
        "error")   print_color "$RED" "  [✗] $message" ;;
        "warning") print_color "$YELLOW" "  [!] $message" ;;
        "info")    print_color "$BLUE" "  [•] $message" ;;
        *)         echo "  [•] $message" ;;
    esac
}

# Print help message
print_help() {
    echo "ULTRA_POS Cashier System - Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --dry-run        Simulate deployment without making changes"
    echo "  --skip-backup    Skip backup creation (not recommended)"
    echo "  --skip-verify    Skip post-deployment verification"
    echo "  --build-only     Only build, don't deploy"
    echo "  --target=TARGET  Build target (win64, win32, portable, all)"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                          # Full deployment"
    echo "  $0 --dry-run                # Simulate deployment"
    echo "  $0 --target=win64           # Build only 64-bit Windows"
    echo "  $0 --build-only             # Build without deployment steps"
    echo ""
}

# Confirm action
confirm() {
    local prompt=$1
    read -p "  [?] $prompt (y/n): " response
    [[ "$response" =~ ^[Yy]$ ]]
}

# Check if command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Get current version from package.json
get_version() {
    if [[ -f "$PROJECT_ROOT/package.json" ]]; then
        grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$PROJECT_ROOT/package.json" | cut -d'"' -f4
    else
        echo "unknown"
    fi
}

# Create timestamp
get_timestamp() {
    date +"%Y%m%d-%H%M%S"
}

# =====================================================
# Parse Arguments
# =====================================================

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --skip-verify)
                SKIP_VERIFY=true
                shift
                ;;
            --build-only)
                BUILD_ONLY=true
                shift
                ;;
            --target=*)
                BUILD_TARGET="${1#*=}"
                shift
                ;;
            --help)
                print_help
                exit 0
                ;;
            *)
                print_step "error" "Unknown option: $1"
                print_help
                exit 1
                ;;
        esac
    done
}

# =====================================================
# Phase 1: Preparation
# =====================================================

phase_prepare() {
    print_phase 1 "PREPARE"
    print_step "info" "Verifying prerequisites and environment..."

    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_step "success" "Node.js version: $NODE_VERSION"
    else
        print_step "error" "Node.js is not installed!"
        exit 1
    fi

    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_step "success" "npm version: $NPM_VERSION"
    else
        print_step "error" "npm is not installed!"
        exit 1
    fi

    # Check package.json
    if [[ ! -f "$PROJECT_ROOT/package.json" ]]; then
        print_step "error" "package.json not found!"
        exit 1
    fi

    # Get version
    VERSION=$(get_version)
    print_step "info" "Application version: v$VERSION"

    # Check node_modules
    if [[ ! -d "$PROJECT_ROOT/node_modules" ]]; then
        print_step "warning" "node_modules not found. Running npm install..."
        if [[ "$DRY_RUN" == false ]]; then
            npm install --prefix "$PROJECT_ROOT"
        else
            print_step "warning" "[DRY RUN] Would run: npm install"
        fi
    fi

    # Verify dependencies
    print_step "info" "Verifying dependencies..."
    if [[ "$DRY_RUN" == false ]]; then
        if npm ls --prefix "$PROJECT_ROOT" --depth=0 &> /dev/null; then
            print_step "success" "All dependencies installed"
        else
            print_step "warning" "Some dependencies may be missing"
        fi
    fi

    # Confirm deployment
    if [[ "$DRY_RUN" == false ]] && [[ "$BUILD_ONLY" == false ]]; then
        if ! confirm "Deploy version v$VERSION?"; then
            print_step "warning" "Deployment cancelled by user"
            exit 0
        fi
    fi
}

# =====================================================
# Phase 2: Backup
# =====================================================

phase_backup() {
    print_phase 2 "BACKUP"
    print_step "info" "Creating backup of current state..."

    if [[ "$SKIP_BACKUP" == true ]]; then
        print_step "warning" "BACKUP SKIPPED - Rollback may not be possible!"
        return
    fi

    TIMESTAMP=$(get_timestamp)
    VERSION=$(get_version)
    BACKUP_PATH="$BACKUP_DIR/v$VERSION-$TIMESTAMP"

    if [[ "$DRY_RUN" == true ]]; then
        print_step "warning" "[DRY RUN] Would create backup at: $BACKUP_PATH"
        return
    fi

    # Create backup directory
    mkdir -p "$BACKUP_PATH"

    # Backup dist folder
    if [[ -d "$DIST_DIR" ]]; then
        EXE_COUNT=$(find "$DIST_DIR" -name "*.exe" 2>/dev/null | wc -l)
        if [[ $EXE_COUNT -gt 0 ]]; then
            find "$DIST_DIR" -name "*.exe" -exec cp {} "$BACKUP_PATH/" \;
            print_step "success" "Backed up $EXE_COUNT file(s) to $BACKUP_PATH"
        else
            print_step "info" "No existing executables to backup"
        fi
    else
        print_step "info" "No dist/ folder to backup (first build)"
    fi

    # Backup user data (if exists)
    APPDATA_DIR="$HOME/.config/ULTRA_POS Cashier System"
    if [[ -d "$APPDATA_DIR" ]]; then
        DATA_BACKUP="$BACKUP_PATH/appdata"
        mkdir -p "$DATA_BACKUP"
        find "$APPDATA_DIR" -name "*.db" -exec cp {} "$DATA_BACKUP/" \; 2>/dev/null || true
        find "$APPDATA_DIR" -name "*.json" -exec cp {} "$DATA_BACKUP/" \; 2>/dev/null || true
        print_step "success" "Backed up user data"
    fi

    print_step "success" "Backup completed successfully"
}

# =====================================================
# Phase 3: Build/Deploy
# =====================================================

phase_build() {
    print_phase 3 "BUILD"
    print_step "info" "Executing build process..."

    cd "$PROJECT_ROOT"

    # Determine build command
    BUILD_CMD=""
    case $BUILD_TARGET in
        win64)
            BUILD_CMD="npm run build:win64"
            ;;
        win32)
            BUILD_CMD="npm run build:win32"
            ;;
        portable)
            BUILD_CMD="npm run build:portable"
            ;;
        all)
            BUILD_CMD="npm run build"
            ;;
        *)
            print_step "error" "Unknown build target: $BUILD_TARGET"
            exit 1
            ;;
    esac

    if [[ "$DRY_RUN" == true ]]; then
        print_step "warning" "[DRY RUN] Would execute: $BUILD_CMD"
        return
    fi

    # Execute build
    print_step "info" "Running: $BUILD_CMD"
    echo ""

    if eval "$BUILD_CMD"; then
        echo ""
        print_step "success" "Build completed successfully!"
    else
        echo ""
        print_step "error" "Build failed!"
        print_step "info" "Check the logs above for details"
        
        if confirm "Attempt rollback?"; then
            rollback
        fi
        exit 1
    fi
}

# =====================================================
# Phase 4: Verification
# =====================================================

phase_verify() {
    print_phase 4 "VERIFY"
    print_step "info" "Verifying build output..."

    if [[ "$SKIP_VERIFY" == true ]]; then
        print_step "warning" "VERIFICATION SKIPPED"
        return
    fi

    if [[ "$DRY_RUN" == true ]]; then
        print_step "warning" "[DRY RUN] Would verify build output"
        return
    fi

    # Check dist directory
    if [[ ! -d "$DIST_DIR" ]]; then
        print_step "error" "dist/ folder not found!"
        return 1
    fi

    # Count executables
    EXE_COUNT=$(find "$DIST_DIR" -name "*.exe" 2>/dev/null | wc -l)
    if [[ $EXE_COUNT -eq 0 ]]; then
        print_step "error" "No executables found in dist/!"
        return 1
    fi

    print_step "success" "Found $EXE_COUNT executable(s) in dist/"
    
    # List executables with sizes
    find "$DIST_DIR" -name "*.exe" -printf "    - %f (%k KB)\n" 2>/dev/null || \
        find "$DIST_DIR" -name "*.exe" -exec ls -lh {} \; | awk '{print "    - " $NF " (" $5 ")"}'

    print_step "success" "Verification completed successfully"
}

# =====================================================
# Phase 5: Finalize
# =====================================================

phase_finalize() {
    print_phase 5 "FINALIZE"
    
    VERSION=$(get_version)
    TIMESTAMP=$(get_timestamp)

    if [[ "$DRY_RUN" == true ]]; then
        print_step "warning" "[DRY RUN] Deployment simulation complete"
        print_step "info" "No changes were made to the system"
        return
    fi

    print_step "success" "DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "  DEPLOYMENT SUMMARY"
    echo "  -------------------------------------"
    echo "  Version:  v$VERSION"
    echo "  Date:     $(date '+%Y-%m-%d %H:%M:%S')"
    echo "  Output:   $DIST_DIR"
    if [[ "$SKIP_BACKUP" == false ]]; then
        echo "  Backup:   $BACKUP_DIR/v$VERSION-$TIMESTAMP"
    fi
    echo "  -------------------------------------"
    echo ""
    print_step "info" "Next Steps:"
    print_step "info" "  1. Test the installer: dist/ULTRA_POS-*-Setup.exe"
    print_step "info" "  2. Verify all key features work"
    print_step "info" "  3. If issues found, run: ./scripts/rollback.sh"
}

# =====================================================
# Rollback Function
# =====================================================

rollback() {
    print_color "$RED" "\n  INITIATING ROLLBACK..."
    
    # Find latest backup
    LATEST_BACKUP=$(find "$BACKUP_DIR" -maxdepth 1 -type d -name "v*" | sort -r | head -n1)
    
    if [[ -z "$LATEST_BACKUP" ]]; then
        print_step "error" "No backup found for rollback!"
        return 1
    fi
    
    print_step "info" "Latest backup: $LATEST_BACKUP"
    
    if confirm "Restore from $LATEST_BACKUP?"; then
        # Restore executables
        if ls "$LATEST_BACKUP"/*.exe 1> /dev/null 2>&1; then
            mkdir -p "$DIST_DIR"
            cp "$LATEST_BACKUP"/*.exe "$DIST_DIR/"
            print_step "success" "Restored executables from backup"
        fi
        
        print_step "success" "Rollback completed"
    else
        print_step "warning" "Rollback cancelled"
    fi
}

# =====================================================
# Main Execution
# =====================================================

main() {
    # Parse command line arguments
    parse_args "$@"

    # Print header
    echo ""
    echo "============================================================"
    print_color "$MAGENTA" "          ULTRA_POS DEPLOYMENT SYSTEM"
    echo "============================================================"

    if [[ "$DRY_RUN" == true ]]; then
        echo ""
        print_color "$YELLOW" "[!] DRY RUN MODE - No changes will be made"
    fi

    # Create necessary directories
    mkdir -p "$BACKUP_DIR" "$LOGS_DIR" "$DIST_DIR"

    # Execute deployment phases
    phase_prepare
    phase_backup
    phase_build
    phase_verify
    phase_finalize

    exit 0
}

# Run main function
main "$@"
