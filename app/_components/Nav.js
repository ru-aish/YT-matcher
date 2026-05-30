'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Nav.module.css'

const LINKS = [
  { label: 'How it works', href: '/#how' },
  { label: 'Match Lab', href: '/#lab' },
  { label: 'Trust', href: '/#trust' },
  { label: 'Stories', href: '/#voices' },
]

export function MatchMark({ className }) {
  return (
    <svg
      className={className}
      width="30"
      height="22"
      viewBox="0 0 30 22"
      aria-hidden
      focusable="false"
    >
      <circle cx="11" cy="11" r="9" fill="var(--coral)" fillOpacity="0.9" />
      <circle cx="19" cy="11" r="9" fill="var(--blue)" fillOpacity="0.78" />
      <circle cx="15" cy="11" r="3.1" fill="var(--paper)" />
    </svg>
  )
}

// Signed-in CTA: Dashboard + Sign out. Only rendered once Clerk hooks load.
function AuthedActions({ useAuth, useClerk }) {
  const { isSignedIn, isLoaded } = useAuth()
  const { signOut } = useClerk()

  // While Clerk resolves, show the default signed-out CTA to avoid a flash.
  if (!isLoaded) return <SignedOutActions />

  if (isSignedIn) {
    return (
      <>
        <button
          type="button"
          className={styles.signin}
          onClick={() => signOut({ redirectUrl: '/' })}
        >
          Sign out
        </button>
        <Link href="/dashboard" className={styles.cta}>
          Go to dashboard →
        </Link>
      </>
    )
  }
  return <SignedOutActions />
}

function SignedOutActions() {
  return (
    <>
      <Link href="/login" className={styles.signin}>
        Sign in
      </Link>
      <Link href="/signup" className={styles.cta}>
        Find your match
      </Link>
    </>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [clerkHooks, setClerkHooks] = useState(null)
  const [authState, setAuthState] = useState({ loaded: false, signedIn: false })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Dynamically load Clerk auth hooks; gracefully no-op if Clerk isn't configured.
  useEffect(() => {
    let active = true
    async function loadClerk() {
      try {
        if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return
        const clerk = await import('@clerk/nextjs')
        if (active && clerk.useAuth && clerk.useClerk) {
          setClerkHooks({ useAuth: clerk.useAuth, useClerk: clerk.useClerk })
        }
      } catch {
        /* Clerk unavailable — keep the signed-out CTA. */
      }
    }
    loadClerk()
    return () => {
      active = false
    }
  }, [])

  return (
    <header className={`${styles.root} ${scrolled ? styles.solid : ''}`}>
      <nav className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <MatchMark className={styles.mark} />
          <span>
            YT<span className={styles.dot}>·</span>Matcher
          </span>
        </Link>

        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {clerkHooks ? (
            <AuthStateReporter
              useAuth={clerkHooks.useAuth}
              useClerk={clerkHooks.useClerk}
              onState={setAuthState}
            />
          ) : (
            <SignedOutActions />
          )}
          <button
            className={styles.burger}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span data-open={open} />
          </button>
        </div>
      </nav>

      {open && (
        <div className={styles.sheet}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          {authState.loaded && authState.signedIn ? (
            <Link href="/dashboard" className={styles.sheetCta} onClick={() => setOpen(false)}>
              Go to dashboard →
            </Link>
          ) : (
            <Link href="/signup" className={styles.sheetCta} onClick={() => setOpen(false)}>
              Find your match →
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

// Renders the desktop actions AND lifts auth state up for the mobile sheet.
function AuthStateReporter({ useAuth, useClerk, onState }) {
  const auth = useAuth()
  useEffect(() => {
    onState({ loaded: auth.isLoaded, signedIn: Boolean(auth.isSignedIn) })
  }, [auth.isLoaded, auth.isSignedIn, onState])
  return <AuthedActions useAuth={useAuth} useClerk={useClerk} />
}
