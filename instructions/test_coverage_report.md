# Policy Radar - Test Coverage Report

**Generated**: 2025-01-XX  
**Target Coverage**: 100%  
**Current Coverage**: 28% (27/96 tests)

---

## Coverage Breakdown

### Contract Tests ✅

**Status**: 88.9% (24/27 tests passing)

| Category | Total | Passed | Failed | Coverage |
|----------|-------|--------|--------|----------|
| OpenAPI Validation | 7 | 7 | 0 | ✅ 100% |
| Field Names | 11 | 11 | 0 | ✅ 100% |
| API Contracts | 9 | 6 | 3 | ⚠️ 66.7% |

**Failures**:
- `test_policies_query_parameters` - Needs investigation
- `test_saved_response_schema` - 500 error from endpoint
- `test_error_response_schema` - Needs investigation

### Golden Tests ⏳

**Status**: 0% (0/23 tests)

| Category | Total | Passed | Failed | Status |
|----------|-------|--------|--------|--------|
| Classification | 8 | 0 | 0 | ⏳ Blocked |
| Scoring | 15 | 0 | 0 | ⏳ Blocked |

**Blockers**:
- Classification module not found (`app.core.classify`)
- Scoring module exists but needs verification

### Integration Tests ⏳

**Status**: 0% (0/16 tests)

| Category | Total | Passed | Failed | Status |
|----------|-------|--------|--------|--------|
| Idempotency | 5 | 0 | 0 | ⏳ Pending |
| Versioning | 5 | 0 | 0 | ⏳ Pending |
| Pipeline | 6 | 0 | 0 | ⏳ Pending |

**Blockers**:
- Test database migrations not run
- TEST_DATABASE_URL configuration

### E2E Tests ⏳

**Status**: 0% (0/30 tests)

| Category | Total | Passed | Failed | Status |
|----------|-------|--------|--------|--------|
| Policy Feed | 10 | 0 | 0 | ⏳ Pending |
| Policy Detail | 6 | 0 | 0 | ⏳ Pending |
| Saved Items | 5 | 0 | 0 | ⏳ Pending |
| Digest Preview | 5 | 0 | 0 | ⏳ Pending |
| Performance | 4 | 0 | 0 | ⏳ Pending |

**Blockers**:
- Playwright not installed
- Frontend components need data-testid attributes

---

## Coverage Trend

```
Target: 100% ████████████████████████████████████████████████
Current:  28% ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

**Progress**: 28% → Target: 100% (72% remaining)

---

## Quick Wins (High Impact, Low Effort)

1. ✅ **Fixed**: YAML syntax error (enabled OpenAPI validation)
2. ✅ **Fixed**: API key fixture (enabled API contract tests)
3. 🔄 **In Progress**: Saved endpoint fix (will enable 1 test)
4. ⏳ **Next**: Test database migrations (will enable 16 tests)
5. ⏳ **Next**: Playwright installation (will enable 30 tests)

---

## Blockers & Solutions

### Blocker 1: Classification Module Missing

**Solution Options**:
1. Create stub module for testing
2. Check if module is in different location
3. Verify import path

**Priority**: HIGH  
**Estimated Effort**: 1 hour

### Blocker 2: Test Database Migrations

**Solution**:
```bash
cd PolicyRadar-backend
source venv/bin/activate
DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test \
alembic -c app/db/alembic.ini upgrade head
```

**Priority**: HIGH  
**Estimated Effort**: 30 minutes

### Blocker 3: Playwright Setup

**Solution**:
```bash
cd policy-radar-frontend
pnpm install
pnpm exec playwright install --with-deps
```

**Priority**: MEDIUM  
**Estimated Effort**: 15 minutes

---

## Test Execution Status

### ✅ Ready to Run
- Contract tests (27 tests)
- Field name validation (11 tests)
- OpenAPI validation (7 tests)

### ⏳ Needs Setup
- API contract tests (3 failing, 6 passing)
- Golden tests (23 tests - blocked)
- Integration tests (16 tests - blocked)
- E2E tests (30 tests - blocked)

### 🔄 In Progress
- API contract test fixes
- Test database setup
- Playwright installation

---

## Recommendations

1. **Immediate** (Today):
   - Fix saved endpoint 500 error
   - Run test database migrations
   - Install Playwright

2. **Short-term** (This Week):
   - Fix remaining API contract test failures
   - Create classification module or stubs
   - Run integration tests
   - Execute smoke flow test

3. **Long-term** (Ongoing):
   - Add data-testid attributes to frontend
   - Set up coverage reporting
   - Add performance benchmarks
   - Continuous test execution in CI/CD

---

**Next Update**: After fixing saved endpoint and running migrations

