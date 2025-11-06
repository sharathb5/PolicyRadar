#!/bin/bash
# Comprehensive Test Execution Script for Policy Radar

set -e

echo "========================================="
echo "Policy Radar - Comprehensive Test Suite"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Set environment variables
export API_BASE_URL="${API_BASE_URL:-http://localhost:8000/api}"
export API_KEY="${API_KEY:-1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d}"
export TEST_DATABASE_URL="${TEST_DATABASE_URL:-postgresql://sharath@localhost:5432/policyradar}"

echo "Configuration:"
echo "  API_BASE_URL: $API_BASE_URL"
echo "  TEST_DATABASE_URL: $TEST_DATABASE_URL"
echo ""

# Function to run tests and count results
run_test_suite() {
    local suite_name=$1
    local test_path=$2
    local coverage_opt=$3
    
    echo "----------------------------------------"
    echo "Running: $suite_name"
    echo "----------------------------------------"
    
    if [ -z "$coverage_opt" ]; then
        coverage_opt="--no-cov"
    fi
    
    if python3 -m pytest "$test_path" -v --tb=short $coverage_opt 2>&1 | tee /tmp/test_output.log; then
        local passed=$(grep -c "PASSED" /tmp/test_output.log || echo "0")
        local failed=$(grep -c "FAILED" /tmp/test_output.log || echo "0")
        PASSED_TESTS=$((PASSED_TESTS + passed))
        FAILED_TESTS=$((FAILED_TESTS + failed))
        echo -e "${GREEN}✓ $suite_name completed${NC}"
        return 0
    else
        echo -e "${RED}✗ $suite_name failed${NC}"
        return 1
    fi
}

# 1. Contract Tests - OpenAPI Validation
echo "Step 1: Contract Tests - OpenAPI Validation"
run_test_suite "OpenAPI Validation" "tests/contract/test_openapi_validation.py" "--no-cov"

# 2. Contract Tests - Field Names
echo ""
echo "Step 2: Contract Tests - Field Names"
run_test_suite "Field Names Validation" "tests/contract/test_field_names.py" "--no-cov"

# 3. Contract Tests - API Contracts (requires running API)
echo ""
echo "Step 3: Contract Tests - API Contracts"
echo "Checking if API is running..."
if curl -s -f -H "X-API-Key: $API_KEY" "$API_BASE_URL/healthz" > /dev/null 2>&1; then
    echo "API is running, running API contract tests..."
    run_test_suite "API Contracts" "tests/contract/test_api_contracts.py" "--no-cov"
else
    echo -e "${YELLOW}⚠ API not running, skipping API contract tests${NC}"
    echo "   To run these tests, start the backend server:"
    echo "   cd PolicyRadar-backend && source venv/bin/activate && uvicorn app.main:app --reload"
fi

# 4. Golden Tests - Classification
echo ""
echo "Step 4: Golden Tests - Classification"
run_test_suite "Classification Golden Tests" "tests/unit/test_classify.py" "--no-cov"

# 5. Golden Tests - Scoring
echo ""
echo "Step 5: Golden Tests - Scoring"
run_test_suite "Scoring Golden Tests" "tests/unit/test_scoring.py" "--no-cov"

# 6. Integration Tests
echo ""
echo "Step 6: Integration Tests"
if psql -lqt | cut -d \| -f 1 | grep -qw policyradar; then
    echo "Database exists, running integration tests..."
    run_test_suite "Integration Tests" "tests/integration/" "--no-cov"
else
    echo -e "${YELLOW}⚠ Database not found, skipping integration tests${NC}"
fi

# Summary
echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo "Total Tests Run: $((PASSED_TESTS + FAILED_TESTS))"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi

