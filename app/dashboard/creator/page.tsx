import { db } from '@/db';
import { users, deals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function CreatorDashboard() {
  const authResponse = await auth();
  const userId = authResponse.userId;
  if (!userId) return <div>Unauthorized</div>;

  const creator = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerk_id, userId)
  });

  if (!creator) return <div>User not found</div>;

  const myDeals = await db.query.deals.findMany({
    where: (deals, { eq }) => eq(deals.creator_id, creator.id),
    with: {
      brand: true
    }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>
      <h2 className="text-xl mb-4">My Deals</h2>

      <div className="grid grid-cols-1 gap-4">
        {myDeals.length === 0 ? (
          <p>No deals yet.</p>
        ) : (
          myDeals.map((deal) => (
            <Card key={deal.id}>
              <CardHeader>
                <CardTitle>Deal with Brand #{deal.brand_id}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p>Status: {deal.status}</p>
                  <p>Price: ${deal.price}</p>
                </div>
                <Link href={`/deal/${deal.id}`}>
                  <Button variant="outline">View Deal</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
