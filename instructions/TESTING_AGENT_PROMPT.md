# Testing & Assurance Agent - Development & Testing Prompt

**Last Updated**: 2025-01-XX  
**Current Status**: 🟡 In Progress (API Contract Fix)  
**Overall Progress**: 28% (27/96 tests)  
**Next Milestone**: 36% (after API Contract Fix)

## 📋 Quick Reference
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`
- **Status Tracker**: `AGENT_STATUS_TRACKER.md`
- **Quick Dashboard**: `QUICK_STATUS_DASHBOARD.md`
- **Test Report**: `FINAL_TEST_REPORT.md`

## 🎯 Your Mission

Set up comprehensive testing infrastructure, fix test issues, run all test suites, and ensure everything is ready for production.

**Current Priority**: Fix API Contract Test Fixture (🔴 CRITICAL)

**Current Status**: 
- ✅ Contract tests: 27/27 passing (100%)
- ⚠️ API contract tests: 1/8 passing (needs fixture fix)
- ⏳ Golden tests: 0/23 pending (need backend modules)
- ⏳ Integration tests: 0/16 pending (need test database)
- ⏳ E2E tests: 0/30 pending (need Playwright setup)

---

## 🔴 CRITICAL: Continuous Testing During Development

**YOU MUST**: Run tests continuously during development. Test after every change to verify progress.

### Development Workflow

1. **Identify what needs testing** (from test report)
2. **Set up test infrastructure** (if missing)
3. **Fix test issues** (make tests pass)
4. **Run full test suite** (verify everything works)
5. **Document results** (update test report)

### Test Commands (Run Frequently)

```bash
cd "/Users/sharath/Policy Radar"

# Run all tests
pytest tests/ -v --tb=short

# Run specific test suite
pytest tests/contract/ -v
pytest tests/unit/ -v
pytest tests/integration/ -v

# Run with coverage
pytest tests/ --cov=PolicyRadar-backend/app --cov-report=term-missing --cov-report=html

# Run Playwright tests (when set up)
cd policy-radar-frontend
npx playwright test

# Run smoke flow test
npx playwright test smoke-flow.spec.ts
```

---

## 🚨 Priority 1: Fix API Contract Test Fixture (CRITICAL)

### Issue
API contract tests fail because test client doesn't pass API key in headers.

### Task
- [ ] Open `tests/contract/test_api_contracts.py`
- [ ] Find the `client` or `test_client` fixture
- [ ] Fix it to include `X-API-Key` header
- [ ] Run test immediately: `pytest tests/contract/test_api_contracts.py -v`
- [ ] Verify all 8 tests pass

### Test-While-Developing

**Step 1**: Run test to see current failure
```bash
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py -v --tb=short
```

**Step 2**: Check current fixture implementation
```bash
cat tests/contract/test_api_contracts.py | grep -A 10 "def client\|@pytest.fixture"
```

**Step 3**: Fix fixture to include API key
```python
# tests/contract/test_api_contracts.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """Test client with API key."""
    client = TestClient(app)
    api_key = "1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"
    client.headers.update({"X-API-Key": api_key})
    return client
```

**Step 4**: Run test again - should pass
```bash
pytest tests/contract/test_api_contracts.py::test_healthz_response_schema -v
```

**Step 5**: Run all API contract tests
```bash
pytest tests/contract/test_api_contracts.py -v
# Expected: 8/8 passing ✅
```

**Step 6**: Run full contract test suite
```bash
pytest tests/contract/ -v
# Expected: All passing ✅
```

### Success Criteria
- ✅ All 8 API contract tests pass
- ✅ Test fixture properly includes API key
- ✅ All contract tests pass (27+ tests)
- ✅ Tests run reliably

---

## 🟠 Priority 2: Set Up Test Database for Integration Tests (HIGH)

### Issue
Integration tests need isolated test database to avoid conflicts with development database.

### Task
- [ ] Create test database: `policyradar_test`
- [ ] Run migrations on test database
- [ ] Update `tests/conftest.py` to use test database
- [ ] Add database cleanup fixtures
- [ ] Run integration tests: `pytest tests/integration/ -v`
- [ ] Verify all 16 tests pass

### Test-While-Developing

**Step 1**: Create test database
```bash
psql postgres -c "CREATE DATABASE policyradar_test;"
psql policyradar_test -c "\dt"  # Should show no tables yet
```

**Step 2**: Run migrations on test database
```bash
cd PolicyRadar-backend
source venv/bin/activate
export DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
cd app/db
PYTHONPATH="/Users/sharath/Policy Radar/PolicyRadar-backend" alembic upgrade head
```

**Step 3**: Verify tables created
```bash
psql policyradar_test -c "\dt"
# Expected: policies, saved_policies, ingest_runs, policy_changes_log, alembic_version
```

**Step 4**: Update `tests/conftest.py` to use test database
```python
# tests/conftest.py
import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import SessionLocal, Base
from app.config import settings

