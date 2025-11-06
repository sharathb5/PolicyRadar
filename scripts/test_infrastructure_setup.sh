#!/bin/bash
# Test Infrastructure Setup Script
# Sets up all testing infrastructure components

set -e

echo "========================================="
echo "Policy Radar - Test Infrastructure Setup"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
export API_BASE_URL="${API_BASE_URL:-http://localhost:8000/api}"
export API_KEY="${API_KEY:-1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d}"
export TEST_DATABASE_URL="${TEST_DATABASE_URL:-postgresql://sharath@localhost:5432/policyradar_test}"
export DATABASE_URL="${DATABASE_URL:-postgresql://sharath@localhost:5432/policyradar}"

echo "Configuration:"
echo "  API_BASE_URL: $API_BASE_URL"
echo "  TEST_DATABASE_URL: $TEST_DATABASE_URL"
echo "  DATABASE_URL: $DATABASE_URL"
echo ""

# 1. Test Database Setup
echo "----------------------------------------"
echo "1. Setting up Test Database"
echo "----------------------------------------"

if command -v psql >/dev/null 2>&1; then
    echo "Creating test database..."
    if psql -lqt | cut -d \| -f 1 | grep -qw policyradar_test; then
        echo -e "${YELLOW}⚠ Test database already exists${NC}"
        read -p "Drop and recreate? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            dropdb policyradar_test 2>/dev/null || true
            createdb policyradar_test
            echo -e "${GREEN}✓ Test database created${NC}"
        fi
    else
        createdb policyradar_test
        echo -e "${GREEN}✓ Test database created${NC}"
    fi
    
    # Run migrations on test database
    echo "Running migrations on test database..."
    cd PolicyRadar-backend
    source venv/bin/activate 2>/dev/null || true
    DATABASE_URL=$TEST_DATABASE_URL alembic -c app/db/alembic.ini upgrade head
    echo -e "${GREEN}✓ Migrations completed${NC}"
    cd ..
else
    echo -e "${YELLOW}⚠ PostgreSQL not available - skipping test database setup${NC}"
fi

# 2. Install Test Dependencies
echo ""
echo "----------------------------------------"
echo "2. Installing Test Dependencies"
echo "----------------------------------------"

# Python test dependencies
echo "Installing Python test dependencies..."
cd PolicyRadar-backend
source venv/bin/activate 2>/dev/null || true
pip install -q pytest pytest-cov pytest-asyncio pytest-mock freezegun openapi-spec-validator jsonschema pyyaml httpx 2>&1 | grep -E "(Installing|Requirement|Successfully)" || true
echo -e "${GREEN}✓ Python dependencies installed${NC}"
cd ..

# Frontend/Playwright dependencies
echo "Installing Playwright..."
cd policy-radar-frontend
if [ -f "package.json" ]; then
    if ! grep -q "@playwright/test" package.json; then
        pnpm add -D @playwright/test 2>&1 | tail -3
    fi
    echo "Installing Playwright browsers..."
    pnpm exec playwright install --with-deps 2>&1 | grep -E "(Installing|chromium|firefox|webkit)" || echo "Playwright browsers installed"
    echo -e "${GREEN}✓ Playwright setup complete${NC}"
else
    echo -e "${YELLOW}⚠ Frontend package.json not found${NC}"
fi
cd ..

# 3. Verify Backend Modules
echo ""
echo "----------------------------------------"
echo "3. Verifying Backend Modules"
echo "----------------------------------------"

cd PolicyRadar-backend
source venv/bin/activate 2>/dev/null || true

if python3 -c "from app.core import classify; from app.core import scoring" 2>/dev/null; then
    echo -e "${GREEN}✓ Classification and scoring modules available${NC}"
    HAS_MODULES=true
else
    echo -e "${YELLOW}⚠ Classification/scoring modules not found${NC}"
    echo "   Golden tests will be skipped until modules are implemented"
    HAS_MODULES=false
fi
cd ..

# 4. Run All Test Suites
echo ""
echo "----------------------------------------"
echo "4. Running Test Suites"
echo "----------------------------------------"

cd "/Users/sharath/Policy Radar"

# Contract Tests
echo ""
echo "Running Contract Tests..."
export API_BASE_URL API_KEY
python3 -m pytest tests/contract/test_openapi_validation.py tests/contract/test_field_names.py -v --no-cov -q 2>&1 | tail -5

# API Contract Tests (if backend is running)
if curl -s -f -H "X-API-Key: $API_KEY" "$API_BASE_URL/healthz" >/dev/null 2>&1; then
    echo ""
    echo "Running API Contract Tests..."
    python3 -m pytest tests/contract/test_api_contracts.py -v --no-cov -q 2>&1 | tail -5
else
    echo ""
    echo -e "${YELLOW}⚠ Backend not running - skipping API contract tests${NC}"
fi

# Golden Tests (if modules available)
if [ "$HAS_MODULES" = true ]; then
    echo ""
    echo "Running Golden Tests..."
    python3 -m pytest tests/unit/test_classify.py tests/unit/test_scoring.py -v --no-cov -q 2>&1 | tail -5
else
    echo ""
    echo -e "${YELLOW}⚠ Skipping golden tests (modules not available)${NC}"
fi

# Integration Tests (if test database available)
if psql -lqt | cut -d \| -f 1 | grep -qw policyradar_test 2>/dev/null; then
    echo ""
    echo "Running Integration Tests..."
    export TEST_DATABASE_URL
    python3 -m pytest tests/integration/ -v --no-cov -q 2>&1 | tail -5
else
    echo ""
    echo -e "${YELLOW}⚠ Skipping integration tests (test database not available)${NC}"
fi

# E2E Tests (if Playwright installed)
if command -v playwright >/dev/null 2>&1 || [ -f "policy-radar-frontend/node_modules/@playwright/test" ]; then
    echo ""
    echo "Running E2E Tests..."
    cd policy-radar-frontend
    pnpm exec playwright test --reporter=list 2>&1 | tail -10 || echo "E2E tests completed with some failures"
    cd ..
else
    echo ""
    echo -e "${YELLOW}⚠ Skipping E2E tests (Playwright not installed)${NC}"
fi

# Summary
echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Ensure backend is running: cd PolicyRadar-backend && uvicorn app.main:app --reload"
echo "2. Ensure frontend is running: cd policy-radar-frontend && pnpm dev"
echo "3. Run full test suite: ./run_tests.sh"
echo ""
echo "Test databases:"
echo "  Main: $DATABASE_URL"
echo "  Test: $TEST_DATABASE_URL"
echo ""

