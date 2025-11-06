# Testing & Assurance Agent - Comprehensive Testing Brief

## Goal
Comprehensively test the Policy Radar backend and frontend integration to ensure correctness, stability, and contract compliance before deployment.

## Current Status
✅ Setup complete - database seeded with 12 policies  
✅ Backend ready - all endpoints implemented  
✅ Frontend ready - API client integrated  
✅ API key configured: `1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d`  
✅ Database URL: `postgresql://sharath@localhost:5432/policyradar`

## Your Mission
Run comprehensive tests covering:
1. **Contract Tests** - Validate API against OpenAPI spec
2. **Golden Tests** - Verify classification and scoring algorithms
3. **Integration Tests** - Test ingestion pipeline and API endpoints
4. **E2E Tests** - Full user flows (Playwright)
5. **Smoke Flow** - Critical path validation
6. **Compliance Checks** - Field names, enum values, secrets

---

## Test Coverage Requirements

### 1. Contract Tests (Priority: CRITICAL)

**Location**: `/tests/contract/` or `/contracts/tests/`

**Tasks**:
- [ ] Validate OpenAPI spec syntax (`/contracts/openapi.yml`)
- [ ] Test all API endpoints exist and match spec
- [ ] Validate all request schemas match OpenAPI
- [ ] Validate all response schemas match OpenAPI
- [ ] Verify all enum values match `/dictionary.md`
- [ ] Verify all field names match `/dictionary.md`
- [ ] Test required fields are present in responses
- [ ] Test error responses match OpenAPI error schema

**Test Files to Create**:
- `tests/contract/test_openapi_validation.py`
- `tests/contract/test_api_contracts.py`
- `tests/contract/test_field_names.py`
- `tests/contract/test_enum_values.py`

**Key Validations**:
- Field names must be `snake_case` (e.g., `impact_score`, not `impactScore`)
- Enum values must match exactly (e.g., `US-Federal` with hyphen, not `US_Federal`)
- All routes must match `/dictionary.md` exactly
- Date formats must be `YYYY-MM-DD`

### 2. Golden Tests for Classification & Scoring (Priority: HIGH)

**Location**: `/tests/unit/`

**Tasks**:
- [ ] Create golden test cases for classification
- [ ] Create golden test cases for impact scoring
- [ ] Test classification rules with known inputs/outputs
- [ ] Test scoring algorithm against `/contracts/scoring.md`
- [ ] Verify impact_factors JSON structure
- [ ] Test edge cases (boundary values, special dates)

**Test Files to Create**:
- `tests/unit/test_classify.py`
- `tests/unit/test_scoring.py`
- `tests/fixtures/golden/classification_cases.json`
- `tests/fixtures/golden/scoring_cases.json`

**Golden Test Cases** (from `/contracts/scoring.md`):

**Classification Golden Tests**:
- Policy type: keywords → Disclosure, Pricing, Ban, Incentive, Supply-chain
- Scopes: text patterns → [1, 2, 3]
- Jurisdiction: source + text → EU, US-Federal, US-CA, UK, OTHER
- Status: heuristics → Proposed, Adopted, Effective
- Confidence: weighted signals → 0-1

**Scoring Golden Tests**:
- Mandatory: +20 vs Voluntary: +10
- Time proximity: ≤12m (+20), 12-24m (+10), >24m (0)
- Scope coverage: S1 (+7), S2 (+7), S3 (+7), capped at 20
- Sector breadth: narrow (+5), medium (+12), cross-sector (+20)
- Disclosure complexity: 0-20
- Total score capped at 100

**Important**: Do NOT mock classification/scoring logic - test actual implementations!

### 3. Integration Tests (Priority: HIGH)

**Location**: `/tests/integration/`

**Tasks**:
- [ ] Test ingestion pipeline end-to-end
- [ ] Test idempotency (run twice → no duplicates)
- [ ] Test versioning (normalized_hash change → version increment)
- [ ] Test policy_changes_log population
- [ ] Test API endpoints with real database
- [ ] Test filtering combinations
- [ ] Test sorting combinations
- [ ] Test pagination edge cases

