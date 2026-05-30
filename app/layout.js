import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'YT Matcher — Connect Brands & Creators, Transparently',
  description: 'The simplest way to connect brands with YouTube creators. Fair matching, transparent 10% commission, real deals. No upfront fees.',
}

export default async function RootLayout({ children }) {
  const hasClerkConfig = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const ClerkProvider = hasClerkConfig ? (await import('@clerk/nextjs')).ClerkProvider : null;

  return (
    <html lang="en" className={`${syne.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        {ClerkProvider ? <ClerkProvider>{children}</ClerkProvider> : children}
      </body>
    </html>
  )
}
