# Comprehensive Action Plan - All Agents

**Date**: 2025-01-XX  
**Status**: 🎯 **ACTIVE**  
**Goal**: Fix all blocked/missing tests and implement Legend  
**Current Coverage**: 34.4% (33/96 tests) → **Target**: 100% (96/96 tests)

---

## 📊 Current Status Summary

### Test Coverage Breakdown

| Category | Passed | Total | Coverage | Status | Blocking Issues |
|----------|--------|-------|----------|--------|----------------|
| Contract Tests | 24 | 27 | 88.9% | ✅ Working | 3 API contract tests need fixture fix |
| Golden Tests | 7 | 23 | 30.4% | 🔄 In Progress | Need classification + scoring modules |
| **Integration Tests** | **1** | **16** | **6.3%** | ⏳ **BLOCKED** | **Import path issues** 🔴 |
| E2E Tests | 2 | 30 | 6.7% | ⏳ Running | Missing `data-testid` attributes 🔴 |
| **TOTAL** | **33** | **96** | **34.4%** | ⏳ In Progress | |

### Critical Blockers

1. **Integration Tests** (15/16 skipped) - Import path mismatches
2. **E2E Tests** (28/30 failing) - Missing `data-testid` attributes
3. **API Contract Tests** (7/8 failing) - Missing API key in test fixture
4. **Golden Tests** (16/23 failing) - Need classification/scoring modules

---

## 🎯 Action Plan by Agent

### 🔵 BACKEND AGENT - Tasks

#### Priority 1: Fix Integration Test Import Issues (CRITICAL)
**Status**: 🔴 BLOCKING (15/16 tests skipped)  
**Time**: ~1 hour  
**Impact**: Coverage 34% → 51% (+16.6%)

**Problem**: Integration tests have wrong import paths and function signatures

**Files to Fix**:
1. `tests/integration/test_idempotency.py`
2. `tests/integration/test_versioning.py`
3. `tests/integration/test_pipeline.py`
4. `tests/conftest.py` (update database URL)

**Required Changes**:

```python
# BEFORE (Wrong)
from backend.app.db.models import Base
from backend.app.ingestion.pipeline import run_ingestion

def test_no_duplicates_on_second_run(pipeline, test_database, test_source_data):
    result1 = pipeline(source_data=test_source_data)
    result2 = pipeline(source_data=test_source_data)

# AFTER (Correct)
import sys
from pathlib import Path

# Add backend to Python path
backend_dir = Path(__file__).parent.parent.parent / "PolicyRadar-backend"
sys.path.insert(0, str(backend_dir))

from app.models.policy import Policy, IngestRun, PolicyChangesLog, Base
from app.ingest.pipeline import IngestionPipeline

@pytest.fixture
def db_session(test_database_url):
    """Create database session for tests"""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.models.policy import Base
    
    engine = create_engine(test_database_url)
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    yield session
    
    session.rollback()
    Base.metadata.drop_all(engine)
    session.close()

@pytest.mark.asyncio
async def test_no_duplicates_on_second_run(db_session, mock_fetcher):
    """Test: Run pipeline twice with same source data → no duplicates"""
    pipeline = IngestionPipeline(db=db_session)
    
    # Mock fetcher to return test data
    # (Need to patch get_fetcher)
    
    # First run
    result1 = await pipeline.run(source="test_source")
    first_count = result1["items_inserted"]
    
    # Second run with same data
    result2 = await pipeline.run(source="test_source")
    second_count = result2["items_inserted"]
    
    # Should not create duplicates
    assert second_count == 0
```

**Key Fixes**:
1. ✅ Remove `backend.` prefix from imports
2. ✅ Change `app.db.models` → `app.models.policy`
3. ✅ Change `ingestion` → `ingest`
4. ✅ Use `IngestionPipeline` class (not `run_ingestion` function)
5. ✅ Add `@pytest.mark.asyncio` to async tests
6. ✅ Create `db_session` fixture with proper setup/teardown
7. ✅ Mock `get_fetcher` to return test data
8. ✅ Update database URL in `conftest.py` to use `sharath` user

**Test Command**:
```bash
cd PolicyRadar-backend
source venv/bin/activate
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/ -v --tb=short
```

**Expected Result**: 16/16 tests passing ✅

---

#### Priority 2: Fix API Contract Test Fixture (CRITICAL)
**Status**: 🔴 BLOCKING (7/8 tests failing)  
**Time**: 10 minutes  
**Impact**: Coverage 88.9% → 100% for contract tests

**Problem**: Test client doesn't include API key in headers

**File to Fix**: `tests/contract/test_api_contracts.py`

**Required Change**:

