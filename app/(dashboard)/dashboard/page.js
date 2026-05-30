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

        // If this email already had an account, its real role wins. Send the
        // user to their actual dashboard rather than the role they just picked.
        if (created.roleMismatch && created.existingRole) {
          const params = new URLSearchParams({ role_notice: created.existingRole });
          redirect(`/dashboard?${params.toString()}`);
        }

        if (!created.user.profileCompleted) {
          return renderRoleDashboard(serializableUser, true);
        }

        return renderRoleDashboard(serializableUser, false);
      }

      redirect('/signup?error=db_creation_failed');
    }

    redirect('/auth-callback?error=no_account');
  }

  const serializableUser = {
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
  };

  // Existing account: always route by the account's true role + show the
  // (possibly required) profile-setup overlay until the profile is completed.
  return renderRoleDashboard(serializableUser, !user.profileCompleted)
}

// Renders the role-correct dashboard, with the profile-setup overlay mounted
// on top when the profile still needs completing (non-skippable).
function renderRoleDashboard(serializableUser, needsProfile) {
  const Dashboard = serializableUser.role === 'brand' ? BrandDashboard : CreatorDashboard;
  return (
    <>
      <Dashboard initialUser={serializableUser} />
      {needsProfile && <ProfileSetup initialUser={serializableUser} />}
    </>
  );
}
