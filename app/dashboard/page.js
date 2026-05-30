'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check auth cookie
    const cookies = document.cookie.split(';').map(c => c.trim())
    const authCookie = cookies.find(c => c.startsWith('yt_matcher_auth='))
    
    if (!authCookie) {
      router.push('/login')
      return
    }

    try {
      const token = authCookie.split('=')[1]
      const decoded = JSON.parse(atob(token))
      setUser(decoded)
    } catch {
      router.push('/login')
    }
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (!user) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
      </div>
    )
  }

  return (
    <main style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={{ color: '#e8613c', fontSize: '1rem' }}>●</span>
          <span style={styles.sidebarLogoText}>YT-Matcher</span>
        </div>
        <nav style={styles.sidebarNav}>
          <a href="#" style={styles.sidebarLinkActive}>
            <span>📊</span> Dashboard
          </a>
          <a href="#" style={styles.sidebarLink}>
            <span>🔍</span> Discover
          </a>
          <a href="#" style={styles.sidebarLink}>
            <span>💬</span> Messages
          </a>
          <a href="#" style={styles.sidebarLink}>
            <span>📋</span> Deals
          </a>
          <a href="#" style={styles.sidebarLink}>
            <span>⚙️</span> Settings
          </a>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>
              Welcome back{user.name ? `, ${user.name}` : ''}
            </h1>
            <p style={styles.headerSub}>
              Here's what's happening with your matches today.
            </p>
          </div>
          <div style={styles.headerAvatar}>
            {(user.name || user.email || '?').charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Stats cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active Deals</p>
            <h3 style={styles.statValue}>3</h3>
            <p style={styles.statChange}>+1 this week</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Pending Matches</p>
            <h3 style={styles.statValue}>12</h3>
            <p style={styles.statChange}>5 new today</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Messages</p>
            <h3 style={styles.statValue}>8</h3>
            <p style={styles.statChange}>2 unread</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Earnings</p>
            <h3 style={styles.statValue}>$2,450</h3>
            <p style={styles.statChange}>+$800 this month</p>
          </div>
        </div>

        {/* Recent activity */}
        <div style={styles.activitySection}>
          <h2 style={styles.activityTitle}>Recent Activity</h2>
          <div style={styles.activityList}>
            <div style={styles.activityItem}>
              <div style={styles.activityDot} />
              <div>
                <p style={styles.activityText}>New match suggestion: TechReviews (180K subs)</p>
                <p style={styles.activityTime}>2 hours ago</p>
              </div>
            </div>
            <div style={styles.activityItem}>
              <div style={styles.activityDot} />
              <div>
                <p style={styles.activityText}>Deal #45 — deliverable submitted for review</p>
                <p style={styles.activityTime}>5 hours ago</p>
              </div>
            </div>
            <div style={styles.activityItem}>
              <div style={styles.activityDot} />
              <div>
                <p style={styles.activityText}>Payment of $1,200 released for Deal #42</p>
                <p style={styles.activityTime}>Yesterday</p>
              </div>
            </div>
            <div style={styles.activityItem}>
              <div style={styles.activityDot} />
              <div>
                <p style={styles.activityText}>New message from Sarah M. regarding collab</p>
                <p style={styles.activityTime}>Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const styles = {
  loading: {
    minHeight: '100vh',
    background: '#0f0f0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #333',
    borderTop: '3px solid #e8613c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  page: {
    minHeight: '100vh',
    background: '#0f0f0f',
    display: 'flex',
    color: '#f0f0f0',
  },
  /* Sidebar */
  sidebar: {
    width: '240px',
    background: '#1a1a1a',
    borderRight: '1px solid #2a2a2a',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2.5rem',
  },
  sidebarLogoText: {
    fontWeight: 700,
    fontSize: '1rem',
    color: '#f0f0f0',
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  sidebarLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#999',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  sidebarLinkActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#f0f0f0',
    background: '#2a2a2a',
    textDecoration: 'none',
  },
  logoutBtn: {
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    background: 'transparent',
    border: '1px solid #333',
    color: '#999',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  /* Main */
  mainContent: {
    flex: 1,
    padding: '2rem 3rem',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#f0f0f0',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '0.25rem',
  },
  headerSub: {
    fontSize: '0.9rem',
    color: '#999',
  },
  headerAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#e8613c',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '1rem',
  },
  /* Stats */
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem',
    marginBottom: '3rem',
  },
  statCard: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#999',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#f0f0f0',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '0.25rem',
  },
  statChange: {
    fontSize: '0.8rem',
    color: '#4ade80',
  },
  /* Activity */
  activitySection: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  activityTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#f0f0f0',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '1.25rem',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #2a2a2a',
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#e8613c',
    marginTop: '0.4rem',
    flexShrink: 0,
  },
  activityText: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    marginBottom: '0.2rem',
  },
  activityTime: {
    fontSize: '0.75rem',
    color: '#666',
  },
}
