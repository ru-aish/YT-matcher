import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getDbUserAction, createDbUserAction } from '../../actions';
import BrandDashboard from './BrandDashboard';
import CreatorDashboard from './CreatorDashboard';
import ProfileSetup from './ProfileSetup';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }) {
  const cookieStore = await cookies();
  const resolvedSearchParams = await searchParams;
  const flow = resolvedSearchParams?.flow;
  const selectedRole =
    resolvedSearchParams?.role ||
    cookieStore.get('selected_role')?.value ||
    cookieStore.get('dev_user_role')?.value ||
    'creator';

  const user = await getDbUserAction();

  if (!user) {
    if (flow === 'signup') {
      const created = await createDbUserAction(selectedRole);
      if (created.success) {
        const serializableUser = {
          ...created.user,
          createdAt: created.user.createdAt ? new Date(created.user.createdAt).toISOString() : null,
        };

        if (!created.user.profileCompleted) {
          return <ProfileSetup initialUser={serializableUser} />;
        }

        if (created.user.role === 'brand') {
          return <BrandDashboard initialUser={serializableUser} />;
        }

        return <CreatorDashboard initialUser={serializableUser} />;
      }

      redirect('/signup?error=db_creation_failed');
    }

    redirect('/auth-callback?error=no_account');
  }

  const serializableUser = {
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
  };

  // If profile not completed, show profile setup
  if (!user.profileCompleted) {
    return <ProfileSetup initialUser={serializableUser} />;
  }

  // Role-based dashboard
  if (user.role === 'brand') {
    return <BrandDashboard initialUser={serializableUser} />;
  }

  return <CreatorDashboard initialUser={serializableUser} />;
}
