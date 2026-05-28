import './globals.css';

export const metadata = {
  title: 'YT Matcher',
  description: 'YouTube Video Matcher Application',
}

export default async function RootLayout({ children }) {
  const hasClerkConfig = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const ClerkProvider = hasClerkConfig ? (await import('@clerk/nextjs')).ClerkProvider : null;

  return (
    <html lang="en">
      <body>
        {ClerkProvider ? <ClerkProvider>{children}</ClerkProvider> : children}
      </body>
    </html>
  )
}
