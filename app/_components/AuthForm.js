'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MatchMark } from './Nav'
import styles from './AuthForm.module.css'

export default function AuthForm({ mode = 'in', initialRole = 'creator' }) {
  const router = useRouter()
  const [role, setRole] = useState(initialRole)
  const isUp = mode === 'up'

  const submit = (e) => {
    e.preventDefault()
    router.push(`/dashboard/${role}`)
  }

  return (
    <main className={styles.root}>
      <div className={styles.bloom} aria-hidden />

      <div className={styles.card}>
        <Link href="/" className={styles.brand}>
          <MatchMark className={styles.mark} />
          <span>
            YT<span className={styles.dot}>·</span>Matcher
          </span>
        </Link>

        <h1 className={styles.title}>
          {isUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className={styles.sub}>
          {isUp
            ? 'Pick your side and start matching in minutes.'
            : 'Sign in to pick up where your deals left off.'}
        </p>

        <div className={styles.roleToggle} role="tablist" aria-label="Account type">
          <button
            type="button"
            role="tab"
            aria-selected={role === 'creator'}
            className={role === 'creator' ? styles.roleOn : styles.roleOff}
            onClick={() => setRole('creator')}
          >
            I&apos;m a Creator
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'brand'}
            className={role === 'brand' ? styles.roleOn : styles.roleOff}
            onClick={() => setRole('brand')}
          >
            I&apos;m a Brand
          </button>
        </div>

        <form className={styles.form} onSubmit={submit}>
          {isUp && (
            <label className={styles.field}>
              <span>{role === 'brand' ? 'Brand name' : 'Channel name'}</span>
              <input
                type="text"
                placeholder={role === 'brand' ? 'Northwind Co.' : 'Your channel'}
                autoComplete="organization"
              />
            </label>
          )}
          <label className={styles.field}>
            <span>Email</span>
            <input type="email" required placeholder="you@studio.com" autoComplete="email" />
          </label>
          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              required
              placeholder="••••••••"
              autoComplete={isUp ? 'new-password' : 'current-password'}
            />
          </label>

          <button type="submit" className={styles.submit}>
            {isUp ? 'Create account' : 'Sign in'} <span aria-hidden>→</span>
          </button>
        </form>

        <p className={styles.switch}>
          {isUp ? (
            <>
              Already have an account? <Link href="/sign-in">Sign in</Link>
            </>
          ) : (
            <>
              New to YT&middot;Matcher? <Link href="/sign-up">Create one</Link>
            </>
          )}
        </p>

        <p className={styles.demoNote}>Demo preview — authentication isn&apos;t wired up yet.</p>
      </div>

      <Link href="/" className={styles.back}>
        ← Back to home
      </Link>
    </main>
  )
}
