import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// We need to initialize db here to make sure env vars are loaded first before neon is called.
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

import { deals, users } from './db/schema';

test('Stage 4 Verification: Real-Time Chat (Two Browsers)', async ({ browser }) => {
  // Setup data directly
  const testBrand = await db.insert(users).values({
    clerk_id: `test_brand_${Date.now()}`,
    email: `brand_${Date.now()}@test.com`,
    role: 'brand',
    name: 'Brand Context A'
  }).returning();

  const testCreator = await db.insert(users).values({
    clerk_id: `test_creator_${Date.now()}`,
    email: `creator_${Date.now()}@test.com`,
    role: 'creator',
    name: 'Creator Context B'
  }).returning();

  const testDeal = await db.insert(deals).values({
    brand_id: testBrand[0].id,
    creator_id: testCreator[0].id,
    status: 'pending',
    price: "500.00"
  }).returning();

  const dealId = testDeal[0].id;
  const uniqueMessage = `Hello from Brand! ${Date.now()}`;

  // Launch two isolated browser contexts
  const contextA = await browser.newContext(); // Brand
  const contextB = await browser.newContext(); // Creator

  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  // Navigate both to the deal page
  await pageA.goto(`http://localhost:3000/deal/${dealId}`);
  await pageB.goto(`http://localhost:3000/deal/${dealId}`);

  // Wait for pusher connection to establish
  await pageA.waitForTimeout(1000);
  await pageB.waitForTimeout(1000);

  // In Context A (Brand), send a message
  await pageA.fill('input[placeholder="Type a message..."]', uniqueMessage);
  await pageA.click('button:has-text("Send")');

  // Verify it appears in Context A
  await expect(pageA.getByText(uniqueMessage)).toBeVisible();

  // Without refreshing, verify it appears in Context B via WebSocket
  await expect(pageB.getByText(uniqueMessage)).toBeVisible({ timeout: 10000 });

  console.log("Stage 4 Passed!");

  // Cleanup
  await contextA.close();
  await contextB.close();
});
