'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PaletteIcon, XIcon, SunIcon, MoonIcon } from 'lucide-react'
import { useMultiTheme, themes } from '@/components/MultiThemeProvider'

interface ThemeSelectorProps {
  onClose: () => void
}

export default function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { currentTheme, currentMode, setTheme, setMode } = useMultiTheme()

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl bg-card border border-border">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex-1 pr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <PaletteIcon className="h-6 w-6" />
                Choose Theme
              </h2>
              <p className="text-sm sm:text-base text-foreground/70">Select your preferred color scheme and mode</p>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-foreground/70 hover:text-foreground shrink-0">
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Appearance Mode</h3>
            <div className="flex gap-2">
              <Button
                variant={currentMode === 'light' ? 'default' : 'outline'}
                onClick={() => setMode('light')}
                className={`flex items-center gap-2 ${
                  currentMode === 'light' 
                    ? 'bg-accent text-background' 
                    : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                <SunIcon className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={currentMode === 'dark' ? 'default' : 'outline'}
                onClick={() => setMode('dark')}
                className={`flex items-center gap-2 ${
                  currentMode === 'dark' 
                    ? 'bg-accent text-background' 
                    : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                <MoonIcon className="h-4 w-4" />
                Dark
              </Button>
            </div>
          </div>

          {/* Theme Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Color Themes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {themes.map((theme) => {
                const isSelected = currentTheme.id === theme.id
                const colors = theme[currentMode]
                
                return (
                  <Card
                    key={theme.id}
                    className={`cursor-pointer transition-all duration-300 p-4 ${
                      isSelected 
                        ? 'ring-2 ring-accent bg-accent/5' 
                        : 'hover:bg-muted/50 border-border'
                    }`}
                    onClick={() => setTheme(theme.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: colors.accent }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: colors.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: colors.background }}
                        />
                      </div>
                      <h4 className="font-semibold text-foreground text-sm">{theme.name}</h4>
                    </div>
                    
                    {/* Theme Preview */}
                    <div 
                      className="h-16 rounded border border-gray-300 flex items-center justify-center text-xs"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.foreground,
                        borderColor: colors.border
                      }}
                    >
                      <div 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: colors.accent,
                          color: colors.background
                        }}
                      >
                        Preview
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-xs sm:text-sm text-foreground/70">
              Theme changes apply instantly. Current: <span className="font-medium">{currentTheme.name} ({currentMode})</span>
            </div>
            <Button 
              onClick={onClose}
              className="bg-accent hover:bg-accent-hover text-background"
            >
              Done
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}