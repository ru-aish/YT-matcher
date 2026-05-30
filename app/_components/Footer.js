import Link from 'next/link'
import { MatchMark } from './Nav'
import styles from './Footer.module.css'

const COLS = [
  {
    title: 'Product',
    links: [
      ['How it works', '/how-it-works'],
      ['Match Lab', '/#lab'],
      ['For creators', '/signup'],
      ['For brands', '/signup'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '#'],
      ['Careers', '#'],
      ['Contact', '#'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Privacy', '#'],
      ['Terms', '#'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand}>
            <MatchMark className={styles.mark} />
            <span>
              YT<span className={styles.dot}>·</span>Matcher
            </span>
          </Link>
          <p className={styles.tagline}>
            Where good taste meets good money. The marketplace for creators and brands.
          </p>
          <p className={styles.status}>
            <span className={styles.statusDot} /> v1 — matching &amp; chat live · escrow
            in progress
          </p>
        </div>

        <nav className={styles.cols}>
          {COLS.map((c) => (
            <div key={c.title} className={styles.col}>
              <p className={styles.colTitle}>{c.title}</p>
              <ul>
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.bottom}>
        <span>&copy; {new Date().getFullYear()} YT&middot;Matcher</span>
        <span className={styles.made}>Built on the open web</span>
      </div>
    </footer>
  )
}