@pytest.fixture(scope="function")
def test_db():
    """Create test database session."""
    test_db_url = os.getenv(
        "TEST_DATABASE_URL",
        "postgresql://sharath@localhost:5432/policyradar_test"
    )
    engine = create_engine(test_db_url)
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        Base.metadata.drop_all(bind=engine)
```

**Step 5**: Run one integration test to verify setup
```bash
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/test_idempotency.py::test_same_run_no_duplicates -v
```

**Step 6**: Run all integration tests
```bash
pytest tests/integration/ -v
# Expected: 16/16 passing ✅
```

### Success Criteria
- ✅ Test database created and migrated
- ✅ `tests/conftest.py` configured correctly
- ✅ All 16 integration tests pass
- ✅ Database cleanup works (no test pollution)

---

## 🟠 Priority 3: Verify & Fix Golden Tests (HIGH)

### Issue
Golden tests require backend classification/scoring modules. Need to verify modules exist and tests pass.

### Task
- [ ] Check if `app/core/classify.py` exists and is complete
- [ ] Check if `app/core/scoring.py` exists and is complete
- [ ] Run classification tests: `pytest tests/unit/test_classify.py -v`
- [ ] Run scoring tests: `pytest tests/unit/test_scoring.py -v`
- [ ] Fix any test failures
- [ ] Verify all 23 golden tests pass

### Test-While-Developing

**Step 1**: Check if modules exist
```bash
ls -la PolicyRadar-backend/app/core/classify.py
ls -la PolicyRadar-backend/app/core/scoring.py
```

**Step 2**: Check if tests exist
```bash
ls -la tests/unit/test_classify.py
ls -la tests/unit/test_scoring.py
```

**Step 3**: Run classification tests
```bash
pytest tests/unit/test_classify.py -v --tb=short
# Expected: 7/7 passing (or fix issues)
```

**Step 4**: Run scoring tests
```bash
pytest tests/unit/test_scoring.py -v --tb=short
# Expected: 16/16 passing (or fix issues)
```

**Step 5**: Fix any test failures
- [ ] Review test failures
- [ ] Check if backend modules need fixing (see Backend Agent)
- [ ] Or fix test expectations if backend is correct
- [ ] Re-run tests until all pass

**Step 6**: Run all golden tests
```bash
pytest tests/unit/ -v
# Expected: 23/23 passing ✅
```

### Success Criteria
- ✅ All 7 classification tests pass
- ✅ All 16 scoring tests pass
- ✅ Tests match `/contracts/scoring.md` algorithm
- ✅ Tests run reliably

---

## 🟡 Priority 4: Set Up Playwright for E2E Tests (MEDIUM)

### Issue
E2E tests require Playwright installation and browser setup.

### Task
- [ ] Install Playwright browsers
- [ ] Verify Playwright config
- [ ] Run Playwright tests
- [ ] Fix any test failures
- [ ] Verify all 30 E2E tests pass

### Test-While-Developing

**Step 1**: Check if Playwright is installed
```bash
cd policy-radar-frontend
cat package.json | grep playwright
```

**Step 2**: Install Playwright browsers
```bash
npx playwright install --with-deps
```

**Step 3**: Verify Playwright config
```bash
cat playwright.config.ts | head -30
```

**Step 4**: Start servers for testing
```bash
# Terminal 1: Backend
cd PolicyRadar-backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd policy-radar-frontend
npm run dev

# Terminal 3: Run Playwright tests
cd "/Users/sharath/Policy Radar"
npx playwright test
```

**Step 5**: Run specific test file
```bash
npx playwright test policy-feed.spec.ts
```

**Step 6**: Fix test failures
- [ ] Review test failures
- [ ] Check if selectors are correct
- [ ] Check if timing needs adjustment (wait for elements)
- [ ] Fix API integration issues (if any)
- [ ] Re-run tests until all pass

**Step 7**: Run all E2E tests
```bash
npx playwright test
# Expected: 30/30 passing ✅
```

### Success Criteria
- ✅ Playwright installed and configured
- ✅ All 30 E2E tests pass
- ✅ Tests run reliably (no flakiness)
- ✅ Smoke flow test passes

---

## 🟢 Priority 5: Run Smoke Flow Test (CRITICAL)

### Issue
Smoke flow test has not been executed yet. This is the most critical test.

### Task
- [ ] Run smoke flow test manually OR
- [ ] Run via Playwright automation
- [ ] Document all steps pass/fail
- [ ] Fix any issues found
- [ ] Re-run until all pass

### Test-While-Developing

**Option A: Manual Smoke Flow Test**

1. **Start Servers**:
   ```bash
   # Terminal 1: Backend
   cd PolicyRadar-backend && source venv/bin/activate && uvicorn app.main:app --reload
   
   # Terminal 2: Frontend
   cd policy-radar-frontend && npm run dev
   ```

2. **Open Browser**: `http://localhost:3000`

