import { test, expect } from '@playwright/test';

test.describe('Policy Detail Drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for policies to load
    await page.waitForSelector('[data-testid="policy-row"]', { timeout: 10000 });
  });

  test('opens drawer when clicking policy', async ({ page }) => {
    // Click first policy
    await page.click('[data-testid="policy-row"]').first();
    
    // Verify drawer opens
    await page.waitForSelector('[data-testid="policy-drawer"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="policy-drawer"]')).toBeVisible();
  });

  test('API called with correct policy ID', async ({ page }) => {
    // Get first policy ID from list
    const policyId = await page.locator('[data-testid="policy-row"]').first().getAttribute('data-policy-id');
    
    // Intercept API call
    const responsePromise = page.waitForResponse(
      response => response.url().includes(`/api/policies/${policyId}`) && response.status() === 200
    );
    
    // Click policy
    await page.click('[data-testid="policy-row"]').first();
    
    // Wait for API call
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  test('displays all required fields', async ({ page }) => {
    // Click policy to open drawer
    await page.click('[data-testid="policy-row"]').first();
    
    // Wait for drawer
    await page.waitForSelector('[data-testid="policy-drawer"]', { timeout: 5000 });
    
    // Check required fields
    await expect(page.locator('[data-testid="policy-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="policy-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="policy-impact-factors"]')).toBeVisible();
    await expect(page.locator('[data-testid="policy-version"]')).toBeVisible();
    await expect(page.locator('[data-testid="policy-history"]')).toBeVisible();
  });

  test('displays impact factors breakdown', async ({ page }) => {
    // Open drawer
    await page.click('[data-testid="policy-row"]').first();
    await page.waitForSelector('[data-testid="policy-drawer"]', { timeout: 5000 });
    
    // Check impact factors
    await expect(page.locator('[data-testid="impact-factor-mandatory"]')).toBeVisible();
    await expect(page.locator('[data-testid="impact-factor-time-proximity"]')).toBeVisible();
    await expect(page.locator('[data-testid="impact-factor-scope-coverage"]')).toBeVisible();
    await expect(page.locator('[data-testid="impact-factor-sector-breadth"]')).toBeVisible();
    await expect(page.locator('[data-testid="impact-factor-disclosure-complexity"]')).toBeVisible();
  });

  test('closes drawer when clicking close', async ({ page }) => {
    // Open drawer
    await page.click('[data-testid="policy-row"]').first();
    await page.waitForSelector('[data-testid="policy-drawer"]', { timeout: 5000 });
    
    // Click close button
    await page.click('[data-testid="drawer-close"]');
    
    // Verify drawer closes
    await expect(page.locator('[data-testid="policy-drawer"]')).not.toBeVisible();
  });

  test('closes drawer when clicking backdrop', async ({ page }) => {
    // Open drawer
    await page.click('[data-testid="policy-row"]').first();
    await page.waitForSelector('[data-testid="policy-drawer"]', { timeout: 5000 });
    
    // Click backdrop (outside drawer)
    await page.click('[data-testid="drawer-backdrop"]');
    
    // Verify drawer closes
    await expect(page.locator('[data-testid="policy-drawer"]')).not.toBeVisible();
  });
});

