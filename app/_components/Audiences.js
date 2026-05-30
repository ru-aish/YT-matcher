'use client'

import { useState } from 'react'
import Link from 'next/link'
import Reveal from './Reveal'
import styles from './Audiences.module.css'

const ICONS = {
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  tag: (
    <>
      <path d="M4 4h7l9 9-7 7-9-9z" />
      <circle cx="8.5" cy="8.5" r="1.4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.4 7.7-8 9-4.6-1.3-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  chart: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  thread: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 9h16M8 13h6" />
    </>
  ),
}

const DATA = {
  creator: {
    blurb: 'Stop pitching into the void. Let the right brands find you.',
    cta: 'Join as a Creator',
    href: '/sign-up?role=creator',
    items: [
      { icon: 'target', t: 'Found for fit', d: 'Ranked on real audience overlap and tone — not raw subscriber count.' },
      { icon: 'tag', t: 'Your rate, your call', d: 'Set your price up front. No awkward haggling buried in DMs.' },
      { icon: 'shield', t: 'Never chase an invoice', d: 'Escrow holds the money before you start, so payment is a given.' },
      { icon: 'bolt', t: 'Deals that move', d: 'Real-time chat plus email nudges keep brands from going quiet.' },
    ],
  },
  brand: {
    blurb: 'Skip the agency markup. Reach creators whose audience is actually yours.',
    cta: 'Join as a Brand',
    href: '/sign-up?role=brand',
    items: [
      { icon: 'chart', t: 'Signal over vanity', d: 'See genuine engagement and audience overlap before you reach out.' },
      { icon: 'target', t: 'Pre-qualified matches', d: 'Every intro is scored for fit, so your shortlist starts strong.' },
      { icon: 'thread', t: 'One thread per deal', d: 'Scope, price, and timeline in a single shared, on-record space.' },
      { icon: 'shield', t: 'Pay on delivery', d: 'Escrow releases when the work ships. Budget protected end to end.' },
    ],
  },
}

export default function Audiences() {
  const [tab, setTab] = useState('creator')
  const d = DATA[tab]

  return (
    <section className={styles.root} id="who">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <Reveal>
            <p className={styles.eyebrow}>Two sides, one table</p>
            <h2 className={styles.heading}>
              Built for <em>both</em> of you.
            </h2>

            <div className={styles.tabs} role="tablist" aria-label="Choose your side">
              <button
                role="tab"
                aria-selected={tab === 'creator'}
                className={tab === 'creator' ? styles.tabOn : styles.tabOff}
                onClick={() => setTab('creator')}
              >
                For Creators
              </button>
              <button
                role="tab"
                aria-selected={tab === 'brand'}
                className={tab === 'brand' ? styles.tabOn : styles.tabOff}
                onClick={() => setTab('brand')}
              >
                For Brands
              </button>
            </div>

            <p className={styles.blurb} key={tab}>
              {d.blurb}
            </p>

            <Link href={d.href} className={styles.cta}>
              {d.cta} <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        <div className={styles.grid} key={tab}>
          {d.items.map((it, i) => (
            <article key={it.t} className={styles.item} style={{ '--i': i }}>
              <span className={styles.icon} aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[it.icon]}
                </svg>
              </span>
              <h3 className={styles.itemTitle}>{it.t}</h3>
              <p className={styles.itemBody}>{it.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
