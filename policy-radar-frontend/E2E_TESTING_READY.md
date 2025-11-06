# E2E Testing - Ready ✅

## Status: Playwright Setup Complete

All Playwright E2E tests are configured and ready to run.

---

## Quick Start

### 1. Install Browsers (One-time)

```bash
cd policy-radar-frontend
npx playwright install
```

### 2. Run Tests

```bash
# From workspace root
npm test

# Or from frontend directory
cd policy-radar-frontend
npm run test
```

### 3. View Results

```bash
npx playwright show-report
```

---

## Test Coverage

### ✅ Policy Feed Tests (`policy-feed.spec.ts`)
- [x] Displays policy list
- [x] Filter flow - apply filters
- [x] Filter flow - clear filters
- [x] Sort flow - change sort option
- [x] Sort flow - change sort order
- [x] Sort flow - verify results order
- [x] Loading states - skeletons display
- [x] Empty states - no results message
- [x] Active filter chips display
- [x] Clear all button resets filters

### ✅ Policy Detail Tests (`policy-detail.spec.ts`)
- [x] Opens drawer when clicking policy
- [x] API called with correct policy ID
- [x] Displays all required fields
- [x] Displays impact factors breakdown
- [x] Closes drawer when clicking close
- [x] Closes drawer when clicking backdrop

### ✅ Saved Items Tests (`saved-items.spec.ts`)
- [x] Save policy from feed
- [x] Save button state updated
- [x] Navigate to saved page
- [x] Saved item appears in correct effective window
- [x] Unsave policy

### ✅ Digest Preview Tests (`digest-preview.spec.ts`)
- [x] Digest preview loads
- [x] Top 5 policies displayed
- [x] All fields shown

### ✅ Performance Tests (`performance.spec.ts`)
- [x] Performance metrics
- [x] Load time checks

---

## Test Data IDs Added

All components now have `data-testid` attributes for E2E testing:

### Policy Feed
- `policy-row` - Policy row element
- `policy-skeleton` - Loading skeleton
- `empty-state` - Empty state message
- `filter-region-EU` - Region filter toggle
- `filter-policy-type-Disclosure` - Policy type filter
- `clear-all-filters` - Clear filters button

### Policy Drawer
- `policy-drawer` - Drawer container
- `policy-title` - Policy title
- `policy-summary` - Policy summary
- `policy-impact-factors` - Impact factors section
- `impact-factor-mandatory` - Individual impact factor
- `policy-version` - Version number
- `policy-history` - History section
- `save-policy-button` - Save button
- `drawer-close` - Close button
- `drawer-backdrop` - Backdrop overlay

### Saved Page
- `saved-digest` - Saved digest container
- `saved-policy-card` - Saved policy card
- `saved-window-<=90d` - Window section

---

## Configuration

### Playwright Config (`playwright.config.ts`)

- **Test directory**: `./playwright`
- **Base URL**: `http://localhost:3000`
- **Auto-start dev server**: ✅ Yes
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Screenshots**: On failure
- **Traces**: On first retry

### Environment Variables

Tests use fixtures by default. To test with real API:

```bash
export NEXT_PUBLIC_USE_FIXTURES=false
export NEXT_PUBLIC_API_URL=http://localhost:8000/api
export NEXT_PUBLIC_API_KEY=your-api-key
```

---

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test File
```bash
npx playwright test policy-feed.spec.ts
```

### UI Mode
```bash
npx playwright test --ui
```

### Debug Mode
```bash
npx playwright test --debug
```

### Specific Browser
```bash
npx playwright test --project=chromium
```

---

## Test Results

### View HTML Report
```bash
npx playwright show-report
```

### View Traces (on failure)
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

---

## Documentation

- **`PLAYWRIGHT_SETUP.md`** - Detailed setup and usage guide
- **`API_VERIFICATION.md`** - Manual API verification checklist
- **`TESTING_CHECKLIST.md`** - Comprehensive testing checklist
- **`TESTING_GUIDE.md`** - Step-by-step testing guide

---

## Ready for E2E Testing! 🚀

All tests are configured and ready to run. Execute with:

```bash
npm test
```

