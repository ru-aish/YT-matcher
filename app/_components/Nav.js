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

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
          <Link href="/login" className={styles.signin}>
            Sign in
          </Link>
          <Link href="/signup" className={styles.cta}>
            Find your match
          </Link>
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
          <Link href="/signup" className={styles.sheetCta} onClick={() => setOpen(false)}>
            Find your match →
          </Link>
        </div>
      )}
    </header>
  )
}
