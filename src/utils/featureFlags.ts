import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface FeatureFlags {
  DEFAULT_CV_TEMPLATE: 'harvard' | 'modern' | 'creative'
}

export function getFeatureFlags(): FeatureFlags {
  try {
    const filePath = path.join(process.cwd(), 'src/content/feature-flags.md')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContent)
    
    return {
      DEFAULT_CV_TEMPLATE: data.DEFAULT_CV_TEMPLATE || 'harvard'
    }
  } catch (error) {
    console.warn('Failed to read feature flags, using defaults:', error)
    return {
      DEFAULT_CV_TEMPLATE: 'harvard'
    }
  }
}

export function isDevMode(): boolean {
  return process.env.DEV_MODE === 'true'
}

export function shouldShowThemeSelector(): boolean {
  return isDevMode() || process.env.SWITCH_THEME === 'true'
}

export function getDefaultTheme(): string {
  // Default to Magenta Pink theme (id: 'pink') for all modes
  return 'pink'
}