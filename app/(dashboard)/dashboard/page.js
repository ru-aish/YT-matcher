import { getDbUserAction } from '../../actions';
import BrandDashboard from './BrandDashboard';
import CreatorDashboard from './CreatorDashboard';
import ProfileSetup from './ProfileSetup';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getDbUserAction();

  if (!user) {
    return null; // Layout handles redirect
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
