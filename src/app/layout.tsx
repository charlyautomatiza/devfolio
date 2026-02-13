import './globals.css'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'
import { MultiThemeProvider } from '@/components/MultiThemeProvider'
import type { Metadata } from 'next'

const geist = localFont({
  src: [
    {
      path: './fonts/GeistVF.woff',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://devfolio.charlyautomatiza.com'),
  title: {
    default: 'DevFolio - Professional Developer Portfolio & CV Generator',
    template: '%s | DevFolio'
  },
  description: 'Modern developer portfolio with professional CV generation, multiple themes, and ATS-friendly templates. Showcase your projects and generate beautiful CVs instantly.',
  keywords: [
    'developer portfolio',
    'CV generator', 
    'resume builder',
    'ATS friendly',
    'professional templates',
    'web developer',
    'portfolio website',
    'modern design'
  ],
  authors: [{ name: 'Charly Automatiza' }],
  creator: 'Charly Automatiza',
  publisher: 'Charly Automatiza',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://devfolio.charlyautomatiza.com',
    title: 'DevFolio - Professional Developer Portfolio & CV Generator',
    description: 'Modern developer portfolio with professional CV generation, multiple themes, and ATS-friendly templates.',
    siteName: 'DevFolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DevFolio - Professional Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevFolio - Professional Developer Portfolio & CV Generator',
    description: 'Modern developer portfolio with professional CV generation, multiple themes, and ATS-friendly templates.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://devfolio.charlyautomatiza.com',
  },
  other: {
    'theme-color': '#0f172a',
    'color-scheme': 'light dark',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${geist.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <MultiThemeProvider>
            {children}
          </MultiThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}