**Test Files to Create**:
- `tests/integration/test_pipeline.py`
- `tests/integration/test_idempotency.py`
- `tests/integration/test_versioning.py`
- `tests/integration/test_api.py`

**Key Validations**:
- **Idempotency**: Run pipeline twice with same data → no duplicates
- **Versioning**: Change content → version increments, policy_changes_log updated
- **API**: All endpoints return correct data with proper schemas

**Test Data**:
- Use fixtures from `/contracts/fixtures/seed_policies.json`
- Use test database (isolated from dev data)
- Use deterministic data (fixed seeds, frozen timestamps)

### 4. E2E Tests - Smoke Flow (Priority: CRITICAL)

**Location**: `/playwright/` or `/tests/e2e/`

**Setup**:
- Backend must be running on `http://localhost:8000`
- Frontend must be running on `http://localhost:3000`
- Database seeded with 12 policies
- API key: `1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d`

**Smoke Flow Test Checklist** (MUST PASS):

#### Test 1: Feed Filters
- [ ] Navigate to feed page (`http://localhost:3000`)
- [ ] Verify page loads with 12 policies displayed
- [ ] Apply region filter (EU) → verify results filtered
- [ ] Apply policy type filter (Disclosure) → verify results filtered
- [ ] Apply status filter (Adopted) → verify results filtered
- [ ] Apply scopes filter ([1, 2]) → verify results filtered
- [ ] Set impact_min slider → verify results filtered
- [ ] Set confidence_min slider → verify results filtered
- [ ] Set date range (effective_before, effective_after) → verify results filtered
- [ ] Clear all filters → verify all 12 policies shown again
- [ ] Verify active filter chips display correctly
- [ ] Click "Clear all" button → verify filters reset

#### Test 2: Search & Sort
- [ ] Enter search query "EU" → verify results filtered
- [ ] Verify search is debounced (300ms delay)
- [ ] Change sort to "effective" → verify results sorted by effective_date
- [ ] Change sort to "updated" → verify results sorted by last_updated_at
- [ ] Change sort order to "asc" → verify ascending order
- [ ] Change sort order to "desc" → verify descending order
- [ ] Default sort should be "impact" descending

#### Test 3: Open Drawer & Policy Detail
- [ ] Click on first policy in feed
- [ ] Verify drawer opens
- [ ] Verify correct policy data displays (not a different policy)
- [ ] Verify all fields display:
  - [ ] Title
  - [ ] Jurisdiction (EU, US-Federal, US-CA, UK)
  - [ ] Policy Type (Disclosure, Pricing, Ban, Incentive, Supply-chain)
  - [ ] Status (Proposed, Adopted, Effective)
  - [ ] Scopes ([1], [2], [3], or combinations)
  - [ ] Impact Score (0-100)
  - [ ] Confidence (0-1)
  - [ ] Effective Date (YYYY-MM-DD format)
  - [ ] Last Updated At (YYYY-MM-DD format)
  - [ ] Summary (full text)
  - [ ] What Might Change (text)
  - [ ] Source Name Official
  - [ ] Source Name Secondary
  - [ ] Impact Factors (JSON breakdown displayed)
  - [ ] Mandatory (true/false)
  - [ ] Sectors (array or null)
  - [ ] Version (integer)
  - [ ] History (array of changes)
- [ ] Close drawer → verify drawer closes
- [ ] Open different policy → verify correct data shows

#### Test 4: Save/Unsave Flow
- [ ] Open policy drawer
- [ ] Click save button
- [ ] Verify save button state updates (saved indicator appears)
- [ ] Verify optimistic UI update (immediate feedback)
- [ ] Navigate to Saved tab/page
- [ ] Verify saved policy appears
- [ ] Verify correct effective window grouping:
  - [ ] Policies effective ≤90 days in "<=90d" group
  - [ ] Policies effective 90-365 days in "90-365d" group
  - [ ] Policies effective >365 days in ">365d" group
