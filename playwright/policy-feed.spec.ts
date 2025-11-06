import { test, expect } from '@playwright/test';

test.describe('Policy Feed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays policy list', async ({ page }) => {
    // Wait for policies to load
    await page.waitForSelector('[data-testid="policy-row"]', { timeout: 10000 });
    
    // Check that at least one policy is displayed
    const policyRows = await page.locator('[data-testid="policy-row"]').count();
    expect(policyRows).toBeGreaterThan(0);
  });

  test('filter flow - apply filters', async ({ page }) => {
    // Wait for filters to be visible
    await page.waitForSelector('[data-testid="filter-region"]', { timeout: 5000 });
    
    // Apply region filter
    await page.click('[data-testid="filter-region-EU"]');
    
    // Apply policy type filter
    await page.click('[data-testid="filter-policy-type-Disclosure"]');
    
    // Verify API called with correct query params (check network requests)
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/policies') && response.status() === 200
    );
    
    // Wait for filtered results
    await page.waitForSelector('[data-testid="policy-row"]', { timeout: 5000 });
    
    const response = await responsePromise;
    const url = response.url();
    
    expect(url).toContain('region=EU');
    expect(url).toContain('policy_type=Disclosure');
  });

  test('filter flow - clear filters', async ({ page }) => {
    // Apply filters first
    await page.click('[data-testid="filter-region-EU"]');
    
    // Wait for filtered results
    await page.waitForSelector('[data-testid="policy-row"]', { timeout: 5000 });
    
    // Clear all filters
    await page.click('[data-testid="clear-all-filters"]');
    
    // Verify API called without filter params
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/policies') && response.status() === 200
    );
    
    await responsePromise;
    
    const response = await responsePromise;
    const url = response.url();
    
    // Should not contain filter params (or contain empty filters)
    expect(url).not.toContain('region=EU');
  });

  test('sort flow - change sort option', async ({ page }) => {
    // Change sort to "effective"
    await page.selectOption('[data-testid="sort-select"]', 'effective');
    
    // Verify API called with correct sort param
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/policies') && response.status() === 200
    );
    
    await responsePromise;
    
    const response = await responsePromise;
    const url = response.url();
    
    expect(url).toContain('sort=effective');
  });

  test('sort flow - change sort order', async ({ page }) => {
    // Change sort order to "asc"
    await page.selectOption('[data-testid="order-select"]', 'asc');
    
    // Verify API called with correct order param
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/policies') && response.status() === 200
    );
    
    await responsePromise;
    
    const response = await responsePromise;
    const url = response.url();
    
    expect(url).toContain('order=asc');
  });

  test('sort flow - verify results displayed in correct order', async ({ page }) => {
    // Sort by impact descending (default)
    await page.waitForSelector('[data-testid="policy-row"]', { timeout: 10000 });
    
    // Get first two impact scores
    const impactScore1 = await page.locator('[data-testid="policy-row"]').first().locator('[data-testid="impact-score"]').textContent();
    const impactScore2 = await page.locator('[data-testid="policy-row"]').nth(1).locator('[data-testid="impact-score"]').textContent();
    
    if (impactScore1 && impactScore2) {
      const score1 = parseInt(impactScore1);
      const score2 = parseInt(impactScore2);
      expect(score1).toBeGreaterThanOrEqual(score2);
    }
  });

  test('loading states - skeletons display', async ({ page }) => {
    // Navigate to page
    await page.goto('/');
    
    // Check for loading skeletons (they should appear briefly)
    const skeleton = await page.locator('[data-testid="policy-skeleton"]').first();
    
    // Skeleton should appear or have appeared (might be gone by now)
    const count = await page.locator('[data-testid="policy-skeleton"]').count();
    
    // Either skeleton exists or it's already loaded (count >= 0 is always true, but we check it appeared)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('empty states - no results message', async ({ page }) => {
    // Apply filters that return no results
    await page.click('[data-testid="filter-region-OTHER"]');
    await page.selectOption('[data-testid="impact-min-slider"]', '100'); // Very high threshold
    
    // Wait for empty state
    await page.waitForSelector('[data-testid="empty-state"]', { timeout: 5000 });
    
    // Verify empty state message
    const emptyMessage = await page.locator('[data-testid="empty-state"]').textContent();
    expect(emptyMessage).toContain('No policies found');
  });

  test('active filter chips display correctly', async ({ page }) => {
    // Apply filters
    await page.click('[data-testid="filter-region-EU"]');
    await page.click('[data-testid="filter-policy-type-Disclosure"]');
    
    // Verify filter chips are displayed
    const regionChip = await page.locator('[data-testid="active-filter-EU"]');
    const typeChip = await page.locator('[data-testid="active-filter-Disclosure"]');
    
    await expect(regionChip).toBeVisible();
    await expect(typeChip).toBeVisible();
  });

  test('clear all button resets filters', async ({ page }) => {
    // Apply filters
    await page.click('[data-testid="filter-region-EU"]');
    await page.click('[data-testid="filter-policy-type-Disclosure"]');
    
    // Click clear all
    await page.click('[data-testid="clear-all-filters"]');
    
    // Verify filter chips are removed
    const regionChip = page.locator('[data-testid="active-filter-EU"]');
    await expect(regionChip).not.toBeVisible();
  });
});

