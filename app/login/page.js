'use client';

import { useState } from 'react';
import { SignIn } from '@clerk/nextjs';
import { Building2, Video } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Set cookie for role so dashboard knows what role to create
    document.cookie = `selected_role=${role}; path=/; max-age=3600`;
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {/* Header */}
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <div className={styles.loginLogoIcon}>YT</div>
            <span className={styles.loginLogoText}>Matcher</span>
          </div>
          <h1 className={styles.loginTitle}>
            {selectedRole ? `Sign in as ${selectedRole}` : 'Choose your role'}
          </h1>
          <p className={styles.loginSubtitle}>
            {selectedRole
              ? 'Continue with your preferred sign-in method'
              : 'Select how you want to use the platform'}
          </p>
        </div>

        {/* Role Selection */}
        {!selectedRole ? (
          <div className={styles.roleCards}>
            <button
              className={`${styles.roleCard} ${selectedRole === 'brand' ? styles.selected : ''}`}
              onClick={() => handleRoleSelect('brand')}
            >
              <div className={styles.roleCardIcon}>
                <Building2 size={24} />
              </div>
              <span className={styles.roleCardLabel}>Brand</span>
              <span className={styles.roleCardDesc}>
                Create campaigns & find creators for sponsorships
              </span>
            </button>

            <button
              className={`${styles.roleCard} ${selectedRole === 'creator' ? styles.selected : ''}`}
              onClick={() => handleRoleSelect('creator')}
            >
              <div className={styles.roleCardIcon}>
                <Video size={24} />
              </div>
              <span className={styles.roleCardLabel}>Creator</span>
              <span className={styles.roleCardDesc}>
                Discover brand campaigns & land sponsorship deals
              </span>
            </button>
          </div>
        ) : (
          /* Clerk Sign In */
          <div className={styles.clerkContainer}>
            <SignIn
              appearance={{
                elements: {
                  rootBox: { width: '100%' },
                  card: { width: '100%', margin: 0 },
                },
              }}
              redirectUrl="/dashboard?flow=signup"
              signUpUrl="/login"
            />
            <button
              onClick={() => setSelectedRole(null)}
              className="btn btn-ghost btn-block"
              style={{ marginTop: 'var(--space-md)' }}
            >
              ← Back to role selection
            </button>
          </div>
        )}

        <div className={styles.loginFooter}>
          <p>Secured by Clerk · YT Matcher © 2026</p>
        </div>
      </div>
    </div>
  );
}
