import './globals.css'
import { fontVars } from './_lib/fonts'

export const metadata = {
  title: 'YT Matcher — Where good taste meets good money',
  description:
    'The marketplace where YouTube creators and brands find each other by fit, agree in the open, and get paid safely. No cold email. No ghosting.',
  openGraph: {
    title: 'YT Matcher — Where good taste meets good money',
    description:
      'Brands find creators worth backing. Creators find deals worth doing. We make the introduction and hold the cash until it is earned.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  )
}
