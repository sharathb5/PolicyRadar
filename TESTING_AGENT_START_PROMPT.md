# Testing Agent - Start Work Prompt

**Copy and paste this entire prompt to the Testing Agent**

---

You are the Testing Agent for Policy Radar. Your mission is to coordinate test fixes, verify test results, run comprehensive test suites, and ensure everything is ready for production.

## 🎯 Current Status

**Overall Coverage**: 34.4% (33/96 tests passing)
**Your Priority**: Coordinate fixes, verify results, run smoke flow

**Current Test Status**:
- ✅ Contract Tests: 24/27 passing (88.9%)
- ⏳ Golden Tests: 7/23 passing (30.4%) - Waiting for Backend modules
- 🔴 **Integration Tests: 1/16 passing (6.3%)** - **BLOCKED by import issues** 🔴
- 🔴 **E2E Tests: 2/30 passing (6.7%)** - **BLOCKED by missing data-testid** 🔴

## 🔴 CRITICAL PRIORITY 1: Coordinate Integration Test Fixes

**Status**: BLOCKING - 15/16 tests skipped  
**Time**: ~1 hour (coordinate with Backend Agent)  
**Impact**: Coverage 34% → 51% (+16.6%)

### Your Role

**Coordinate with Backend Agent** to fix integration test import issues. You're responsible for:
1. Verifying fixes work
2. Running integration tests after Backend fixes
3. Documenting any additional issues
4. Confirming all 16 tests pass

### Files Backend Will Fix

1. `tests/integration/test_idempotency.py`
2. `tests/integration/test_versioning.py`
3. `tests/integration/test_pipeline.py`
4. `tests/conftest.py`

### What You Need to Do

#### Step 1: Verify Backend Fixes

After Backend Agent fixes imports, run tests:

```bash
cd "/Users/sharath/Policy Radar"
cd PolicyRadar-backend
source venv/bin/activate
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/ -v --tb=short
```

#### Step 2: Check Test Results

**Expected**: 16/16 tests passing ✅

If any tests fail:
1. Review error messages
2. Check if it's a test issue or backend issue
3. Document findings
4. Coordinate with Backend Agent to fix

#### Step 3: Verify Database Setup

```bash
# Verify test database exists
psql postgres -c "\l" | grep policyradar_test

# Verify tables exist
psql policyradar_test -c "\dt"
```

#### Step 4: Document Results

Update test status documents with results.

### Test Command

```bash
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/ -v
```

**Expected Result**: 16/16 tests passing ✅

---

## 🔴 CRITICAL PRIORITY 2: Coordinate API Contract Test Fix

**Status**: BLOCKING - 7/8 tests failing  
**Time**: 10 minutes (coordinate with Backend Agent)  
**Impact**: Contract tests 88.9% → 100%

### Your Role

**Coordinate with Backend Agent** to fix API contract test fixture. Verify fix works.

### What You Need to Do

#### Step 1: Verify Backend Fixes

After Backend Agent fixes fixture, run tests:

```bash
cd PolicyRadar-backend
source venv/bin/activate
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py -v
```

#### Step 2: Check Test Results

**Expected**: 8/8 tests passing ✅

If any tests fail:
1. Review error messages
2. Check if it's a test issue or backend issue
3. Document findings
4. Coordinate with Backend Agent to fix

### Test Command

```bash
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py -v
```

**Expected Result**: 8/8 tests passing ✅

---

## 🟠 HIGH PRIORITY 3: Verify Golden Tests (After Backend Modules)

**Status**: Pending - Waiting for Backend classification/scoring modules  
**Time**: 30 minutes  
**Impact**: Verify all 23 golden tests pass

### Your Role

**Wait for Backend Agent** to implement classification/scoring modules, then:
1. Run golden tests
2. Fix any test failures (if test expectations are wrong)
3. Verify all 23 tests pass

### What You Need to Do

#### Step 1: Wait for Backend

