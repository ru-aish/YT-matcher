import { redirect } from 'next/navigation';
import { getDealAction } from '../../../actions';
import DealClient from './DealClient';

export const dynamic = 'force-dynamic';

export default async function DealPage({ params }) {
  const resolvedParams = await params;
  const dealId = resolvedParams.id;

  const res = await getDealAction(dealId);

  if (res.error) {
    redirect(`/dashboard?error=${encodeURIComponent(res.error)}`);
  }

  // Serialize dates in user
  const serialized = {
    ...res,
    currentUser: {
      ...res.currentUser,
      createdAt: res.currentUser?.createdAt ? new Date(res.currentUser.createdAt).toISOString() : null,
    },
    otherUser: res.otherUser ? {
      ...res.otherUser,
      createdAt: res.otherUser?.createdAt ? new Date(res.otherUser.createdAt).toISOString() : null,
    } : null,
  };

  return <DealClient initialData={serialized} />;
}