```python
@pytest.fixture
def client():
    """Test client with API key."""
    from fastapi.testclient import TestClient
    from app.main import app
    
    client = TestClient(app)
    api_key = "1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"
    client.headers.update({"X-API-Key": api_key})
    return client
```

**Test Command**:
```bash
cd PolicyRadar-backend
source venv/bin/activate
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py -v
```

**Expected Result**: 8/8 tests passing ✅

---

#### Priority 3: Implement Classification Module (HIGH)
**Status**: ⏳ Pending (blocks 16 golden tests)  
**Time**: ~2 hours  
**Impact**: Coverage 30.4% → 100% for golden tests

**Problem**: Golden tests require `app/core/classify.py` module

**File to Create**: `PolicyRadar-backend/app/core/classify.py`

**Requirements** (per `/contracts/scoring.md`):
- Policy type: keywords → Disclosure, Pricing, Ban, Incentive, Supply-chain
- Scopes: text patterns → [1, 2, 3]
- Jurisdiction: source + text → EU, US-Federal, US-CA, UK, OTHER
- Status: heuristics → Proposed, Adopted, Effective

**Test Command**:
```bash
pytest tests/unit/test_classify.py -v
```

**Expected Result**: 7/7 classification tests passing ✅

---

#### Priority 4: Implement Scoring Module (HIGH)
**Status**: ⏳ Pending (blocks remaining golden tests)  
**Time**: ~2 hours  
**Impact**: All golden tests passing (23/23)

**Problem**: Golden tests require `app/core/scoring.py` module

**File to Create**: `PolicyRadar-backend/app/core/scoring.py`

**Requirements** (per `/contracts/scoring.md`):
- Mandatory: +20 vs Voluntary: +10
- Time proximity: ≤12m (+20), 12-24m (+10), >24m (0)
- Scope coverage: S1 (+7), S2 (+7), S3 (+7), capped at 20
- Sector breadth: narrow (+5), medium (+12), cross-sector (+20)
- Disclosure complexity: 0-20
- Total score capped at 100

**Test Command**:
```bash
pytest tests/unit/test_scoring.py -v
```

**Expected Result**: 16/16 scoring tests passing ✅

---

### 🟢 FRONTEND AGENT - Tasks

#### Priority 1: Add Missing Data-TestId Attributes (CRITICAL - BLOCKING E2E)
**Status**: 🔴 URGENT (28/30 E2E tests failing)  
**Time**: ~1 hour  
**Impact**: E2E coverage 6.7% → 100% (30/30 tests)

**Problem**: Missing `data-testid` attributes blocking Playwright tests

**Files to Fix**:
1. `policy-radar-frontend/components/policy-filters.tsx`
2. `policy-radar-frontend/components/ui/filter-toggle.tsx`
3. `policy-radar-frontend/components/ui/policy-row.tsx`
4. `policy-radar-frontend/components/policy-header.tsx`

**Missing Test IDs**:
- `filter-region`
- `filter-region-EU`
- `filter-region-US-Federal`
- `filter-region-OTHER`
- `sort-select`
- `order-select`
- `impact-score`
- `clear-all-filters`

**Reference**: See `FRONTEND_DATA_TESTID_FIX.md` for detailed guide

**Test Command**:
```bash
cd policy-radar-frontend
npx playwright test -v
```

**Expected Result**: 30/30 E2E tests passing ✅

---

#### Priority 2: Implement Legend/Help Dialog (HIGH)
**Status**: ⏳ New Feature  
**Time**: ~2 hours  
**Impact**: User experience improvement

**Problem**: Users need help understanding the number key (Impact Score, Confidence, etc.)

**Files to Create**:
1. `policy-radar-frontend/components/legend-dialog.tsx` (NEW)

**Files to Modify**:
1. `policy-radar-frontend/components/policy-header.tsx` (add help icon)

**Implementation Plan**: See `LEGEND_IMPLEMENTATION_PLAN.md`

