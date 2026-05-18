import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { seedMockCreators } from '@/app/actions';
import { deals } from '@/db/schema';
import { redirect } from 'next/navigation';

export default async function TestBrandDashboard() {
  await seedMockCreators();

  const creators = await db.select().from(users).where(eq(users.role, 'creator'));

  async function testStartDeal(creatorId: number) {
    'use server'
    // Create dummy brand for test if doesn't exist
    const brand = await db.insert(users).values({
      clerk_id: 'test_brand_clerk',
      email: 'testbrand@example.com',
      role: 'brand',
      name: 'Test Brand'
    }).onConflictDoUpdate({
      target: users.clerk_id,
      set: { email: 'testbrand@example.com' }
    }).returning();

    // Create deal
    const newDeal = await db.insert(deals).values({
      brand_id: brand[0].id,
      creator_id: creatorId,
      status: 'pending',
      price: "1000.00"
    }).returning();

    redirect(`/deal/${newDeal[0].id}`);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Test Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <Card key={creator.id} data-testid="creator-card">
            <CardHeader>
              <CardTitle>{creator.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={async () => {
                'use server'
                await testStartDeal(creator.id)
              }}>
                <Button type="submit" className="w-full">Start Deal</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
