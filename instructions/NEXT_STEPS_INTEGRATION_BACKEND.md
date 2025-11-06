# Next Steps for Integration & Backend

**Based on**: FINAL_TEST_REPORT.md  
**Current Status**: Contract tests passing (27/27), remaining tests pending  
**Coverage**: 28% complete (27/96 tests)

---

## 📊 Current Test Status

### ✅ Completed
- **Contract Tests**: 27/27 passing (100%)
  - OpenAPI validation: ✅ 7/7
  - Field names validation: ✅ 11/11
  - API contracts: ⚠️ 1/8 (needs fixture fix)

### ⏳ Pending Tests
- **Golden Tests**: 0/23 (0%) - Requires backend modules
- **Integration Tests**: 0/16 (0%) - Requires test database
- **E2E Tests**: 0/30 (0%) - Requires Playwright setup

---

## 🎯 Priority Actions

### 1. 🔴 CRITICAL: Fix API Contract Test Fixture

**Issue**: API contract tests fail because API key not passed in test client fixture

**Action Required**:
- [ ] Fix `tests/contract/test_api_contracts.py` client fixture
- [ ] Ensure all test requests include `X-API-Key` header
- [ ] Verify tests pass: `pytest tests/contract/test_api_contracts.py`

**Expected Outcome**: All 8 API contract tests pass

**Files to Fix**:
- `tests/contract/test_api_contracts.py` - Update client fixture to pass API key

**Test Command**:
```bash
cd "/Users/sharath/Policy Radar"
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py -v
```

---

### 2. 🟠 HIGH: Set Up Test Database for Integration Tests

**Issue**: Integration tests require isolated test database to avoid conflicts

**Action Required**:
- [ ] Create test database: `policyradar_test`
- [ ] Configure test database URL in `pytest.ini` or `conftest.py`
- [ ] Set up database cleanup/teardown in test fixtures
- [ ] Run integration tests: `pytest tests/integration/ -v`

**Setup Steps**:

#### Option A: PostgreSQL Test Database (Recommended)
```bash
# Create test database
psql postgres -c "CREATE DATABASE policyradar_test;"

# Run migrations on test database
cd PolicyRadar-backend
source venv/bin/activate
export DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
cd app/db
PYTHONPATH="/Users/sharath/Policy Radar/PolicyRadar-backend" alembic upgrade head
```

#### Option B: SQLite for Tests (Simpler)
```bash
# Update conftest.py to use SQLite for tests
# Tests run faster, no separate database needed
```

**Test Configuration**:
- Update `tests/conftest.py` to use test database
- Add database cleanup after each test
- Seed test data in fixtures

**Expected Outcome**: All 16 integration tests pass
- Idempotency tests (5)
- Versioning tests (5)
- Pipeline tests (6)

**Files to Update**:
- `tests/conftest.py` - Add test database configuration
- `tests/integration/test_idempotency.py` - Verify setup
- `tests/integration/test_versioning.py` - Verify setup
- `tests/integration/test_pipeline.py` - Verify setup

---

### 3. 🟠 HIGH: Verify Backend Classification/Scoring Modules

**Issue**: Golden tests require backend classification and scoring implementations

**Action Required**:
- [ ] Verify backend has classification module: `app/core/classify.py`
- [ ] Verify backend has scoring module: `app/core/scoring.py`
- [ ] Check if modules match `/contracts/scoring.md` algorithm
- [ ] Run golden tests: `pytest tests/unit/test_classify.py tests/unit/test_scoring.py -v`

**Verification Steps**:

```bash
# Check if modules exist
ls -la PolicyRadar-backend/app/core/classify.py
ls -la PolicyRadar-backend/app/core/scoring.py

# Verify module structure matches expected
grep -r "def classify" PolicyRadar-backend/app/core/
grep -r "def score" PolicyRadar-backend/app/core/
```

**If Modules Missing**:
- [ ] Implement classification logic per `/contracts/scoring.md`
- [ ] Implement scoring algorithm per `/contracts/scoring.md`
- [ ] Ensure impact_factors structure matches spec

**Expected Outcome**: All 23 golden tests pass
- Classification tests (7)
- Scoring tests (16)

**Files to Check**:
- `PolicyRadar-backend/app/core/classify.py` - Should exist
- `PolicyRadar-backend/app/core/scoring.py` - Should exist
- `tests/unit/test_classify.py` - Should pass
- `tests/unit/test_scoring.py` - Should pass

---

### 4. 🟡 MEDIUM: Set Up Playwright for E2E Tests

**Issue**: E2E tests require Playwright installation and browser setup

**Action Required**:
- [ ] Install Playwright browsers: `pnpm exec playwright install --with-deps`
- [ ] Verify Playwright configuration: `playwright.config.ts`
- [ ] Start backend server: `cd PolicyRadar-backend && source venv/bin/activate && uvicorn app.main:app --reload`
- [ ] Start frontend server: `cd policy-radar-frontend && npm run dev`
- [ ] Run E2E tests: `pnpm exec playwright test`

**Setup Steps**:

```bash
# Install Playwright (from project root)
cd "/Users/sharath/Policy Radar"
pnpm exec playwright install --with-deps

# Verify configuration
cat playwright.config.ts

# Start servers (in separate terminals)
# Terminal 1: Backend
cd PolicyRadar-backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd policy-radar-frontend
npm run dev

# Terminal 3: Run E2E tests
cd "/Users/sharath/Policy Radar"
pnpm exec playwright test
```

**Expected Outcome**: All 30 E2E tests pass
- Policy feed tests (10)
- Policy detail tests (6)
- Saved items tests (5)
- Digest preview tests (5)
- Performance tests (4)

