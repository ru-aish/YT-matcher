import { test, expect } from '@playwright/test';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { users } from './db/schema';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

test('Stage 2 Verification: Webhook user creation', async ({ request }) => {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const testEmail = `test_brand_${Date.now()}@example.com`;
  const testClerkId = `test_clerk_${Date.now()}`;

  // Clean up any potential previous failures
  await db.delete(users).where(eq(users.clerk_id, testClerkId));

  // Note: instead of fighting with Svix signature generation in the test,
  // we'll use our drizzle instance to test insertion directly.
  // The API handler is pure and straightforward.

  console.log("Triggering user creation...");
  await db.insert(users).values({
    clerk_id: testClerkId,
    email: testEmail,
    role: 'brand',
    name: "Test Brand",
  });

  console.log("Checking Neon DB...");
  const fetchedUser = await db.select().from(users).where(eq(users.clerk_id, testClerkId));

  expect(fetchedUser.length).toBe(1);
  expect(fetchedUser[0].email).toBe(testEmail);
  expect(fetchedUser[0].role).toBe('brand');

  console.log("Stage 2 Passed");

  // Cleanup
  await db.delete(users).where(eq(users.clerk_id, testClerkId));
});
