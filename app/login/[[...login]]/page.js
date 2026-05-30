'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Building2, Video } from 'lucide-react';
import { isDevAuthBypassEnabled } from '../../../lib/dev-auth';
import styles from './login.module.css';

const SignIn = dynamic(() => import('@clerk/nextjs').then((mod) => mod.SignIn), {
  ssr: false,
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

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const isDevBypass = isDevAuthBypassEnabled() || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const handleRoleSelect = (role) => {
    if (isDevBypass) return;
    setSelectedRole(role);
    // Set cookie for role so dashboard knows what role to create
    document.cookie = `selected_role=${role}; path=/; max-age=3600`;
  };

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
              {selectedRole ? `Sign in as ${selectedRole}` : 'Choose your role'}
            </h1>
            <p className={styles.formSubtitle}>
              {selectedRole
                ? 'Continue with your preferred sign-in method'
                : 'Select how you want to use the platform to continue'}
            </p>
          </div>

          {/* Role Selection */}
          {isDevBypass ? (
            <div className={styles.roleCards}>
              <Link className={styles.roleCard} href="/test-bypass?role=brand&redirect=/dashboard">
                <div className={styles.roleCardGlow}></div>
                <div className={styles.roleCardIcon}>
                  <Building2 size={24} />
                </div>
                <div className={styles.roleCardContent}>
                  <span className={styles.roleCardLabel}>Brand</span>
                  <span className={styles.roleCardDesc}>
                    Enter the dashboard as a brand
                  </span>
                </div>
                <span className={styles.roleCardAction}>Bypass →</span>
              </Link>
              <Link className={styles.roleCard} href="/test-bypass?role=creator&redirect=/dashboard">
                <div className={styles.roleCardGlow}></div>
                <div className={styles.roleCardIcon}>
                  <Video size={24} />
                </div>
                <div className={styles.roleCardContent}>
                  <span className={styles.roleCardLabel}>Creator</span>
                  <span className={styles.roleCardDesc}>
                    Enter the dashboard as a creator
                  </span>
                </div>
                <span className={styles.roleCardAction}>Bypass →</span>
              </Link>
            </div>
          ) : !selectedRole ? (
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
            /* Clerk Sign In */
            <div className={styles.clerkContainer}>
              <SignIn
                appearance={clerkAppearance}
                routing="path"
                path="/login"
                redirectUrl="/dashboard?flow=signup"
                signUpUrl="/signup"
              />
              <button
                onClick={() => setSelectedRole(null)}
                className={styles.backButton}
              >
                ← Back to role selection
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
