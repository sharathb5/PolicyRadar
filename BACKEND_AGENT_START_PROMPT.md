# Backend Agent - Start Work Prompt

**Copy and paste this entire prompt to the Backend Agent**

---

You are the Backend Agent for Policy Radar. Your mission is to fix blocked integration tests, implement missing modules, and ensure all backend tests pass.

## 🎯 Current Status

**Overall Coverage**: 34.4% (33/96 tests passing)
**Your Priority**: Fix integration tests + implement classification/scoring modules

**Current Test Status**:
- ✅ Contract Tests: 24/27 passing (88.9%)
- ⏳ Golden Tests: 7/23 passing (30.4%) - Need classification/scoring modules
- 🔴 **Integration Tests: 1/16 passing (6.3%)** - **BLOCKED by import issues**
- ⏳ E2E Tests: 2/30 passing (6.7%)

## 🔴 CRITICAL PRIORITY 1: Fix Integration Test Import Issues

**Status**: BLOCKING - 15/16 tests skipped due to import errors  
**Time**: ~1 hour  
**Impact**: Coverage 34% → 51% (+16.6%)

### Problem

Integration tests have **wrong import paths** and **function signatures**. They're trying to import:
- `backend.app.db.models` → Should be `app.models.policy`
- `backend.app.ingestion.pipeline` → Should be `app.ingest.pipeline`
- `run_ingestion()` function → Should be `IngestionPipeline` class with `async run()` method

### Files to Fix

1. **`tests/integration/test_idempotency.py`**
2. **`tests/integration/test_versioning.py`**
3. **`tests/integration/test_pipeline.py`**
4. **`tests/conftest.py`** (update database URL default)

### Required Fixes

#### Fix 1: Update Import Paths

**BEFORE (Wrong)**:
```python
from backend.app.db.models import Base
from backend.app.ingestion.pipeline import run_ingestion
```

**AFTER (Correct)**:
```python
import sys
from pathlib import Path

# Add backend to Python path
backend_dir = Path(__file__).parent.parent.parent / "PolicyRadar-backend"
sys.path.insert(0, str(backend_dir))

from app.models.policy import Policy, IngestRun, PolicyChangesLog, Base
from app.ingest.pipeline import IngestionPipeline
from app.ingest.fetchers import get_fetcher
```

#### Fix 2: Create db_session Fixture

Add to `tests/conftest.py` or create in each test file:

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.policy import Base

@pytest.fixture
def test_database_url():
    import os
    return os.getenv("TEST_DATABASE_URL", 
                     "postgresql://sharath@localhost:5432/policyradar_test")

@pytest.fixture
def db_session(test_database_url):
    """Create database session for tests"""
    engine = create_engine(test_database_url)
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    try:
        yield session
    finally:
        session.rollback()
        Base.metadata.drop_all(engine)
        session.close()
```

#### Fix 3: Update Test Functions

**BEFORE (Wrong)**:
```python
def test_no_duplicates_on_second_run(pipeline, test_database, test_source_data):
    result1 = pipeline(source_data=test_source_data)
    result2 = pipeline(source_data=test_source_data)
```

**AFTER (Correct)**:
```python
import pytest
from unittest.mock import patch

@pytest.mark.asyncio
async def test_no_duplicates_on_second_run(db_session):
    """Test: Run pipeline twice with same source data → no duplicates"""
    pipeline = IngestionPipeline(db=db_session)
    
    # Mock fetcher to return test data
    with patch('app.ingest.fetchers.get_fetcher') as mock_get_fetcher:
        # Set up mock to return test data
        mock_fetcher = Mock()
        mock_fetcher.fetch.return_value = test_source_data
        mock_get_fetcher.return_value = mock_fetcher
        
        # First run
        result1 = await pipeline.run(source="test_source")
        first_count = result1.get("items_inserted", 0)
        
        # Second run with same data
        result2 = await pipeline.run(source="test_source")
        second_count = result2.get("items_inserted", 0)
        
        # Should not create duplicates
        assert second_count == 0
