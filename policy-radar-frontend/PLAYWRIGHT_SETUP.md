# Playwright E2E Testing Setup

## Prerequisites

Playwright is already configured in the project. Just need to verify setup and run tests.

---

## Setup Verification

### 1. Check Playwright Installation

```bash
cd policy-radar-frontend
npm list @playwright/test
```

Should show `@playwright/test` version (already installed).

### 2. Install Playwright Browsers

```bash
npx playwright install
```

This installs Chromium, Firefox, and WebKit browsers.

---

## Configuration

Playwright config is at root: `/playwright.config.ts`

Key settings:
- **Test directory**: `./playwright`
- **Base URL**: `http://localhost:3000`
- **Auto-start dev server**: Yes (when running tests)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

---

## Running Tests

### Run All Tests

```bash
# From workspace root
npm test

# Or from frontend directory
cd policy-radar-frontend
npm run test
```

### Run Specific Test File

```bash
npx playwright test policy-feed.spec.ts
```

### Run Tests in UI Mode

```bash
npx playwright test --ui
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Tests for Specific Browser

```bash
npx playwright test --project=chromium
```

---

## Test Files

### 1. `policy-feed.spec.ts`
- ✅ Feed page loads policies
- ✅ Filters work correctly
- ✅ Search debounces
- ✅ Sort functionality
- ✅ Loading states
- ✅ Empty states
- ✅ Clear filters

### 2. `policy-detail.spec.ts`
- ✅ Drawer opens on policy click
- ✅ API called with correct ID
- ✅ All fields displayed
- ✅ Impact factors shown
- ✅ Drawer closes (button & backdrop)

### 3. `saved-items.spec.ts`
- ✅ Save policy from feed
- ✅ Save button state updates
- ✅ Navigate to saved page
- ✅ Saved item appears in correct window
- ✅ Unsave policy

### 4. `digest-preview.spec.ts`
- ✅ Digest preview loads
- ✅ Top 5 policies displayed
- ✅ All fields shown

### 5. `performance.spec.ts`
- ✅ Performance metrics
- ✅ Load time checks

---

## Test Environment Setup

### Environment Variables

Tests will use fixtures by default. To test with real API:

1. **Set environment variables** (before running tests):
   ```bash
   export NEXT_PUBLIC_USE_FIXTURES=false
   export NEXT_PUBLIC_API_URL=http://localhost:8000/api
   export NEXT_PUBLIC_API_KEY=your-api-key
   ```

2. **Or create `.env.local`** in `policy-radar-frontend`:
   ```env
   NEXT_PUBLIC_USE_FIXTURES=false
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_API_KEY=your-api-key
   ```

### Backend Server

If testing with real API, ensure backend is running:

```bash
# Start backend server
cd PolicyRadar-backend
# ... start backend
```

---

## Test Data Requirements

### Fixtures Mode (Default)

- Uses `/contracts/fixtures/seed_policies.json`
- No backend needed
- Fast tests
- Predictable data

### Real API Mode

- Requires backend running
- Requires valid API key
- Tests actual API integration
- May have data dependencies

---

## Test Results

### View HTML Report

After running tests:

```bash
npx playwright show-report
```

Opens HTML report with:
- Test results
- Screenshots (on failure)
- Traces (on failure)
- Network logs

### View Test Output

Tests output to terminal:
- ✅ Passed tests
- ❌ Failed tests
- ⏱️ Execution time
- 📊 Summary

---

## Debugging Failed Tests

### 1. Check Test Output

```bash
npx playwright test --reporter=list
```

Shows detailed output for each test.

### 2. View Screenshots

Failed tests automatically capture screenshots in `test-results/` directory.

### 3. View Traces

Traces are captured on first retry. View with:

```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### 4. Run in Debug Mode

```bash
npx playwright test --debug
```

Opens Playwright Inspector:
- Step through test
- Inspect page state
- View network requests
- Check console logs

### 5. Run Single Test

```bash
npx playwright test policy-feed.spec.ts -g "displays policy list"
```

---

## Common Issues

### Issue: Tests Timeout

**Solution:**
- Increase timeout in test: `test.setTimeout(30000)`
- Check if dev server is starting properly
- Verify network requests complete

### Issue: Element Not Found

**Solution:**
- Check `data-testid` attributes are present
- Verify element exists in component
- Wait for element: `await page.waitForSelector('[data-testid="..."]')`

### Issue: API Requests Fail

**Solution:**
- Check backend is running (if using real API)
- Verify API key is set correctly
- Check CORS configuration
- Review Network tab in debug mode

### Issue: Dev Server Not Starting

**Solution:**
- Check `playwright.config.ts` webServer config
- Verify `npm run dev` works manually
- Check port 3000 is available
- Increase timeout: `timeout: 120 * 1000`

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd policy-radar-frontend && npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Maintenance

### Adding New Tests

1. Create test file in `playwright/` directory
2. Follow existing test structure
3. Use `data-testid` attributes for selectors
4. Add to appropriate test file or create new one

### Updating Tests

1. Update selectors if components change
2. Update assertions if API responses change
3. Keep tests independent (no dependencies)

### Best Practices

- ✅ Use `data-testid` for selectors (not CSS classes)
- ✅ Wait for elements before interacting
- ✅ Verify API calls in tests
- ✅ Test both success and error cases
- ✅ Keep tests independent
- ✅ Use descriptive test names

---

## Test Coverage

### Current Coverage:

- ✅ Feed page (load, filters, search, sort)
- ✅ Policy detail drawer
- ✅ Save/unsave functionality
- ✅ Saved page
- ✅ Digest preview
- ⏳ Error states (needs enhancement)
- ⏳ Loading states (needs enhancement)
- ⏳ Empty states (needs enhancement)

---

## Next Steps

1. ✅ **Run tests**: `npm test`
2. ✅ **Review results**: Check HTML report
3. ✅ **Fix failures**: Debug and fix any failing tests
4. ✅ **Add coverage**: Add tests for missing scenarios
5. ✅ **CI Integration**: Set up continuous integration

---

## Ready to Test! 🚀

All Playwright tests are set up and ready to run. Use the commands above to execute tests.

