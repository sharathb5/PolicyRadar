# Testing Documentation

## Test Strategy

This project uses a comprehensive testing strategy following the test pyramid:

1. **Unit Tests** - Fast, isolated tests for individual functions/classes
2. **Integration Tests** - Tests for component interactions and data flow
3. **Contract Tests** - API contract validation against OpenAPI spec
4. **E2E Tests** - End-to-end user flow tests with Playwright

### Golden Tests

Golden tests use fixed input/output pairs to ensure deterministic behavior:
- **Classification Golden Tests**: Test policy classification logic with known inputs/outputs
- **Scoring Golden Tests**: Test impact scoring algorithm with examples from scoring.md

All golden test cases are documented in `/tests/fixtures/golden/` with rationale for expected outputs.

### Contract Testing

Contract tests validate:
- OpenAPI spec syntax and structure
- Field names match dictionary.md exactly
- API responses validate against OpenAPI schemas
- Query parameters match specification

### Deterministic Tests

All tests are designed to be deterministic:
- Fixed test data fixtures
- Frozen timestamps using `freezegun`
- No random data generation
- Same input → same output every run

## Test Coverage

### What's Tested

- ✅ Contract validation (OpenAPI spec, field names, schemas)
- ✅ Classification logic (policy type, scopes, jurisdiction, status, mandatory)
- ✅ Impact scoring algorithm (all 5 factors + capping)
- ✅ Ingestion pipeline idempotency
- ✅ Policy versioning logic
- ✅ E2E user flows (filter, sort, detail, save, digest)

### What's Not Tested (or Limited)

- Database migrations (separate process)
- Third-party API integrations (mocked in tests)
- UI styling/visual regression (manual QA)

## Running Tests

### Backend Tests

```bash
# Install dependencies
pip install -e ".[dev]"

# Set test database
export TEST_DATABASE_URL=postgresql://test:test@localhost:5432/policyradar_test

# Run all tests
pytest

# Run specific test type
pytest tests/unit/              # Unit tests
pytest tests/integration/       # Integration tests
pytest tests/contract/          # Contract tests
pytest -m golden                # Golden tests only
pytest -m integration           # Integration tests only

# Run with coverage
pytest --cov=backend --cov-report=html

# Run specific test file
pytest tests/unit/test_classify.py
```

### Frontend Tests

```bash
cd policy-radar-frontend

# Install dependencies
pnpm install

# Run linter
pnpm lint

# Fix lint errors
pnpm lint:fix

# Run type check
pnpm type-check

# Run Playwright E2E tests
pnpm test:e2e

# Run specific test file
pnpm exec playwright test playwright/policy-feed.spec.ts

# Run in UI mode (interactive)
pnpm exec playwright test --ui
```

### Contract Tests

Contract tests validate API contracts without requiring a running server:

```bash
# Validate OpenAPI spec
pytest tests/contract/test_openapi_validation.py

# Validate field names match dictionary.md
pytest tests/contract/test_field_names.py
```

Contract tests that require a running API server:

```bash
# Set API URL
export API_BASE_URL=http://localhost:8000/api
export API_KEY=test-key

# Run API contract tests
pytest tests/contract/test_api_contracts.py
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers
pnpm exec playwright install --with-deps

# Run all E2E tests
pnpm exec playwright test

# Run specific test suite
pnpm exec playwright test playwright/policy-feed.spec.ts

# Run in headed mode (see browser)
pnpm exec playwright test --headed

# Run in debug mode
pnpm exec playwright test --debug

# Generate HTML report
pnpm exec playwright show-report
```

### Performance Tests

```bash
# Set API URL and key
export API_BASE_URL=http://localhost:8000/api
export API_KEY=test-key

# Run performance tests
pnpm exec playwright test playwright/performance.spec.ts
```

## Test Data Fixtures

### Golden Test Cases

Golden test cases are stored in JSON files:
- `/tests/fixtures/golden/classification_cases.json` - Classification test cases
- `/tests/fixtures/golden/scoring_cases.json` - Scoring test cases

Each case includes:
- `id`: Unique identifier
- `description`: Test case description
- `input`: Input data
- `expected`: Expected output
- `rationale`: Explanation of why this output is expected

### Seed Data

Seed data for testing:
- `/contracts/fixtures/seed_policies.json` - Seed policies for API testing

## Quality Gates

### Coverage Thresholds

- **Backend**: Minimum 80% coverage required
- **Frontend**: Minimum 70% coverage required (if tests configured)

### Linting

- **Backend**: Ruff, Black, MyPy configured
- **Frontend**: ESLint with TypeScript rules

### Type Checking

- **Backend**: MyPy strict mode
- **Frontend**: TypeScript strict mode, no `any` types allowed

### Performance Benchmarks

- List endpoint (1k items): P95 latency < 500ms
- Pagination: Average latency < 300ms
- Concurrent requests (10): Total time < 2s

## CI/CD

Tests run automatically on:
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

CI runs:
1. Backend tests (unit, integration, contract)
2. Frontend lint and type checks
3. E2E tests (Playwright)
4. Performance tests

## Adding New Tests

### Unit Test Example

```python
@pytest.mark.unit
def test_classification_function():
    result = classify_policy(
        title="Test Policy",
        text="Test text",
        jurisdiction="EU",
        source="Test Source"
    )
    assert result["policy_type"] == "Disclosure"
```

### Golden Test Example

Add a new case to `/tests/fixtures/golden/classification_cases.json`:

```json
{
  "id": "case_new",
  "description": "New test case",
  "input": { ... },
  "expected": { ... },
  "rationale": "Why this output is expected"
}
```

### E2E Test Example

Add a new test to a Playwright spec file:

```typescript
test('new user flow', async ({ page }) => {
  await page.goto('/');
  // Test steps...
  await expect(page.locator('[data-testid="element"]')).toBeVisible();
});
```

## Troubleshooting

### Tests failing due to database issues

```bash
# Ensure test database is running
docker run -d --name test-db -e POSTGRES_PASSWORD=test -e POSTGRES_DB=policyradar_test -p 5432:5432 postgres:15

# Set TEST_DATABASE_URL
export TEST_DATABASE_URL=postgresql://postgres:test@localhost:5432/policyradar_test
```

### Playwright tests failing

```bash
# Reinstall browsers
pnpm exec playwright install --with-deps

# Check if frontend server is running
# E2E tests require frontend to be running (or use webServer in playwright.config.ts)
```

### Contract tests failing

- Check OpenAPI spec is valid: `pytest tests/contract/test_openapi_validation.py`
- Verify field names match dictionary.md: `pytest tests/contract/test_field_names.py`
- Ensure API server is running for API contract tests

## Coverage Reports

Coverage reports are generated in:
- HTML: `htmlcov/index.html` (open in browser)
- Terminal: Displayed after test run
- XML: `coverage.xml` (for CI integration)

View coverage:
```bash
# After running tests with coverage
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
start htmlcov/index.html  # Windows
```

