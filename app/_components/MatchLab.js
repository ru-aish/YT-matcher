'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Reveal from './Reveal'
import styles from './MatchLab.module.css'

const NICHES = ['Tech', 'Gaming', 'Beauty', 'Finance', 'Food']

const CREATORS = [
  { id: 'aria', name: 'Aria Vale', handle: '@ariabuilds', tags: ['Tech'], subs: 420, rate: 1800, hue: 14, base: 86, blurb: 'Calm, deep-dive product reviews for builders.' },
  { id: 'niko', name: 'Niko Frame', handle: '@nikoframe', tags: ['Gaming'], subs: 1200, rate: 5200, hue: 230, base: 80, blurb: 'High-energy playthroughs with a loyal core.' },
  { id: 'lumen', name: 'Lumen', handle: '@lumenglow', tags: ['Beauty'], subs: 780, rate: 3400, hue: 330, base: 88, blurb: 'Honest, cinematic skincare storytelling.' },
  { id: 'ledger', name: 'The Ledger', handle: '@theledger', tags: ['Finance'], subs: 240, rate: 2600, hue: 200, base: 91, blurb: 'Plain-English money breakdowns, weekly.' },
  { id: 'saffron', name: 'Saffron', handle: '@saffroneats', tags: ['Food'], subs: 560, rate: 2200, hue: 28, base: 84, blurb: 'Slow recipes, fast appetite. Big watch time.' },
  { id: 'pixel', name: 'Pixel Theory', handle: '@pixeltheory', tags: ['Tech', 'Gaming'], subs: 950, rate: 4100, hue: 268, base: 82, blurb: 'Where hardware nerds meet frame-rate fiends.' },
]

function scoreOf(c, niches) {
  if (niches.length === 0) return Math.min(99, c.base)
  const overlap = c.tags.filter((t) => niches.includes(t)).length
  if (overlap === 0) return Math.max(41, c.base - 34)
  return Math.min(99, c.base + overlap * 6)
}

function buildScript(c, role) {
  const counterpart = role === 'brand' ? c.name.split(' ')[0] : 'Northwind'
  const niche = c.tags[0].toLowerCase()
  return [
    { from: 'them', text: `Hey! Saw you're after a ${niche} collab.` },
    { from: 'you', text: `Yeah — thinking a 60s dedicated slot. Free next week?` },
    { from: 'them', text: `For sure. My rate for that is $${c.rate.toLocaleString()}.` },
    { from: 'you', text: `Works for us. Opening the deal now.` },
    { from: 'system', text: `Deal opened with ${counterpart} · escrow coming soon` },
  ]
}

