'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const creators = [
  { id: 1, name: 'Alex Chen', initials: 'AC', niche: 'Tech', subscribers: '1.2M', engagement: '8.4%', color: '#F59E0B', bio: 'Tech reviews and startup deep-dives' },
  { id: 2, name: 'Maya Lopez', initials: 'ML', niche: 'Gaming', subscribers: '890K', engagement: '12.1%', color: '#06B6D4', bio: 'Competitive gaming and hardware reviews' },
  { id: 3, name: 'James Park', initials: 'JP', niche: 'Lifestyle', subscribers: '2.1M', engagement: '6.7%', color: '#8B5CF6', bio: 'Daily vlogs and lifestyle optimization' },
  { id: 4, name: 'Sara Kim', initials: 'SK', niche: 'Education', subscribers: '560K', engagement: '15.3%', color: '#10B981', bio: 'Science explainers and study tips' },
  { id: 5, name: 'Dev Patel', initials: 'DP', niche: 'Tech', subscribers: '340K', engagement: '9.8%', color: '#F59E0B', bio: 'Coding tutorials and SaaS breakdowns' },
  { id: 6, name: 'Nia Brooks', initials: 'NB', niche: 'Lifestyle', subscribers: '1.5M', engagement: '7.2%', color: '#8B5CF6', bio: 'Fashion, wellness, and brand collabs' },
]

const categories = ['All', 'Tech', 'Gaming', 'Lifestyle', 'Education']

export default function InteractiveDemo() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [matchedIds, setMatchedIds] = useState([])

  const filteredCreators = creators.filter((c) => {
    if (matchedIds.includes(c.id)) return false
    if (activeFilter === 'All') return true
    return c.niche === activeFilter
  })

  const handleMatch = (id) => {
    setMatchedIds((prev) => [...prev, id])
  }

  return (
    <section className="relative py-24 px-6 lg:px-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            See Matching in Action
          </h2>
          <p className="font-[family-name:var(--font-outfit)] text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
            Filter by niche and match with creators instantly. Try it out below.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full font-[family-name:var(--font-outfit)] font-medium text-sm transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Creator cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCreators.map((creator) => (
              <motion.div
                key={creator.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0, transition: { type: 'spring', damping: 15, stiffness: 200 } }}
                transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                className="group relative bg-[var(--bg-secondary)] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-[0_0_40px_rgba(245,158,11,0.06)]"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-[family-name:var(--font-space-grotesk)] font-bold text-lg text-white"
                    style={{ backgroundColor: creator.color + '30', color: creator.color }}
                  >
                    {creator.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--text-primary)]">
                      {creator.name}
                    </h3>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mt-1"
                      style={{ backgroundColor: creator.color + '20', color: creator.color }}
                    >
                      {creator.niche}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-outfit)]">Subscribers</p>
                    <p className="text-lg font-semibold text-[var(--text-primary)] font-[family-name:var(--font-space-grotesk)]">
                      {creator.subscribers}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-outfit)]">Engagement</p>
                    <p className="text-lg font-semibold text-[var(--accent)] font-[family-name:var(--font-space-grotesk)]">
                      {creator.engagement}
                    </p>
                  </div>
                </div>

                {/* Bio - shows on hover */}
                <p className="mt-3 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-outfit)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {creator.bio}
                </p>

                {/* Match button */}
                <button
                  onClick={() => handleMatch(creator.id)}
                  className="mt-4 w-full py-2.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] font-[family-name:var(--font-space-grotesk)] font-semibold text-sm border border-[var(--accent)]/20 transition-all duration-300 hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                >
                  Match
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Matched indicator */}
        {matchedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] font-[family-name:var(--font-outfit)] text-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {matchedIds.length} creator{matchedIds.length > 1 ? 's' : ''} matched!
            </span>
          </motion.div>
        )}
      </div>
    </section>
  )
}
