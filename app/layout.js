import './globals.css'

export const metadata = {
  title: 'YT-Matcher — Where Good Taste Meets Good Money',
  description: 'Find creators worth backing — ranked by real audience fit, not follower vanity.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