3. **Test Feed Filters**:
   - [ ] Navigate to feed page
   - [ ] Apply filter (region: EU) → Verify filtered
   - [ ] Apply filter (policy_type: Disclosure) → Verify filtered
   - [ ] Apply filter (status: Adopted) → Verify filtered
   - [ ] Clear all filters → Verify all 12 policies show

4. **Test Drawer**:
   - [ ] Click on first policy → Verify drawer opens
   - [ ] Verify all fields display correctly
   - [ ] Close drawer

5. **Test Save**:
   - [ ] Open policy drawer
   - [ ] Click save button → Verify save state toggles
   - [ ] Navigate to Saved tab → Verify policy appears
   - [ ] Verify grouping (<=90d, 90-365d, >365d)

6. **Test Digest**:
   - [ ] Navigate to digest section
   - [ ] Generate digest → Verify top 5 policies
   - [ ] Verify all fields display

**Option B: Automated Smoke Flow Test**

```bash
# If Playwright smoke flow test exists
npx playwright test smoke-flow.spec.ts

# Or create smoke flow test
npx playwright test --grep "smoke flow"
```

### Success Criteria
- ✅ All smoke flow steps pass
- ✅ Complete user journey works end-to-end
- ✅ No errors in console
- ✅ All features work correctly

---

## 📋 Development Checklist

### Before Starting Each Task
- [ ] Review test report to understand what needs fixing
- [ ] Check if test infrastructure exists
- [ ] Verify prerequisites (database, servers, etc.)

### During Development
- [ ] Run tests after every change
- [ ] Fix issues as they arise
- [ ] Document any new findings
- [ ] Update test report with progress

### After Each Task
- [ ] All tests for that suite pass
- [ ] Full test suite still passes (no regressions)
- [ ] Test report updated with results
- [ ] Progress documented
- [ ] **🚀 PUSH CODE**: Commit and push changes
  ```bash
  git add .
  git commit -m "test: [test suite name] - [brief description]"
  git push origin main
  ```

---

## 🔍 Progress Verification Commands

Run these after completing each task:

```bash
cd "/Users/sharath/Policy Radar"

# 1. Contract Tests (should pass after Priority 1)
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/ -v
# Expected: All passing ✅

# 2. Integration Tests (should pass after Priority 2)
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/ -v
# Expected: 16/16 passing ✅

# 3. Golden Tests (should pass after Priority 3)
pytest tests/unit/ -v
# Expected: 23/23 passing ✅

# 4. E2E Tests (should pass after Priority 4)
cd policy-radar-frontend
npx playwright test
# Expected: 30/30 passing ✅

# 5. Full Test Suite
pytest tests/ -v --tb=short
# Expected: All passing ✅

# 6. Test Coverage
pytest tests/ --cov=PolicyRadar-backend/app --cov-report=term-missing
# Expected: >80% coverage ✅
```

---

## 📊 Expected Progress

### After Priority 1 (API Contract Fix)
- ✅ Contract tests: 35/35 passing (was 27/27, now +8 API contract tests)
- ✅ Coverage: 36% (35/96 tests)

### After Priority 2 (Test Database)
- ✅ Integration tests: 16/16 passing
- ✅ Coverage: 53% (51/96 tests)

### After Priority 3 (Golden Tests)
- ✅ Golden tests: 23/23 passing
- ✅ Coverage: 77% (74/96 tests)

### After Priority 4 (Playwright)
- ✅ E2E tests: 30/30 passing
- ✅ Coverage: 100% (96/96 tests)

### After Priority 5 (Smoke Flow)
- ✅ Smoke flow test: PASSING ✅
- ✅ Ready for production ✅

---

## 🚨 Critical Reminders

### TEST CONTINUOUSLY
- ✅ Run tests after EVERY change
- ✅ Fix issues immediately
- ✅ Don't move to next task until current tests pass
- ✅ Document progress in test report

### TEST COVERAGE
- ✅ Aim for >80% coverage on critical paths
- ✅ All API endpoints tested
- ✅ All user flows tested (smoke flow)
- ✅ Error cases tested

### TEST RELIABILITY
- ✅ Tests should be deterministic (same input → same output)
- ✅ Use fixed test data (fixtures)
- ✅ Freeze timestamps where needed
- ✅ Clean up after tests (no test pollution)

---

## 🎯 Success Criteria

### Immediate (Today)
- ✅ API contract tests fixed (8/8 passing)
- ✅ Test database set up
- ✅ Integration tests passing (16/16)

### Short Term (This Week)
- ✅ Golden tests passing (23/23)
- ✅ Playwright set up
- ✅ E2E tests passing (30/30)
- ✅ Smoke flow passing
- ✅ Total: 96/96 tests passing ✅

### Final Goal
- ✅ All 96 tests passing (100%)
- ✅ >80% code coverage
- ✅ Smoke flow automated and passing
- ✅ Test report complete
- ✅ Ready for production

---

**Start with Priority 1, test immediately after each fix, then move to Priority 2, 3, 4, 5 in order.**

**Run tests after EVERY change to ensure progress!** 🧪✅

