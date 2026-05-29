'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let rafId
    const duration = 2000
    const startTime = performance.now()

    function animate(currentTime) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(eased * target)
      setCount(current)
      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [isInView, target])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

const stats = [
  { value: 10000, suffix: '+', label: 'Creators' },
  { value: 2500, suffix: '+', label: 'Brands' },
  { value: 5, prefix: '$', suffix: 'M+', label: 'Deals Closed' },
  { value: 98, suffix: '%', label: 'Match Rate' },
]

const brands = [
  'TechCorp', 'GameHub', 'FitLife', 'EduPro', 'StyleCo', 'CloudNine',
  'DataFlow', 'PixelArt', 'VibeLab', 'NovaTech', 'ZenMedia', 'BrewHQ',
]

const testimonials = [
  {
    quote: 'YT Matcher connected us with creators who genuinely love our product. The engagement was 3x our usual campaigns.',
    name: 'Sarah Mitchell',
    role: 'Marketing Director, TechCorp',
  },
  {
    quote: "I went from cold-pitching brands to getting matched with companies that align with my content. Game changer.",
    name: 'Marcus Rivera',
    role: 'Tech Creator, 850K subscribers',
  },
  {
    quote: 'The matching algorithm is incredibly accurate. Every partnership has been a perfect fit for our brand voice.',
    name: 'Emily Chang',
    role: 'Brand Manager, StyleCo',
  },
]

export default function SocialProof() {
  const sectionRef = useRef(null)

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 lg:px-12 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(30,30,46,0.5) 0%, var(--bg-primary) 70%)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} />
              </div>
              <p className="font-[family-name:var(--font-outfit)] text-[var(--text-secondary)] text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Brand marquee */}
        <div className="relative mb-20 overflow-hidden py-6">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10" />
          <div className="flex animate-marquee gap-8">
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={`${brand}-${i}`}
                className="flex-shrink-0 px-8 py-3 bg-[var(--bg-secondary)] border border-white/5 rounded-lg flex items-center justify-center"
              >
                <span className="font-[family-name:var(--font-space-grotesk)] text-[var(--text-secondary)] text-sm font-medium whitespace-nowrap">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-[var(--bg-secondary)] border border-white/5 rounded-2xl p-8 relative"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-6 font-[family-name:var(--font-space-grotesk)] text-6xl text-[var(--accent)]/10 leading-none">
                &ldquo;
              </div>

              <p className="font-[family-name:var(--font-outfit)] text-[var(--text-secondary)] text-sm leading-relaxed mb-6 relative z-10">
                {testimonial.quote}
              </p>

              <div>
                <p className="font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)] font-semibold text-sm">
                  {testimonial.name}
                </p>
                <p className="font-[family-name:var(--font-outfit)] text-[var(--text-secondary)] text-xs">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
