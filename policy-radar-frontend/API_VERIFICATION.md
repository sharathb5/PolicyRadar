# API Integration Verification Guide

## Quick Verification Steps

### 1. Start Dev Server

```bash
cd policy-radar-frontend
npm run dev
```

### 2. Open Browser DevTools

1. Navigate to: http://localhost:3000
2. Press `F12` (or `Cmd+Option+I` on Mac)
3. Go to **Network** tab
4. Enable "Preserve log" checkbox
5. Filter by "Fetch/XHR"

### 3. Verify Each Endpoint

---

## Test 1: GET /policies (Feed Page)

### Steps:
1. **Open Feed Page**
   - Navigate to home page
   - Wait for policies to load

2. **Check Network Tab**
   - Look for request: `GET /policies?sort=impact&order=desc&page=1&page_size=20`
   - Click on the request to inspect

3. **Verify Request Headers**
   ```
   ✅ Content-Type: application/json
   ✅ X-API-Key: [your-api-key or empty if using fixtures]
   ```

4. **Verify Query Parameters**
   - `sort=impact` (or configured default)
   - `order=desc` (or configured default)
   - `page=1`
   - `page_size=20`

5. **Verify Response**
   - Status: `200 OK`
   - Response body structure:
     ```json
     {
       "items": [...],
       "total": 12,
       "page": 1,
       "page_size": 20
     }
     ```

### Expected Results:
- ✅ Request sent to correct URL
- ✅ Headers include `X-API-Key` (if not using fixtures)
- ✅ Query params formatted correctly
- ✅ Response status is 200
- ✅ Policies displayed in UI

---

## Test 2: GET /policies (With Filters)

### Steps:
1. **Apply Filters**
   - Click "EU" region filter
   - Click "Disclosure" policy type filter
   - Set impact slider to 70

2. **Check Network Tab**
   - Look for new request with filters
   - Request should include: `?region[]=EU&policy_type[]=Disclosure&impact_min=70&sort=impact&order=desc&page=1&page_size=20`

3. **Verify Array Parameters**
   - Array params use bracket notation: `region[]=EU`
   - Multiple values: `region[]=EU&region[]=UK` (if multiple selected)

4. **Verify Response**
   - Status: `200 OK`
   - Filtered results returned

### Expected Results:
- ✅ Filters mapped to query params correctly
- ✅ Array params formatted as `key[]=value`
- ✅ Results filtered correctly in UI

---

## Test 3: GET /policies (Search)

### Steps:
1. **Type in Search Box**
   - Type "EU" in search box
   - Wait 300ms (debounce delay)

2. **Check Network Tab**
   - Look for request: `GET /policies?q=EU&sort=impact&order=desc&page=1&page_size=20`
   - Verify only ONE request sent after debounce

3. **Verify Debouncing**
   - Type "E" → wait → type "U" → wait → type "R" → wait
   - Should see separate requests with `q=E`, `q=EU`, `q=EUR`
   - NOT multiple rapid requests

### Expected Results:
- ✅ Search query included as `q=...`
- ✅ Debounce works (300ms delay)
- ✅ No unnecessary requests

---

## Test 4: GET /policies/{id} (Policy Detail)

### Steps:
1. **Click on Policy**
   - Click any policy in the list
   - Drawer should open

2. **Check Network Tab**
   - Look for request: `GET /policies/1` (or selected ID)
   - Request sent when drawer opens

3. **Verify Request Headers**
   ```
   ✅ Content-Type: application/json
   ✅ X-API-Key: [your-api-key]
   ```

4. **Verify Response**
   - Status: `200 OK`
   - Response includes full `PolicyDetail`:
     ```json
     {
       "id": 1,
       "title": "...",
       "summary": "...",
       "impact_factors": {...},
       "mandatory": true,
       "sectors": [...],
       "version": 1,
       "history": [...],
       ...
     }
     ```

5. **Verify UI Display**
   - All fields displayed in drawer
   - Impact factors breakdown shown
   - Version and history displayed

### Expected Results:
- ✅ Request sent to `/policies/{id}`
- ✅ Headers include `X-API-Key`
- ✅ Full policy detail displayed
- ✅ All fields from schema shown

---

## Test 5: POST /saved/{policy_id} (Save Policy)

### Steps:
1. **Save from Feed**
   - Click bookmark icon on policy row
   - Check Network tab

2. **Verify Request**
   - Method: `POST`
   - URL: `/saved/1` (or selected ID)
   - Headers include `X-API-Key`
   - Request body: `{}` (empty, toggle endpoint)

3. **Verify Response**
   - Status: `200 OK`
   - Response: `{ "saved": true }`

4. **Verify UI Update**
   - Icon changes immediately (optimistic update)
   - No flicker or delay

5. **Unsave**
   - Click bookmark icon again
   - Verify request: `POST /saved/1`
   - Response: `{ "saved": false }`

