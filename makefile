.DELETE_ON_ERROR:
.FORCE:
.DEFAULT_GOAL := help

# =============================================================================
# Configuration
# =============================================================================

# Path vars
PROJECT_DIR = $(shell pwd -L)
BIN_DIR     = $(PROJECT_DIR)/bin
SPA_DIR     = $(PROJECT_DIR)/spa

# Files
SERVER_TEST_DIRECTORIES := $(shell go list ./... | grep -v /vendor/ | grep -v mocks)

# Build vars
VERSION     ?= $(shell git describe --tags --always --dirty)
COMMIT_HASH := $(shell git rev-parse HEAD)
BUILD_TIME  := $(shell date -u '+%Y-%m-%d_%H:%M:%S')

# Docker vars
DOCKER_REGISTRY ?= 
DOCKER_IMAGE    ?= echo-boilerplate
DOCKER_TAG      ?= $(VERSION)

# Tools need to be enumerated here in order to support installing them.
TOOLS :=
TOOLS := $(TOOLS) github.com/swaggo/swag/cmd/swag@v1.16.4
TOOLS := $(TOOLS) github.com/golangci/golangci-lint/cmd/golangci-lint@v1.55.2
TOOLS := $(TOOLS) github.com/cosmtrek/air@v1.49.0

# =============================================================================
# Help
# =============================================================================

.PHONY: help
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# =============================================================================
# Development
# =============================================================================

.PHONY: dev
dev: ## Run both server and spa projects locally using Docker
	docker compose -f docker-compose.dev.yml up --remove-orphans

.PHONY: dev-build
dev-build: ## Build and run development environment
	docker compose -f docker-compose.dev.yml up --build --remove-orphans

.PHONY: dev-down
dev-down: ## Stop development environment
	docker compose -f docker-compose.dev.yml down

.PHONY: dev-clean
dev-clean: ## Stop and remove all development containers and volumes
	docker compose -f docker-compose.dev.yml down -v --remove-orphans
	docker system prune -f

.PHONY: dev-logs
dev-logs: ## Show logs from development environment
	docker compose -f docker-compose.dev.yml logs -f

.PHONY: dev-server
dev-server: install-tools ## Run server locally (requires local PostgreSQL)
	@echo "Starting server in development mode..."
	air -c .air.toml

.PHONY: dev-spa
dev-spa: ## Run SPA development server
	@echo "Starting SPA development server..."
	cd $(SPA_DIR) && npm run dev

.PHONY: dev-db
dev-db: ## Start only the database for local development
	docker compose -f docker-compose.dev.yml up postgres -d

# =============================================================================
# Building
# =============================================================================

.PHONY: build
build: build-server build-spa ## Build both server and SPA

.PHONY: build-server
build-server: ## Build server binary
	@echo "Building server..."
	CGO_ENABLED=0 GOOS=linux go build \
		-ldflags="-w -s -X main.Version=$(VERSION) -X main.CommitHash=$(COMMIT_HASH) -X main.BuildTime=$(BUILD_TIME)" \
		-o $(BIN_DIR)/server \
		./main.go

.PHONY: build-spa
build-spa: ## Build SPA for production
	@echo "Building SPA..."
	cd $(SPA_DIR) && npm run build

.PHONY: build-docker
build-docker: ## Build Docker images
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .
	docker build -f Dockerfile.server -t $(DOCKER_IMAGE)-server:$(DOCKER_TAG) .
	docker build -f Dockerfile.spa -t $(DOCKER_IMAGE)-spa:$(DOCKER_TAG) ./spa

# =============================================================================
# Testing
# =============================================================================

.PHONY: test
test: test-server test-spa ## Run all tests

.PHONY: test-server
test-server: ## Run server tests
	@echo "Running server tests..."
	go test -v -race -coverprofile=coverage.out ./...

.PHONY: test-server-coverage
test-server-coverage: test-server ## Run server tests with coverage report
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

.PHONY: test-spa
test-spa: ## Run SPA tests
	@echo "Running SPA tests..."
	cd $(SPA_DIR) && npm test -- --coverage --watchAll=false

.PHONY: test-integration
test-integration: ## Run integration tests
	@echo "Running integration tests..."
	go test -v -tags=integration ./...

.PHONY: test-e2e
test-e2e: ## Run end-to-end tests
	@echo "Running E2E tests..."
	cd $(SPA_DIR) && npm run test:e2e

# =============================================================================
# Code Quality
# =============================================================================

.PHONY: lint
lint: lint-server lint-spa ## Run all linters

.PHONY: lint-server
lint-server: install-tools ## Run server linting
	@echo "Linting server code..."
	golangci-lint run

.PHONY: lint-spa
lint-spa: ## Run SPA linting
	@echo "Linting SPA code..."
	cd $(SPA_DIR) && npm run lint

.PHONY: fmt
fmt: fmt-server fmt-spa ## Format all code

.PHONY: fmt-server
fmt-server: ## Format server code
	@echo "Formatting server code..."
	go fmt ./...
	goimports -w .

.PHONY: fmt-spa
fmt-spa: ## Format SPA code
	@echo "Formatting SPA code..."
	cd $(SPA_DIR) && npm run format

.PHONY: check
check: fmt lint test ## Run formatting, linting, and tests

# =============================================================================
# Dependencies
# =============================================================================

.PHONY: deps
deps: deps-server deps-spa ## Install all dependencies

.PHONY: deps-server
deps-server: ## Install server dependencies
	@echo "Installing server dependencies..."
	go mod download
	go mod tidy

