.PHONY: all install dev build clean parsers help

# Default target
all: install parsers

# ============================================================================
# Frontend (UI)
# ============================================================================

## Install frontend dependencies
install:
	cd ui && npm install

## Download tree-sitter parser WASM files
parsers:
	cd ui && npm run download-parsers

## Start frontend development server
dev:
	cd ui && npm run dev

## Build frontend for production
build:
	cd ui && npm run build

## Preview production build
preview:
	cd ui && npm run preview

## Lint frontend code
lint:
	cd ui && npm run lint

## Clean frontend build artifacts and dependencies
clean:
	rm -rf ui/node_modules ui/dist ui/public/parsers/*.wasm

# ============================================================================
# Combined Commands
# ============================================================================

## Full setup: install deps, download parsers
setup: install parsers

## Rebuild everything from scratch
rebuild: clean setup

## Start dev server with fresh install
fresh: install parsers dev

# ============================================================================
# Help
# ============================================================================

## Show this help message
help:
	@echo "AST Visualizer - Available Commands"
	@echo "===================================="
	@echo ""
	@echo "Frontend:"
	@echo "  make install     - Install frontend npm dependencies"
	@echo "  make parsers     - Download tree-sitter WASM parsers"
	@echo "  make dev         - Start development server (hot reload)"
	@echo "  make build       - Build for production"
	@echo "  make preview     - Preview production build"
	@echo "  make lint        - Run ESLint"
	@echo "  make clean       - Remove node_modules and build artifacts"
	@echo ""
	@echo "Combined:"
	@echo "  make setup       - Full setup (install + parsers)"
	@echo "  make rebuild     - Clean and rebuild everything"
	@echo "  make fresh       - Fresh install and start dev server"
	@echo ""
	@echo "Quick Start:"
	@echo "  make install parsers  - First time setup"
	@echo "  make dev              - Start developing"
