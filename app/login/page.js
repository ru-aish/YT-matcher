import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="auth-card" style={{ marginBottom: '1rem' }}>
          <h1 className="auth-title">YT Matcher</h1>
          <p className="auth-subtitle">Sign in to continue</p>
        </div>
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </main>
  );
}
