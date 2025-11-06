# Frontend Integration Testing Guide

## Quick Start Testing

### 1. Setup & Run

```bash
cd policy-radar-frontend

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_USE_FIXTURES=true
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_KEY=
EOF

# Install dependencies (if not already done)
npm install

# Type check
npm run type-check

# Start dev server
npm run dev
```

### 2. Open Browser

- Navigate to: http://localhost:3000
- Open DevTools (`F12` or `Cmd+Option+I`)
- Go to **Network** tab
- Go to **Console** tab

---

## Testing Workflow

### After Every Code Change:

1. ✅ **Type Check**: `npm run type-check`
2. ✅ **Start Dev Server**: `npm run dev`
3. ✅ **Check Network Tab**: Verify API calls
4. ✅ **Check Console Tab**: Look for errors
5. ✅ **Test Functionality**: Manual testing

---

## Critical Tests

### Test 1: Feed Page Loads Policies

**Steps:**
1. Open http://localhost:3000
2. Check Network tab for `GET /policies` request
3. Verify policies displayed in list
4. Check Console for errors

**Expected:**
- ✅ Network request: `GET /policies?sort=impact&order=desc&page=1&page_size=20`
- ✅ Policies appear in list
- ✅ No console errors

---

### Test 2: Search Functionality

**Steps:**
1. Type in search box (e.g., "EU")
2. Wait 300ms (debounce delay)
3. Check Network tab for new request

**Expected:**
- ✅ Request includes `?q=EU`
- ✅ Results filtered to matching policies
- ✅ No unnecessary requests (debounced)

---

### Test 3: Filter Integration

**Steps:**
1. Click "EU" region filter
2. Check Network tab for new request
3. Verify results filtered

**Expected:**
- ✅ Request includes `?region[]=EU`
- ✅ Only EU policies displayed
- ✅ Filter toggle active

---

### Test 4: Policy Detail Drawer

**Steps:**
1. Click on a policy in the list
2. Check Network tab for `GET /policies/{id}` request
3. Verify drawer opens
4. Check all fields displayed

**Expected:**
- ✅ Request: `GET /policies/1`
- ✅ Drawer shows:
  - Title, jurisdiction, status
  - Impact score, confidence
  - Summary, what_might_change
  - Impact factors breakdown
  - Scopes, sectors (if present)
  - Source citations
  - Version, history

---

### Test 5: Save/Unsave

**Steps:**
1. Click save icon on policy row
2. Check Network tab for `POST /saved/{id}` request
3. Verify UI updates immediately
4. Click again to unsave

**Expected:**
- ✅ Request: `POST /saved/1`
- ✅ Response: `{ "saved": true }`
- ✅ UI updates optimistically
- ✅ Unsave works correctly

---

### Test 6: Saved Page

**Steps:**
1. Navigate to "Saved" tab
2. Check Network tab for `GET /saved` request
3. Verify policies grouped by effective window

**Expected:**
- ✅ Request: `GET /saved`
- ✅ Response includes `<=90d`, `90-365d`, `>365d` groups
- ✅ Each group shows count and policies
- ✅ Policies correctly grouped

---

### Test 7: Digest Preview

**Steps:**
1. Navigate to Saved page
2. Scroll to Digest Preview section
3. Check Network tab for `POST /digest/preview` request

**Expected:**
- ✅ Request: `POST /digest/preview`
- ✅ Response includes `top5` array
- ✅ Each item shows title, score, why_it_matters, source_name

---

## Visual Compliance Check

### Quick Visual Check

1. **Take Screenshot** of current page
2. **Compare** with original design (if available)
3. **Verify:**
   - ✅ Colors match
   - ✅ Spacing unchanged
   - ✅ Layout unchanged
   - ✅ Components styled correctly

---

## Common Issues & Solutions

### Issue: TypeScript Errors

**Solution:**
```bash
npm run type-check
```

Fix any errors before continuing.

---

### Issue: API Calls Not Working

**Check:**
1. Network tab shows requests?
2. CORS errors in console?
3. API URL correct in `.env.local`?
4. API key set (if required)?

**Solution:**
- Verify `.env.local` settings
- Check API server running
- Verify CORS configuration

---

### Issue: Fixtures Not Loading

**Check:**
1. Fixture file exists at `/contracts/fixtures/seed_policies.json`?
2. `NEXT_PUBLIC_USE_FIXTURES=true` in `.env.local`?

**Solution:**
- Verify fixture path
- Check file exists
- Verify environment variable

---

### Issue: React Query Errors

**Check:**
1. Console for React Query errors
2. Network requests failing?

**Solution:**
- Verify API endpoint correct
- Check response format matches schema
- Verify error handling

---

## Network Tab Debugging

### Request Checklist

For each API call, verify:

1. **URL Correct**
   - Base URL: `http://localhost:8000/api` (or configured)
   - Endpoint path: `/policies`, `/policies/{id}`, etc.

2. **Method Correct**
   - `GET` for fetch operations
   - `POST` for mutations

3. **Headers Present**
   - `Content-Type: application/json`
   - `X-API-Key` (if not using fixtures)

4. **Query Params**
   - Arrays formatted as `region[]=EU&region[]=UK`
   - Values URL encoded
   - No undefined/null values

5. **Response Status**
   - `200` for success
   - `400` for bad request
   - `401` for unauthorized
   - `404` for not found
   - `500` for server error

---

## Console Tab Debugging

### Check For:

1. **Errors (Red)**
   - React errors
   - API errors
   - TypeScript errors

2. **Warnings (Yellow)**
   - Deprecation warnings
   - React warnings
   - Console warnings

3. **Network Errors**
   - CORS errors
   - Network failures
   - Timeout errors

---

## Manual Testing Checklist

Use this checklist for each feature:

### Feed Page
- [ ] Policies load on page load
- [ ] Search works and debounces
- [ ] Filters apply correctly
- [ ] Clear filters works
- [ ] Sorting works
- [ ] Loading state shows
- [ ] Error state shows with retry
- [ ] Empty state shows

### Drawer
- [ ] Opens on policy click
- [ ] Shows all fields
- [ ] Loading state shows
- [ ] Error state shows with retry
- [ ] Close button works
- [ ] Escape key closes

### Save/Unsave
- [ ] Save button toggles
- [ ] Optimistic update works
- [ ] Error handling works
- [ ] UI syncs between feed and drawer

### Saved Page
- [ ] Groups by effective window
- [ ] Shows correct counts
- [ ] Loading state shows
- [ ] Error state shows
- [ ] Empty state shows
- [ ] Digest preview loads

---

## Success Criteria

✅ All API integrations work
✅ All filters map correctly
✅ All states handled
✅ Visual design unchanged
✅ No console errors
✅ No TypeScript errors
✅ Performance acceptable

---

## Next Steps

1. ✅ Complete manual testing
2. ✅ Fix any issues found
3. ✅ Set up Playwright E2E tests (optional)
4. ✅ Document any limitations
5. ✅ Ready for production!

