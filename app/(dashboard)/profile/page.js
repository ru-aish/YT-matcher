import { getDbUserAction } from '../../actions';
import ProfileSetup from '../dashboard/ProfileSetup';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getDbUserAction();

  if (!user) return null;

  const serializableUser = {
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
  };

  return <ProfileSetup initialUser={serializableUser} />;
}
