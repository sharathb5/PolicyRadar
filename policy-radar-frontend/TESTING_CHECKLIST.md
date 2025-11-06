# Frontend Integration Testing Checklist

## Quick Start Testing

### 1. Setup Environment
```bash
cd policy-radar-frontend

# Create .env.local file (see ENV_SETUP.md)
# For fixtures mode:
echo "NEXT_PUBLIC_USE_FIXTURES=true" > .env.local

# For real API mode:
echo "NEXT_PUBLIC_USE_FIXTURES=false" > .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" >> .env.local
echo "NEXT_PUBLIC_API_KEY=your-api-key" >> .env.local

# Start dev server
npm run dev
```

### 2. Open Browser DevTools
- Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)
- Open **Network** tab to monitor API calls
- Open **Console** tab to check for errors

---

## CRITICAL: API Integration Tests

### ✅ Feed Page - Policy List Integration

**Test:** `GET /policies` endpoint

1. **Initial Load**
   - [ ] Feed page loads policies on mount
   - [ ] Network tab shows: `GET /policies` request
   - [ ] Request includes query params: `?sort=impact&order=desc&page=1&page_size=20`
   - [ ] Policies displayed in list
   - [ ] No console errors

2. **Search Functionality**
   - [ ] Type in search box
   - [ ] Wait 300ms (debounce)
   - [ ] Network tab shows new request with `?q=search-term`
   - [ ] Results filtered correctly
   - [ ] Search query appears in URL params

3. **Filter Integration**
   - [ ] Click "EU" region filter
   - [ ] Network tab shows `?region[]=EU` in request
   - [ ] Results filtered to EU policies only
   - [ ] Apply multiple filters (region + type + status)
   - [ ] Request includes all filter params correctly
   - [ ] Click "Clear all filters" button
   - [ ] All filters reset, new request sent with no filter params

4. **Sort Integration**
   - [ ] Change sort option (if UI has sort controls)
   - [ ] Network tab shows `?sort=effective&order=asc` (or selected values)
   - [ ] Results sorted correctly

5. **Pagination**
   - [ ] Navigate to next page (if UI has pagination)
   - [ ] Network tab shows `?page=2`
   - [ ] Correct page of results displayed

**Expected API Call Format:**
```
GET /api/policies?sort=impact&order=desc&page=1&page_size=20&region[]=EU&policy_type[]=Disclosure
```

---

### ✅ Policy Detail Drawer Integration

**Test:** `GET /policies/{id}` endpoint

1. **Open Drawer**
   - [ ] Click on a policy in the list
   - [ ] Drawer opens from right side
   - [ ] Network tab shows: `GET /policies/{id}` request
   - [ ] Drawer shows loading skeleton initially

2. **Data Display**
   - [ ] Policy title displayed
   - [ ] Jurisdiction badge shown
   - [ ] Status badge shown
   - [ ] Impact score displayed
   - [ ] Confidence pill displayed
   - [ ] Summary text displayed
   - [ ] Impact factors breakdown shown (5 factors)
   - [ ] Scopes displayed as chips
   - [ ] Effective date shown
   - [ ] Source citations displayed (official + secondary if present)
   - [ ] Version number displayed
   - [ ] History entries displayed (if available)
   - [ ] Sectors displayed (if present)

3. **All Fields from API**
   - [ ] Verify all fields from `PolicyDetail` schema are displayed:
     - ✅ id, title, jurisdiction, policy_type, status
     - ✅ scopes, impact_score, confidence
     - ✅ effective_date, last_updated_at
     - ✅ source_name_official, source_name_secondary
     - ✅ what_might_change
     - ✅ summary (full text)
     - ✅ impact_factors (breakdown)
     - ✅ mandatory (boolean)
     - ✅ sectors (array)
     - ✅ version (number)
     - ✅ history (array)

4. **Error Handling**
   - [ ] Close drawer
   - [ ] Try to open policy with invalid ID (if possible)
   - [ ] Error message displayed
   - [ ] Retry button works

