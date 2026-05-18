import { db } from '@/db';
import { deals, messages, users } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Chat from './Chat';
import { auth } from '@clerk/nextjs/server';

export default async function DealPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const dealId = parseInt(params.id);

  if (isNaN(dealId)) {
    return <div>Invalid Deal ID</div>;
  }

  const deal = await db.query.deals.findFirst({
    where: (deals, { eq }) => eq(deals.id, dealId)
  });

  if (!deal) {
    return <div>Deal not found</div>;
  }

  const chatMessages = await db.query.messages.findMany({
    where: (messages, { eq }) => eq(messages.deal_id, dealId),
    orderBy: [asc(messages.created_at)]
  });

  const authResponse = await auth();
  const userId = authResponse.userId;

  // We need the internal user ID for this logged in user to associate messages properly
  // For tests/anonymous, we default to the brand_id or creator_id
  let internalUserId = deal.brand_id;

  if (userId) {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerk_id, userId)
    });
    if (user) internalUserId = user.id;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Deal #{deal.id}</h1>

      <div className="bg-gray-50 p-6 rounded-lg mb-8 border">
        <h2 className="text-xl font-semibold mb-4">Deal Details</h2>
        <p><strong>Status:</strong> <span className="capitalize">{deal.status}</span></p>
        <p><strong>Price:</strong> ${deal.price}</p>
      </div>

      <div className="mb-8 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold mb-2">Escrow Funding (Simulated)</h3>
        <p className="text-gray-500 mb-6 max-w-md">In the future, this button will connect to a payment provider to lock funds securely.</p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700" disabled>
          [Simulate Fund Escrow - Payment Integration Later]
        </Button>
      </div>

      <Chat dealId={deal.id} initialMessages={chatMessages} currentUserId={internalUserId!} />
    </div>
  );
}
