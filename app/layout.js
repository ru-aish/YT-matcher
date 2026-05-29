import './globals.css'
import { Space_Grotesk, Outfit } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
})

export const metadata = {
  title: 'YT Matcher | Creator x Brand Matchmaking',
  description: 'Connect with the perfect creators and brands for authentic partnerships',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
