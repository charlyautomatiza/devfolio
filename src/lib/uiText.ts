import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// UI Text Configuration Types
export interface UIText {
  nav: {
    home: string
    portfolio: string
    cv: string
    contact: string
    download_cv: string
  }
  hero: {
    greeting: string
    tagline_prefix: string
    cta_primary: string
    cta_secondary: string
    scroll_hint: string
  }
  portfolio: {
    heading: string
    subheading: string
    view_project: string
    no_projects: string
  }
  cv: {
    heading: string
    subheading: string
    download_button: string
    preview_button: string
    select_template: string
    template_harvard: string
    template_modern: string
    template_creative: string
    generating: string
    preview_title: string
    back_to_selection: string
    download_pdf: string
    close: string
  }
  contact: {
    heading: string
    subheading: string
    name_label: string
    name_placeholder: string
    email_label: string
    email_placeholder: string
    message_label: string
    message_placeholder: string
    send_button: string
    sending: string
    success_message: string
    error_message: string
  }
  theme: {
    toggle_tooltip: string
    select_theme: string
    light_mode: string
    dark_mode: string
    ocean_blue: string
    royal_purple: string
    forest_green: string
    sunset_orange: string
    magenta_pink: string
  }
  aria: {
    toggle_menu: string
    toggle_theme: string
    toggle_theme_selector: string
    close_theme_selector: string
    social_github: string
    social_linkedin: string
    social_email: string
    download_cv: string
  }
  status: {
    loading: string
    error: string
    no_data: string
  }
  date: {
    present: string
    to: string
    from: string
  }
}

// Default UI text (fallback values)
const defaultUIText: UIText = {
  nav: {
    home: 'Home',
    portfolio: 'Portfolio',
    cv: 'CV',
    contact: 'Contact',
    download_cv: 'Download CV'
  },
  hero: {
    greeting: "Hi, I'm",
    tagline_prefix: "I'm a",
    cta_primary: 'View Portfolio',
    cta_secondary: 'Download CV',
    scroll_hint: 'Scroll to explore'
  },
  portfolio: {
    heading: 'Portfolio',
    subheading: 'Featured Projects',
    view_project: 'View Project',
    no_projects: 'No projects available'
  },
  cv: {
    heading: 'CV',
    subheading: 'Professional Experience & Skills',
    download_button: 'Download CV',
    preview_button: 'Preview CV',
    select_template: 'Select Template',
    template_harvard: 'Harvard',
    template_modern: 'Modern',
    template_creative: 'Creative',
    generating: 'Generating CV...',
    preview_title: 'CV Preview',
    back_to_selection: 'Back to Templates',
    download_pdf: 'Download PDF',
    close: 'Close'
  },
  contact: {
    heading: 'Contact',
    subheading: 'Get in Touch',
    name_label: 'Name',
    name_placeholder: 'Your Name',
    email_label: 'Email',
    email_placeholder: 'your.email@example.com',
    message_label: 'Message',
    message_placeholder: 'Your message...',
    send_button: 'Send Message',
    sending: 'Sending...',
    success_message: 'Message sent successfully!',
    error_message: 'Failed to send message. Please try again.'
  },
  theme: {
    toggle_tooltip: 'Toggle theme',
    select_theme: 'Select Theme',
    light_mode: 'Light',
    dark_mode: 'Dark',
    ocean_blue: 'Ocean Blue',
    royal_purple: 'Royal Purple',
    forest_green: 'Forest Green',
    sunset_orange: 'Sunset Orange',
    magenta_pink: 'Magenta Pink'
  },
  aria: {
    toggle_menu: 'Toggle navigation menu',
    toggle_theme: 'Toggle theme',
    toggle_theme_selector: 'Open theme selector',
    close_theme_selector: 'Close theme selector',
    social_github: 'Visit GitHub profile',
    social_linkedin: 'Visit LinkedIn profile',
    social_email: 'Send email',
    download_cv: 'Download CV'
  },
  status: {
    loading: 'Loading...',
    error: 'Something went wrong',
    no_data: 'No data available'
  },
  date: {
    present: 'Present',
    to: 'to',
    from: 'From'
  }
}

// Cache for UI text to avoid reading file multiple times
// Safe for Next.js static generation as it's read once at build time
// If you need request-specific or dynamic text, remove this cache
let cachedUIText: UIText | null = null

/**
 * Get UI text configuration from ui-text.md
 * Returns default values for any missing fields
 */