export default function MatchLab() {
  const [role, setRole] = useState('brand')
  const [niches, setNiches] = useState([])
  const [minSubs, setMinSubs] = useState(0)
  const [selected, setSelected] = useState(null)
  const [thread, setThread] = useState([])
  const [typing, setTyping] = useState(false)
  const screenRef = useRef(null)

  const ranked = useMemo(
    () =>
      CREATORS.filter((c) => c.subs >= minSubs)
        .map((c) => ({ ...c, score: scoreOf(c, niches) }))
        .sort((a, b) => b.score - a.score),
    [niches, minSubs]
  )

  const toggleNiche = (n) =>
    setNiches((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]))

  useEffect(() => {
    if (!selected) return
    const script = buildScript(selected, role)
    setThread([])
    setTyping(false)
    const timers = []
    let acc = 450
    script.forEach((m) => {
      if (m.from !== 'system') {
        timers.push(setTimeout(() => setTyping(true), acc))
        acc += 950
      } else {
        acc += 350
      }
      timers.push(
        setTimeout(() => {
          setTyping(false)
          setThread((t) => [...t, m])
        }, acc)
      )
      acc += 460
    })
    return () => timers.forEach(clearTimeout)
  }, [selected, role])

  const onMove = (e) => {
    const el = screenRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const tilt = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-py * 6).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(px * 8).toFixed(2)}deg`)
  }
  const untilt = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }

  return (
    <section className={styles.root} id="lab">
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <p className={styles.eyebrow}>Try it live</p>
          <h2 className={styles.heading}>
            Try the match engine — <em>right here.</em>
          </h2>
          <p className={styles.dek}>
            Filter the roster and watch the ranking re-order in real time. Open a deal
            to see how the live conversation starts. No signup, no catch.
          </p>
        </Reveal>

        <Reveal className={styles.windowWrap} delay={120}>
          <div className={styles.window}>
            <div className={styles.chrome}>
              <span className={styles.dots}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.url}>yt-matcher.app/match</span>
              <span className={styles.count}>
                <b>{ranked.length}</b> {ranked.length === 1 ? 'match' : 'matches'}
              </span>
            </div>

            <div className={styles.screen} ref={screenRef} onMouseMove={onMove}>
              <div className={styles.glow} aria-hidden />

              <div className={styles.controls}>
                <div className={styles.roleToggle}>
                  <button
                    className={role === 'brand' ? styles.roleOn : styles.roleOff}
                    onClick={() => setRole('brand')}
                  >
                    I&apos;m a Brand
                  </button>
                  <button
                    className={role === 'creator' ? styles.roleOn : styles.roleOff}
                    onClick={() => setRole('creator')}
                  >
                    I&apos;m a Creator
                  </button>
                </div>

                <div className={styles.chips}>
                  {NICHES.map((n) => (
                    <button
                      key={n}
                      onClick={() => toggleNiche(n)}
                      className={`${styles.chip} ${niches.includes(n) ? styles.chipOn : ''}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <label className={styles.slider}>
                  <span className={styles.sliderLabel}>
                    Min reach <b>{minSubs}k</b>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1200"
                    step="20"
                    value={minSubs}
                    onChange={(e) => setMinSubs(Number(e.target.value))}
                    aria-label="Minimum subscriber reach"
                  />
                </label>
              </div>

              <div className={styles.body}>
                <ul className={styles.cards}>
                  {ranked.map((c) => (
                    <li
                      key={c.id}
                      className={`${styles.card} ${selected?.id === c.id ? styles.cardActive : ''}`}
                      onMouseMove={tilt}
                      onMouseLeave={untilt}
                    >
                      <div className={styles.cardInner}>
                        <div className={styles.cardTop}>
                          <span
                            className={styles.avatar}
                            style={{
                              background: `radial-gradient(circle at 30% 30%, hsl(${c.hue} 85% 64%), hsl(${c.hue + 24} 70% 42%))`,
                            }}
                          />
                          <div className={styles.who}>
                            <p className={styles.cName}>{c.name}</p>
                            <p className={styles.cHandle}>{c.handle}</p>
                          </div>
                          <span className={styles.fit}>
                            {c.score}
                            <small>% fit</small>
                          </span>
                        </div>
                        <p className={styles.blurb}>{c.blurb}</p>
                        <div className={styles.meta}>
                          <span>{c.subs}k subs</span>
                          <span className={styles.tagRow}>
                            {c.tags.map((t) => (
                              <em key={t}>{t}</em>
                            ))}
                          </span>
                        </div>
                        <button className={styles.deal} onClick={() => setSelected(c)}>
                          Open deal →
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <aside className={styles.chatPanel}>
                  {!selected ? (
                    <div className={styles.empty}>
                      <span className={styles.emptyMark} aria-hidden>
                        ⌁
                      </span>
                      <p>Open a deal to start a live conversation.</p>
                    </div>
                  ) : (
                    <>
                      <div className={styles.chatHead}>
                        <span
                          className={styles.chatAv}
                          style={{
                            background: `radial-gradient(circle at 30% 30%, hsl(${selected.hue} 85% 64%), hsl(${selected.hue + 24} 70% 42%))`,
                          }}
                        />
                        <div>
                          <p className={styles.cName}>{selected.name}</p>
                          <p className={styles.live}>
                            <span className={styles.liveDot} /> live now
                          </p>
                        </div>
                      </div>
                      <div className={styles.thread}>
                        {thread.map((m, i) =>
                          m.from === 'system' ? (
                            <p key={i} className={styles.sys}>
                              {m.text}
                            </p>
                          ) : (
                            <p
                              key={i}
                              className={m.from === 'you' ? styles.you : styles.them}
                            >
                              {m.text}
                            </p>
                          )
                        )}
                        {typing && (
                          <p className={styles.them}>
                            <span className={styles.typing}>
                              <i />
                              <i />
                              <i />
                            </span>
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </aside>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
