import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'brand';
  const id = searchParams.get('id') || 'dev_brand_123';
  const email = searchParams.get('email') || (role === 'brand' ? 'test_brand@example.com' : 'test_creator@example.com');
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const redirectUrl = new URL(redirectTo, request.url);
  redirectUrl.searchParams.set('dev_user_id', id);
  redirectUrl.searchParams.set('dev_user_role', role);
  redirectUrl.searchParams.set('dev_user_email', email);

  const cookieStore = await cookies();
  cookieStore.set('dev_user_id', id, { path: '/' });
  cookieStore.set('dev_user_role', role, { path: '/' });
  cookieStore.set('dev_user_email', email, { path: '/' });

  redirect(redirectUrl.pathname + redirectUrl.search);
}