**Files to Verify**:
- `playwright.config.ts` - Configuration exists
- `playwright/*.spec.ts` - Test files exist

---

### 5. 🔴 CRITICAL: Run Smoke Flow Test

**Issue**: Most critical test - complete user journey - not yet executed

**Action Required**:
- [ ] Manually run smoke flow OR
- [ ] Run via Playwright: `pnpm exec playwright test playwright/smoke-flow.spec.ts`

**Smoke Flow Checklist** (Manual or Automated):

- [ ] **Feed Filters**: Navigate to feed → Apply all filters → Verify results → Clear all
- [ ] **Search & Sort**: Enter search → Verify debounced → Change sort → Change order
- [ ] **Open Drawer**: Click policy → Verify drawer opens → Verify ALL fields display
- [ ] **Save/Unsave**: Click save → Verify state toggles → Navigate to Saved → Verify grouped → Unsave
- [ ] **Digest Preview**: Generate digest → Verify top 5 → Verify fields

**Expected Outcome**: ✅ All smoke flow steps pass

**Manual Test Steps**:

1. **Start Servers**:
   ```bash
   # Backend
   cd PolicyRadar-backend
   source venv/bin/activate
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Frontend
   cd policy-radar-frontend
   npm run dev
   ```

2. **Open Browser**: `http://localhost:3000`

3. **Test Feed Filters**:
   - Apply region filter (EU) → Verify filtered
   - Apply policy type (Disclosure) → Verify filtered
   - Apply status (Adopted) → Verify filtered
   - Clear all → Verify all 12 policies shown

4. **Test Drawer**:
   - Click on first policy → Verify drawer opens
   - Verify all fields display correctly
   - Close drawer

5. **Test Save**:
   - Open policy drawer
   - Click save button → Verify save state toggles
   - Navigate to Saved tab → Verify policy appears
   - Verify grouping (<=90d, 90-365d, >365d)
   - Unsave → Verify removed

6. **Test Digest**:
   - Navigate to digest section
   - Generate digest → Verify top 5 policies
   - Verify all fields display

---

## 📋 Implementation Checklist

### Backend Agent Tasks

1. **Fix API Contract Tests** ⚠️
   - [ ] Update `tests/contract/test_api_contracts.py` client fixture
   - [ ] Ensure API key passed in headers
   - [ ] Run tests to verify fix

2. **Set Up Test Database** 🟠
   - [ ] Create `policyradar_test` database
   - [ ] Update `tests/conftest.py` for test database
   - [ ] Add database cleanup fixtures
   - [ ] Run integration tests

3. **Verify Classification/Scoring** 🟠
   - [ ] Check if `app/core/classify.py` exists
   - [ ] Check if `app/core/scoring.py` exists
   - [ ] Verify implementation matches `/contracts/scoring.md`
   - [ ] Fix any mismatches if needed

### Integration Agent Tasks

1. **Set Up E2E Testing** 🟡
   - [ ] Install Playwright browsers
   - [ ] Verify Playwright config
   - [ ] Test that servers can start together
   - [ ] Run E2E tests

2. **Run Smoke Flow** 🔴
   - [ ] Start both servers
   - [ ] Execute smoke flow manually OR
   - [ ] Run via Playwright automation
   - [ ] Document any issues found

---

## 🎯 Success Criteria

### Immediate (Week 1)
- ✅ All API contract tests pass (8/8)
- ✅ Test database configured
- ✅ Integration tests running (16/16)
- ✅ Classification/scoring verified

### Short Term (Week 2)
- ✅ Playwright set up
- ✅ E2E tests running (30/30)
- ✅ Smoke flow passing
- ✅ Test coverage > 80%

### Final Goal
- ✅ All 96 tests passing
- ✅ 100% test coverage on critical paths
- ✅ Smoke flow automated and passing
- ✅ Ready for production

---

## 🐛 Known Issues to Fix

1. **API Contract Test Fixture** ⚠️
   - Location: `tests/contract/test_api_contracts.py`
   - Issue: API key not passed in test client
   - Fix: Update client fixture to include `X-API-Key` header

2. **Test Database Missing** ⏳
   - Issue: Integration tests need isolated database
   - Fix: Create `policyradar_test` database

3. **Playwright Not Set Up** ⏳
   - Issue: E2E tests can't run without Playwright browsers
   - Fix: Run `pnpm exec playwright install --with-deps`

---

## 📊 Test Coverage Goals

| Category | Current | Target | Status |
|----------|---------|--------|--------|
| Contract Tests | 27/27 | 27/27 | ✅ 100% |
| Golden Tests | 0/23 | 23/23 | ⏳ 0% |
| Integration Tests | 0/16 | 16/16 | ⏳ 0% |
| E2E Tests | 0/30 | 30/30 | ⏳ 0% |
| **Total** | **27/96** | **96/96** | **⏳ 28%** |

---

## 🚀 Quick Start Commands

### Fix API Contract Tests
```bash
cd "/Users/sharath/Policy Radar"
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py -v
```

### Set Up Test Database
```bash
psql postgres -c "CREATE DATABASE policyradar_test;"
cd PolicyRadar-backend
source venv/bin/activate
export DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
cd app/db
PYTHONPATH="/Users/sharath/Policy Radar/PolicyRadar-backend" alembic upgrade head
```

### Install Playwright
```bash
cd "/Users/sharath/Policy Radar"
pnpm exec playwright install --with-deps
```

### Run All Tests
```bash
# Backend tests
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/ tests/unit/ tests/integration/ -v

# E2E tests (requires servers running)
pnpm exec playwright test
```

---

**Next Priority**: Fix API contract test fixture → Set up test database → Run integration tests

---

**Last Updated**: Based on FINAL_TEST_REPORT.md  
**Status**: Ready for implementation

