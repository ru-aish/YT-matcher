'use client'

import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section className="relative py-24 px-6 lg:px-12 bg-[var(--bg-secondary)] overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Background gradient mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section headline */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)]"
          >
            Ready to Start?
          </motion.h2>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Creator card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ type: 'spring', damping: 15, stiffness: 80 }}
            className="group relative bg-[var(--bg-tertiary)] border border-[var(--accent)]/20 rounded-2xl p-8 lg:p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(245,158,11,0.1)] hover:border-[var(--accent)]/40"
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-6 group-hover:bg-[var(--accent)]/20 transition-colors duration-300">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="6" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
                <circle cx="14" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 24h8M14 20v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4">
              I&apos;m a Creator
            </h3>

            <ul className="space-y-3 mb-8">
              {['Get matched with brands that fit your niche', 'Access exclusive partnership opportunities', 'Grow your revenue with data-driven deals'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-[family-name:var(--font-outfit)] text-[var(--text-secondary)] text-sm">
                  <svg className="flex-shrink-0 w-5 h-5 text-[var(--accent)] mt-0.5" viewBox="0 0 20 20" fill="none">
                    <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <button className="w-full py-3.5 bg-[var(--accent)] text-[var(--bg-primary)] font-[family-name:var(--font-space-grotesk)] font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110">
              Get Started
            </button>
          </motion.div>

          {/* Brand card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ type: 'spring', damping: 15, stiffness: 80 }}
            className="group relative bg-[var(--bg-tertiary)] border border-[var(--accent-secondary)]/20 rounded-2xl p-8 lg:p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(6,182,212,0.1)] hover:border-[var(--accent-secondary)]/40"
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] mb-6 group-hover:bg-[var(--accent-secondary)]/20 transition-colors duration-300">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="6" y="10" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M10 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="17" r="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>

            <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4">
              I&apos;m a Brand
            </h3>

            <ul className="space-y-3 mb-8">
              {['Find creators with verified audience data', 'AI-powered matching for authentic partnerships', 'Track campaign performance in real-time'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-[family-name:var(--font-outfit)] text-[var(--text-secondary)] text-sm">
                  <svg className="flex-shrink-0 w-5 h-5 text-[var(--accent-secondary)] mt-0.5" viewBox="0 0 20 20" fill="none">
                    <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <button className="w-full py-3.5 bg-[var(--accent-secondary)] text-[var(--bg-primary)] font-[family-name:var(--font-space-grotesk)] font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:brightness-110">
              Get Started
            </button>
          </motion.div>
        </div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center font-[family-name:var(--font-outfit)] text-[var(--text-secondary)] text-sm"
        >
          Join 12,500+ creators and brands already matched
        </motion.p>
      </div>
    </section>
  )
}
