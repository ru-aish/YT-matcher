'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import LandingNav from './components/LandingNav';
import DealCalculator from './components/DealCalculator';
import styles from './landing.module.css';

// Rotating words for the hero section
const ROTATING_WORDS = [
  'Gaming channels',
  'Tech reviewers',
  'Lifestyle creators',
  'Finance educators',
  'Travel vloggers',
  'Food creators',
];

// Lucide-style SVG icons (inline to avoid extra dependency weight on landing page)
function MegaphoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.68.05l2.48-1a1 1 0 0 1 1.27.4l.06.12" />
      <path d="M18 22H4a2 2 0 0 1-2-2V6" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function PlayCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

// Hook: Intersection Observer for scroll reveal
function useReveal() {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `${styles.reveal} ${revealed ? styles.revealed : ''}` };
}

// Reusable reveal wrapper
function Reveal({ children, delay = 0 }) {
  const { ref, className } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [authState, setAuthState] = useState({ isSignedIn: false, loading: true });

  // Rotating word cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auth check for CTA buttons
  useEffect(() => {
    async function checkAuth() {
      try {
        const clerk = await import('@clerk/nextjs');
        // Check if Clerk is loaded on the window
        if (typeof window !== 'undefined' && window.Clerk) {
          setAuthState({ isSignedIn: !!window.Clerk.user, loading: false });
        } else {
          setAuthState({ isSignedIn: false, loading: false });
        }
      } catch {
        setAuthState({ isSignedIn: false, loading: false });
      }
    }
    checkAuth();
  }, []);

  const ctaHref = authState.isSignedIn ? '/dashboard' : '/signup';
  const ctaText = authState.isSignedIn ? 'Go to Dashboard' : 'Sign Up to Start';

  return (
    <div className={styles.page}>
      {/* ── Nav ── */}
      <LandingNav />

      {/* ── Hero ── */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeadline}>
            The simplest way to connect{' '}
            <span className={styles.heroAccent}>Brands</span> ↔{' '}
            <span className={styles.heroSecondary}>Creators</span>
          </h1>
          <div className={styles.heroRotatingWord} aria-live="polite">
            <span key={wordIndex} className={styles.heroRotatingWordActive}>
              {ROTATING_WORDS[wordIndex]}
            </span>
          </div>
          <p className={styles.heroSubtitle}>
            Fair matching. Transparent commission. Real deals.
          </p>
          <Link href={ctaHref} className={styles.heroCta} id="hero-cta">
            {authState.loading ? 'Loading...' : ctaText}
          </Link>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.howSection} id="how-it-works">
        <div className={styles.container}>
          <Reveal>
            <p className={styles.sectionLabel}>How It Works</p>
            <h2 className={styles.sectionTitle}>Three steps. No complexity.</h2>
          </Reveal>

          <div className={styles.stepsGrid}>
            <Reveal delay={0}>
              <div className={styles.step}>
                <p className={styles.stepNumber}>Step 01</p>
                <div className={styles.stepIcon}>
                  <MegaphoneIcon />
                </div>
                <h3 className={styles.stepTitle}>Brand posts a campaign</h3>
                <p className={styles.stepDesc}>
                  Describe what you&apos;re looking for — niche, audience size, budget range. Takes 2 minutes.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className={styles.step}>
                <p className={styles.stepNumber}>Step 02</p>
                <div className={styles.stepIcon}>
                  <SparklesIcon />
                </div>
                <h3 className={styles.stepTitle}>We match the right creators</h3>
                <p className={styles.stepDesc}>
                  Our algorithm finds creators who actually fit — not just follower count, but audience overlap and content style.
                </p>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className={styles.step}>
                <p className={styles.stepNumber}>Step 03</p>
                <div className={styles.stepIcon}>
                  <HandshakeIcon />
                </div>
                <h3 className={styles.stepTitle}>Deal closes, everyone wins</h3>
                <p className={styles.stepDesc}>
                  Negotiate directly in-platform. When both sides agree, the deal is done. We take our cut, you keep the rest.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className={styles.commissionCallout}>
              <p className={styles.commissionHighlight}>
                Our cut: <span>10%</span> — only when a deal closes
              </p>
              <p className={styles.commissionSub}>
                No upfront fees. No hidden costs. You see every number.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className={styles.benefitsSection} id="benefits">
        <div className={styles.container}>
          <Reveal>
            <p className={styles.sectionLabel}>Why YT Matcher</p>
            <h2 className={styles.sectionTitle}>Built for both sides of the deal</h2>
          </Reveal>

          <div className={styles.benefitsGrid}>
            {/* Brand Card */}
            <Reveal delay={0}>
              <div className={`${styles.benefitCard} ${styles.benefitCardBrand}`} id="benefit-brand">
                <div className={styles.benefitCardHeader}>
                  <div className={styles.benefitCardIcon}>
                    <BriefcaseIcon />
                  </div>
                  <h3 className={styles.benefitCardTitle}>For Brands</h3>
                </div>
                <ul className={styles.benefitList}>
                  <li className={styles.benefitItem}>
                    <span className={styles.benefitIcon} aria-hidden="true">✦</span>
                    <span className={styles.benefitText}>Find creators that actually fit your niche — not just big numbers</span>
                  </li>
                  <li className={styles.benefitItem}>
                    <span className={styles.benefitIcon} aria-hidden="true">✦</span>
                    <span className={styles.benefitText}>See real channel stats and audience data before you reach out</span>
                  </li>
                  <li className={styles.benefitItem}>
                    <span className={styles.benefitIcon} aria-hidden="true">✦</span>
                    <span className={styles.benefitText}>Negotiate directly — no agency markup, no middleman</span>
                  </li>
                  <li className={styles.benefitItem}>
                    <span className={styles.benefitIcon} aria-hidden="true">✦</span>
                    <span className={styles.benefitText}>Track every deal from outreach to completion in one dashboard</span>
                  </li>
                </ul>
              </div>
            </Reveal>

            {/* Creator Card */}
            <Reveal delay={120}>
              <div className={`${styles.benefitCard} ${styles.benefitCardCreator}`} id="benefit-creator">
                <div className={styles.benefitCardHeader}>
                  <div className={styles.benefitCardIcon}>
                    <PlayCircleIcon />
                  </div>
                  <h3 className={styles.benefitCardTitle}>For Creators</h3>
                </div>
                <ul className={styles.benefitList}>
                  <li className={styles.benefitItem}>
                    <span className={styles.benefitIcon} aria-hidden="true">✦</span>
                    <span className={styles.benefitText}>Get discovered by real brands looking for your exact audience</span>
                  </li>
                  <li className={styles.benefitItem}>
                    <span className={styles.benefitIcon} aria-hidden="true">✦</span>
                    <span className={styles.benefitText}>See the full deal terms before you commit — complete transparency</span>
                  </li>
                  <li className={styles.benefitItem}>
                    <span className={styles.benefitIcon} aria-hidden="true">✦</span>
                    <span className={styles.benefitText}>No middleman markup — you keep 90% of every deal</span>
                  </li>
                  <li className={styles.benefitItem}>
                    <span className={styles.benefitIcon} aria-hidden="true">✦</span>
                    <span className={styles.benefitText}>Build your brand deal portfolio and track your sponsorship history</span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Transparency Calculator ── */}
      <section className={styles.transparencySection} id="transparency">
        <div className={styles.container}>
          <Reveal>
            <h2 className={styles.transparencyQuote}>
              &ldquo;We take <span>10%</span>. You see the math.&rdquo;
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <DealCalculator />
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.ctaSection} id="final-cta">
        <div className={styles.container}>
          <Reveal>
            <h2 className={styles.ctaHeadline}>Ready to find your match?</h2>
            <Link href={ctaHref} className={styles.ctaButton} id="final-cta-btn">
              {authState.loading ? 'Loading...' : ctaText}
            </Link>
            <p className={styles.ctaSub}>No credit card. No commitment.</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
