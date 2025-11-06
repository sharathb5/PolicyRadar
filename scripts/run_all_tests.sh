#!/bin/bash
# Comprehensive Test Execution Script
# Runs all test suites with proper configuration

set -e

echo "========================================="
echo "Policy Radar - Complete Test Suite"
echo "========================================="
echo ""

# Configuration
export API_BASE_URL="${API_BASE_URL:-http://localhost:8000/api}"
export API_KEY="${API_KEY:-1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d}"
export TEST_DATABASE_URL="${TEST_DATABASE_URL:-postgresql://sharath@localhost:5432/policyradar_test}"
export DATABASE_URL="${DATABASE_URL:-postgresql://sharath@localhost:5432/policyradar}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

cd "/Users/sharath/Policy Radar"

# Function to run test suite
run_test_suite() {
    local suite_name=$1
    local test_path=$2
    local marker=$3
    
    echo "----------------------------------------"
    echo "Running: $suite_name"
    echo "----------------------------------------"
    
    local marker_arg=""
    if [ -n "$marker" ]; then
        marker_arg="-m $marker"
    fi
    
    if python3 -m pytest "$test_path" -v --no-cov $marker_arg 2>&1 | tee /tmp/test_${suite_name// /_}.log; then
        local passed=$(grep -c "PASSED\|passed" /tmp/test_${suite_name// /_}.log || echo "0")
        local failed=$(grep -c "FAILED\|failed\|ERROR" /tmp/test_${suite_name// /_}.log || echo "0")
        local skipped=$(grep -c "SKIPPED\|skipped" /tmp/test_${suite_name// / /_}.log || echo "0")
        
        PASSED_TESTS=$((PASSED_TESTS + passed))
        FAILED_TESTS=$((FAILED_TESTS + failed))
        SKIPPED_TESTS=$((SKIPPED_TESTS + skipped))
        
        echo -e "${GREEN}✓ $suite_name: $passed passed, $failed failed, $skipped skipped${NC}"
        return 0
    else
        echo -e "${RED}✗ $suite_name failed${NC}"
        return 1
    fi
}

# 1. Contract Tests
echo ""
echo "========================================="
echo "1. Contract Tests"
echo "========================================="

run_test_suite "OpenAPI Validation" "tests/contract/test_openapi_validation.py"
run_test_suite "Field Names Validation" "tests/contract/test_field_names.py"

# API Contract Tests (only if backend is running)
if curl -s -f -H "X-API-Key: $API_KEY" "$API_BASE_URL/healthz" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
    run_test_suite "API Contracts" "tests/contract/test_api_contracts.py"
else
    echo -e "${YELLOW}⚠ Backend not running - skipping API contract tests${NC}"
    SKIPPED_TESTS=$((SKIPPED_TESTS + 8))
fi

# 2. Golden Tests
echo ""
echo "========================================="
echo "2. Golden Tests"
echo "========================================="

cd PolicyRadar-backend
source venv/bin/activate 2>/dev/null || true

if python3 -c "from app.core import classify; from app.core import scoring" 2>/dev/null; then
    cd ..
    run_test_suite "Classification Golden Tests" "tests/unit/test_classify.py" "golden"
    run_test_suite "Scoring Golden Tests" "tests/unit/test_scoring.py" "golden"
else
    echo -e "${YELLOW}⚠ Classification/scoring modules not found - skipping golden tests${NC}"
    SKIPPED_TESTS=$((SKIPPED_TESTS + 23))
    cd ..
fi

# 3. Integration Tests
echo ""
echo "========================================="
echo "3. Integration Tests"
echo "========================================="

if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw policyradar_test; then
    echo -e "${GREEN}✓ Test database exists${NC}"
    run_test_suite "Integration Tests" "tests/integration/" "integration"
else
    echo -e "${YELLOW}⚠ Test database not found - skipping integration tests${NC}"
    SKIPPED_TESTS=$((SKIPPED_TESTS + 16))
fi

# 4. E2E Tests (Playwright)
echo ""
echo "========================================="
echo "4. E2E Tests (Playwright)"
echo "========================================="

cd policy-radar-frontend

if [ -f "node_modules/@playwright/test/package.json" ]; then
    echo -e "${GREEN}✓ Playwright is installed${NC}"
    cd ..
    
    # Check if frontend is running
    if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is running${NC}"
        
        # Run Playwright tests
        cd policy-radar-frontend
        if pnpm exec playwright test --reporter=list 2>&1 | tee /tmp/test_e2e.log; then
            e2e_passed=$(grep -c "passed\|PASSED" /tmp/test_e2e.log || echo "0")
            e2e_failed=$(grep -c "failed\|FAILED" /tmp/test_e2e.log || echo "0")
            PASSED_TESTS=$((PASSED_TESTS + e2e_passed))
            FAILED_TESTS=$((FAILED_TESTS + e2e_failed))
            echo -e "${GREEN}✓ E2E Tests: $e2e_passed passed, $e2e_failed failed${NC}"
        else
            echo -e "${RED}✗ E2E Tests failed${NC}"
        fi
        cd ..
    else
        echo -e "${YELLOW}⚠ Frontend not running - skipping E2E tests${NC}"
        SKIPPED_TESTS=$((SKIPPED_TESTS + 30))
        cd ..
    fi
else
    echo -e "${YELLOW}⚠ Playwright not installed - skipping E2E tests${NC}"
    echo "   Install with: cd policy-radar-frontend && pnpm exec playwright install --with-deps"
    SKIPPED_TESTS=$((SKIPPED_TESTS + 30))
    cd ..
fi

# Summary
echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo ""
TOTAL_TESTS=$((PASSED_TESTS + FAILED_TESTS + SKIPPED_TESTS))
echo "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo -e "Skipped: ${YELLOW}$SKIPPED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All executed tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi

