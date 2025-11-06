# Backend Agent - Development & Testing Prompt

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

Fix backend issues identified in testing and implement missing modules while writing tests during development to ensure progress.

**Current Priority**: Fix API Contract Test Fixture (🔴 CRITICAL)

**Current Status**: 
- ✅ Backend server running (12 policies seeded)
- ✅ Contract tests: 27/27 passing (100%)
- ⚠️ API contract tests: 1/8 passing (needs fixture fix)
- ⏳ Golden tests: 0/23 pending (need classification/scoring modules)
- ⏳ Integration tests: 0/16 pending (need test database)

---

## 🔴 CRITICAL: Test-First Development

**YOU MUST**: Write tests BEFORE or ALONGSIDE implementing features. Test immediately after each change.

### Development Workflow

1. **Write test first** (or alongside code)
2. **Implement feature** (make test pass)
3. **Run test immediately** (verify it passes)
4. **Run full test suite** (ensure no regressions)
5. **Commit with test** (include test in same commit)

### Test Commands (Run After Each Change)

```bash
cd PolicyRadar-backend
source venv/bin/activate

# Run tests after each change
pytest tests/ -v --tb=short

# Run specific test file
pytest tests/contract/test_api_contracts.py -v

# Run with coverage
pytest tests/ --cov=app --cov-report=term-missing
```

---

## 🚨 Priority 1: Fix API Contract Test Fixture (CRITICAL)

### Issue
API contract tests fail because test client doesn't pass API key in headers.

### Task
- [ ] Open `tests/contract/test_api_contracts.py`
- [ ] Find the `client` or `test_client` fixture
- [ ] Ensure it includes `X-API-Key` header with API key: `1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d`
- [ ] Run test immediately: `pytest tests/contract/test_api_contracts.py -v`
- [ ] Verify all 8 API contract tests pass

### Test-While-Developing

**Step 1**: Run test to see failure
```bash
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py::test_healthz_response_schema -v
```

**Step 2**: Fix fixture (add API key to headers)
```python
# In tests/contract/test_api_contracts.py
@pytest.fixture
def client():
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    client.headers.update({"X-API-Key": "1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"})
    return client
```

**Step 3**: Run test again - should pass
```bash
pytest tests/contract/test_api_contracts.py::test_healthz_response_schema -v
```

**Step 4**: Run all API contract tests
```bash
pytest tests/contract/test_api_contracts.py -v
```

**Expected Result**: All 8 tests pass ✅

### Success Criteria
- ✅ All 8 API contract tests pass
- ✅ Test fixture properly includes API key
- ✅ Tests run with: `pytest tests/contract/test_api_contracts.py -v`

---

## 🟠 Priority 2: Implement Classification Module (HIGH)

### Issue
Golden tests require `app/core/classify.py` but it may not exist or be incomplete.

### Task
- [ ] Check if `app/core/classify.py` exists
- [ ] If missing, create it per `/contracts/scoring.md`
- [ ] Implement classification logic:
  - Policy type: keywords → Disclosure, Pricing, Ban, Incentive, Supply-chain
  - Scopes: text patterns → [1, 2, 3]
  - Jurisdiction: source + text → EU, US-Federal, US-CA, UK, OTHER
  - Status: heuristics → Proposed, Adopted, Effective
- [ ] **Write tests FIRST** in `tests/unit/test_classify.py`
- [ ] Implement module to make tests pass
- [ ] Run tests after each change: `pytest tests/unit/test_classify.py -v`

### Test-While-Developing

**Step 1**: Check if module exists
```bash
ls -la PolicyRadar-backend/app/core/classify.py
cat PolicyRadar-backend/app/core/classify.py | head -20
```

**Step 2**: Write test first (if module missing)
```python
# tests/unit/test_classify.py
def test_classify_policy_type_disclosure():
    from app.core.classify import classify_policy_type
    result = classify_policy_type("disclosure requirements climate emissions")
    assert result == "Disclosure"

def test_classify_policy_type_pricing():
    from app.core.classify import classify_policy_type
    result = classify_policy_type("carbon tax pricing mechanism")
    assert result == "Pricing"
```

**Step 3**: Run test (will fail - expected)
```bash
pytest tests/unit/test_classify.py::test_classify_policy_type_disclosure -v
```

**Step 4**: Implement function to make test pass
```python
# app/core/classify.py
def classify_policy_type(text: str) -> str:
    text_lower = text.lower()
    if any(kw in text_lower for kw in ["disclosure", "report", "disclose"]):
        return "Disclosure"
    # ... etc
```

**Step 5**: Run test again - should pass
```bash
pytest tests/unit/test_classify.py::test_classify_policy_type_disclosure -v
```

**Step 6**: Run all classification tests
```bash
pytest tests/unit/test_classify.py -v
```

### Success Criteria
- ✅ `app/core/classify.py` exists with all classification functions
- ✅ All 7 classification golden tests pass
- ✅ Tests match `/contracts/scoring.md` rules
- ✅ Tests run with: `pytest tests/unit/test_classify.py -v`

---

## 🟠 Priority 3: Implement Scoring Module (HIGH)

### Issue
Golden tests require `app/core/scoring.py` but it may not exist or be incomplete.

### Task
- [ ] Check if `app/core/scoring.py` exists
- [ ] If missing, create it per `/contracts/scoring.md`
- [ ] Implement 5-factor scoring algorithm:
  - Mandatory: +20 vs Voluntary: +10
  - Time proximity: ≤12m (+20), 12-24m (+10), >24m (0)
  - Scope coverage: S1 (+7), S2 (+7), S3 (+7), capped at 20
  - Sector breadth: narrow (+5), medium (+12), cross-sector (+20)
  - Disclosure complexity: 0-20
  - Total score capped at 100
- [ ] **Write tests FIRST** in `tests/unit/test_scoring.py`
- [ ] Implement module to make tests pass
- [ ] Run tests after each change: `pytest tests/unit/test_scoring.py -v`

### Test-While-Developing

**Step 1**: Check if module exists
```bash
ls -la PolicyRadar-backend/app/core/scoring.py
cat PolicyRadar-backend/app/core/scoring.py | head -30
```

**Step 2**: Write test first (if module missing)
```python
# tests/unit/test_scoring.py
def test_score_mandatory_factor():
    from app.core.scoring import calculate_impact_score
    factors = {
        "mandatory": True,
        "time_proximity_days": 30,
        "scopes": [1, 2],
        "sector_breadth": "medium",
        "disclosure_complexity": 10
    }
    score, impact_factors = calculate_impact_score(**factors)
    assert impact_factors["mandatory"] == 20  # Mandatory = +20
    assert score <= 100
```

**Step 3**: Run test (will fail - expected)
```bash
pytest tests/unit/test_scoring.py::test_score_mandatory_factor -v
```

**Step 4**: Implement function to make test pass
```python
# app/core/scoring.py
def calculate_impact_score(
    mandatory: bool,
    time_proximity_days: int,
    scopes: list,
    sector_breadth: str,
    disclosure_complexity: int
) -> tuple[int, dict]:
    factors = {}
    
    # Mandatory factor
    factors["mandatory"] = 20 if mandatory else 10
    
    # Time proximity
    if time_proximity_days <= 365:  # ≤12m
        factors["time_proximity"] = 20
    elif time_proximity_days <= 730:  # 12-24m
        factors["time_proximity"] = 10
    else:
        factors["time_proximity"] = 0
    
    # ... implement other factors
    
    total_score = sum(factors.values())
    factors["total"] = min(total_score, 100)  # Cap at 100
    
    return factors["total"], factors
```

**Step 5**: Run test again - should pass
```bash
pytest tests/unit/test_scoring.py::test_score_mandatory_factor -v
```

**Step 6**: Run all scoring tests
```bash
pytest tests/unit/test_scoring.py -v
```

### Success Criteria
- ✅ `app/core/scoring.py` exists with scoring algorithm
- ✅ All 16 scoring golden tests pass
- ✅ Algorithm matches `/contracts/scoring.md` exactly
- ✅ Tests run with: `pytest tests/unit/test_scoring.py -v`

---

## 🟡 Priority 4: Set Up Test Database for Integration Tests (MEDIUM)

### Issue
Integration tests need isolated test database to avoid conflicts.

### Task
- [ ] Create test database: `policyradar_test`
- [ ] Update `tests/conftest.py` to use test database
- [ ] Add database cleanup fixtures (teardown after each test)
- [ ] Run integration tests: `pytest tests/integration/ -v`
- [ ] Verify all 16 tests pass

### Test-While-Developing

**Step 1**: Create test database
```bash
psql postgres -c "CREATE DATABASE policyradar_test;"
```

**Step 2**: Run migrations on test database
```bash
cd PolicyRadar-backend
source venv/bin/activate
export DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
cd app/db
PYTHONPATH="/Users/sharath/Policy Radar/PolicyRadar-backend" alembic upgrade head
```

**Step 3**: Update `tests/conftest.py` to use test database
```python
# tests/conftest.py
import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@pytest.fixture(scope="function")
def db_session():
    # Use test database
    test_db_url = os.getenv("TEST_DATABASE_URL", "postgresql://sharath@localhost:5432/policyradar_test")
    engine = create_engine(test_db_url)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    try:
        yield session
    finally:
        session.rollback()
        session.close()
```