```

### Test Command

```bash
cd "/Users/sharath/Policy Radar"
cd PolicyRadar-backend
source venv/bin/activate
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/ -v --tb=short
```

**Expected Result**: 16/16 tests passing ✅

---

## 🔴 CRITICAL PRIORITY 2: Fix API Contract Test Fixture

**Status**: BLOCKING - 7/8 API contract tests failing  
**Time**: 10 minutes  
**Impact**: Contract tests 88.9% → 100%

### Problem

Test client doesn't include API key in headers, causing 401 Unauthorized errors.

### File to Fix

**`tests/contract/test_api_contracts.py`**

### Required Fix

Find the `client` fixture and update it:

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

### Test Command

```bash
cd PolicyRadar-backend
source venv/bin/activate
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py -v
```

**Expected Result**: 8/8 tests passing ✅

---

## 🟠 HIGH PRIORITY 3: Implement Classification Module

**Status**: Pending - Blocks 16 golden tests  
**Time**: ~2 hours  
**Impact**: Golden tests 30.4% → 100%

### Problem

Golden tests require `app/core/classify.py` but it doesn't exist or is incomplete.

### File to Create

**`PolicyRadar-backend/app/core/classify.py`**

### Requirements

Per `/contracts/scoring.md`, implement classification logic:

1. **Policy type**: Keywords → Disclosure, Pricing, Ban, Incentive, Supply-chain
2. **Scopes**: Text patterns → [1, 2, 3]
3. **Jurisdiction**: Source + text → EU, US-Federal, US-CA, UK, OTHER
4. **Status**: Heuristics → Proposed, Adopted, Effective

### Reference

- **Contract**: `/contracts/scoring.md`
- **Dictionary**: `/dictionary.md` (for enum values)
- **Tests**: `tests/unit/test_classify.py` (write tests first!)

### Test Command

```bash
pytest tests/unit/test_classify.py -v
```

**Expected Result**: 7/7 classification tests passing ✅

---

## 🟠 HIGH PRIORITY 4: Implement Scoring Module

**Status**: Pending - Blocks remaining golden tests  
**Time**: ~2 hours  
**Impact**: All golden tests passing (23/23)

### Problem

Golden tests require `app/core/scoring.py` but it doesn't exist or is incomplete.

### File to Create

**`PolicyRadar-backend/app/core/scoring.py`**

### Requirements

Per `/contracts/scoring.md`, implement 5-factor scoring algorithm:

1. **Mandatory**: +20 vs Voluntary: +10
2. **Time proximity**: ≤12m (+20), 12-24m (+10), >24m (0)
3. **Scope coverage**: S1 (+7), S2 (+7), S3 (+7), capped at 20
4. **Sector breadth**: narrow (+5), medium (+12), cross-sector (+20)
5. **Disclosure complexity**: 0-20
6. **Total score**: Capped at 100

### Reference

- **Contract**: `/contracts/scoring.md`
- **Dictionary**: `/dictionary.md` (for enum values)
- **Tests**: `tests/unit/test_scoring.py` (write tests first!)

### Test Command

```bash
pytest tests/unit/test_scoring.py -v
```

**Expected Result**: 16/16 scoring tests passing ✅

---

## 📋 Development Workflow

### Test-First Development

1. **Write test first** (or alongside code)
2. **Implement feature** (make test pass)
3. **Run test immediately** (verify it passes)
4. **Run full test suite** (ensure no regressions)
5. **Commit with test** (include test in same commit)

### Test Commands (Run After Each Change)

```bash
cd PolicyRadar-backend
source venv/bin/activate

# Run specific test file
pytest tests/integration/test_idempotency.py -v
pytest tests/contract/test_api_contracts.py -v
pytest tests/unit/test_classify.py -v
pytest tests/unit/test_scoring.py -v

# Run full test suite
pytest tests/ -v --tb=short

# Run with coverage
pytest tests/ --cov=app --cov-report=term-missing
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

## 🚀 After Completing Tasks

1. **Run full test suite**: `pytest tests/ -v`
2. **Verify progress**: Check test counts match expected
3. **Commit and push**: 
   ```bash
   git add .
   git commit -m "feat: [feature name] - [brief description]"
   git push origin main
   ```
4. **Update status**: Notify when integration tests are fixed

---

## 📚 Reference Documents

- **Action Plan**: `COMPREHENSIVE_ACTION_PLAN.md`
- **Integration Test Status**: `INTEGRATION_TEST_STATUS.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`
- **Contracts**: `/contracts/scoring.md`, `/contracts/openapi.yml`
- **Dictionary**: `/dictionary.md`

---

**Start with Priority 1 (Integration Tests), then Priority 2 (API Contract Fix), then Priorities 3 & 4 (Modules).**

**Run tests after EVERY change to ensure progress!** 🧪✅

