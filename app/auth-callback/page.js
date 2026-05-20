import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isDevAuthBypassEnabled } from '../../lib/dev-auth';

export default async function AuthCallbackPage({ searchParams }) {
  if (isDevAuthBypassEnabled()) {
    redirect('/dashboard');
  }

  const { auth } = await import('@clerk/nextjs/server');
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error || 'no_account';

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div className="auth-card" style={{ width: '100%', maxWidth: '520px' }}>
        <h1 className="auth-title">Finish account setup</h1>
        <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
          {error === 'google_no_account'
            ? 'Your Clerk session is ready, but no marketplace profile exists yet.'
            : 'Your session is ready, but this account still needs a marketplace profile.'}
        </p>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <Link className="btn btn-cyan" href="/dashboard?flow=signup&role=brand">
            Continue as Brand
          </Link>
          <Link className="btn btn-purple" href="/dashboard?flow=signup&role=creator">
            Continue as Creator
          </Link>
        </div>
      </div>
    </main>
  );
}
