'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GithubIcon, LinkedinIcon, MailIcon, FileTextIcon, ChevronDownIcon, MoonIcon, SunIcon, MenuIcon, XIcon, PaletteIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useMultiTheme } from '@/components/MultiThemeProvider'
import ThemeSelector from '@/components/ThemeSelector'
import { PortfolioProps } from '@/types'
import Image from 'next/image'
import CVTemplateSelector from '@/components/CVTemplateSelector'
import CVDataForm, { CVFormData } from '@/components/CVDataForm'
import CVPreview from '@/components/CVPreview'
import { CVTemplate } from '@/utils/pdfGenerator'

gsap.registerPlugin(ScrollTrigger)

export default function Portfolio({ projects, cvData, personalInfo, socialLinks, cvPdfUrl }: Readonly<PortfolioProps>) {
  const [activeSection, setActiveSection] = useState('')
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { toggleMode } = useMultiTheme()
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [isContactEnabled, setIsContactEnabled] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [showCVTemplateSelector, setShowCVTemplateSelector] = useState(false)
  const [showCVDataForm, setShowCVDataForm] = useState(false)
  const [showCVPreview, setShowCVPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('harvard')
  const [cvFormData, setCvFormData] = useState<CVFormData>({})

  useEffect(() => {
    setMounted(true)
    setIsContactEnabled(process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ENABLED === 'true')

    const sections = ['home', 'portfolio', 'cv']
    if (isContactEnabled) sections.push('contact')

    sections.forEach((section) => {
      if (!sectionRefs.current[section]) {
        sectionRefs.current[section] = React.createRef<HTMLDivElement>()
      }
    })

    const handleScroll = () => {
      let current = ''
      sections.forEach((section) => {
        const element = sectionRefs.current[section]?.current
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section
          }
        }
      })
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Set initial active section

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isContactEnabled])

  useEffect(() => {
    if (mounted) {
      gsap.from('.header', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' })

      Object.keys(sectionRefs.current).forEach((section) => {
        if (sectionRefs.current[section]?.current) {
          gsap.from(sectionRefs.current[section].current, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
              trigger: sectionRefs.current[section].current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          })
        }
      })
    }
  }, [mounted])

  const scrollToSection = (section: string) => {
    const element = sectionRefs.current[section]?.current
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    } else {
      console.warn(`Section ${section} is not available`)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    try {
        const response = await fetch('/api/submit-form', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        })

        if (!response.ok) {
            const errorText = await response.text(); // Obtener el texto de error
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        if (e.currentTarget) {
            e.currentTarget.reset()
        }
        setSubmitStatus('success')
    } catch (error: unknown) { // Especificar el tipo de error como 'unknown'
        console.error('Error submitting form:', error)
        setSubmitStatus('error')
    }
  }

  const handleTemplateSelect = (template: CVTemplate) => {
    setSelectedTemplate(template)
    setShowCVTemplateSelector(false)
    setShowCVDataForm(true)
  }

  const handleCVDataSubmit = (data: CVFormData) => {
    setCvFormData(data)
    setShowCVDataForm(false)
    setShowCVPreview(true)
  }

  const handlePreviewBack = () => {
    setShowCVPreview(false)
    setShowCVTemplateSelector(true)
  }

  const handlePreviewClose = () => {
    setShowCVPreview(false)
    setShowCVTemplateSelector(false)
    setShowCVDataForm(false)
    setCvFormData({})
  }

  const handleCVDownload = () => {
    // This will be called from the preview component
    handlePreviewClose()
  }

  if (!mounted) {
    return null
  }

  const navItems = ['home', 'portfolio', 'cv']
  if (isContactEnabled) navItems.push('contact')

  return (
    <div className="min-h-screen bg-gradient-modern text-foreground transition-all duration-300">
      <header className="header fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-2 lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              <MenuIcon className="h-6 w-6" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">{personalInfo.name}</h1>
          </div>
          <nav className="hidden lg:block">
            <ul className="flex space-x-2 sm:space-x-6">
              {navItems.map((section) => (
                <li key={section}>
                  <Button
                    variant="ghost"
                    className={`text-sm sm:text-lg px-2 sm:px-4 transition-all duration-300 ${
                      activeSection === section 
                        ? 'bg-accent text-background shadow-lg' 
                        : 'text-foreground hover:text-accent hover:bg-muted'
                    }`}
                    onClick={() => scrollToSection(section)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowThemeSelector(true)}
              className="hover:bg-accent/10 hover:text-accent transition-all duration-300"
              aria-label="Change theme"
            >
              <PaletteIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMode}
              className="hover:bg-accent/10 hover:text-accent transition-all duration-300"
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            ref={mobileMenuRef}
            className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border p-6 mobile-menu-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" className="absolute top-4 right-4" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <XIcon className="h-6 w-6" />
            </Button>
            <ul className="space-y-4 mt-8">
              {navItems.map((section) => (
                <li key={section}>
                  <Button
                    variant="ghost"
                    className={`text-lg w-full justify-start transition-all duration-300 ${
                      activeSection === section 
                        ? 'bg-accent text-background' 
                        : 'text-foreground hover:text-accent hover:bg-muted'
                    }`}
                    onClick={() => scrollToSection(section)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <main className="pt-20">
        {/* Home section */}
        <section
          ref={sectionRefs.current['home']}
          className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-modern"
        >
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-foreground animate-float">
              {personalInfo.name}
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-foreground/80">
              {personalInfo.role}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent-hover text-background btn-glow transform hover:scale-105 transition-all duration-300" 
                onClick={() => scrollToSection('portfolio')}
              >
                View Portfolio
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent/10 transform hover:scale-105 transition-all duration-300"
                onClick={() => setShowCVTemplateSelector(true)}
              >
                Download CV
              </Button>
            </div>
          </div>
          <ChevronDownIcon
            className="animate-bounce mt-16 cursor-pointer text-foreground/60 hover:text-accent transition-colors duration-300"
            size={48}
            onClick={() => scrollToSection('portfolio')}
          />
        </section>

        {/* Portfolio section */}
        <section
          ref={sectionRefs.current['portfolio']}
          className="min-h-screen py-20 px-4 bg-muted"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-foreground">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="bg-card overflow-hidden group card-hover">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={500}
                    height={250}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button 
                      className="bg-accent hover:bg-accent-hover text-background btn-glow transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" 
                      onClick={() => window.open(project.link, '_blank')}
                    >
                      View Project
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-foreground/70">{project.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CV section */}
        <section
          ref={sectionRefs.current['cv']}
          className="min-h-screen py-20 px-4 bg-background"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-foreground">Curriculum Vitae</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-card rounded-lg p-6 card-hover border border-border">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Experience</h3>
              <ul className="space-y-6">
                {cvData.experiences.map((exp, index) => (
                  <li key={index} className="border-l-2 border-accent pl-4">
                    <h4 className="text-xl font-medium text-foreground">{exp.title} at {exp.company}</h4>
                    <p className="text-accent font-medium">{exp.period}</p>
                    <p className="text-foreground/80 mt-2">{exp.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-lg p-6 card-hover border border-border">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Education</h3>
              <ul className="space-y-4">
                {cvData.education.map((edu, index) => (
                  <li key={index} className="border-l-2 border-accent pl-4">
                    <h4 className="text-xl font-medium text-foreground">{edu.degree}</h4>
                    <p className="text-accent font-medium">{edu.institution}, {edu.year}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-lg p-6 card-hover border border-border">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-accent text-background px-3 py-1 rounded-full text-sm font-medium hover:bg-accent-hover transition-colors duration-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact section */}
        {isContactEnabled && (
          <section
            ref={sectionRefs.current['contact']}
            className="min-h-screen py-20 px-4 flex items-center justify-center bg-muted"
          >
            <Card className="w-full max-w-md p-8 bg-card border border-border card-hover">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-foreground">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground transition-all duration-300"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent-hover text-background btn-glow">
                  Send Message
                </Button>
              </form>
              {submitStatus === 'success' && <p className="mt-4 text-green-600">Message sent successfully!</p>}
              {submitStatus === 'error' && <p className="mt-4 text-red-600">An error occurred. Please try again.</p>}
            </Card>
          </section>
        )}
      </main>

      <footer className="bg-background/90 backdrop-blur-md border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/80 text-center md:text-left">&copy; 2024 {personalInfo.name}. All rights reserved. This site was created by CharlyAutomatiza.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.github && (
              <Button 
                variant="ghost" 
                className="text-foreground/70 hover:text-accent transition-colors duration-300 dark:text-foreground/70 text-foreground/90" 
                onClick={() => window.open(socialLinks.github, '_blank')} 
                aria-label="GitHub"
              >
                <GithubIcon size={24} />
              </Button>
            )}
            {socialLinks.linkedin && (
              <Button 
                variant="ghost" 
                className="text-foreground/70 hover:text-accent transition-colors duration-300" 
                onClick={() => window.open(socialLinks.linkedin, '_blank')} 
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={24} />
              </Button>
            )}
            {socialLinks.email && (
              <Button 
                variant="ghost" 
                className="text-foreground/70 hover:text-accent transition-colors duration-300" 
                onClick={() => window.open(`mailto:${socialLinks.email}`)} 
                aria-label="Email"
              >
                <MailIcon size={24} />
              </Button>
            )}
            {cvPdfUrl && (
              <Button 
                variant="ghost" 
                className="text-foreground/70 hover:text-accent transition-colors duration-300" 
                onClick={() => setShowCVTemplateSelector(true)} 
                aria-label="Download CV"
              >
                <FileTextIcon size={24} />
              </Button>
            )}
          </div>
        </div>
      </footer>

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelector onClose={() => setShowThemeSelector(false)} />
      )}

      {/* CV Template Selector Modal */}
      {showCVTemplateSelector && (
        <CVTemplateSelector
          onTemplateSelect={handleTemplateSelect}
          onClose={() => setShowCVTemplateSelector(false)}
        />
      )}

      {/* CV Data Form Modal */}
      {showCVDataForm && (
        <CVDataForm
          onSubmit={handleCVDataSubmit}
          onClose={() => {
            setShowCVDataForm(false)
            setShowCVTemplateSelector(true)
          }}
        />
      )}

      {/* CV Preview Modal */}
      {showCVPreview && (
        <CVPreview
          template={selectedTemplate}
          cvData={cvData}
          personalInfo={personalInfo}
          additionalData={cvFormData}
          onClose={handlePreviewClose}
          onBack={handlePreviewBack}
          onDownload={handleCVDownload}
        />
      )}
    </div>
  )
}
