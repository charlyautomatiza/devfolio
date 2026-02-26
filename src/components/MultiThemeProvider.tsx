'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface ThemeConfig {
  id: string
  name: string
  light: {
    background: string
    foreground: string
    primary: string
    accent: string
    accentHover: string
    muted: string
    border: string
    card: string
    cardHover: string
    gradientStart: string
    gradientEnd: string
  }
  dark: {
    background: string
    foreground: string
    primary: string
    accent: string
    accentHover: string
    muted: string
    border: string
    card: string
    cardHover: string
    gradientStart: string
    gradientEnd: string
  }
}

export const themes: ThemeConfig[] = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    light: {
      background: '#fafafa',
      foreground: '#1a1a1a',
      primary: '#0066ff',
      accent: '#0ea5e9',
      accentHover: '#0284c7',
      muted: '#f1f5f9',
      border: '#d1d5db',
      card: '#ffffff',
      cardHover: '#f8fafc',
      gradientStart: '#f8fafc',
      gradientEnd: '#f1f5f9'
    },
    dark: {
      background: '#0a0a0a',
      foreground: '#ededed',
      primary: '#0066ff',
      accent: '#0ea5e9',
      accentHover: '#0284c7',
      muted: '#1a1a1a',
      border: '#333333',
      card: '#1a1a1a',
      cardHover: '#262626',
      gradientStart: '#1a1a1a',
      gradientEnd: '#0a0a0a'
    }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    light: {
      background: '#fdfcff',
      foreground: '#1a1a1a',
      primary: '#7c3aed',
      accent: '#a855f7',
      accentHover: '#9333ea',
      muted: '#f5f3ff',
      border: '#d8b4fe',
      card: '#ffffff',
      cardHover: '#faf5ff',
      gradientStart: '#faf5ff',
      gradientEnd: '#f5f3ff'
    },
    dark: {
      background: '#0a0a0a',
      foreground: '#ededed',
      primary: '#7c3aed',
      accent: '#a855f7',
      accentHover: '#9333ea',
      muted: '#1a1a1a',
      border: '#333333',
      card: '#1a1a1a',
      cardHover: '#262626',
      gradientStart: '#1a1a1a',
      gradientEnd: '#0a0a0a'
    }
  },
  {
    id: 'green',
    name: 'Forest Green',
    light: {
      background: '#fafafa',
      foreground: '#1a1a1a',
      primary: '#059669',
      accent: '#10b981',
      accentHover: '#059669',
      muted: '#f0fdf4',
      border: '#bbf7d0',
      card: '#ffffff',
      cardHover: '#f7fee7',
      gradientStart: '#f7fee7',
      gradientEnd: '#f0fdf4'
    },
    dark: {
      background: '#0a0a0a',
      foreground: '#ededed',
      primary: '#059669',
      accent: '#10b981',
      accentHover: '#059669',
      muted: '#1a1a1a',
      border: '#333333',
      card: '#1a1a1a',
      cardHover: '#262626',
      gradientStart: '#1a1a1a',
      gradientEnd: '#0a0a0a'
    }
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    light: {
      background: '#fefefe',
      foreground: '#1a1a1a',
      primary: '#ea580c',
      accent: '#f97316',
      accentHover: '#ea580c',
      muted: '#fff7ed',
      border: '#fed7aa',
      card: '#ffffff',
      cardHover: '#fffbeb',
      gradientStart: '#fffbeb',
      gradientEnd: '#fff7ed'
    },
    dark: {
      background: '#0a0a0a',
      foreground: '#ededed',
      primary: '#ea580c',
      accent: '#f97316',
      accentHover: '#ea580c',
      muted: '#1a1a1a',
      border: '#333333',
      card: '#1a1a1a',
      cardHover: '#262626',
      gradientStart: '#1a1a1a',
      gradientEnd: '#0a0a0a'
    }
  },
  {
    id: 'pink',
    name: 'Magenta Pink',
    light: {
      background: '#fefefe',
      foreground: '#1a1a1a',
      primary: '#db2777',
      accent: '#ec4899',
      accentHover: '#db2777',
      muted: '#fdf2f8',
      border: '#fbcfe8',
      card: '#ffffff',
      cardHover: '#fef7ff',
      gradientStart: '#fef7ff',
      gradientEnd: '#fdf2f8'
    },
    dark: {
      background: '#0a0a0a',
      foreground: '#ededed',
      primary: '#db2777',
      accent: '#ec4899',
      accentHover: '#db2777',
      muted: '#1a1a1a',
      border: '#333333',
      card: '#1a1a1a',
      cardHover: '#262626',
      gradientStart: '#1a1a1a',
      gradientEnd: '#0a0a0a'
    }
  }
]

interface MultiThemeContextType {
  currentTheme: ThemeConfig
  currentMode: 'light' | 'dark'
  setTheme: (themeId: string) => void
  setMode: (mode: 'light' | 'dark') => void
  toggleMode: () => void
}

const MultiThemeContext = createContext<MultiThemeContextType | undefined>(undefined)

export function useMultiTheme() {
  const context = useContext(MultiThemeContext)
  if (!context) {
    throw new Error('useMultiTheme must be used within a MultiThemeProvider')
  }
  return context
}

interface MultiThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
}

export function MultiThemeProvider({ children, defaultTheme = 'blue' }: MultiThemeProviderProps) {
  const [currentThemeId, setCurrentThemeId] = useState(defaultTheme)
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  const currentTheme = themes.find(theme => theme.id === currentThemeId) || themes[0]

  useEffect(() => {
    setMounted(true)
    // Load saved theme and mode from localStorage
    const savedTheme = localStorage.getItem('multiTheme')
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark'
    
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentThemeId(savedTheme)
    }
    if (savedMode) {
      setCurrentMode(savedMode)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Apply theme to CSS variables
    const colors = currentTheme[currentMode]
    const root = document.documentElement
    
    root.style.setProperty('--background', colors.background)
    root.style.setProperty('--foreground', colors.foreground)
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--accent', colors.accent)
    root.style.setProperty('--accent-hover', colors.accentHover)
    root.style.setProperty('--muted', colors.muted)
    root.style.setProperty('--border', colors.border)
    root.style.setProperty('--card', colors.card)
    root.style.setProperty('--card-hover', colors.cardHover)
    root.style.setProperty('--gradient-start', colors.gradientStart)
    root.style.setProperty('--gradient-end', colors.gradientEnd)

    // Update dark class
    if (currentMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [currentTheme, currentMode, mounted])

  const setTheme = (themeId: string) => {
    setCurrentThemeId(themeId)
    localStorage.setItem('multiTheme', themeId)
  }

  const setMode = (mode: 'light' | 'dark') => {
    setCurrentMode(mode)
    localStorage.setItem('themeMode', mode)
  }

  const toggleMode = () => {
    setMode(currentMode === 'light' ? 'dark' : 'light')
  }

  if (!mounted) {
    return null
  }

  return (
    <MultiThemeContext.Provider value={{
      currentTheme,
      currentMode,
      setTheme,
      setMode,
      toggleMode
    }}>
      {children}
    </MultiThemeContext.Provider>
  )
}