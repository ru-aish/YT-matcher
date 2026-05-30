'use client'

import { useState } from 'react'
import styles from './ClosingCta.module.css'

export default function ClosingCta() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  return (
    <section className={styles.root} id="cta">
      <div className={styles.marquee} aria-hidden>
        <div className={styles.track}>
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              MATCH&nbsp;·&nbsp; AGREE&nbsp;·&nbsp; DELIVER&nbsp;·&nbsp; GET&nbsp;PAID&nbsp;·&nbsp;
              MATCH&nbsp;·&nbsp; AGREE&nbsp;·&nbsp; DELIVER&nbsp;·&nbsp; GET&nbsp;PAID&nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className={styles.inner}>
        <h2 className={styles.headline}>
          Your next great collab
          <br />
          is <em>one match</em> away.
        </h2>
        <p className={styles.sub}>
          Join free as a brand or a creator. Browse the roster, find your fit, and open
          a deal in minutes.
        </p>

        {sent ? (
          <p className={styles.thanks} role="status">
            You&apos;re on the list — we&apos;ll be in touch at{' '}
            <strong>{email}</strong>. ✦
          </p>
        ) : (
          <form className={styles.form} onSubmit={submit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              className={styles.input}
              aria-label="Email address"
            />
            <button type="submit" className={styles.button}>
              Get early access
            </button>
          </form>
        )}

        <p className={styles.fine}>Free to join · no card required</p>
      </div>
    </section>
  )
}