### Expected Results:
- ✅ Request sent with POST method
- ✅ Headers include `X-API-Key`
- ✅ Response handled correctly
- ✅ UI updates optimistically

---

## Test 6: GET /saved (Saved Page)

### Steps:
1. **Navigate to Saved Page**
   - Click "Saved" tab or navigate to saved page
   - Wait for policies to load

2. **Check Network Tab**
   - Look for request: `GET /saved`
   - Headers include `X-API-Key`

3. **Verify Response**
   - Status: `200 OK`
   - Response structure:
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

4. **Verify UI Display**
   - Policies grouped by effective window
   - Each section shows count
   - Policies displayed correctly

### Expected Results:
- ✅ Request sent to `/saved`
- ✅ Headers include `X-API-Key`
- ✅ Response grouped by window
- ✅ UI displays groups correctly

---

## Test 7: POST /digest/preview (Digest Preview)

### Steps:
1. **Navigate to Saved Page**
   - Scroll to "Digest Preview" section

2. **Check Network Tab**
   - Look for request: `POST /digest/preview`
   - Method: `POST`
   - Headers include `X-API-Key`
   - Request body: `{}` (empty, or filters object)

3. **Verify Response**
   - Status: `200 OK`
   - Response structure:
     ```json
     {
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

4. **Verify UI Display**
   - Top 5 policies displayed
   - Each shows title, score, why_it_matters, source_name

### Expected Results:
- ✅ Request sent with POST method
- ✅ Headers include `X-API-Key`
- ✅ Top 5 displayed correctly
- ✅ All fields shown

---

## API Key Verification

### Test 1: API Key in Headers

**Steps:**
1. Open Network tab
2. Click on any API request
3. Go to "Headers" tab
4. Scroll to "Request Headers"
5. Look for `X-API-Key`

**Expected:**
- ✅ `X-API-Key` header present (when not using fixtures)
- ✅ Value matches `NEXT_PUBLIC_API_KEY` from `.env.local`

### Test 2: Without API Key

**Steps:**
1. Set `NEXT_PUBLIC_API_KEY=` (empty) in `.env.local`
2. Restart dev server
3. Make API request
4. Check if `X-API-Key` header is omitted (when empty)

**Expected:**
- ✅ Header omitted when value is empty
- ✅ Request still works (if API allows unauthenticated access)

### Test 3: Fixtures Mode (No API Key Needed)

**Steps:**
1. Set `NEXT_PUBLIC_USE_FIXTURES=true` in `.env.local`
2. Restart dev server
3. Make requests
4. Verify NO network requests sent (uses fixtures instead)

**Expected:**
- ✅ No network requests to API
- ✅ Data loaded from fixtures
- ✅ No API key needed

---

## Error Handling Verification

### Test 1: 401 Unauthorized

**Steps:**
1. Set invalid API key: `NEXT_PUBLIC_API_KEY=invalid-key`
2. Restart dev server
3. Try to load policies
4. Check Network tab for 401 response

**Expected:**
- ✅ Request sent with invalid key
- ✅ Response status: `401 Unauthorized`
- ✅ Error message displayed in UI
- ✅ Retry button works

### Test 2: 404 Not Found

**Steps:**
1. Try to open policy with invalid ID (e.g., ID 99999)
2. Check Network tab for 404 response

**Expected:**
- ✅ Request sent: `GET /policies/99999`
- ✅ Response status: `404 Not Found`
- ✅ Error message displayed in drawer
- ✅ Retry button works

### Test 3: Network Error

**Steps:**
1. In DevTools → Network tab → right-click → Block request domain
2. Try to load policies
3. Verify error handling

**Expected:**
- ✅ Network error caught
- ✅ Error message displayed
- ✅ Retry button works
- ✅ No app crash

---

## Checklist Summary

### API Integration Checklist:

- [ ] **GET /policies** - Feed page loads
- [ ] **GET /policies** - Filters work
- [ ] **GET /policies** - Search works (debounced)
- [ ] **GET /policies/{id}** - Drawer opens with detail
- [ ] **POST /saved/{id}** - Save works
- [ ] **POST /saved/{id}** - Unsave works
- [ ] **GET /saved** - Saved page loads
- [ ] **POST /digest/preview** - Digest preview loads
- [ ] **X-API-Key header** - Present in all requests
- [ ] **Error handling** - 401, 404, network errors handled

### Verification Results:

```
Date: __________
Tester: __________

GET /policies: ✅ / ❌
GET /policies (with filters): ✅ / ❌
GET /policies (search): ✅ / ❌
GET /policies/{id}: ✅ / ❌
POST /saved/{id}: ✅ / ❌
GET /saved: ✅ / ❌
POST /digest/preview: ✅ / ❌
X-API-Key header: ✅ / ❌
Error handling: ✅ / ❌

Issues Found:
1. ________________________________
2. ________________________________
```

---

## Ready for E2E Testing ✅

Once all API integrations are verified, proceed to Playwright E2E tests.

