# Frontend Integration Agent - Development & Testing Prompt

**Last Updated**: 2025-01-XX  
**Current Status**: ⏳ Waiting (API Contract Fix in progress)  
**Overall Progress**: 28% (27/96 tests)  
**Next Milestone**: 36% (after API Contract Fix)

## 📋 Quick Reference
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`
- **Status Tracker**: `AGENT_STATUS_TRACKER.md`
- **Quick Dashboard**: `QUICK_STATUS_DASHBOARD.md`
- **Test Report**: `FINAL_TEST_REPORT.md`

## 🎯 Your Mission

Ensure frontend integration works perfectly with backend API, test all API integrations, and verify no visual changes were made.

**Current Priority**: Add Missing Data-TestId Attributes (🔴 CRITICAL - BLOCKING E2E TESTS)

**Current Status**: 
- ✅ Frontend server running (accessible at localhost:3000)
- ⏳ E2E tests: 0/30 pending (need Playwright setup)
- ⏳ Smoke flow: Not yet executed
- ✅ No visual changes detected (monitoring active)

---

## 🔴 CRITICAL: Test-First Integration

**YOU MUST**: Test API integrations immediately after each change. Verify backend integration works before moving to next feature.

### Development Workflow

1. **Test backend endpoint first** (verify it works)
2. **Implement frontend integration** (wire up API call)
3. **Test immediately** (verify data displays correctly)
4. **Run Playwright tests** (verify E2E works)
5. **Check visual** (ensure no styling changes)
6. **Commit with test** (include test in same commit)

### Test Commands (Run After Each Change)

```bash
cd policy-radar-frontend

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run Playwright tests (when set up)
npx playwright test

# Run specific test
npx playwright test policy-feed.spec.ts
```

---

## 🚨 Priority 1: Add Missing Data-TestId Attributes (CRITICAL - BLOCKING)

### Issue
**8 E2E tests are failing because frontend components are missing `data-testid` attributes.**

**Current Status**: 2/10 tests passing (20%)  
**Target**: 10/10 tests passing (100%)

### Task
- [ ] Review `FRONTEND_DATA_TESTID_FIX.md` for complete guide
- [ ] Update `filter-toggle.tsx` to accept `data-testid` prop
- [ ] Add missing test IDs to `policy-filters.tsx`:
  - All region filter toggles (US-Federal, US-CA, UK, OTHER)
  - All policy type filter toggles (Pricing, Ban, Incentive, Supply-chain)
  - All status filter toggles (Proposed, Adopted, Effective)
  - All scope filter toggles (1, 2, 3)
  - Filter region container
- [ ] Add `data-testid="impact-score"` to `policy-row.tsx`
- [ ] Create/find sort and order select components
- [ ] Add `data-testid="sort-select"` and `data-testid="order-select"`
- [ ] Add active filter chips test IDs
- [ ] Run tests: `npx playwright test policy-feed.spec.ts`
- [ ] Verify: 10/10 tests passing ✅
- [ ] **🚀 PUSH CODE** when complete

**Reference**: `FRONTEND_DATA_TESTID_FIX.md` has detailed code examples

**Expected Result**: All 10 policy-feed tests pass ✅

---

## 🚨 Priority 2: Verify All API Integrations (HIGH)

### Task
- [ ] Test each API endpoint integration:
  - [ ] `GET /api/policies` (feed page)
  - [ ] `GET /api/policies/{id}` (drawer)
  - [ ] `POST /api/saved/{id}` (save/unsave)
  - [ ] `GET /api/saved` (saved page)
  - [ ] `POST /api/digest/preview` (digest)
- [ ] Verify API key passed correctly: `X-API-Key` header
- [ ] Verify error handling (network errors, 401, 404, 500)
- [ ] Test loading states display correctly
- [ ] Test empty states display correctly

### Test-While-Developing

**Step 1**: Check if backend is running
```bash
curl http://localhost:8000/api/healthz \
  -H "X-API-Key: 1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d"
