import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Site Configuration Types
export interface SiteConfig {
  site_name: string
  site_title: string
  site_description: string
  site_url: string
  author_name: string
  author_url: string
  creator: string
  publisher: string
  keywords: string[]
  pwa: {
    short_name: string
    background_color: string
    theme_color: string
  }
  og_image: string
  og_image_width: number
  og_image_height: number
  og_image_alt: string
  twitter_card: string
  footer: {
    show_creator_link: boolean
    creator_text: string
    creator_url: string
    rights_text: string
  }
  analytics: {
    google_analytics_id: string
    google_tag_manager_id: string
  }
  seo: {
    index: boolean
    follow: boolean
    google_site_verification: string
  }
}

// Default site configuration (fallback values)
const defaultSiteConfig: SiteConfig = {
  site_name: 'DevFolio',
  site_title: 'Professional Developer Portfolio & CV Generator',
  site_description: 'Modern developer portfolio with professional CV generation, multiple themes, and ATS-friendly templates.',
  site_url: 'https://devfolio.charlyautomatiza.com',
  author_name: 'Charly Automatiza',
  author_url: 'https://charlyautomatiza.tech/',
  creator: 'Charly Automatiza',
  publisher: 'Charly Automatiza',
  keywords: ['developer portfolio', 'CV generator', 'resume builder', 'ATS friendly', 'professional templates', 'web developer', 'portfolio website', 'modern design'],
  pwa: {
    short_name: 'DevFolio',
    background_color: '#0f172a',
    theme_color: '#0f172a'
  },
  og_image: '/og-image.png',
  og_image_width: 1200,
  og_image_height: 630,
  og_image_alt: 'DevFolio - Professional Developer Portfolio',
  twitter_card: 'summary_large_image',
  footer: {
    show_creator_link: true,
    creator_text: 'CharlyAutomatiza',
    creator_url: 'https://charlyautomatiza.tech/',
    rights_text: 'All rights reserved'
  },
  analytics: {
    google_analytics_id: '',
    google_tag_manager_id: ''
  },
  seo: {
    index: true,
    follow: true,
    google_site_verification: ''
  }
}

// Cache for site config to avoid reading file multiple times
// Safe for Next.js static generation as it's read once at build time
// If you need request-specific data, remove this cache
let cachedSiteConfig: SiteConfig | null = null

/**
 * Get site configuration from site-config.md
 * Returns default values for any missing fields
 */
export function getSiteConfig(): SiteConfig {
  // Return cached config if available
  if (cachedSiteConfig) {
    return cachedSiteConfig
  }

  try {
    const configPath = path.join(process.cwd(), 'src', 'content', 'site-config.md')
    const fileContents = fs.readFileSync(configPath, 'utf8')
    const { data } = matter(fileContents)

    // Merge with defaults to ensure all fields exist
    cachedSiteConfig = {
      site_name: data.site_name || defaultSiteConfig.site_name,
      site_title: data.site_title || defaultSiteConfig.site_title,
      site_description: data.site_description || defaultSiteConfig.site_description,
      site_url: process.env.NEXT_PUBLIC_SITE_URL || data.site_url || defaultSiteConfig.site_url,
      author_name: data.author_name || defaultSiteConfig.author_name,
      author_url: data.author_url || defaultSiteConfig.author_url,
      creator: data.creator || defaultSiteConfig.creator,
      publisher: data.publisher || defaultSiteConfig.publisher,
      keywords: data.keywords || defaultSiteConfig.keywords,
      pwa: {
        short_name: data.pwa?.short_name || defaultSiteConfig.pwa.short_name,
        background_color: data.pwa?.background_color || defaultSiteConfig.pwa.background_color,
        theme_color: data.pwa?.theme_color || defaultSiteConfig.pwa.theme_color
      },
      og_image: data.og_image || defaultSiteConfig.og_image,
      og_image_width: data.og_image_width || defaultSiteConfig.og_image_width,
      og_image_height: data.og_image_height || defaultSiteConfig.og_image_height,
      og_image_alt: data.og_image_alt || defaultSiteConfig.og_image_alt,
      twitter_card: data.twitter_card || defaultSiteConfig.twitter_card,
      footer: {
        show_creator_link: data.footer?.show_creator_link ?? defaultSiteConfig.footer.show_creator_link,
        creator_text: data.footer?.creator_text || defaultSiteConfig.footer.creator_text,
        creator_url: data.footer?.creator_url || defaultSiteConfig.footer.creator_url,
        rights_text: data.footer?.rights_text || defaultSiteConfig.footer.rights_text
      },
      analytics: {
        google_analytics_id: data.analytics?.google_analytics_id || defaultSiteConfig.analytics.google_analytics_id,
        google_tag_manager_id: data.analytics?.google_tag_manager_id || defaultSiteConfig.analytics.google_tag_manager_id
      },
      seo: {
        index: data.seo?.index ?? defaultSiteConfig.seo.index,
        follow: data.seo?.follow ?? defaultSiteConfig.seo.follow,
        google_site_verification: data.seo?.google_site_verification || defaultSiteConfig.seo.google_site_verification
      }
    }

    return cachedSiteConfig
  } catch (error) {
    console.warn('Could not read site-config.md, using defaults:', error)
    return defaultSiteConfig
  }
}

/**
 * Generate manifest.json data from site configuration
 */
export function getManifestData(): Record<string, unknown> {
  const config = getSiteConfig()
  
  return {
    name: `${config.site_name} - ${config.site_title}`,
    short_name: config.pwa.short_name,
    description: config.site_description,
    start_url: '/',
    display: 'standalone',
    background_color: config.pwa.background_color,
    theme_color: config.pwa.theme_color,
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon'
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  }
}
