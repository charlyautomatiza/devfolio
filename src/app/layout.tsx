import './globals.css'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'
import { MultiThemeProvider } from '@/components/MultiThemeProvider'
import { getSiteConfig } from '@/lib/siteConfig'
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

// Generate metadata from site-config.md
const siteConfig = getSiteConfig()

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site_url),
  title: {
    default: siteConfig.site_title,
    template: `%s | ${siteConfig.site_name}`
  },
  description: siteConfig.site_description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author_name }],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  robots: {
    index: siteConfig.seo.index,
    follow: siteConfig.seo.follow,
    googleBot: {
      index: siteConfig.seo.index,
      follow: siteConfig.seo.follow,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: siteConfig.seo.google_site_verification ? {
    google: siteConfig.seo.google_site_verification
  } : undefined,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.site_url,
    title: siteConfig.site_title,
    description: siteConfig.site_description,
    siteName: siteConfig.site_name,
    images: [
      {
        url: siteConfig.og_image,
        width: siteConfig.og_image_width,
        height: siteConfig.og_image_height,
        alt: siteConfig.og_image_alt,
      },
    ],
  },
  twitter: {
    card: siteConfig.twitter_card as 'summary_large_image',
    title: siteConfig.site_title,
    description: siteConfig.site_description,
    images: [siteConfig.og_image],
  },
  alternates: {
    canonical: siteConfig.site_url,
  },
  other: {
    'theme-color': siteConfig.pwa.theme_color,
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