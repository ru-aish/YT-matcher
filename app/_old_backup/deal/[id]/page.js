import { redirect } from 'next/navigation';
import { getDealActionForUser } from '../../actions';
import DealClient from './DealClient';
import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function DealPage({ params, searchParams }) {
  const resolvedParams = await params;
  const dealId = resolvedParams.id;
  const resolvedSearchParams = await searchParams;

  const cookieStore = await cookies();
  const isDevBypass = process.env.DEV_AUTH_BYPASS === 'true' || process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';
  let userIdentifier = null;

  if (!isDevBypass) {
    const authObj = await auth();
    if (!authObj.userId) {
      redirect('/login');
    }
    userIdentifier = authObj.userId;
  } else {
    userIdentifier =
      resolvedSearchParams?.dev_user_id ||
      cookieStore.get('dev_user_id')?.value ||
      null;
  }

  const res = await getDealActionForUser(dealId, userIdentifier);

  if (res.error) {
    redirect(`/dashboard?error=${encodeURIComponent(res.error)}`);
  }

  return <DealClient initialData={res} />;
}
