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
import styles from './Sidebar.module.css';

export default function Sidebar({ chatThreads = [], dbUser, collapsed, onToggle }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();

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

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const avatarUrl = clerkUser?.imageUrl || dbUser?.avatarUrl;
  const displayName = dbUser?.name || clerkUser?.fullName || 'User';
  const role = dbUser?.role || 'user';

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
            onClick={handleLogout}
            title="Sign out"
            style={{ marginLeft: 'auto' }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
