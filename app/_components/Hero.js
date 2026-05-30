'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Hero.module.css'

const COPY = {
  brand: {
    dek: 'Find creators worth backing — ranked by real audience fit, not follower vanity. Open a deal, agree in the open, and release payment only when the work ships.',
    cta: 'Find creators',
  },
  creator: {
    dek: 'Find deals worth doing — brands matched to your niche and your tone. Set your rate, chat in real time, and get paid through escrow, not promises.',
    cta: 'Find deals',
  },
}

// Decorative "match constellation" — creators & brands linked by fit.
function Constellation() {
  const nodes = [
    { x: 60, y: 70, r: 6, c: 'b' },
    { x: 150, y: 40, r: 9, c: 'c' },
    { x: 250, y: 96, r: 5, c: 'i' },
    { x: 330, y: 52, r: 7, c: 'b' },
    { x: 110, y: 150, r: 5, c: 'i' },
    { x: 210, y: 186, r: 10, c: 'c' },
    { x: 300, y: 160, r: 6, c: 'b' },
    { x: 78, y: 246, r: 7, c: 'c' },
    { x: 178, y: 286, r: 5, c: 'i' },
    { x: 286, y: 256, r: 8, c: 'b' },
    { x: 356, y: 210, r: 5, c: 'i' },
  ]
  const links = [
    [0, 1],
    [1, 2],
    [1, 4],
    [2, 5],
    [3, 6],
    [4, 7],
    [5, 8],
    [5, 9],
    [6, 9],
    [9, 10],
  ]
  const matches = [
    [1, 5],
    [3, 9],
    [7, 5],
  ]
  const fill = { c: 'var(--coral)', b: 'var(--blue)', i: 'var(--ink)' }

  return (
    <svg
      className={styles.constellation}
      viewBox="0 0 410 330"
      aria-hidden
      focusable="false"
    >
      <g className={styles.cLines}>
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="var(--ink)"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        ))}
      </g>
      <g>
        {matches.map(([a, b], i) => (
          <line
            key={i}
            className={styles.matchLine}
            style={{ animationDelay: `${i * 0.9}s` }}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="var(--coral)"
            strokeWidth="1.6"
          />
        ))}
      </g>
      <g>
        {nodes.map((n, i) => (
          <circle
            key={i}
            className={styles.node}
            style={{ animationDelay: `${(i % 5) * 0.4}s` }}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={fill[n.c]}
            fillOpacity={n.c === 'i' ? 0.35 : 0.92}
          />
        ))}
      </g>
    </svg>
  )
}

export default function Hero() {
  const [who, setWho] = useState('brand')
  const copy = COPY[who]

  return (
    <section className={styles.root}>
      <div className={styles.bloom} aria-hidden />
      <Constellation />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span className={styles.live} /> Creator &times; Brand marketplace
        </p>

        <h1 className={styles.headline}>
          Where <span className={styles.italic}>good taste</span>
          <br />
          meets <span className={styles.outline}>good</span> money.
        </h1>

        <p className={styles.dek} key={who}>
          {copy.dek}
        </p>

        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>I&apos;m a</span>
          <div className={styles.toggle} data-who={who}>
            <button
              className={who === 'brand' ? styles.on : styles.off}
              onClick={() => setWho('brand')}
            >
              Brand
            </button>
            <button
              className={who === 'creator' ? styles.on : styles.off}
              onClick={() => setWho('creator')}
            >
              Creator
            </button>
          </div>
        </div>

        <div className={styles.cta}>
          <Link href={`/sign-up?role=${who}`} className={styles.primary}>
            {copy.cta}
          </Link>
          <a href="#how" className={styles.secondary}>
            See how it works ↗
          </a>
        </div>

        <p className={styles.assurance}>
          No cold email &nbsp;·&nbsp; escrow-backed &nbsp;·&nbsp; you&apos;re live in 2 minutes
        </p>
      </div>
    </section>
  )
}
