'use client';

import AppShell from '../components/AppShell';

export default function AppShellWrapper({ children, dbUser, chatThreads }) {
  return (
    <AppShell dbUser={dbUser} chatThreads={chatThreads}>
      {children}
    </AppShell>
  );
}
