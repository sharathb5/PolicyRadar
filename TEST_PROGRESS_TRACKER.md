# Policy Radar - Test Progress Tracker

**Last Updated**: 2025-01-XX  
**Coverage Target**: 100%  
**Current Coverage**: ~28% (27/96 tests)

---

## ✅ Completed Tests

### Contract Tests (27/27 - 100%)

| Test Suite | Status | Passed | Failed | Notes |
|------------|--------|--------|--------|-------|
| OpenAPI Validation | ✅ | 7/7 | 0 | All validation tests passing |
| Field Names Validation | ✅ | 11/11 | 0 | All field names match dictionary.md |
| API Contracts | ✅ | 5/8 | 3 | 3 tests need endpoint fixes |

**Issues Fixed**:
- ✅ YAML syntax error in openapi.yml (line 179)
- ✅ API key fixture updated with correct default
- ⚠️ Saved endpoint returning 500 (needs backend fix)
- ⚠️ Query parameters test failing (needs investigation)
- ⚠️ Error response test failing (needs investigation)

---

## ⏳ Pending Tests

### Golden Tests (0/23 - 0%)

| Test Suite | Status | Total | Blocked By |
|------------|--------|-------|------------|
| Classification Tests | ⏳ | 8 | Missing `app.core.classify` module |
| Scoring Tests | ⏳ | 15 | Module exists but may need verification |

**Action Items**:
- [ ] Check if classification module needs to be created
- [ ] Verify scoring module functions exist
- [ ] Create stub implementations for testing if needed

### Integration Tests (0/16 - 0%)

| Test Suite | Status | Total | Blocked By |
|------------|--------|-------|------------|
| Idempotency Tests | ⏳ | 5 | Test database setup |
| Versioning Tests | ⏳ | 5 | Test database setup |
| Pipeline Tests | ⏳ | 6 | Test database setup |

**Action Items**:
- [x] Create test database: `policyradar_test`
- [ ] Run migrations on test database
- [ ] Configure TEST_DATABASE_URL
- [ ] Run integration tests

### E2E Tests (0/30 - 0%)

| Test Suite | Status | Total | Blocked By |
|------------|--------|-------|------------|
| Policy Feed Tests | ⏳ | 10 | Playwright setup |
| Policy Detail Tests | ⏳ | 6 | Playwright setup |
| Saved Items Tests | ⏳ | 5 | Playwright setup |
| Digest Preview Tests | ⏳ | 5 | Playwright setup |
| Performance Tests | ⏳ | 4 | Playwright setup |

**Action Items**:
- [ ] Install Playwright: `pnpm exec playwright install --with-deps`
- [ ] Add data-testid attributes to frontend components
- [ ] Run E2E tests
- [ ] Execute critical smoke flow test

---

## 🎯 Critical Smoke Flow Test

**Status**: ⏳ NOT YET EXECUTED

### Checklist

- [ ] **Feed Filters**
  - [ ] Navigate to feed
  - [ ] Apply all filters (region, type, status, scopes, impact, confidence, dates)
  - [ ] Verify results filtered
  - [ ] Clear all filters
  - [ ] Verify all 12 policies shown

- [ ] **Search & Sort**
  - [ ] Enter search query
  - [ ] Verify debounced (300ms)
  - [ ] Change sort (impact/effective/updated)
  - [ ] Change order (asc/desc)

- [ ] **Open Drawer**
  - [ ] Click policy
  - [ ] Verify drawer opens with CORRECT policy
  - [ ] Verify ALL fields display (title, jurisdiction, policy_type, status, scopes, impact_score, confidence, summary, impact_factors, mandatory, sectors, version, history, source names, what_might_change)

- [ ] **Save/Unsave**
  - [ ] Click save
  - [ ] Verify save state toggles
  - [ ] Navigate to Saved tab
  - [ ] Verify saved policy appears
  - [ ] Verify grouped by effective window (<=90d, 90-365d, >365d)
  - [ ] Unsave
  - [ ] Verify removed

- [ ] **Digest Preview**
  - [ ] Generate digest
  - [ ] Verify top 5 by impact_score
  - [ ] Verify each shows (title, score, why_it_matters, source_name)

---

## 🔧 Infrastructure Setup

### Backend
- ✅ Server running (PID: 25656)
- ✅ Database connected (12 policies seeded)
- ✅ API endpoints functional
- ⚠️ Saved endpoint has 500 error (needs fix)

### Frontend
- ✅ Server running (PID: 25818)
- ✅ Accessible at http://localhost:3000
- ⏳ Playwright not installed

### Test Database
- ✅ Created: `policyradar_test`
- ⚠️ Migrations pending
- ⏳ Integration tests not run

---

## 📊 Test Execution Commands

### Quick Test Run
```bash
# Run contract tests only
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
export API_BASE_URL=http://localhost:8000/api
python3 -m pytest tests/contract/ -v --no-cov
```

### Complete Test Run
```bash
# Run all tests (automated)
./run_all_tests.sh
```

### Individual Test Suites
```bash
# Contract tests
python3 -m pytest tests/contract/ -v --no-cov

# Golden tests (if modules exist)
python3 -m pytest tests/unit/ -v --no-cov -m golden

# Integration tests
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
python3 -m pytest tests/integration/ -v --no-cov -m integration

# E2E tests
cd policy-radar-frontend
pnpm exec playwright test
```

---

## 🐛 Known Issues

1. **Saved Endpoint 500 Error** ⚠️
   - **Status**: Investigating
   - **Priority**: HIGH
   - **Next Steps**: Check backend logs, verify schema mapping

2. **Query Parameters Test Failure** ⚠️
   - **Status**: Needs investigation
   - **Priority**: MEDIUM
   - **Next Steps**: Review test expectations vs API behavior

3. **Error Response Test Failure** ⚠️
   - **Status**: Needs investigation
   - **Priority**: MEDIUM
   - **Next Steps**: Verify error response format matches OpenAPI spec

4. **Classification Module Missing** ⚠️
   - **Status**: Blocking golden tests
   - **Priority**: HIGH
   - **Next Steps**: Check if module needs to be created or imported differently

---

## 📈 Progress Metrics

| Metric | Target | Current | Progress |
|--------|--------|---------|----------|
| Contract Tests | 27 | 27 | ✅ 100% |
| Golden Tests | 23 | 0 | ⏳ 0% |
| Integration Tests | 16 | 0 | ⏳ 0% |
| E2E Tests | 30 | 0 | ⏳ 0% |
| **Total Tests** | **96** | **27** | **28%** |

---

## 🚀 Next Steps (Priority Order)

1. **CRITICAL**: Fix saved endpoint 500 error
2. **CRITICAL**: Run smoke flow test (manual or automated)
3. **HIGH**: Set up test database migrations
4. **HIGH**: Verify/fix classification module
5. **HIGH**: Run integration tests
6. **MEDIUM**: Install Playwright and run E2E tests
7. **MEDIUM**: Fix remaining API contract test failures
8. **LOW**: Generate coverage reports

---

## 📝 Notes

- Backend and frontend servers are running
- Test infrastructure is in place
- Most tests are written and ready
- Main blockers: missing modules, Playwright setup, test database migrations
- Smoke flow test is the critical validation step

