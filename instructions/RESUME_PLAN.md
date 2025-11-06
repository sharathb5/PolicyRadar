# Resume Plan - Next Steps When Returning

## First Things First - Sequential Order

### 1. Re-enable Schedulers
- [ ] Check if any agents are running
- [ ] Review any scheduled jobs/tasks
- [ ] Re-enable monitoring schedules
- [ ] Verify compliance monitoring is active

### 2. Review PRs
- [ ] Check for any pending Pull Requests
- [ ] Review Backend Agent PRs (if any)
- [ ] Review Frontend Integration Agent PRs (if any)
- [ ] Review Testing & Assurance Agent PRs (if any)
- [ ] Verify compliance with contracts and dictionary.md
- [ ] Check for violations in COMPLIANCE_STATUS.md

### 3. Green-Light Agents (Sequential)
**Important**: Green-light agents ONE AT A TIME in this order:

#### Step 1: Backend Agent ✅
- [ ] Review backend implementation
- [ ] Verify all endpoints match OpenAPI spec
- [ ] Check for hardcoded secrets (see BACKEND_ADVISORY.md)
- [ ] Validate field names match dictionary.md exactly
- [ ] Check enum values match dictionary.md exactly
- [ ] Verify database models are correct
- [ ] **GREEN-LIGHT**: Approve backend agent to continue

#### Step 2: Testing & Assurance Agent ✅
- [ ] Review test implementations
- [ ] Verify contract tests validate OpenAPI spec
- [ ] Check golden tests for classification/scoring
- [ ] Verify E2E tests cover smoke flow
- [ ] Check test coverage meets threshold
- [ ] **GREEN-LIGHT**: Approve testing agent to continue

#### Step 3: Frontend Integration Agent ✅
- [ ] Review frontend API integration
- [ ] Verify no visual changes made
- [ ] Check API client implementation
- [ ] Verify TypeScript interfaces match OpenAPI
- [ ] Check feature flag for fixtures
- [ ] **GREEN-LIGHT**: Approve frontend agent to continue

---

## Smoke Flow Test Checklist

After green-lighting agents, run the complete smoke flow:

### Feed Filters Test
- [ ] Navigate to policy feed page
- [ ] Apply filter: Region (EU, US-Federal, etc.)
- [ ] Apply filter: Policy Type (Disclosure, Pricing, etc.)
- [ ] Apply filter: Status (Proposed, Adopted, Effective)
- [ ] Apply filter: Scopes (1, 2, 3)
- [ ] Apply filter: Impact Score (min threshold)
- [ ] Apply filter: Confidence (min threshold)
- [ ] Apply filter: Date Range (effective_before, effective_after)
- [ ] Verify filtered results display correctly
- [ ] Clear all filters
- [ ] Verify all results return

### Open Drawer Test
- [ ] Click on a policy in the feed
- [ ] Verify drawer opens
- [ ] Verify correct policy data displays
- [ ] Verify all fields show (title, jurisdiction, policy_type, status, scopes)
- [ ] Verify summary displays
- [ ] Verify impact_score displays
- [ ] Verify impact_factors breakdown displays
- [ ] Verify mandatory flag displays
- [ ] Verify sectors display (if applicable)
- [ ] Verify version number displays
- [ ] Verify history array displays (if available)
- [ ] Verify source_name_official displays
- [ ] Verify source_name_secondary displays
- [ ] Verify what_might_change displays
- [ ] Close drawer
- [ ] Verify drawer closes correctly

### Save Test
- [ ] Open policy drawer
- [ ] Click save button
- [ ] Verify save status toggles (optimistic UI update)
- [ ] Verify API call made to POST /saved/{policy_id}
- [ ] Verify saved indicator appears
- [ ] Close drawer
- [ ] Verify saved status persists in feed

### Saved Groups Test
- [ ] Navigate to Saved page
- [ ] Verify saved policy appears
- [ ] Verify policies grouped by effective window:
  - [ ] **<=90d**: Policies effective within 90 days
  - [ ] **90-365d**: Policies effective 90-365 days
  - [ ] **>365d**: Policies effective beyond 365 days
- [ ] Verify correct grouping logic
- [ ] Click on saved policy
- [ ] Verify drawer opens with correct policy
- [ ] Verify unsave functionality works
- [ ] Verify item removed from Saved page after unsave

### Digest Preview Test
- [ ] Navigate to digest preview section
- [ ] Generate digest preview (with or without filters)
- [ ] Verify API call made to POST /digest/preview
- [ ] Verify top 5 policies display
- [ ] Verify each item shows:
  - [ ] Title
  - [ ] Impact score
  - [ ] "why_it_matters" text
  - [ ] source_name
- [ ] Verify results sorted by impact_score (highest first)
- [ ] Apply filters to digest preview
- [ ] Verify filtered results show

---

## Post-Smoke Flow Checks

After running smoke flow:

### Verify Data Integrity
- [ ] All field names match dictionary.md
- [ ] All enum values match dictionary.md
- [ ] All API responses match OpenAPI spec
- [ ] Date formats are YYYY-MM-DD
- [ ] Impact scores are 0-100
- [ ] Confidence scores are 0-1

### Verify Compliance
- [ ] Check COMPLIANCE_STATUS.md for any violations
- [ ] Verify no hardcoded secrets found
- [ ] Verify no field name mismatches
- [ ] Verify no enum value mismatches
- [ ] Verify no visual changes made

### Verify Performance
- [ ] Feed page loads quickly
- [ ] Drawer opens quickly
- [ ] Filtering responds quickly
- [ ] Saved page loads quickly
- [ ] Digest preview generates quickly

---

## Troubleshooting Guide

If smoke flow fails:

1. **Feed Filters Not Working**:
   - Check API endpoint matches OpenAPI spec
   - Verify query parameters match dictionary.md
   - Check network tab for API calls
   - Verify filter state management

2. **Drawer Not Opening/Showing Wrong Data**:
   - Check API call to GET /policies/{id}
   - Verify response matches OpenAPI spec
   - Check field names match dictionary.md
   - Verify TypeScript interfaces match API response

3. **Save Not Working**:
   - Check API call to POST /saved/{policy_id}
   - Verify response structure
   - Check optimistic UI update
   - Verify state synchronization

4. **Saved Groups Not Correct**:
   - Check API call to GET /saved
   - Verify grouping logic (<=90d, 90-365d, >365d)
   - Check effective_date calculation
   - Verify response structure matches spec

5. **Digest Preview Not Working**:
   - Check API call to POST /digest/preview
   - Verify request body structure
   - Check response matches OpenAPI spec
   - Verify top 5 sorting logic

---

## Priority Actions

1. **CRITICAL**: Review COMPLIANCE_STATUS.md for violations
2. **CRITICAL**: Verify no hardcoded secrets in code
3. **HIGH**: Validate all field names match dictionary.md
4. **HIGH**: Verify all enum values match dictionary.md
5. **MEDIUM**: Run smoke flow end-to-end
6. **MEDIUM**: Check test coverage

---

**Remember**: Green-light agents ONE AT A TIME in order: Backend → Tests → Frontend Integration

Then run the complete smoke flow to verify everything works together! 🚀