- [ ] Click on saved policy → verify drawer opens with correct policy
- [ ] Click unsave in drawer → verify policy removed from Saved page
- [ ] Verify save state syncs between feed and detail views

#### Test 5: Digest Preview
- [ ] Navigate to digest preview section
- [ ] Generate digest preview
- [ ] Verify POST `/digest/preview` API call made
- [ ] Verify top 5 policies displayed
- [ ] Verify each item shows:
  - [ ] Title
  - [ ] Impact Score
  - [ ] "why_it_matters" text
  - [ ] source_name
- [ ] Verify results sorted by impact_score (highest first)
- [ ] Apply filters → generate digest → verify filtered top 5
- [ ] Verify "generated_at" timestamp displays

#### Test 6: States & Error Handling
- [ ] Verify loading states (skeletons/shimmers) display during fetch
- [ ] Verify empty states display when no results
- [ ] Stop backend server → verify error state displays with retry button
- [ ] Start backend server → click retry → verify data loads
- [ ] Verify error messages are user-friendly

#### Test 7: Pagination
- [ ] Set page_size to 5 → verify 5 items per page
- [ ] Navigate to page 2 → verify next 5 items
- [ ] Verify pagination controls work (next, previous, page numbers)
- [ ] Verify total count displays correctly

**Test Files to Create**:
- `playwright/smoke-flow.spec.ts` (complete smoke flow)
- `playwright/feed-filters.spec.ts`
- `playwright/policy-detail.spec.ts`
- `playwright/save-flow.spec.ts`
- `playwright/digest-preview.spec.ts`
- `playwright/error-handling.spec.ts`

### 5. Performance Tests (Priority: MEDIUM)

**Tasks**:
- [ ] Test list endpoint with 1000 items (p95 latency < 500ms)
- [ ] Test pagination performance
- [ ] Test search performance
- [ ] Test concurrent requests (load testing)
- [ ] Verify no N+1 query issues

**Test File**:
- `playwright/performance.spec.ts`

### 6. Security & Compliance Checks (Priority: CRITICAL)

**Tasks**:
- [ ] Verify no hardcoded secrets in code
- [ ] Verify all field names match `/dictionary.md`
- [ ] Verify all enum values match `/dictionary.md`
- [ ] Verify all route paths match `/dictionary.md`
- [ ] Verify `.env` and `.env.local` files are in `.gitignore`
- [ ] Check for any hardcoded API keys, passwords, tokens
- [ ] Verify API key authentication works correctly
- [ ] Test unauthorized access (missing/wrong API key)

**Script to Run**:
```bash
# Check for hardcoded secrets
grep -r "api.*key\|secret\|password\|token" --exclude-dir=node_modules --exclude-dir=venv --exclude-dir=.git --exclude="*.md" PolicyRadar-backend/ policy-radar-frontend/ | grep -v ".env" | grep -v "example"

# Should return NOTHING (or only acceptable test/example values)
```

### 7. Field Name Compliance (Priority: CRITICAL)

**Tasks**:
- [ ] Validate all API response field names against `/dictionary.md`
- [ ] Validate all enum values against `/dictionary.md`
- [ ] Test that frontend TypeScript interfaces match backend responses
- [ ] Verify no camelCase in API responses (must be snake_case)

**Test File**:
- `tests/contract/test_field_names.py` (validate all endpoints)

**Key Validations**:
- `impact_score` (not `impactScore`)
- `policy_type` (not `policyType`)
- `effective_date` (not `effectiveDate`)
- `source_name_official` (not `sourceNameOfficial`)
- Enums: `US-Federal` (not `US_Federal` or `USFederal`)
- Enums: `Supply-chain` (not `Supply_chain` or `SupplyChain`)

---

