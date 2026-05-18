'use server'

import { db } from '@/db';
import { users, deals } from '@/db/schema';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export async function seedMockCreators() {
  const mockCreators = [
    { clerk_id: 'mock_1', email: 'creator1@test.com', role: 'creator' as const, name: 'Alice Tech' },
    { clerk_id: 'mock_2', email: 'creator2@test.com', role: 'creator' as const, name: 'Bob Vlogs' },
    { clerk_id: 'mock_3', email: 'creator3@test.com', role: 'creator' as const, name: 'Charlie Gaming' },
  ];

  for (const creator of mockCreators) {
    await db.insert(users).values(creator).onConflictDoNothing({ target: users.clerk_id });
  }
}

export async function startDeal(creatorId: number) {
  const authResponse = await auth();
  const userId = authResponse.userId;
  if (!userId) throw new Error("Unauthorized");

  // Get brand ID
  const brand = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerk_id, userId)
  });

  if (!brand) throw new Error("Brand not found in database");

  // Create deal
  const newDeal = await db.insert(deals).values({
    brand_id: brand.id,
    creator_id: creatorId,
    status: 'pending',
    price: "1000.00" // Default dummy price
  }).returning();

  redirect(`/deal/${newDeal[0].id}`);
}
