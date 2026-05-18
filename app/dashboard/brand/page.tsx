import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { startDeal, seedMockCreators } from '@/app/actions';

export default async function BrandDashboard() {
  // Try to seed mocks just in case for testing, this safely ignores on conflict
  await seedMockCreators();

  const creators = await db.select().from(users).where(eq(users.role, 'creator'));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Brand Dashboard</h1>
      <h2 className="text-xl mb-4">Available Creators</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <Card key={creator.id}>
            <CardHeader>
              <CardTitle>{creator.name || 'Unnamed Creator'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{creator.email}</p>
              <form action={async () => {
                'use server'
                await startDeal(creator.id)
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