**Expected API Call:**
```
GET /api/policies/1
```

---

### ✅ Save/Unsave Integration

**Test:** `POST /saved/{policy_id}` endpoint

1. **Save from Feed**
   - [ ] Click save/bookmark icon on policy row
   - [ ] Network tab shows: `POST /saved/{policy_id}`
   - [ ] Request body: `{}` (empty, toggle endpoint)
   - [ ] Response: `{ "saved": true }`
   - [ ] UI updates immediately (optimistic update)
   - [ ] Icon changes to "saved" state

2. **Save from Drawer**
   - [ ] Open policy drawer
   - [ ] Click "Save" button at bottom
   - [ ] Network tab shows: `POST /saved/{policy_id}`
   - [ ] Button shows "Saving..." while pending
   - [ ] Button updates to show saved state
   - [ ] Drawer doesn't close

3. **Unsave**
   - [ ] Click save icon again on saved policy
   - [ ] Network tab shows: `POST /saved/{policy_id}`
   - [ ] Response: `{ "saved": false }`
   - [ ] UI updates immediately
   - [ ] Icon returns to unsaved state

4. **Error Handling**
   - [ ] Simulate network error (network tab: right-click → Block request domain)
   - [ ] Try to save
   - [ ] Error state shown
   - [ ] UI rolls back optimistic update
   - [ ] Retry works after unblocking

**Expected API Call:**
```
POST /api/saved/1
Response: { "saved": true }
```

---

### ✅ Saved Page Integration

**Test:** `GET /saved` endpoint

1. **Load Saved Page**
   - [ ] Navigate to "Saved" tab/page
   - [ ] Network tab shows: `GET /saved` request
   - [ ] Loading skeleton displayed initially

2. **Grouped Display**
   - [ ] Policies grouped by effective window:
     - ✅ `<=90d` section shows policies effective within 90 days
     - ✅ `90-365d` section shows policies effective 90-365 days
     - ✅ `>365d` section shows policies effective beyond 365 days
   - [ ] Each section shows count
   - [ ] Each section shows policy cards

3. **Empty State**
   - [ ] With no saved policies, empty message shown
   - [ ] Message: "No saved policies"

4. **Error Handling**
   - [ ] Simulate API error
   - [ ] Error message displayed
   - [ ] Retry button works

**Expected API Response:**
```json
{
  "<=90d": {
    "window": "<=90d",
    "count": 2,
    "policies": [...]
  },
  "90-365d": {
    "window": "90-365d",
    "count": 1,
    "policies": [...]
  },
  ">365d": {
    "window": ">365d",
    "count": 0,
    "policies": []
  }
}
```

---

### ✅ Digest Preview Integration

**Test:** `POST /digest/preview` endpoint

1. **Load Digest**
   - [ ] Navigate to Saved page
   - [ ] Scroll to "Digest Preview" section
   - [ ] Network tab shows: `POST /digest/preview`
   - [ ] Request body: `{}` (or filter object if filters applied)

2. **Display Top 5**
   - [ ] Top 5 policies displayed
   - [ ] Each item shows:
     - ✅ Title
     - ✅ Impact score (`score` field)
     - ✅ "Why it matters" text (`why_it_matters` field)
     - ✅ Source name (`source_name` field)

3. **Error Handling**
   - [ ] Simulate API error
   - [ ] Error message displayed
   - [ ] Retry button works

**Expected API Call:**
```
POST /api/digest/preview
Body: {} (or filters object)
Response: {
  "top5": [
    {
      "id": 1,
      "title": "...",
      "score": 85,
      "why_it_matters": "...",
      "source_name": "..."
    },
    ...
  ],
  "generated_at": "2025-01-XX..."
}
```

---

## HIGH: Visual Compliance Checks

### ✅ No Styling Changes

**Visual Verification:**
- [ ] Colors match original design
- [ ] Spacing/tokens unchanged
- [ ] Layout structure unchanged
- [ ] Component styling unchanged
- [ ] No unexpected visual regressions

