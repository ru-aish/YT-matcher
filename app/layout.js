import './globals.css';
import { isDevAuthBypassEnabled } from '../lib/dev-auth';

export const metadata = {
  title: 'YT Matcher',
  description: 'YouTube Video Matcher Application',
}

export default async function RootLayout({ children }) {
  const useClerk = !isDevAuthBypassEnabled();
  const ClerkProvider = useClerk ? (await import('@clerk/nextjs')).ClerkProvider : null;

  return (
    <html lang="en">
      <body>
        {useClerk && ClerkProvider ? <ClerkProvider>{children}</ClerkProvider> : children}
      </body>
    </html>
  )
}
