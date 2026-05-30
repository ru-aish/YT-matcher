'use client'

import { useState } from 'react'
import Reveal from './Reveal'
import styles from './Faq.module.css'

const QA = [
  {
    q: 'How does the match score work?',
    a: 'We weigh genuine audience overlap, niche, and tone between a brand and a creator — not raw subscriber counts. A higher score means the two audiences actually line up, so the first conversation starts from a good place.',
  },
  {
    q: 'What does it cost?',
    a: 'Browsing and matching are free. When a deal is agreed, we add one transparent service fee shown up front before anyone commits — what you agree to is exactly what you pay.',
  },
  {
    q: 'When does escrow go live?',
    a: 'Matching and real-time chat are live now. Protected payments via escrow are coming next — until then you will see a clearly marked placeholder where the funding step will be.',
  },
  {
    q: 'Is the chat really real-time?',
    a: 'Yes. Messages on a deal appear instantly for both sides, and an email nudge is sent if someone goes quiet so a deal never stalls in silence.',
  },
  {
    q: 'Can I be both a brand and a creator?',
    a: 'Absolutely. Your role just changes what you see first — you can switch sides any time from your account.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className={styles.root} id="faq">
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <p className={styles.eyebrow}>FAQ</p>
          <h2 className={styles.heading}>
            Questions, <em>answered.</em>
          </h2>
        </Reveal>

        <Reveal className={styles.list} delay={100}>
          {QA.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                <button
                  className={styles.q}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className={styles.plus} aria-hidden>
                    <i />
                    <i />
                  </span>
                </button>
                <div className={styles.answer} data-open={isOpen}>
                  <div className={styles.answerInner}>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
