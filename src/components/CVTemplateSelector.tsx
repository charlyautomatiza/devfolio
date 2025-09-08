'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileTextIcon, PaletteIcon, SparklesIcon } from 'lucide-react'
import { CVTemplate } from '@/utils/pdfGenerator'

interface CVTemplateSelectorProps {
  onTemplateSelect: (template: CVTemplate) => void
  onClose: () => void
}

export default function CVTemplateSelector({ onTemplateSelect, onClose }: CVTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('harvard')

  const templates: Array<{
    id: CVTemplate
    name: string
    description: string
    icon: React.ReactNode
    preview: string
  }> = [
    {
      id: 'harvard',
      name: 'Harvard Classic',
      description: 'Traditional academic format with clean typography and professional layout',
      icon: <FileTextIcon className="h-6 w-6" />,
      preview: 'Traditional • Professional • ATS-Friendly'
    },
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Contemporary design with accent sidebar and clean visual hierarchy',
      icon: <PaletteIcon className="h-6 w-6" />,
      preview: 'Contemporary • Visual • Branded'
    },
    {
      id: 'creative',
      name: 'Creative Designer',
      description: 'Eye-catching layout with geometric elements and creative styling',
      icon: <SparklesIcon className="h-6 w-6" />,
      preview: 'Creative • Artistic • Stand-out'
    }
  ]

  const handleGenerate = () => {
    onTemplateSelect(selectedTemplate)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card border border-border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Choose CV Template</h2>
              <p className="text-foreground/70">Select a template that best represents your professional style</p>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-foreground/70 hover:text-foreground">
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer card-hover transition-all duration-300 ${
                  selectedTemplate === template.id 
                    ? 'ring-2 ring-accent bg-accent/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      selectedTemplate === template.id 
                        ? 'bg-accent text-background' 
                        : 'bg-muted text-foreground'
                    }`}>
                      {template.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                  </div>
                  
                  <p className="text-sm text-foreground/70 mb-4">{template.description}</p>
                  
                  <div className="text-xs text-accent font-medium">{template.preview}</div>
                  
                  {/* Template preview mockup */}
                  <div className="mt-4 h-32 bg-muted rounded border-2 border-dashed border-border flex items-center justify-center">
                    <div className="text-center text-foreground/50">
                      <div className="text-xs mb-1">{template.name}</div>
                      <div className="text-xs">Preview</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-foreground/70">
              All templates include your complete experience, education, and skills
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate} 
                className="bg-accent hover:bg-accent-hover text-background"
              >
                Generate {templates.find(t => t.id === selectedTemplate)?.name} CV
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}