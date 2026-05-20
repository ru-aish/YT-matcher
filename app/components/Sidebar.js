'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useClerk, useUser } from '@clerk/nextjs';
import {
  LayoutDashboard,
  MessageSquare,
  UserCircle,
  PanelLeftClose,
  PanelLeft,
  LogOut,
} from 'lucide-react';
import { isDevAuthBypassEnabled } from '../../lib/dev-auth';
import styles from './Sidebar.module.css';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function ClerkFooter({ dbUser, handleLogout }) {
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();

  const avatarUrl = clerkUser?.imageUrl || dbUser?.avatarUrl;
  const displayName = dbUser?.name || clerkUser?.fullName || 'User';
  const role = dbUser?.role || 'user';

  return (
    <div className={styles.sidebarFooterUser}>
      <div className={styles.threadAvatar}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="" />
        ) : (
          getInitials(displayName)
        )}
      </div>
      <div className={styles.sidebarFooterInfo}>
        <div className={styles.sidebarFooterName}>{displayName}</div>
        <div className={styles.sidebarFooterRole}>{role}</div>
      </div>
      <button
        className={styles.sidebarToggle}
        onClick={async () => {
          await signOut();
          handleLogout();
        }}
        title="Sign out"
        style={{ marginLeft: 'auto' }}
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}

export default function Sidebar({ chatThreads = [], dbUser, collapsed, onToggle }) {
  const pathname = usePathname();
  const isDevBypass = isDevAuthBypassEnabled();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: 'Profile', icon: UserCircle },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname.startsWith('/dashboard/campaign');
    }
    return pathname.startsWith(href);
  };

  const isChatActive = (dealId) => {
    return pathname === `/chat/${dealId}`;
  };

  const handleLogout = async () => {
    window.location.href = '/login';
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoIcon}>YT</div>
          <span className={styles.sidebarLogoText}>Matcher</span>
        </div>
        <button
          className={styles.sidebarToggle}
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.sidebarNav}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navLink} ${isActive(href) ? styles.active : ''}`}
          >
            <span className={styles.navLinkIcon}>
              <Icon size={18} />
            </span>
            <span className={styles.navLinkLabel}>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Divider + Chat Section Label */}
      <div className={styles.sidebarDivider} />
      <div className={styles.sidebarSectionLabel}>
        <MessageSquare size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
        Chats
      </div>

      {/* Chat Threads */}
      <div className={styles.sidebarThreads}>
        {chatThreads.length === 0 ? (
          <div className={styles.threadsEmpty}>
            <MessageSquare size={18} style={{ opacity: 0.3 }} />
            <span>No active chats</span>
          </div>
        ) : (
          chatThreads.map((thread) => (
            <Link
              key={thread.dealId}
              href={`/chat/${thread.dealId}`}
              className={`${styles.threadItem} ${isChatActive(thread.dealId) ? styles.active : ''}`}
            >
              <div className={styles.threadAvatar}>
                {thread.otherUser?.avatarUrl ? (
                  <img src={thread.otherUser.avatarUrl} alt="" />
                ) : (
                  getInitials(thread.otherUser?.name)
                )}
              </div>
              <div className={styles.threadInfo}>
                <div className={styles.threadName}>
                  {thread.otherUser?.name || 'Partner'}
                </div>
                <div className={styles.threadPreview}>
                  {thread.lastMessage || `Deal #${thread.dealId}`}
                </div>
              </div>
              {thread.hasUnread && <div className={styles.threadUnread} />}
            </Link>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        {isDevBypass ? (
          <div className={styles.sidebarFooterUser}>
            <div className={styles.threadAvatar}>
              {dbUser?.avatarUrl ? (
                <img src={dbUser.avatarUrl} alt="" />
              ) : (
                getInitials(dbUser?.name || 'User')
              )}
            </div>
            <div className={styles.sidebarFooterInfo}>
              <div className={styles.sidebarFooterName}>{dbUser?.name || 'User'}</div>
              <div className={styles.sidebarFooterRole}>{dbUser?.role || 'user'}</div>
            </div>
            <button
              className={styles.sidebarToggle}
              onClick={handleLogout}
              title="Sign out"
              style={{ marginLeft: 'auto' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <ClerkFooter dbUser={dbUser} handleLogout={handleLogout} />
        )}
      </div>
    </aside>
  );
}
