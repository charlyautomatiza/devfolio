'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MailIcon, PhoneIcon, LinkIcon, LinkedinIcon, XIcon } from 'lucide-react'

interface CVDataFormProps {
  onSubmit: (data: CVFormData) => void
  onClose: () => void
}

export interface CVFormData {
  email?: string
  phone?: string
  website?: string
  linkedin?: string
}

export default function CVDataForm({ onSubmit, onClose }: CVDataFormProps) {
  const [formData, setFormData] = useState<CVFormData>({
    email: '',
    phone: '',
    website: '',
    linkedin: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter out empty values
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value.trim() !== '')
    )
    onSubmit(filteredData)
  }

  const handleChange = (field: keyof CVFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-lg bg-card border border-border">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex-1 pr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Additional Contact Information</h2>
              <p className="text-sm sm:text-base text-foreground/70">Add optional contact details to your CV (not saved)</p>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-foreground/70 hover:text-foreground shrink-0">
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground flex items-center gap-2">
                  <MailIcon className="h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground transition-all duration-300 text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2 text-foreground flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground transition-all duration-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium mb-2 text-foreground flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Website
              </label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground transition-all duration-300 text-sm"
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium mb-2 text-foreground flex items-center gap-2">
                <LinkedinIcon className="h-4 w-4" />
                LinkedIn
              </label>
              <input
                type="url"
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground transition-all duration-300 text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
              <div className="text-xs sm:text-sm text-foreground/70">
                All fields are optional. Data is only used for PDF generation and not stored.
              </div>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                  Skip
                </Button>
                <Button 
                  type="submit"
                  className="bg-accent hover:bg-accent-hover text-background flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  Continue to Template
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}