```

**Step 2**: Test API client configuration
```typescript
// lib/api-client.ts - Verify API key is set
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
console.log('API Key configured:', API_KEY ? 'YES' : 'NO');
```

**Step 3**: Test each endpoint in browser console
```javascript
// Open browser dev tools console
// Test GET /api/policies
fetch('http://localhost:8000/api/policies', {
  headers: {
    'X-API-Key': '1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d'
  }
}).then(r => r.json()).then(console.log);
```

**Step 4**: Verify data displays correctly
- [ ] Open feed page → Check network tab → Verify request sent
- [ ] Verify data renders correctly
- [ ] Check for TypeScript errors in console
- [ ] Verify no runtime errors

### Success Criteria
- ✅ All API endpoints integrated correctly
- ✅ API key passed in all requests
- ✅ Error handling works (shows user-friendly messages)
- ✅ Loading states display correctly
- ✅ Empty states display correctly

---

## 🟠 Priority 2: Test Feed Page Integration (HIGH)

### Task
- [ ] Verify `GET /api/policies` integration:
  - [ ] Filters map to query parameters correctly
  - [ ] Sorting works (sort, order params)
  - [ ] Pagination works (page, page_size params)
  - [ ] Search debouncing works (300ms delay)
  - [ ] All filters work together
- [ ] Test error states (network error, 401, 500)
- [ ] Test loading state (shimmer/skeleton)
- [ ] Test empty state (no results)

### Test-While-Developing

**Step 1**: Check API client in `lib/services/policies.ts`
```typescript
// Verify query parameters are correct
const params = {
  region: filters.region,
  policy_type: filters.policy_type,
  status: filters.status,
  scopes: filters.scopes?.join(','),
  impact_min: filters.impact_min,
  confidence_min: filters.confidence_min,
  effective_before: filters.effective_before,
  effective_after: filters.effective_after,
  search: debouncedSearch,
  sort: sortBy,
  order: sortOrder,
  page: currentPage,
  page_size: pageSize
};
```

**Step 2**: Test in browser
1. Open `http://localhost:3000`
2. Open Network tab in DevTools
3. Apply filter (e.g., region: EU)
4. Verify request: `GET /api/policies?region=EU&...`
5. Verify response data renders correctly

**Step 3**: Test all filters
- [ ] Apply each filter individually → Verify works
- [ ] Apply multiple filters → Verify works together
- [ ] Clear all filters → Verify all 12 policies show

**Step 4**: Test sorting
- [ ] Change sort to "impact" → Verify sorted
- [ ] Change order to "asc" → Verify ascending
- [ ] Change order to "desc" → Verify descending

**Step 5**: Test search
- [ ] Type search query → Verify debounced (300ms delay)
- [ ] Verify request includes `search` parameter
- [ ] Verify results filtered correctly

**Step 6**: Test pagination
- [ ] Change page size → Verify correct number of items
- [ ] Navigate to page 2 → Verify next items show
- [ ] Verify total count displays correctly

### Success Criteria
- ✅ All filters work and map to correct query params
- ✅ Sorting works (sort, order params)
- ✅ Pagination works (page, page_size params)
- ✅ Search debouncing works (300ms)
- ✅ Loading/empty/error states display correctly

---

## 🟠 Priority 3: Test Drawer Integration (HIGH)

### Task
- [ ] Verify `GET /api/policies/{id}` integration:
  - [ ] Drawer opens on policy click
  - [ ] Correct policy data displays (not wrong policy)
  - [ ] All fields display correctly:
    - [ ] Title, jurisdiction, policy_type, status, scopes
    - [ ] Impact score, confidence
    - [ ] Summary, what_might_change
    - [ ] Source names, sectors
    - [ ] Impact factors breakdown
    - [ ] Version, history
- [ ] Test error states (404, network error)
- [ ] Test loading state

### Test-While-Developing

**Step 1**: Verify drawer opens
1. Click on first policy in feed
2. Verify drawer opens
3. Check Network tab → Verify `GET /api/policies/{id}` request
4. Verify response data matches displayed data

**Step 2**: Verify all fields display
- [ ] Check each field displays correctly
- [ ] Verify field names match API response (snake_case)
- [ ] Verify enum values display correctly (e.g., "US-Federal" not "US_Federal")
- [ ] Verify dates formatted correctly (YYYY-MM-DD)
- [ ] Verify impact factors JSON displays correctly

**Step 3**: Test with different policies
- [ ] Click on different policies → Verify correct data shows
- [ ] Verify no data mixing between policies

**Step 4**: Test error handling
- [ ] Stop backend server → Click policy → Verify error message displays
- [ ] Start backend server → Click retry → Verify drawer loads

### Success Criteria
- ✅ Drawer opens with correct policy data
- ✅ All fields display correctly
- ✅ Field names match API response (snake_case)
- ✅ Error handling works (shows user-friendly message)
- ✅ Loading state displays correctly