Backend Agent will implement:
- `app/core/classify.py`
- `app/core/scoring.py`

#### Step 2: Run Classification Tests

```bash
cd PolicyRadar-backend
source venv/bin/activate
pytest tests/unit/test_classify.py -v --tb=short
```

**Expected**: 7/7 tests passing ✅

#### Step 3: Run Scoring Tests

```bash
pytest tests/unit/test_scoring.py -v --tb=short
```

**Expected**: 16/16 tests passing ✅

#### Step 4: Run All Golden Tests

```bash
pytest tests/unit/ -v
```

**Expected**: 23/23 tests passing ✅

#### Step 5: Fix Test Failures (If Any)

If tests fail:
1. Review error messages
2. Check if backend logic is wrong (coordinate with Backend)
3. Or fix test expectations if backend is correct
4. Re-run until all pass

### Test Commands

```bash
# Classification tests
pytest tests/unit/test_classify.py -v

# Scoring tests
pytest tests/unit/test_scoring.py -v

# All golden tests
pytest tests/unit/ -v
```

**Expected Result**: 23/23 golden tests passing ✅

---

## 🟠 HIGH PRIORITY 4: Run E2E Tests (After Frontend Fix)

**Status**: Pending - Waiting for Frontend to add data-testid attributes  
**Time**: 30 minutes  
**Impact**: E2E coverage 6.7% → 100% (30/30 tests)

### Your Role

**Wait for Frontend Agent** to add missing `data-testid` attributes, then:
1. Run Playwright E2E tests
2. Fix any remaining test failures
3. Verify all 30 tests pass

### What You Need to Do

#### Step 1: Wait for Frontend

Frontend Agent will add `data-testid` attributes to:
- Filter components
- Policy row components
- Header components

#### Step 2: Verify Servers Are Running

```bash
# Check backend
curl http://localhost:8000/api/healthz

# Check frontend
curl http://localhost:3000
```

#### Step 3: Install Playwright (If Needed)

```bash
cd policy-radar-frontend
npm install -D @playwright/test --legacy-peer-deps
npx playwright install --with-deps
```

#### Step 4: Run E2E Tests

```bash
cd policy-radar-frontend
npx playwright test -v
```

#### Step 5: Fix Test Failures (If Any)

If tests fail:
1. Review error messages
2. Check if frontend implementation is wrong (coordinate with Frontend)
3. Or fix test selectors/expectations if frontend is correct
4. Re-run until all pass

### Test Command

```bash
cd policy-radar-frontend
npx playwright test -v
```

**Expected Result**: 30/30 E2E tests passing ✅

---

## 🔴 CRITICAL PRIORITY 5: Run Smoke Flow Test

**Status**: CRITICAL - Final verification  
**Time**: 15 minutes  
**Impact**: Verify complete user journey works

### Your Role

**Run smoke flow test** to verify complete user journey works end-to-end.

### Smoke Flow Steps

1. **Navigate to feed page**
   - Open `http://localhost:3000`
   - Verify page loads
   - Verify 12 policies display

2. **Apply filters**
   - Apply filter: region → EU
   - Apply filter: policy_type → Disclosure
   - Apply filter: status → Adopted
   - Verify results filter correctly
   - Clear all filters
   - Verify all 12 policies show again

3. **Search and sort**
   - Enter search query: "climate"
   - Verify debounced (300ms delay)
   - Change sort: Impact ↓
   - Change sort order: Ascending
   - Verify results update

4. **Open drawer**
   - Click on first policy
   - Verify drawer opens
   - Verify ALL fields display correctly:
     - Title, jurisdiction, policy type, status
     - Impact score, confidence
     - Impact factor bars
     - Effective date, last updated, version
     - Citations, history
   - Close drawer

5. **Save/Unsave**
   - Open policy drawer
   - Click save button
   - Verify save state toggles
   - Navigate to Saved tab
   - Verify policy appears in correct group (≤90d, 90-365d, >365d)
   - Unsave policy
   - Verify removed from Saved