export function getUIText(language = 'en'): UIText {
  // Return cached text if available
  if (cachedUIText) {
    return cachedUIText
  }

  try {
    const fileName = language === 'en' ? 'ui-text.md' : `ui-text-${language}.md`
    const textPath = path.join(process.cwd(), 'src', 'content', fileName)
    
    const fileContents = fs.readFileSync(textPath, 'utf8')
    const { data } = matter(fileContents)

    // Merge with defaults to ensure all fields exist
    cachedUIText = {
      nav: {
        home: data.nav?.home || defaultUIText.nav.home,
        portfolio: data.nav?.portfolio || defaultUIText.nav.portfolio,
        cv: data.nav?.cv || defaultUIText.nav.cv,
        contact: data.nav?.contact || defaultUIText.nav.contact,
        download_cv: data.nav?.download_cv || defaultUIText.nav.download_cv
      },
      hero: {
        greeting: data.hero?.greeting || defaultUIText.hero.greeting,
        tagline_prefix: data.hero?.tagline_prefix || defaultUIText.hero.tagline_prefix,
        cta_primary: data.hero?.cta_primary || defaultUIText.hero.cta_primary,
        cta_secondary: data.hero?.cta_secondary || defaultUIText.hero.cta_secondary,
        scroll_hint: data.hero?.scroll_hint || defaultUIText.hero.scroll_hint
      },
      portfolio: {
        heading: data.portfolio?.heading || defaultUIText.portfolio.heading,
        subheading: data.portfolio?.subheading || defaultUIText.portfolio.subheading,
        view_project: data.portfolio?.view_project || defaultUIText.portfolio.view_project,
        no_projects: data.portfolio?.no_projects || defaultUIText.portfolio.no_projects
      },
      cv: {
        heading: data.cv?.heading || defaultUIText.cv.heading,
        subheading: data.cv?.subheading || defaultUIText.cv.subheading,
        download_button: data.cv?.download_button || defaultUIText.cv.download_button,
        preview_button: data.cv?.preview_button || defaultUIText.cv.preview_button,
        select_template: data.cv?.select_template || defaultUIText.cv.select_template,
        template_harvard: data.cv?.template_harvard || defaultUIText.cv.template_harvard,
        template_modern: data.cv?.template_modern || defaultUIText.cv.template_modern,
        template_creative: data.cv?.template_creative || defaultUIText.cv.template_creative,
        generating: data.cv?.generating || defaultUIText.cv.generating,
        preview_title: data.cv?.preview_title || defaultUIText.cv.preview_title,
        back_to_selection: data.cv?.back_to_selection || defaultUIText.cv.back_to_selection,
        download_pdf: data.cv?.download_pdf || defaultUIText.cv.download_pdf,
        close: data.cv?.close || defaultUIText.cv.close
      },
      contact: {
        heading: data.contact?.heading || defaultUIText.contact.heading,
        subheading: data.contact?.subheading || defaultUIText.contact.subheading,
        name_label: data.contact?.name_label || defaultUIText.contact.name_label,
        name_placeholder: data.contact?.name_placeholder || defaultUIText.contact.name_placeholder,
        email_label: data.contact?.email_label || defaultUIText.contact.email_label,
        email_placeholder: data.contact?.email_placeholder || defaultUIText.contact.email_placeholder,
        message_label: data.contact?.message_label || defaultUIText.contact.message_label,
        message_placeholder: data.contact?.message_placeholder || defaultUIText.contact.message_placeholder,
        send_button: data.contact?.send_button || defaultUIText.contact.send_button,
        sending: data.contact?.sending || defaultUIText.contact.sending,
        success_message: data.contact?.success_message || defaultUIText.contact.success_message,
        error_message: data.contact?.error_message || defaultUIText.contact.error_message
      },
      theme: {
        toggle_tooltip: data.theme?.toggle_tooltip || defaultUIText.theme.toggle_tooltip,
        select_theme: data.theme?.select_theme || defaultUIText.theme.select_theme,
        light_mode: data.theme?.light_mode || defaultUIText.theme.light_mode,
        dark_mode: data.theme?.dark_mode || defaultUIText.theme.dark_mode,
        ocean_blue: data.theme?.ocean_blue || defaultUIText.theme.ocean_blue,
        royal_purple: data.theme?.royal_purple || defaultUIText.theme.royal_purple,
        forest_green: data.theme?.forest_green || defaultUIText.theme.forest_green,
        sunset_orange: data.theme?.sunset_orange || defaultUIText.theme.sunset_orange,
        magenta_pink: data.theme?.magenta_pink || defaultUIText.theme.magenta_pink
      },
      aria: {
        toggle_menu: data.aria?.toggle_menu || defaultUIText.aria.toggle_menu,
        toggle_theme: data.aria?.toggle_theme || defaultUIText.aria.toggle_theme,
        toggle_theme_selector: data.aria?.toggle_theme_selector || defaultUIText.aria.toggle_theme_selector,
        close_theme_selector: data.aria?.close_theme_selector || defaultUIText.aria.close_theme_selector,
        social_github: data.aria?.social_github || defaultUIText.aria.social_github,
        social_linkedin: data.aria?.social_linkedin || defaultUIText.aria.social_linkedin,
        social_email: data.aria?.social_email || defaultUIText.aria.social_email,
        download_cv: data.aria?.download_cv || defaultUIText.aria.download_cv
      },
      status: {
        loading: data.status?.loading || defaultUIText.status.loading,
        error: data.status?.error || defaultUIText.status.error,
        no_data: data.status?.no_data || defaultUIText.status.no_data
      },
      date: {
        present: data.date?.present || defaultUIText.date.present,
        to: data.date?.to || defaultUIText.date.to,
        from: data.date?.from || defaultUIText.date.from
      }
    }

    return cachedUIText
  } catch (error) {
    console.warn('Could not read ui-text.md, using defaults:', error)
    return defaultUIText
  }
}
