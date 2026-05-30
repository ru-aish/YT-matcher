'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'brand',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Cookie is set by the API route, redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.page}>
      {/* Back to home */}
      <Link href="/" style={styles.backLink}>
        ← Back to home
      </Link>

      <div style={styles.container}>
        {/* Left side - branding */}
        <div style={styles.brandSide}>
          <div style={styles.brandContent}>
            <div style={styles.brandLogo}>
              <span style={styles.logoDot}>●</span>
              <span style={styles.logoText}>YT-Matcher</span>
            </div>
            <h1 style={styles.brandTitle}>
              Where <em style={styles.brandItalic}>good taste</em> meets good money.
            </h1>
            <p style={styles.brandDesc}>
              Join thousands of creators and brands already making meaningful partnerships happen.
            </p>
            <div style={styles.brandStats}>
              <div style={styles.brandStat}>
                <span style={styles.brandStatNum}>2,400+</span>
                <span style={styles.brandStatLabel}>creators</span>
              </div>
              <div style={styles.brandStat}>
                <span style={styles.brandStatNum}>$1.9M</span>
                <span style={styles.brandStatLabel}>in deals</span>
              </div>
              <div style={styles.brandStat}>
                <span style={styles.brandStatNum}>4.8/5</span>
                <span style={styles.brandStatLabel}>rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - form */}
        <div style={styles.formSide}>
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p style={styles.formSubtitle}>
              {isSignUp
                ? 'Start finding perfect brand-creator matches today.'
                : 'Sign in to access your dashboard and deals.'}
            </p>

            {error && <div style={styles.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              {isSignUp && (
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    style={styles.input}
                    required
                  />
                </div>
              )}

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  style={styles.input}
                  required
                />
              </div>

              {isSignUp && (
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>I am a...</label>
                  <div style={styles.roleSelector}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'brand' })}
                      style={{
                        ...styles.roleBtn,
                        ...(formData.role === 'brand' ? styles.roleBtnActive : {}),
                      }}
                    >
                      Brand
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'creator' })}
                      style={{
                        ...styles.roleBtn,
                        ...(formData.role === 'creator' ? styles.roleBtnActive : {}),
                      }}
                    >
                      Creator
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? 'Please wait...'
                  : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
              </button>
            </form>

            <div style={styles.switchMode}>
              <p style={styles.switchText}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                  }}
                  style={styles.switchBtn}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-cream)',
    position: 'relative',
  },
  backLink: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-medium)',
    fontWeight: 500,
    zIndex: 10,
  },
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  /* Left brand side */
  brandSide: {
    flex: 1,
    background: 'linear-gradient(135deg, var(--bg-cream) 0%, var(--accent-coral-light) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    borderRight: '1px solid var(--border-light)',
  },
  brandContent: {
    maxWidth: '400px',
  },
  brandLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  logoDot: {
    color: 'var(--accent-coral)',
    fontSize: '1.2rem',
  },
  logoText: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '1.1rem',
    color: 'var(--text-dark)',
  },
  brandTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2.5rem',
    lineHeight: 1.2,
    color: 'var(--text-dark)',
    marginBottom: '1.5rem',
    fontWeight: 400,
  },
  brandItalic: {
    color: 'var(--accent-coral)',
    fontStyle: 'italic',
  },
  brandDesc: {
    fontSize: '1rem',
    color: 'var(--text-medium)',
    lineHeight: 1.6,
    marginBottom: '2.5rem',
  },
  brandStats: {
    display: 'flex',
    gap: '2rem',
  },
  brandStat: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandStatNum: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.5rem',
    color: 'var(--text-dark)',
    fontWeight: 700,
  },
  brandStatLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '0.25rem',
  },

  /* Right form side */
  formSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    background: 'var(--white)',
  },
  formContainer: {
    width: '100%',
    maxWidth: '380px',
  },
  formTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.8rem',
    color: 'var(--text-dark)',
    marginBottom: '0.5rem',
  },
  formSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-medium)',
    marginBottom: '2rem',
    lineHeight: 1.5,
  },
  errorBox: {
    background: '#fff0f0',
    border: '1px solid #ffcccc',
    color: '#cc3333',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-dark)',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
    fontSize: '0.95rem',
    color: 'var(--text-dark)',
    background: 'var(--bg-cream-light)',
    transition: 'border-color 0.2s',
  },
  roleSelector: {
    display: 'flex',
    gap: '0.75rem',
  },
  roleBtn: {
    flex: 1,
    padding: '0.7rem',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
    background: 'var(--bg-cream-light)',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-medium)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  roleBtnActive: {
    background: 'var(--accent-coral)',
    color: 'var(--white)',
    border: '1px solid var(--accent-coral)',
  },
  submitBtn: {
    padding: '0.85rem',
    borderRadius: '8px',
    background: 'var(--accent-coral)',
    color: 'var(--white)',
    fontSize: '0.95rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'opacity 0.2s',
  },
  switchMode: {
    marginTop: '2rem',
    textAlign: 'center',
  },
  switchText: {
    fontSize: '0.85rem',
    color: 'var(--text-medium)',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-coral)',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: '0.4rem',
    fontSize: '0.85rem',
  },
}
