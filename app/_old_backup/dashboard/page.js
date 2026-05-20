import { redirect } from 'next/navigation';
import { getDbUserAction, createDbUserAction } from '../actions';
import DashboardClient from './DashboardClient';
import { auth, currentUser } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }) {
  const cookieStore = await cookies();
  const isDevBypass = process.env.DEV_AUTH_BYPASS === 'true' || process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';

  if (!isDevBypass) {
    const authObj = await auth();
    if (!authObj.userId) {
      redirect('/login');
    }
  }

  const resolvedSearchParams = await searchParams;
  const flow = resolvedSearchParams.flow;

  let user = await getDbUserAction();

  if (!user) {
    if (isDevBypass) {
      const selectedRole = resolvedSearchParams.role || cookieStore.get('dev_user_role')?.value || 'creator';
      const res = await createDbUserAction(selectedRole);
      if (res.success) {
        user = res.user;
      } else {
        redirect('/login?error=db_creation_failed');
      }
    } else if (flow === 'signup') {
      const selectedRole = resolvedSearchParams.role || cookieStore.get('selected_role')?.value || 'creator';
      const res = await createDbUserAction(selectedRole);
      if (res.success) {
        user = res.user;
      } else {
        redirect('/signup?error=db_creation_failed');
      }
    } else {
      const clerkUser = await currentUser();
      const isGoogle = clerkUser?.externalAccounts?.some(acc => acc.provider === 'google') || false;

      if (isGoogle) {
        redirect('/auth-callback?error=google_no_account');
      } else {
        redirect('/auth-callback?error=no_account');
      }
    }
  }

  const serializableUser = {
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null
  };

  return <DashboardClient initialUser={serializableUser} />;
}
