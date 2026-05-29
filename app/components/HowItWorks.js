'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Create Profile',
    description: 'Set up your creator or brand profile with your niche, audience stats, and partnership goals.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="14" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Smart Matching',
    description: 'Our algorithm analyzes compatibility, audience overlap, and brand alignment for perfect matches.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4l4 8h8l-6 5 2 8-8-5-8 5 2-8-6-5h8l4-8z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Connect',
    description: 'Reach out to your matches directly through our platform. Chat, negotiate, and align on vision.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 20c0-2 2-6 6-6s4 4 6 4 2-4 6-4 6 4 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M14 26v4M26 26v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 34h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Close Deal',
    description: 'Finalize partnerships, track deliverables, and watch your collaboration come to life.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      type: 'spring',
      damping: 15,
      stiffness: 80,
    },
  }),
}

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24 px-6 lg:px-12 bg-[var(--bg-secondary)] overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-secondary) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section title */}
        <div className="text-center mb-20">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            How It Works
          </h2>
          <div className="w-20 h-1 bg-[var(--accent)] mx-auto rounded-full" />
        </div>

        {/* Steps container */}
        <div ref={ref} className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[2px] -translate-y-1/2 border-t-2 border-dashed border-[var(--accent)]/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="group relative bg-[var(--bg-tertiary)] border border-white/5 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(245,158,11,0.08)] hover:border-[var(--accent)]/20"
              >
                {/* Step number */}
                <div className="font-[family-name:var(--font-space-grotesk)] text-5xl font-bold text-[var(--accent)]/20 absolute top-4 right-6 group-hover:text-[var(--accent)]/40 transition-colors duration-300">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-6 group-hover:bg-[var(--accent)]/20 transition-colors duration-300">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--text-primary)] mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-[family-name:var(--font-outfit)] text-sm text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
