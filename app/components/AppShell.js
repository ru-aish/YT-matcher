'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './AppShell.module.css';

export default function AppShell({ children, dbUser, chatThreads = [], title, breadcrumbs }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        chatThreads={chatThreads}
        dbUser={dbUser}
      />
      <div className={`${styles.main} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <Topbar
          sidebarCollapsed={sidebarCollapsed}
          dbUser={dbUser}
          title={title}
          breadcrumbs={breadcrumbs}
        />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
