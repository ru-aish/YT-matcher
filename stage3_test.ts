import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

test('Stage 3 Verification: End-to-End Flow (Test Route)', async ({ page }) => {
  // 1. Navigate to test dashboard (bypasses Clerk auth for testing)
  await page.goto('/test-dashboard');

  // 2. Assert the page displays Creator cards
  const creatorCards = page.getByTestId('creator-card');
  await expect(creatorCards.first()).toBeVisible();

  const count = await creatorCards.count();
  expect(count).toBeGreaterThanOrEqual(3); // We seeded 3

  // 3. Click the "Start Deal" button on the first card
  await creatorCards.first().getByRole('button', { name: 'Start Deal' }).click();

  // 4. Wait for redirect to /deal/[id]
  await page.waitForURL(/\/deal\/\d+/);

  // 5. Assert "Simulate Fund Escrow" button is visible
  const simulateButton = page.getByRole('button', { name: /Simulate Fund Escrow/i });
  await expect(simulateButton).toBeVisible();

  console.log("Stage 3 Passed!");
});
