export const metadata = {
  title: 'YT Matcher',
  description: 'YouTube Video Matcher Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