---

## 🟡 Priority 4: Test Save/Unsave Integration (MEDIUM)

### Task
- [ ] Verify `POST /api/saved/{id}` integration:
  - [ ] Save button toggles state correctly
  - [ ] Optimistic UI update works (immediate feedback)
  - [ ] API call made with correct policy ID
  - [ ] Error handling works (if save fails)
- [ ] Verify `GET /api/saved` integration:
  - [ ] Saved policies display correctly
  - [ ] Grouping works (<=90d, 90-365d, >365d)
  - [ ] Unsave removes policy from saved page

### Test-While-Developing

**Step 1**: Test save functionality
1. Open policy drawer
2. Click save button
3. Check Network tab → Verify `POST /api/saved/{id}` request
4. Verify save button state updates immediately (optimistic UI)
5. Verify saved indicator displays

**Step 2**: Test saved page
1. Navigate to Saved tab/page
2. Check Network tab → Verify `GET /api/saved` request
3. Verify saved policy appears
4. Verify grouping by effective window:
   - Policies effective ≤90 days → "<=90d" group
   - Policies effective 90-365 days → "90-365d" group
   - Policies effective >365 days → ">365d" group

**Step 3**: Test unsave functionality
1. Click on saved policy → Opens drawer
2. Click unsave button
3. Check Network tab → Verify `POST /api/saved/{id}` request (delete)
4. Verify policy removed from Saved page
5. Verify save state syncs between feed and detail views

**Step 4**: Test error handling
- [ ] Stop backend server → Click save → Verify error message
- [ ] Start backend server → Click retry → Verify save works

### Success Criteria
- ✅ Save/unsave works correctly
- ✅ Optimistic UI update works (immediate feedback)
- ✅ Saved page displays correctly with grouping
- ✅ Save state syncs between views
- ✅ Error handling works

---

## 🟡 Priority 5: Test Digest Preview Integration (MEDIUM)

### Task
- [ ] Verify `POST /api/digest/preview` integration:
  - [ ] Digest preview generates correctly
  - [ ] Top 5 policies display (by impact_score)
  - [ ] Each item shows: title, score, why_it_matters, source_name
  - [ ] Filters applied to digest preview
- [ ] Test error handling
- [ ] Test loading state

### Test-While-Developing

**Step 1**: Test digest generation
1. Navigate to digest section
2. Click "Generate Digest" or similar
3. Check Network tab → Verify `POST /api/digest/preview` request
4. Verify request body includes filters (if any)
5. Verify response contains top 5 policies

**Step 2**: Verify digest display
- [ ] Verify top 5 policies display
- [ ] Verify sorted by impact_score (highest first)
- [ ] Verify each item shows:
  - [ ] Title
  - [ ] Impact score
  - [ ] "why_it_matters" text
  - [ ] source_name
- [ ] Verify "generated_at" timestamp displays

**Step 3**: Test with filters
1. Apply filters (e.g., region: EU)
2. Generate digest
3. Verify request includes filters
4. Verify filtered top 5 policies display

**Step 4**: Test error handling
- [ ] Stop backend server → Generate digest → Verify error message
- [ ] Start backend server → Click retry → Verify digest generates

### Success Criteria
- ✅ Digest preview generates correctly
- ✅ Top 5 policies display (sorted by impact_score)
- ✅ All fields display correctly
- ✅ Filters applied correctly
- ✅ Error handling works

---

## 🟢 Priority 6: Set Up Playwright for E2E Tests (NICE TO HAVE)

### Task
- [ ] Install Playwright: `pnpm exec playwright install --with-deps`
- [ ] Verify Playwright config: `playwright.config.ts`
- [ ] Run existing Playwright tests: `npx playwright test`
- [ ] Fix any test failures
- [ ] Add new tests for missing coverage

### Test-While-Developing

**Step 1**: Install Playwright
```bash
cd policy-radar-frontend
pnpm exec playwright install --with-deps
```

**Step 2**: Run Playwright tests
```bash
# Start backend server first (Terminal 1)
cd PolicyRadar-backend
source venv/bin/activate
uvicorn app.main:app --reload

# Start frontend server (Terminal 2)
cd policy-radar-frontend
npm run dev

# Run Playwright tests (Terminal 3)
cd "/Users/sharath/Policy Radar"
npx playwright test
```

