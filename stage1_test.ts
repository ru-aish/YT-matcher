import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { users } from './db/schema.ts';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runTest() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("Inserting dummy user...");
  const insertedUser = await db.insert(users).values({
    clerk_id: 'dummy_clerk_id_123',
    email: 'dummy@example.com',
    role: 'brand',
    name: 'Dummy Brand'
  }).returning();

  if (insertedUser.length === 0) {
    throw new Error("Insert failed");
  }
  console.log("Inserted user:", insertedUser[0]);

  console.log("Querying dummy user...");
  const fetchedUser = await db.select().from(users).where(eq(users.clerk_id, 'dummy_clerk_id_123'));

  if (fetchedUser.length === 0 || fetchedUser[0].email !== 'dummy@example.com') {
    throw new Error("Query failed");
  }
  console.log("Fetched user matches!");

  console.log("Deleting dummy user...");
  await db.delete(users).where(eq(users.clerk_id, 'dummy_clerk_id_123'));

  const finalCheck = await db.select().from(users).where(eq(users.clerk_id, 'dummy_clerk_id_123'));
  if (finalCheck.length > 0) {
    throw new Error("Delete failed");
  }

  console.log("Stage 1 Passed");
}

runTest().catch(console.error);
