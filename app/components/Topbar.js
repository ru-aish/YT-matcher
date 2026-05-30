'use client';

import { Bell } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { isDevAuthBypassEnabled } from '../../lib/dev-auth';
import styles from './Topbar.module.css';

function ClerkMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: {
            width: 30,
            height: 30,
          }
        }
      }}
    />
  );
}

export default function Topbar({ sidebarCollapsed, dbUser, title, breadcrumbs }) {
  const isDevBypass = isDevAuthBypassEnabled();
  const role = dbUser?.role || 'user';

  return (
    <header className={`${styles.topbar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.topbarLeft}>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className={styles.topbarBreadcrumb}>
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>
                {i > 0 && <span className={styles.topbarBreadcrumbSep}>/</span>}
                {crumb.href ? (
                  <a href={crumb.href}>{crumb.label}</a>
                ) : (
                  <span style={{ color: 'var(--text-primary)' }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className={styles.topbarTitle}>{title || 'Dashboard'}</h1>
        )}
        <span className={styles.topbarRoleBadge}>{role}</span>
      </div>

      <div className={styles.topbarRight}>
        <button className={styles.topbarAction} title="Notifications">
          <Bell size={17} />
        </button>
        {isDevBypass ? (
          <button className={styles.topbarAction} title={dbUser?.name || 'User'}>
            {(dbUser?.name || 'U').slice(0, 1).toUpperCase()}
          </button>
        ) : (
          <ClerkMenu />
        )}
      </div>
    </header>
  );
}
