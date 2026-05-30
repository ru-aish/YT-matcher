'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Building2, Video } from 'lucide-react';
import { isDevAuthBypassEnabled } from '../../../lib/dev-auth';
import styles from '../../login/[[...login]]/login.module.css';

// Branded loading state while the Clerk widget chunk downloads.
function AuthLoading() {
  return (
    <div className={styles.authLoading} aria-live="polite" aria-busy="true">
      <span className={styles.spinner} />
      <p className={styles.loadingText}>Securing your connection…</p>
    </div>
  );
}

const SignUp = dynamic(() => import('@clerk/nextjs').then((mod) => mod.SignUp), {
  ssr: false,
  loading: () => <AuthLoading />,
});

const clerkAppearance = {
  variables: {
    colorPrimary: '#ff5a3c',
    colorBackground: 'transparent',
    colorInputBackground: '#ffffff',
    colorInputText: '#1a140d',
    colorText: '#1a140d',
    colorTextSecondary: '#5d5344',
    colorTextMuted: '#8a7d69',
    colorBorder: 'rgba(26, 20, 13, 0.14)',
    borderRadius: '12px',
  },
  elements: {
    card: {
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      padding: '0',
    },
    rootBox: {
      width: '100%',
    },
    headerTitle: {
      display: 'none',
    },
    headerSubtitle: {
      display: 'none',
    },
  },
};

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const isDevBypass = isDevAuthBypassEnabled() || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const router = useRouter();

  // Check dev bypass immediately
  useEffect(() => {
    if (isDevBypass) {
      router.push('/dashboard');
    }
  }, [isDevBypass, router]);

  // On mount, check if there is already a role selected in cookies
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    const role = getCookie('selected_role');
    if (role) {
      setSelectedRole(role);
    }
  }, []);

  const handleRoleSelect = (role) => {
    if (isDevBypass) return;
    setSelectedRole(role);
    document.cookie = `selected_role=${role}; path=/; max-age=3600`;
  };

  if (isDevBypass) {
    return null; // Let the redirect trigger
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authGlow}></div>
      <div className={styles.authGlowSecondary}></div>
      <div className={styles.formContainer}>
        {/* Centered Logo Header */}
        <div className={styles.cardHeaderLogo}>
          <div className={styles.logoBadge}>YT</div>
          <span className={styles.logoText}>Matcher</span>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>
              {selectedRole ? `Register as ${selectedRole}` : 'Choose your role'}
            </h1>
            <p className={styles.formSubtitle}>
              {selectedRole
                ? 'Set up your account credentials to proceed'
                : 'Select how you want to use the platform to continue'}
            </p>
          </div>

          {/* Role Selection */}
          {!selectedRole ? (
            <div className={styles.roleCards}>
              <button
                className={styles.roleCard}
                onClick={() => handleRoleSelect('brand')}
              >
                <div className={styles.roleCardGlow}></div>
                <div className={styles.roleCardIcon}>
                  <Building2 size={24} />
                </div>
                <div className={styles.roleCardContent}>
                  <span className={styles.roleCardLabel}>Brand</span>
                  <span className={styles.roleCardDesc}>
                    Create campaigns & hire creators
                  </span>
                </div>
                <span className={styles.roleCardAction}>Select →</span>
              </button>

              <button
                className={styles.roleCard}
                onClick={() => handleRoleSelect('creator')}
              >
                <div className={styles.roleCardGlow}></div>
                <div className={styles.roleCardIcon}>
                  <Video size={24} />
                </div>
                <div className={styles.roleCardContent}>
                  <span className={styles.roleCardLabel}>Creator</span>
                  <span className={styles.roleCardDesc}>
                    Discover campaigns & land deals
                  </span>
                </div>
                <span className={styles.roleCardAction}>Select →</span>
              </button>
            </div>
          ) : (
            /* Clerk Sign Up */
            <div className={styles.clerkContainer}>
              <SignUp
                appearance={clerkAppearance}
                routing="path"
                path="/signup"
                signInUrl="/login"
                fallbackRedirectUrl="/dashboard?flow=signup"
                forceRedirectUrl="/dashboard?flow=signup"
                signUpForceRedirectUrl="/dashboard?flow=signup"
              />
              <button
                onClick={() => setSelectedRole(null)}
                className={styles.backLink}
                type="button"
              >
                ← Use a different role
              </button>
            </div>
          )}
        </div>

        <div className={styles.formFooter}>
          <p>Secured by Clerk · YT Matcher © 2026</p>
        </div>
      </div>
    </div>
  );
}