**Key Requirements**:
- Add "?" or "ℹ️" help icon next to "Policy Radar" title
- Icon opens Dialog modal with full legend content
- Legend content verbatim from user's provided text
- Non-invasive (doesn't clutter UI)
- Accessible (keyboard navigation, ARIA labels)

**Steps**:
1. Create `legend-dialog.tsx` component with Dialog
2. Add all legend content (verbatim)
3. Add help icon button to `policy-header.tsx`
4. Wire up dialog open/close
5. Style and format content
6. Test on mobile (responsive)

**Test Command**:
```bash
# Manual test
# 1. Click help icon
# 2. Verify dialog opens
# 3. Verify content displays correctly
# 4. Verify dialog closes (X button, ESC key)
```

**Expected Result**: Help dialog functional and accessible ✅

---

### 🟡 TESTING AGENT - Tasks

#### Priority 1: Fix Integration Test Import Issues (CRITICAL)
**Status**: 🔴 BLOCKING (works with Backend Agent)  
**Time**: ~1 hour (coordinate with Backend)  
**Impact**: Coverage 34% → 51% (+16.6%)

**Action**: Coordinate with Backend Agent to fix integration test imports
- Same fixes as Backend Agent Priority 1
- Verify all 16 tests pass after fixes
- Document integration test setup

**Test Command**:
```bash
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/ -v
```

**Expected Result**: 16/16 tests passing ✅

---

#### Priority 2: Fix API Contract Test Fixture (CRITICAL)
**Status**: 🔴 BLOCKING (works with Backend Agent)  
**Time**: 10 minutes (coordinate with Backend)  
**Impact**: Contract tests 88.9% → 100%

**Action**: Coordinate with Backend Agent to fix API contract test fixture
- Same fixes as Backend Agent Priority 2
- Verify all 8 API contract tests pass

**Test Command**:
```bash
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py -v
```

**Expected Result**: 8/8 tests passing ✅

---

#### Priority 3: Verify Golden Tests (HIGH)
**Status**: ⏳ Pending (after Backend implements modules)  
**Time**: 30 minutes  
**Impact**: Verify classification/scoring modules work correctly

**Action**: 
1. Wait for Backend Agent to implement classification/scoring modules
2. Run golden tests: `pytest tests/unit/test_classify.py -v`
3. Run scoring tests: `pytest tests/unit/test_scoring.py -v`
4. Fix any test failures (if backend logic is wrong)
5. Verify all 23 golden tests pass

**Test Commands**:
```bash
pytest tests/unit/test_classify.py -v
pytest tests/unit/test_scoring.py -v
pytest tests/unit/ -v  # All golden tests
```

**Expected Result**: 23/23 golden tests passing ✅

---

#### Priority 4: Run E2E Tests After Frontend Fix (HIGH)
**Status**: ⏳ Pending (after Frontend adds data-testid)  
**Time**: 30 minutes  
**Impact**: E2E coverage 6.7% → 100% (30/30 tests)

**Action**:
1. Wait for Frontend Agent to add missing `data-testid` attributes
2. Run Playwright tests: `cd policy-radar-frontend && npx playwright test`
3. Fix any remaining test failures
4. Verify all 30 E2E tests pass
5. Run smoke flow test

**Test Command**:
```bash
cd policy-radar-frontend
npx playwright test -v
```

**Expected Result**: 30/30 E2E tests passing ✅

---

#### Priority 5: Run Smoke Flow Test (CRITICAL)
**Status**: ⏳ Pending (after all fixes)  
**Time**: 15 minutes  
**Impact**: Verify complete user journey works

**Smoke Flow Steps**:
1. Navigate to feed page
2. Apply filters (region: EU, type: Disclosure, status: Adopted)
3. Open policy drawer
4. Save policy
5. Navigate to Saved tab
6. Verify grouping (<=90d, 90-365d, >365d)
7. Generate digest preview
8. Verify top 5 policies display

**Test Command**:
```bash
# Manual or automated via Playwright
cd policy-radar-frontend
npx playwright test smoke-flow.spec.ts
```

**Expected Result**: All smoke flow steps pass ✅

---

## 📋 Implementation Order

### Phase 1: Critical Fixes (Do First - Parallel)
1. **Backend + Testing**: Fix Integration Test Imports (1 hour) → Coverage: 34% → 51%
2. **Backend + Testing**: Fix API Contract Test Fixture (10 min) → Contract: 89% → 100%
3. **Frontend**: Add Missing Data-TestId Attributes (1 hour) → E2E: 7% → 100%

**Result After Phase 1**: Coverage: 34.4% → **~70%** (51 + 3 + 30 = 84 tests)

### Phase 2: Module Implementation (Sequential)
4. **Backend**: Implement Classification Module (2 hours) → Golden: 30% → 61%
5. **Backend**: Implement Scoring Module (2 hours) → Golden: 61% → 100%
6. **Testing**: Verify Golden Tests (30 min) → All golden tests passing

**Result After Phase 2**: Coverage: **~89%** (84 + 16 = 100 tests, but some may overlap)

### Phase 3: E2E & Smoke Flow (After Frontend Fix)
7. **Testing**: Run E2E Tests (30 min) → E2E: 100%
8. **Testing**: Run Smoke Flow Test (15 min) → Complete verification

**Result After Phase 3**: Coverage: **100%** (96/96 tests) ✅

### Phase 4: Legend Feature (Can Run Parallel)
9. **Frontend**: Implement Legend Dialog (2 hours) → UX improvement

**Result After Phase 4**: All tests passing + Legend feature complete ✅

---

## 📊 Expected Progress Tracking

### Current State
```
Coverage: [████████░░░░░░░░░░░░░░░░░░░░░░] 34.4% (33/96)
├── Contract: [████████████████████░░░] 88.9% (24/27)
├── Golden:   [████░░░░░░░░░░░░░░░░░░░] 30.4% (7/23)
├── Integration: [░░░░░░░░░░░░░░░░░░░░] 6.3% (1/16) 🔴
└── E2E:      [░░░░░░░░░░░░░░░░░░░░░░] 6.7% (2/30) 🔴
```

### After Phase 1 (Critical Fixes)
```
Coverage: [██████████████████████░░░░] ~70% (84/96)
├── Contract: [████████████████████████] 100% (27/27) ✅
├── Golden:   [████░░░░░░░░░░░░░░░░░░░] 30.4% (7/23)
├── Integration: [████████████████████] 100% (16/16) ✅
└── E2E:      [████████████████████████] 100% (30/30) ✅
```

### After Phase 2 (Modules)
```
Coverage: [████████████████████████░░] ~89% (100/96)
├── Contract: [████████████████████████] 100% (27/27) ✅
├── Golden:   [████████████████████████] 100% (23/23) ✅
├── Integration: [████████████████████] 100% (16/16) ✅
└── E2E:      [████████████████████████] 100% (30/30) ✅
```

### Final State (All Complete)
```
Coverage: [████████████████████████] 100% (96/96) ✅
All tests passing + Legend feature complete
```

---

## ⚠️ Critical Reminders

### For Backend Agent
- ❌ **NO hardcoded secrets** - All in `.env`
- ✅ **All field names `snake_case`** - Per `/dictionary.md`
- ✅ **All enum values match dictionary** - Exact format
- ✅ **Test-first development** - Write tests alongside code
- ✅ **Run tests after each change** - Verify progress

### For Frontend Agent
- ❌ **NO visual redesign** - Layout/tokens unchanged
- ✅ **All field names `snake_case`** - Per `/dictionary.md`
- ✅ **All enum values match dictionary** - Exact format
- ✅ **Add `data-testid` for E2E tests** - Critical for Playwright
- ✅ **Legend content verbatim** - Use exact text provided

### For Testing Agent
- ✅ **Run tests after Backend/Frontend fixes** - Verify progress
- ✅ **Document test results** - Update test reports
- ✅ **Coordinate with other agents** - Share test results
- ✅ **Fix test infrastructure** - Not backend/frontend code

---

## 🚀 Quick Reference

### Test Commands

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
```

### Database Configuration

**Test Database**:
- Name: `policyradar_test`
- User: `sharath`
- URL: `postgresql://sharath@localhost:5432/policyradar_test`
- Status: ✅ Created with all tables

**Development Database**:
- Name: `policyradar`
- User: `sharath`
- URL: `postgresql://sharath@localhost:5432/policyradar`
- Status: ✅ Running with 12 policies seeded

---

## 📝 Success Criteria

### Must Have (Before Production)
- [ ] ✅ All 96 tests passing (100% coverage)
- [ ] ✅ Integration tests fixed (16/16 passing)
- [ ] ✅ E2E tests fixed (30/30 passing)
- [ ] ✅ API contract tests fixed (8/8 passing)
- [ ] ✅ Golden tests passing (23/23 passing)
- [ ] ✅ Smoke flow test passing
- [ ] ✅ No hardcoded secrets
- [ ] ✅ All field names comply (snake_case)
- [ ] ✅ All enum values match dictionary

### Nice to Have (Can Add Later)
- [ ] Legend/Help dialog implemented
- [ ] Test coverage reports
- [ ] Performance benchmarks
- [ ] CI/CD integration

---

## 📚 Reference Documents

- **Legend Plan**: `LEGEND_IMPLEMENTATION_PLAN.md`
- **Integration Test Status**: `INTEGRATION_TEST_STATUS.md`
- **Test Status**: `TEST_STATUS_AND_INTEGRATION.md`
- **Final Test Report**: `FINAL_TEST_REPORT.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`
- **Data-TestId Fix**: `FRONTEND_DATA_TESTID_FIX.md`

---

**Status**: 🎯 **ALL AGENTS - ACTIVE**  
**Next Milestone**: Phase 1 complete (Critical fixes) → Coverage 70%  
**Target**: 100% test coverage + Legend feature complete

