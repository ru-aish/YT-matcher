'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../landing.module.css';

// Inner component that uses Clerk hooks — only rendered when Clerk is available
function NavAuthButtons({ useAuth, useClerk }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <>
        <Link href="/dashboard" className={`${styles.navBtn} ${styles.navBtnPrimary}`}>
          Dashboard →
        </Link>
        <button
          onClick={() => signOut({ redirectUrl: '/' })}
          className={styles.navSignOut}
          type="button"
        >
          Sign Out
        </button>
      </>
    );
  }

  return (
    <Link href="/login" className={`${styles.navBtn} ${styles.navBtnPrimary}`}>
      Login
    </Link>
  );
}

// Fallback when Clerk is not configured
function NavFallbackButtons() {
  return (
    <Link href="/login" className={`${styles.navBtn} ${styles.navBtnPrimary}`}>
      Login
    </Link>
  );
}

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [clerkHooks, setClerkHooks] = useState(null);

  // Dynamically load Clerk hooks (graceful if not configured)
  useEffect(() => {
    async function loadClerk() {
      try {
        if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
          return;
        }
        const clerk = await import('@clerk/nextjs');
        if (clerk.useAuth && clerk.useClerk) {
          setClerkHooks({ useAuth: clerk.useAuth, useClerk: clerk.useClerk });
        }
      } catch {
        // Clerk not available — fallback
      }
    }
    loadClerk();
  }, []);

  // Scroll listener for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
      id="landing-nav"
    >
      <div className={styles.navInner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoMark} aria-hidden="true" />
          <span className={styles.logoText}>YT Matcher</span>
        </Link>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <a href="#how-it-works" className={styles.navLink}>How It Works</a>
          <a href="#benefits" className={styles.navLink}>Benefits</a>
          <a href="#transparency" className={styles.navLink}>Calculator</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
        </div>

        {/* Auth-aware CTA */}
        <div className={styles.navCta}>
          {clerkHooks ? (
            <NavAuthButtons useAuth={clerkHooks.useAuth} useClerk={clerkHooks.useClerk} />
          ) : (
            <NavFallbackButtons />
          )}
        </div>
      </div>
    </nav>
  );
}
