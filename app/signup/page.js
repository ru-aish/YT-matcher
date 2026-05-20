import { SignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { isDevAuthBypassEnabled } from '../../lib/dev-auth';

export default async function SignUpPage() {
  if (isDevAuthBypassEnabled()) {
    redirect('/dashboard');
  }

  const { auth } = await import('@clerk/nextjs/server');
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="auth-card" style={{ marginBottom: '1rem' }}>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Set up your YT Matcher profile</p>
        </div>
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          fallbackRedirectUrl="/dashboard?flow=signup"
          forceRedirectUrl="/dashboard?flow=signup"
        />
      </div>
    </main>
  );
}