## Test Execution Order

1. **First**: Run contract tests (fastest, catches schema issues)
2. **Second**: Run golden tests (validates core logic)
3. **Third**: Run integration tests (validates database operations)
4. **Fourth**: Run E2E tests (requires both servers running)
5. **Fifth**: Run performance tests (after everything works)
6. **Last**: Run security/compliance checks (final verification)

---

## Prerequisites Before Testing

### Backend Server Running
```bash
cd PolicyRadar-backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Server Running
```bash
cd policy-radar-frontend
npm run dev
```

### Database Ready
- Database: `policyradar`
- Tables created: ✅ (5 tables exist)
- Policies seeded: ✅ (12 policies loaded)
- API key configured in both `.env` files

---

## Expected Test Results

### Must Pass (Critical):
- ✅ All contract tests pass
- ✅ All field names match dictionary.md
- ✅ All enum values match dictionary.md
- ✅ Smoke flow completes without errors
- ✅ No hardcoded secrets found

### Should Pass (High Priority):
- ✅ All golden tests pass
- ✅ Integration tests pass (idempotency, versioning)
- ✅ All E2E tests pass
- ✅ Performance tests meet thresholds

### Nice to Have (Medium Priority):
- ✅ Test coverage > 80%
- ✅ All edge cases covered
- ✅ Error handling validated

---

## Test Environment Setup

### Backend Test Database
- Use separate test database or SQLite for tests
- Or use testcontainers for isolated PostgreSQL
- Clean up after tests

### Frontend Test Mode
- Can use `NEXT_PUBLIC_USE_FIXTURES=true` for some tests
- But must test with real API for E2E tests

### API Authentication
- API key: `1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d`
- Must be in `X-API-Key` header for all API calls
- Test unauthorized access (401 errors)

---

## Reporting Requirements

After running all tests, provide:

1. **Test Summary**
   - Total tests run
   - Tests passed
   - Tests failed
   - Coverage percentage

2. **Contract Compliance Report**
   - All endpoints match OpenAPI spec: ✅/❌
   - All field names match dictionary.md: ✅/❌
   - All enum values match dictionary.md: ✅/❌

3. **Smoke Flow Results**
   - Feed filters: ✅/❌
   - Drawer opens: ✅/❌
   - Save/unsave: ✅/❌
   - Saved groups: ✅/❌
   - Digest preview: ✅/❌

4. **Issues Found**
   - List any failures
   - Priority (Critical/High/Medium)
   - Steps to reproduce

5. **Compliance Status**
   - Secrets check: ✅/❌
   - Field name compliance: ✅/❌
   - Visual changes: ✅/❌

---

## Critical Test Cases (Must Not Fail)

1. **API Contract**: All endpoints match OpenAPI spec
2. **Field Names**: All match `/dictionary.md` exactly
3. **Enum Values**: All match `/dictionary.md` exactly
4. **Smoke Flow**: Complete user journey works end-to-end
5. **Secrets**: No hardcoded secrets in code
6. **Idempotency**: Pipeline can run twice without duplicates
7. **Versioning**: Content changes trigger version increments

---

## Resources

- **OpenAPI Spec**: `/contracts/openapi.yml`
- **Dictionary**: `/dictionary.md`
- **Scoring Algorithm**: `/contracts/scoring.md`
- **Test Fixtures**: `/contracts/fixtures/seed_policies.json`
- **Setup Status**: `/SETUP_COMPLETE.md`

---

## Success Criteria

✅ **All Critical Tests Pass**
- Contract tests pass
- Field name compliance verified
- Smoke flow completes successfully
- No secrets found

✅ **Integration Works**
- Backend serves correct data
- Frontend displays correct data
- Save/unsave syncs correctly
- Filters and sorting work

✅ **Ready for Production**
- All tests passing
- Coverage meets threshold
- Performance acceptable
- Security checks passed

---

**Start testing and report back with comprehensive results!** 🧪