**How to Check:**
1. Take screenshot of original design
2. Compare with current implementation
3. Check DevTools → Elements → Computed styles
4. Verify CSS classes match original

---

## MEDIUM: Performance & UX

### ✅ Loading States

1. **Feed Page**
   - [ ] Skeleton loaders shown during initial fetch
   - [ ] Skeleton matches content layout
   - [ ] Smooth transition to content

2. **Drawer**
   - [ ] Skeleton shown when opening drawer
   - [ ] Content appears after data loads
   - [ ] No layout shift

3. **Saved Page**
   - [ ] Skeleton shown during fetch
   - [ ] Sections load progressively

### ✅ Error States

1. **Feed Page**
   - [ ] Error message displayed on API failure
   - [ ] Retry button visible and functional
   - [ ] Error message user-friendly

2. **Drawer**
   - [ ] Error message displayed on fetch failure
   - [ ] Retry button works
   - [ ] Close button still works

3. **Saved Page**
   - [ ] Error message displayed
   - [ ] Retry button functional

### ✅ Empty States

1. **Feed Page**
   - [ ] "No policies found" message when filters return empty
   - [ ] "Try adjusting your filters" helper text

2. **Saved Page**
   - [ ] "No saved policies" message when empty
   - [ ] Helpful guidance text

---

## NICE TO HAVE: E2E Tests (Playwright)

### Setup Playwright Tests

```bash
cd policy-radar-frontend
npm install -D @playwright/test
npx playwright install
```

### Create Test File

**Location:** `playwright/policy-feed.spec.ts`

**Test Scenarios:**
1. Feed page loads policies
2. Filters work correctly
3. Search debounces
4. Drawer opens with correct policy
5. Save/unsave toggles work
6. Saved page shows grouped policies
7. Digest preview displays

---

## Continuous Testing Workflow

### After Every Change:

1. **Type Check**
   ```bash
   npm run type-check
   ```

2. **Lint**
   ```bash
   npm run lint
   ```

3. **Start Dev Server**
   ```bash
   npm run dev
   ```

4. **Test in Browser**
   - Open http://localhost:3000
   - Check Network tab for API calls
   - Check Console for errors
   - Test all functionality manually

5. **Verify API Integration**
   - All API calls match OpenAPI spec
   - All query params formatted correctly
   - All headers included (X-API-Key)
   - Response handling works

---

## Debugging Tips

### Network Tab Debugging

1. **Check Request URL**
   - Verify base URL correct
   - Verify endpoint path correct
   - Verify query params formatted correctly

2. **Check Request Headers**
   - `Content-Type: application/json` present
   - `X-API-Key` header present (if not using fixtures)

3. **Check Response**
   - Status code (200, 400, 401, 404, etc.)
   - Response body structure matches schema
   - Error messages if status != 200

### Console Debugging

1. **Check for Errors**
   - Red error messages
   - React Query errors
   - Network errors

2. **Check for Warnings**
   - Deprecation warnings
   - React warnings
   - Console warnings

### React Query DevTools (Optional)

Install React Query DevTools for better debugging:
```bash
npm install @tanstack/react-query-devtools
```

---

## Test Results Template

### Test Session: [Date/Time]

#### API Integration
- Feed Page: ✅ / ❌
- Drawer: ✅ / ❌
- Save/Unsave: ✅ / ❌
- Saved Page: ✅ / ❌
- Digest Preview: ✅ / ❌

#### Visual Compliance
- No Styling Changes: ✅ / ❌

#### Performance
- Loading States: ✅ / ❌
- Error States: ✅ / ❌
- Empty States: ✅ / ❌

#### Issues Found:
1. [Issue description]
   - Severity: Critical / High / Medium
   - Status: Fixed / Pending

---

## Success Criteria

✅ All API calls work correctly
✅ All filters map to query params
✅ All states handled (loading, error, empty)
✅ Visual design unchanged
✅ No console errors
✅ No TypeScript errors
✅ Performance acceptable (caching, debouncing)
✅ Feature flag works (fixtures vs API)

