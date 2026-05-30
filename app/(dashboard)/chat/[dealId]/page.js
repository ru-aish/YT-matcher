import { redirect } from 'next/navigation';
import { getDealAction } from '../../../actions';
import ChatClient from './ChatClient';

export const dynamic = 'force-dynamic';

export default async function ChatPage({ params }) {
  const resolvedParams = await params;
  const dealId = resolvedParams.dealId;

  const res = await getDealAction(dealId);

  if (res.error) {
    redirect(`/dashboard?error=${encodeURIComponent(res.error)}`);
  }

  // Serialize dates
  const serialized = {
    ...res,
    deal: {
      ...res.deal,
      createdAt: res.deal?.createdAt ? new Date(res.deal.createdAt).toISOString() : null,
    },
    messages: (res.messages || []).map(m => ({
      ...m,
      createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : null,
    })),
    currentUser: {
      ...res.currentUser,
      createdAt: res.currentUser?.createdAt ? new Date(res.currentUser.createdAt).toISOString() : null,
    },
    otherUser: res.otherUser ? {
      ...res.otherUser,
      createdAt: res.otherUser?.createdAt ? new Date(res.otherUser.createdAt).toISOString() : null,
    } : null,
  };

  return <ChatClient initialData={serialized} />;
}