.PHONY: deps-spa
deps-spa: ## Install SPA dependencies
	@echo "Installing SPA dependencies..."
	cd $(SPA_DIR) && npm install

.PHONY: deps-update
deps-update: ## Update all dependencies
	@echo "Updating server dependencies..."
	go get -u ./...
	go mod tidy
	@echo "Updating SPA dependencies..."
	cd $(SPA_DIR) && npm update

.PHONY: install-tools
install-tools: ## Install development tools
	@echo "Installing development tools..."
	@for tool in $(TOOLS); do \
		echo "Installing $$tool..."; \
		go install $$tool; \
	done

# =============================================================================
# Database
# =============================================================================

.PHONY: db-migrate
db-migrate: ## Run database migrations
	@echo "Running database migrations..."
	go run main.go migrate

.PHONY: db-seed
db-seed: ## Seed database with initial data
	@echo "Seeding database..."
	go run main.go seed

.PHONY: db-reset
db-reset: ## Reset database (drop and recreate)
	@echo "Resetting database..."
	docker compose -f docker-compose.dev.yml exec postgres dropdb -U postgres echoboilerplate_dev --if-exists
	docker compose -f docker-compose.dev.yml exec postgres createdb -U postgres echoboilerplate_dev
	$(MAKE) db-migrate db-seed

.PHONY: db-backup
db-backup: ## Backup database
	@echo "Creating database backup..."
	docker compose -f docker-compose.dev.yml exec postgres pg_dump -U postgres echoboilerplate_dev > backup_$(shell date +%Y%m%d_%H%M%S).sql

.PHONY: db-console
db-console: ## Connect to database console
	docker compose -f docker-compose.dev.yml exec postgres psql -U postgres -d echoboilerplate_dev

# =============================================================================
# Deployment
# =============================================================================

.PHONY: deploy-staging
deploy-staging: build-docker ## Deploy to staging environment
	@echo "Deploying to staging..."
	# Add your staging deployment commands here

.PHONY: deploy-prod
deploy-prod: build-docker ## Deploy to production environment
	@echo "Deploying to production..."
	# Add your production deployment commands here

# =============================================================================
# Utilities
# =============================================================================

.PHONY: clean
clean: ## Clean build artifacts and temporary files
	@echo "Cleaning up..."
	rm -rf $(BIN_DIR)
	rm -rf $(SPA_DIR)/build
	rm -rf $(SPA_DIR)/dist
	rm -f coverage.out coverage.html
	go clean -cache -testcache -modcache

.PHONY: logs
logs: ## Show application logs
	docker compose -f docker-compose.dev.yml logs -f server

.PHONY: shell-server
shell-server: ## Get shell access to server container
	docker compose -f docker-compose.dev.yml exec server sh

.PHONY: shell-spa
shell-spa: ## Get shell access to SPA container
	docker compose -f docker-compose.dev.yml exec spa sh

.PHONY: ps
ps: ## Show running containers
	docker compose -f docker-compose.dev.yml ps

.PHONY: stats
stats: ## Show container resource usage
	docker stats

.PHONY: version
version: ## Show version information
	@echo "Version: $(VERSION)"
	@echo "Commit: $(COMMIT_HASH)"
	@echo "Build Time: $(BUILD_TIME)"

.PHONY: env-check
env-check: ## Check environment configuration
	@echo "Checking environment configuration..."
	@if [ ! -f .env ]; then \
		echo "❌ .env file not found. Copy .env.example to .env and configure it."; \
		exit 1; \
	fi
	@echo "✅ .env file exists"
	@echo "Checking required environment variables..."
	@if [ -z "$$POSTGRES_HOST" ]; then echo "❌ POSTGRES_HOST not set"; else echo "✅ POSTGRES_HOST is set"; fi
	@if [ -z "$$AUTHENTICATION_JWT_SECRET" ]; then echo "❌ AUTHENTICATION_JWT_SECRET not set"; else echo "✅ AUTHENTICATION_JWT_SECRET is set"; fi

.PHONY: security-check
security-check: ## Run security checks
	@echo "Running security checks..."
	@echo "Checking for exposed secrets in git history..."
	@if command -v git-secrets >/dev/null 2>&1; then \
		git secrets --scan; \
	else \
		echo "⚠️  git-secrets not installed. Install it for better security scanning."; \
	fi
	@echo "Checking Go dependencies for vulnerabilities..."
	@if command -v govulncheck >/dev/null 2>&1; then \
		govulncheck ./...; \
	else \
		echo "⚠️  govulncheck not installed. Run: go install golang.org/x/vuln/cmd/govulncheck@latest"; \
	fi

# =============================================================================
# Documentation
# =============================================================================

.PHONY: docs
docs: ## Generate API documentation
	@echo "Generating API documentation..."
	swag init -g main.go -o ./docs

.PHONY: docs-serve
docs-serve: docs ## Serve API documentation locally
	@echo "Serving documentation at http://localhost:8080/swagger/index.html"
	@echo "Start the server with 'make dev-server' to view docs"

# =============================================================================
# CI/CD Helpers
# =============================================================================

.PHONY: ci-setup
ci-setup: ## Setup CI environment
	$(MAKE) install-tools deps

.PHONY: ci-test
ci-test: ## Run tests in CI environment
	$(MAKE) check test-integration

.PHONY: ci-build
ci-build: ## Build for CI environment
	$(MAKE) build

.PHONY: ci-deploy
ci-deploy: ## Deploy from CI environment
	$(MAKE) deploy-staging