// Distinctive type for the YT Matcher marketing site.
// Self-hosted at build time via next/font/google.
import { DM_Serif_Display, Fraunces, Archivo, Space_Mono } from 'next/font/google'

// Display — high-contrast editorial serif for the big statements.
export const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// Accent serif — characterful italics and section headings.
export const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

// Body — clean, slightly condensed grotesque.
export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// Labels & mono — eyebrows, tags, and the chat/code feel.
export const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
  display: 'swap',
})

export const fontVars = `${dmSerif.variable} ${fraunces.variable} ${archivo.variable} ${spaceMono.variable}`