**Step 3**: Fix test failures
- [ ] Run tests: `npx playwright test`
- [ ] Review failures
- [ ] Fix issues (API integration, selectors, timing)
- [ ] Re-run tests until all pass

### Success Criteria
- ✅ Playwright installed and configured
- ✅ All 30 E2E tests pass
- ✅ Smoke flow test passes
- ✅ Tests run reliably (no flakiness)

---

## 📋 Development Checklist

### Before Starting Each Task
- [ ] Verify backend is running: `curl http://localhost:8000/api/healthz`
- [ ] Check frontend is running: Open `http://localhost:3000`
- [ ] Open browser DevTools (Network tab, Console tab)

### During Development
- [ ] Test API integration immediately after each change
- [ ] Check Network tab → Verify requests sent correctly
- [ ] Check Console tab → Verify no errors
- [ ] Verify data displays correctly
- [ ] Test error states (stop backend, verify error handling)
- [ ] Test loading states (check skeletons/shimmer)
- [ ] Test empty states (no data scenarios)

### After Each Task
- [ ] All API integrations work correctly
- [ ] No TypeScript errors
- [ ] No runtime errors in console
- [ ] No visual changes (compare with original design)
- [ ] Run Playwright tests (when available)
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
# 1. Type checking
cd policy-radar-frontend
npm run type-check
# Expected: No errors

# 2. Linting
npm run lint
# Expected: No errors (or only acceptable warnings)

# 3. Manual testing
# Open http://localhost:3000
# Test each feature:
#   - Feed filters work
#   - Drawer opens correctly
#   - Save/unsave works
#   - Saved page displays correctly
#   - Digest preview works

# 4. Playwright tests (when set up)
npx playwright test
# Expected: All 30 tests pass

# 5. Smoke flow (manual or automated)
# Complete full user journey end-to-end
# Expected: All steps pass
```

---

## 🚨 Critical Reminders

### NO VISUAL CHANGES
- ❌ **NO** styling changes, layout changes, visual redesigns
- ✅ **YES** test that existing components still look the same
- ✅ Compare before/after screenshots if needed

### FIELD NAME COMPLIANCE
- ✅ All field names must match API response (snake_case)
- ✅ All enum values must match API response exactly
- ✅ Verify TypeScript interfaces match OpenAPI spec
- ✅ Check `/dictionary.md` for conventions

### API KEY
- ✅ API key must be in `.env.local`: `NEXT_PUBLIC_API_KEY`
- ✅ API key must be passed in `X-API-Key` header for all requests
- ✅ Verify API key matches backend `.env` file

### TEST WHILE DEVELOPING
- ✅ Test immediately after each change
- ✅ Check Network tab → Verify requests sent
- ✅ Check Console tab → Verify no errors
- ✅ Test error states, loading states, empty states

---

## 📊 Expected Progress

### After Priority 1 (API Integrations Verified)
- ✅ All API endpoints integrated correctly
- ✅ API key passed correctly
- ✅ Error handling works

### After Priority 2 (Feed Page)
- ✅ Feed filters work correctly
- ✅ Sorting works
- ✅ Pagination works
- ✅ Search debouncing works

### After Priority 3 (Drawer)
- ✅ Drawer opens correctly
- ✅ All fields display correctly
- ✅ Error handling works

### After Priority 4 (Save/Unsave)
- ✅ Save/unsave works
- ✅ Saved page displays correctly
- ✅ Grouping works

### After Priority 5 (Digest)
- ✅ Digest preview works
- ✅ Top 5 policies display correctly
- ✅ Filters applied correctly

### After Priority 6 (Playwright)
- ✅ All 30 E2E tests pass
- ✅ Smoke flow test passes
- ✅ Ready for production

---

## 🎯 Success Criteria

### Immediate (Today)
- ✅ All API integrations verified
- ✅ Feed page works correctly
- ✅ Drawer opens correctly

### Short Term (This Week)
- ✅ Save/unsave works
- ✅ Saved page displays correctly
- ✅ Digest preview works
- ✅ Playwright tests passing

### Final Goal
- ✅ All 30 E2E tests passing
- ✅ Smoke flow test passing
- ✅ No visual changes
- ✅ Ready for production

---

**Start with Priority 1, test immediately after each change, then move to Priority 2, 3, 4, 5, 6 in order.**

**Test in browser after EVERY change to ensure integration works!** 🧪✅

