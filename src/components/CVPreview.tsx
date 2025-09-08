'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { XIcon, DownloadIcon, ArrowLeftIcon } from 'lucide-react'
import { CVTemplate, createCVPdf } from '@/utils/pdfGenerator'
import { CVData, PersonalInfo } from '@/types'
import { CVFormData } from '@/components/CVDataForm'

interface CVPreviewProps {
  template: CVTemplate
  cvData: CVData
  personalInfo: PersonalInfo
  additionalData: CVFormData
  onClose: () => void
  onBack: () => void
  onDownload: () => void
}

export default function CVPreview({ 
  template, 
  cvData, 
  personalInfo, 
  additionalData, 
  onClose, 
  onBack, 
  onDownload 
}: CVPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    generatePreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, cvData, personalInfo, additionalData])

  const generatePreview = async () => {
    setIsGenerating(true)
    try {
      // Create enhanced personal info with additional data
      const enhancedPersonalInfo = {
        ...personalInfo,
        ...additionalData
      }

      const pdfArrayBuffer = await createCVPdf(cvData, enhancedPersonalInfo, { template })
      const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
    } catch (error) {
      console.error('Error generating preview:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    try {
      // Create enhanced personal info with additional data
      const enhancedPersonalInfo = {
        ...personalInfo,
        ...additionalData
      }

      const pdfArrayBuffer = await createCVPdf(cvData, enhancedPersonalInfo, { template })
      const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${personalInfo.name.replace(/\s+/g, '_')}_CV_${template}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      onDownload()
    } catch (error) {
      console.error('Error downloading CV:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] bg-card border border-border overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="text-foreground/70 hover:text-foreground">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">CV Preview</h2>
              <p className="text-sm sm:text-base text-foreground/70 capitalize">{template} Template</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleDownload}
              className="bg-accent hover:bg-accent-hover text-background flex items-center gap-2"
              disabled={isGenerating}
            >
              <DownloadIcon className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="ghost" onClick={onClose} className="text-foreground/70 hover:text-foreground">
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-foreground/70">Generating CV preview...</p>
              </div>
            </div>
          ) : previewUrl ? (
            <div className="w-full h-full">
              <iframe
                src={previewUrl}
                className="w-full h-full border border-border rounded-lg"
                style={{ minHeight: '600px' }}
                title="CV Preview"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-foreground/70">Unable to generate preview</p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-xs sm:text-sm text-foreground/70">
              {Object.keys(additionalData).length > 0 && (
                <div>
                  <strong>Additional info included:</strong>{' '}
                  {Object.entries(additionalData)
                    .filter(([, value]) => value)
                    .map(([key]) => key)
                    .join(', ')}
                </div>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={onBack} className="flex-1 sm:flex-none">
                Back to Templates
              </Button>
              <Button 
                onClick={handleDownload}
                className="bg-accent hover:bg-accent-hover text-background flex-1 sm:flex-none"
                disabled={isGenerating}
              >
                Download {template.charAt(0).toUpperCase() + template.slice(1)} CV
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}