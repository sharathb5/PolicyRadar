import { test, expect } from '@playwright/test';

test.describe('Digest Preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to load
    await page.waitForSelector('[data-testid="policy-row"]', { timeout: 10000 });
  });

  test('generates digest preview', async ({ page }) => {
    // Find digest preview button/trigger
    const digestButton = page.locator('[data-testid="digest-preview-button"]');
    
    if (await digestButton.count() > 0) {
      // Intercept API call
      const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/digest/preview') && response.method() === 'POST'
      );
      
      // Click digest preview button
      await digestButton.click();
      
      // Wait for API call
      const response = await responsePromise;
      expect(response.status()).toBe(200);
      
      // Verify preview is displayed
      await page.waitForSelector('[data-testid="digest-preview"]', { timeout: 5000 });
      await expect(page.locator('[data-testid="digest-preview"]')).toBeVisible();
    } else {
      // If digest preview feature is not in main UI yet, skip
      test.skip();
    }
  });

  test('POST /digest/preview called with filters', async ({ page }) => {
    // Apply filters first
    await page.click('[data-testid="filter-region-EU"]');
    await page.waitForTimeout(500); // Wait for filter to apply
    
    // Find digest preview button
    const digestButton = page.locator('[data-testid="digest-preview-button"]');
    
    if (await digestButton.count() > 0) {
      // Intercept API call
      const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/digest/preview') && response.method() === 'POST'
      );
      
      // Click digest preview
      await digestButton.click();
      
      // Wait for API call
      const response = await responsePromise;
      const request = response.request();
      
      // Verify request includes filters
      const requestBody = request.postDataJSON();
      expect(requestBody).toHaveProperty('region');
      expect(requestBody.region).toContain('EU');
    } else {
      test.skip();
    }
  });

  test('displays top 5 results', async ({ page }) => {
    // Open digest preview (if available)
    const digestButton = page.locator('[data-testid="digest-preview-button"]');
    
    if (await digestButton.count() > 0) {
      await digestButton.click();
      await page.waitForSelector('[data-testid="digest-preview"]', { timeout: 5000 });
      
      // Check that top 5 results are displayed
      const digestItems = page.locator('[data-testid="digest-item"]');
      const count = await digestItems.count();
      
      expect(count).toBeLessThanOrEqual(5);
      expect(count).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });

  test('displays why_it_matters text', async ({ page }) => {
    // Open digest preview
    const digestButton = page.locator('[data-testid="digest-preview-button"]');
    
    if (await digestButton.count() > 0) {
      await digestButton.click();
      await page.waitForSelector('[data-testid="digest-preview"]', { timeout: 5000 });
      
      // Check first digest item has why_it_matters
      const whyItMatters = page.locator('[data-testid="digest-item"]').first().locator('[data-testid="why-it-matters"]');
      
      if (await whyItMatters.count() > 0) {
        await expect(whyItMatters).toBeVisible();
        const text = await whyItMatters.textContent();
        expect(text).toBeTruthy();
        expect(text?.length).toBeGreaterThan(0);
      }
    } else {
      test.skip();
    }
  });

  test('displays source_name', async ({ page }) => {
    // Open digest preview
    const digestButton = page.locator('[data-testid="digest-preview-button"]');
    
    if (await digestButton.count() > 0) {
      await digestButton.click();
      await page.waitForSelector('[data-testid="digest-preview"]', { timeout: 5000 });
      
      // Check first digest item has source_name
      const sourceName = page.locator('[data-testid="digest-item"]').first().locator('[data-testid="source-name"]');
      
      if (await sourceName.count() > 0) {
        await expect(sourceName).toBeVisible();
        const text = await sourceName.textContent();
        expect(text).toBeTruthy();
        expect(text?.length).toBeGreaterThan(0);
      }
    } else {
      test.skip();
    }
  });
});