6. **Digest preview**
   - Navigate to digest section
   - Generate digest preview
   - Verify top 5 policies display
   - Verify all fields display correctly

### Test Execution

**Option A: Manual Test**

1. Start both servers:
   ```bash
   # Terminal 1: Backend
   cd PolicyRadar-backend
   source venv/bin/activate
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2: Frontend
   cd policy-radar-frontend
   npm run dev
   ```

2. Open browser: `http://localhost:3000`

3. Follow smoke flow steps manually

4. Document any issues found

**Option B: Automated Test (If Playwright Test Exists)**

```bash
cd policy-radar-frontend
npx playwright test smoke-flow.spec.ts
```

### Expected Result

All smoke flow steps pass ✅
- No errors in console
- All features work correctly
- Complete user journey functional

---

## 📋 Test Execution Workflow

### Continuous Testing

1. **Wait for Backend/Frontend fixes**
2. **Run tests immediately after fixes**
3. **Verify results**
4. **Document findings**
5. **Coordinate fixes if needed**
6. **Re-run until all pass**

### Test Commands Summary

```bash
# Integration Tests
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
cd PolicyRadar-backend && source venv/bin/activate
pytest tests/integration/ -v

# API Contract Tests
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py -v

# Golden Tests
pytest tests/unit/test_classify.py -v
pytest tests/unit/test_scoring.py -v
pytest tests/unit/ -v

# E2E Tests
cd policy-radar-frontend
npx playwright test -v

# Full Test Suite
cd PolicyRadar-backend
source venv/bin/activate
pytest tests/ -v --tb=short
```

---

## 📊 Progress Tracking

### Test Coverage Goals

**Current**: 34.4% (33/96 tests)
**After Integration Fix**: 51.0% (51/96 tests)
**After API Contract Fix**: 53.1% (51/96 tests)
**After Golden Tests**: 77.1% (74/96 tests)
**After E2E Tests**: 100% (96/96 tests) ✅

### Tracking Checklist

- [ ] Integration tests fixed (16/16 passing)
- [ ] API contract tests fixed (8/8 passing)
- [ ] Golden tests verified (23/23 passing)
- [ ] E2E tests verified (30/30 passing)
- [ ] Smoke flow test passing
- [ ] All tests documented

---

## 🚨 Critical Reminders

### COORDINATION
- ✅ Coordinate with Backend Agent for integration/API contract fixes
- ✅ Coordinate with Frontend Agent for E2E test fixes
- ✅ Share test results with other agents
- ✅ Document all findings

### TEST INFRASTRUCTURE
- ✅ Fix test infrastructure (not backend/frontend code)
- ✅ Verify test database setup
- ✅ Verify Playwright setup
- ✅ Run tests after each fix

### DOCUMENTATION
- ✅ Update test status documents
- ✅ Document test results
- ✅ Document any issues found
- ✅ Update master coordination plan

---

## 🚀 After Completing Tasks

1. **Run full test suite**: `pytest tests/ -v`
2. **Run E2E tests**: `npx playwright test -v`
3. **Run smoke flow**: Manual or automated
4. **Verify coverage**: All 96 tests passing
5. **Update documents**: Test reports and status
6. **Commit and push**: 
   ```bash
   git add .
   git commit -m "test: verify all tests passing after fixes"
   git push origin main
   ```

---

## 📚 Reference Documents

- **Action Plan**: `COMPREHENSIVE_ACTION_PLAN.md`
- **Integration Test Status**: `INTEGRATION_TEST_STATUS.md`
- **Test Status**: `TEST_STATUS_AND_INTEGRATION.md`
- **Final Test Report**: `FINAL_TEST_REPORT.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`

---

**Start with Priority 1 (Integration Tests), coordinate with Backend Agent, then proceed with other priorities as Backend/Frontend complete their fixes.**

**Run tests continuously and verify progress!** 🧪✅