**Step 4**: Run one integration test to verify setup
```bash
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/test_idempotency.py::test_same_run_no_duplicates -v
```

**Step 5**: Run all integration tests
```bash
pytest tests/integration/ -v
```

### Success Criteria
- ✅ Test database created and migrated
- ✅ `tests/conftest.py` configured for test database
- ✅ All 16 integration tests pass
- ✅ Database cleanup works (no test pollution)

---

## 📋 Development Checklist

### Before Starting Each Task
- [ ] Run existing tests: `pytest tests/ -v`
- [ ] Note current test status
- [ ] Identify what needs to be fixed/implemented

### During Development
- [ ] Write test first (or alongside code)
- [ ] Implement minimal code to make test pass
- [ ] Run test after each change: `pytest tests/unit/test_classify.py::test_name -v`
- [ ] Refactor if needed (test should still pass)
- [ ] Run full test suite: `pytest tests/ -v`

### After Each Task
- [ ] All tests for that module pass
- [ ] Full test suite still passes (no regressions)
- [ ] Code follows `/dictionary.md` conventions
- [ ] No hardcoded secrets (all in `.env`)
- [ ] **🚀 PUSH CODE**: Commit and push changes
  ```bash
  git add .
  git commit -m "feat: [feature name] - [brief description]"
  git push origin main
  ```

---

## 🔍 Progress Verification Commands

Run these after completing each task:

```bash
cd PolicyRadar-backend
source venv/bin/activate

# 1. API Contract Tests (should pass after Priority 1)
pytest tests/contract/test_api_contracts.py -v
# Expected: 8/8 passing

# 2. Classification Tests (should pass after Priority 2)
pytest tests/unit/test_classify.py -v
# Expected: 7/7 passing (or however many golden tests exist)

# 3. Scoring Tests (should pass after Priority 3)
pytest tests/unit/test_scoring.py -v
# Expected: 16/16 passing (or however many golden tests exist)

# 4. Integration Tests (should pass after Priority 4)
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/ -v
# Expected: 16/16 passing

# 5. Full Test Suite
pytest tests/ -v --tb=short
# Should show progress with more tests passing
```

---

## 🚨 Critical Reminders

### NO HARDCODED VALUES
- ❌ **NO** hardcoded API keys, passwords, tokens, URLs
- ✅ **YES** use `.env` file or environment variables
- ✅ Check before committing: `grep -r "api[_-]?key\|secret\|password" --exclude-dir=venv --exclude-dir=node_modules`

### FIELD NAME COMPLIANCE
- ✅ All field names must be `snake_case` (e.g., `impact_score`, NOT `impactScore`)
- ✅ All enum values must match `/dictionary.md` exactly (e.g., `US-Federal` with hyphen)
- ✅ Verify before committing: Check API responses match OpenAPI spec

### TEST WHILE DEVELOPING
- ✅ Write test FIRST (or alongside code)
- ✅ Run test after EVERY change
- ✅ Don't commit code without passing tests
- ✅ Include test in same commit as code

---

## 📊 Expected Progress

### After Priority 1 (API Contract Fix)
- ✅ Contract tests: 35/35 passing (was 27/27, now +8 API contract tests)
- ✅ Coverage: 35% → 36% (35/96 tests)

### After Priority 2 (Classification Module)
- ✅ Golden tests: 7/23 passing (classification tests)
- ✅ Coverage: 42/96 tests = 44%

### After Priority 3 (Scoring Module)
- ✅ Golden tests: 23/23 passing (all golden tests)
- ✅ Coverage: 59/96 tests = 61%

### After Priority 4 (Test Database)
- ✅ Integration tests: 16/16 passing
- ✅ Coverage: 75/96 tests = 78%

### Final Goal
- ✅ All 96 tests passing
- ✅ 100% coverage on critical paths
- ✅ Ready for E2E testing

---

## 🎯 Success Criteria

### Immediate (Today)
- ✅ API contract tests fixed (8/8 passing)
- ✅ Test database set up
- ✅ Classification module implemented with tests

### Short Term (This Week)
- ✅ Scoring module implemented with tests
- ✅ Integration tests passing (16/16)
- ✅ Golden tests passing (23/23)
- ✅ Total: 75+ tests passing

### Final Goal
- ✅ All backend tests passing
- ✅ Ready for frontend integration testing
- ✅ Ready for E2E testing

---

**Start with Priority 1, test immediately after each change, then move to Priority 2, 3, 4 in order.**

**Run tests after EVERY change to ensure progress!** 🧪✅

