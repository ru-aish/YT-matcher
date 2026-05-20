import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { getDbUserAction, createDbUserAction } from '../actions';
import AppShellWrapper from './AppShellWrapper';

export const dynamic = 'force-dynamic';

export default async function DashboardGroupLayout({ children }) {
  const cookieStore = await cookies();
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const isDevBypass =
    isDevelopment ||
    process.env.DEV_AUTH_BYPASS === 'true' ||
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';

  if (!isDevBypass) {
    const authObj = await auth();
    if (!authObj.userId) {
      redirect('/login');
    }
  }

  let user = await getDbUserAction();

  if (!user) {
    if (isDevBypass) {
      const selectedRole = cookieStore.get('dev_user_role')?.value || 'creator';
      const res = await createDbUserAction(selectedRole);
      if (res.success) {
        user = res.user;
      } else {
        redirect('/login?error=db_creation_failed');
      }
    } else {
      redirect('/login');
    }
  }

  // Serialize dates
  const serializableUser = {
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
  };

  return (
    <AppShellWrapper dbUser={serializableUser} chatThreads={[]}>
      {children}
    </AppShellWrapper>
  );
}
