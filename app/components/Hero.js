'use client'

import { motion } from 'framer-motion'

const headlineWords = ['Where', 'Creators', 'Meet', 'Brands']

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: 'spring', damping: 12, stiffness: 100 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--bg-primary)]">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 animate-gradient-mesh opacity-60">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.15)_0%,transparent_70%)] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)] animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.08)_0%,transparent_60%)] animate-float-reverse" />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-3 h-3 border border-[var(--accent)]/30 rotate-45 animate-float-slow" />
        <div className="absolute top-[30%] right-[20%] w-2 h-2 rounded-full bg-[var(--accent-secondary)]/20 animate-float-slower" />
        <div className="absolute bottom-[25%] left-[15%] w-4 h-4 border border-[var(--accent-secondary)]/20 rotate-12 animate-float-reverse" />
        <div className="absolute top-[60%] left-[40%] w-2 h-2 rounded-full bg-[var(--accent)]/15 animate-float-slow" />
        <div className="absolute top-[20%] right-[35%] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-[var(--accent)]/20 animate-float-slower" />
        <div className="absolute bottom-[35%] right-[10%] w-3 h-3 border border-[var(--accent)]/20 rounded-full animate-float-reverse" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center">
        {/* Left content - 60% */}
        <div className="lg:w-[60%] w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className={`inline-block mr-4 ${
                    word === 'Creators' ? 'text-[var(--accent)]' : 
                    word === 'Brands' ? 'text-[var(--accent-secondary)]' : 
                    'text-[var(--text-primary)]'
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.9 }}
            className="font-[family-name:var(--font-outfit)] text-lg md:text-xl text-[var(--text-secondary)] max-w-xl mb-10 leading-relaxed"
          >
            The intelligent matchmaking platform that connects YouTube creators with brands 
            for authentic, high-performing partnerships. Powered by smart algorithms, driven by results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button className="group relative px-8 py-4 bg-[var(--accent)] text-[var(--bg-primary)] font-[family-name:var(--font-space-grotesk)] font-semibold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <span className="relative z-10">Join as Creator</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button className="group px-8 py-4 border-2 border-[var(--accent-secondary)] text-[var(--accent-secondary)] font-[family-name:var(--font-space-grotesk)] font-semibold text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:bg-[var(--accent-secondary)]/10">
              Find Creators
            </button>
          </motion.div>
        </div>

        {/* Right decorative visual - 40% */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
          className="lg:w-[40%] w-full mt-16 lg:mt-0 flex justify-center items-center relative"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            {/* Overlapping circles with gradient fills */}
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-transparent blur-sm animate-float-slow" />
            <div className="absolute bottom-8 left-4 w-48 h-48 rounded-full bg-gradient-to-tr from-[var(--accent-secondary)]/20 to-transparent blur-sm animate-float-slower" />
            <div className="absolute top-16 left-16 w-40 h-40 rounded-full bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent-secondary)]/10 backdrop-blur-md border border-white/5 animate-float-reverse" />
            <div className="absolute top-24 right-12 w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--accent-secondary)]/30 to-transparent animate-float-slow" />
            {/* Inner decorative ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-dashed border-[var(--accent)]/20 animate-spin-slow" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
