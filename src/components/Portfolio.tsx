'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { GithubIcon, LinkedinIcon, MailIcon, FileTextIcon, MoonIcon, SunIcon, MenuIcon, XIcon, PaletteIcon, ExternalLinkIcon, MapPinIcon, ArrowDownIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useMultiTheme } from '@/components/MultiThemeProvider'
import ThemeSelector from '@/components/ThemeSelector'
import { PortfolioProps } from '@/types'
import CVTemplateSelector from '@/components/CVTemplateSelector'
import CVPreview from '@/components/CVPreview'
import { CVTemplate, createCVPdf } from '@/utils/pdfGenerator'

gsap.registerPlugin(ScrollTrigger)

export default function Portfolio({
  projects,
  cvData,
  personalInfo,
  socialLinks,
  cvPdfUrl,
  isDevMode = false,
  featureFlags = { DEFAULT_CV_TEMPLATE: 'harvard' },
  showThemeSelector = false,
  footerConfig = {
    show_creator_link: true,
    creator_text: 'CharlyAutomatiza',
    creator_url: 'https://charlyautomatiza.tech/',
    rights_text: 'All rights reserved'
  }
}: Readonly<PortfolioProps>) {
  const [activeSection, setActiveSection] = useState('')
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { toggleMode } = useMultiTheme()
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false)
  const [isContactEnabled, setIsContactEnabled] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [showCVTemplateSelector, setShowCVTemplateSelector] = useState(false)
  const [showCVPreview, setShowCVPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('harvard')

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
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isContactEnabled])

  useEffect(() => {
    if (mounted) {
      gsap.from('.header', { y: -60, opacity: 0, duration: 0.8, ease: 'power3.out' })

      gsap.utils.toArray<Element>('.gsap-reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      if (e.currentTarget) e.currentTarget.reset()
      setSubmitStatus('success')
    } catch (error: unknown) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    }
  }

  const handleTemplateSelect = (template: CVTemplate) => {
    setSelectedTemplate(template)
    setShowCVTemplateSelector(false)
    setShowCVPreview(true)
  }

  const handlePreviewBack = () => {
    setShowCVPreview(false)
    setShowCVTemplateSelector(true)
  }

  const handlePreviewClose = () => {
    setShowCVPreview(false)
    setShowCVTemplateSelector(false)
  }

  const handleCVDownload = () => {
    handlePreviewClose()
  }

  const handleCVDownloadClick = async () => {
    if (isDevMode) {
      setShowCVTemplateSelector(true)
    } else {
      try {
        const template = featureFlags.DEFAULT_CV_TEMPLATE
        const pdfArrayBuffer = await createCVPdf(cvData, personalInfo, socialLinks, { template })
        const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = `${personalInfo.name.replace(/\s+/g, '_')}_CV_${template}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error downloading CV:', error)
      }
    }
  }

  if (!mounted) {
    return null
  }

  const navItems = ['home', 'portfolio', 'cv']
  if (isContactEnabled) navItems.push('contact')

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Header ─────────────────────────────────────────── */}
      <header
        className="header fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
        role="banner"
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex justify-between items-center">
          <button
            className="text-base font-semibold tracking-tight text-foreground hover:text-accent transition-colors duration-200"
            onClick={() => scrollToSection('home')}
            aria-label="Go to home"
          >
            {personalInfo.name}
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((section) => (
              <button
                key={section}
                className={`nav-link ${activeSection === section ? 'active' : ''}`}
                onClick={() => scrollToSection(section)}
                aria-current={activeSection === section ? 'page' : undefined}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {showThemeSelector && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setThemeSelectorOpen(true)}
                className="h-8 w-8 rounded-lg hover:bg-accent-subtle hover:text-accent transition-all duration-200"
                aria-label="Change theme"
              >
                <PaletteIcon className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMode}
              className="h-8 w-8 rounded-lg hover:bg-accent-subtle hover:text-accent transition-all duration-200"
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg lg:hidden hover:bg-accent-subtle transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu ────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <nav
            id="mobile-navigation"
            ref={mobileMenuRef}
            className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border p-6 mobile-menu-enter"
            onClick={(e) => e.stopPropagation()}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <XIcon className="h-4 w-4" />
            </Button>
            <p className="text-sm font-semibold text-muted-foreground mb-6 mt-2 uppercase tracking-widest">Navigation</p>
            <ul className="space-y-1">
              {navItems.map((section) => (
                <li key={section}>
                  <button
                    className={`nav-link w-full text-left text-base ${activeSection === section ? 'active' : ''}`}
                    onClick={() => scrollToSection(section)}
                    aria-current={activeSection === section ? 'page' : undefined}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <main className="pt-16">
        {/* ─── Hero ───────────────────────────────────────── */}
        <section
          ref={sectionRefs.current['home']}
          className="relative min-h-screen flex flex-col justify-center px-5"
          id="home"
        >
          {/* Subtle grid decoration */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
            aria-hidden="true"
          />

          <div className="max-w-6xl mx-auto w-full py-24 lg:py-32">
            <div className="max-w-4xl">
              <p className="section-label mb-6 gsap-reveal">Available for opportunities</p>

              <h1 className="display-xl text-foreground mb-6 gsap-reveal" style={{ animationDelay: '0.1s' }}>
                {personalInfo.name}
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground font-medium mb-4 gsap-reveal" style={{ animationDelay: '0.15s' }}>
                {personalInfo.role}
              </p>

              {personalInfo.location && (
                <p className="flex items-center gap-2 text-muted-foreground text-sm mb-10 gsap-reveal" style={{ animationDelay: '0.2s' }}>
                  <MapPinIcon className="h-4 w-4" />
                  {personalInfo.location}
                </p>
              )}

              <div className="flex flex-wrap gap-3 gsap-reveal" style={{ animationDelay: '0.25s' }}>
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover btn-glow transition-all duration-200"
                  onClick={() => scrollToSection('portfolio')}
                >
                  View Portfolio
                  <ArrowDownIcon className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:border-border-strong hover:bg-card-hover transition-all duration-200"
                  onClick={handleCVDownloadClick}
                >
                  <FileTextIcon className="h-4 w-4" />
                  Download CV
                </button>
              </div>

              {/* Social links inline */}
              <div className="flex items-center gap-3 mt-8 gsap-reveal" style={{ animationDelay: '0.3s' }}>
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                )}
                {socialLinks.email && (
                  <a
                    href={`mailto:${socialLinks.email}`}
                    className="flex items-center justify-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200"
                    aria-label="Email"
                  >
                    <MailIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Portfolio ──────────────────────────────────── */}
        <section
          ref={sectionRefs.current['portfolio']}
          className="py-24 px-5 bg-muted"
          id="portfolio"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-14 gsap-reveal">
              <p className="section-label mb-3">Selected work</p>
              <h2 className="display-md text-foreground">Portfolio</h2>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, index) => (
                <article
                  key={index}
                  className={`bento-cell group gsap-reveal ${index === 0 ? 'lg:col-span-2' : ''}`}
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  {/* Project number */}
                  <div className="p-6 pb-0 flex justify-between items-start">
                    <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                      aria-label={`Open ${project.title}`}
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="p-6 pt-4">
                    <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="h-1 w-0 group-hover:w-full bg-accent transition-all duration-500 ease-out" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CV / Experience ────────────────────────────── */}
        <section
          ref={sectionRefs.current['cv']}
          className="py-24 px-5 bg-background"
          id="cv"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-14 gsap-reveal">
              <p className="section-label mb-3">Background</p>
              <h2 className="display-md text-foreground">Curriculum Vitae</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Experience — takes 2 columns */}
              <div className="lg:col-span-2 space-y-4 gsap-reveal">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">Experience</h3>
                <div className="space-y-8">
                  {cvData.experiences.map((exp, index) => (
                    <div key={index} className="timeline-item gsap-reveal" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                        <div>
                          <h4 className="text-base font-semibold text-foreground">{exp.title}</h4>
                          <p className="text-sm font-medium text-accent">{exp.company}</p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">{exp.period}</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar: Education + Skills */}
              <div className="space-y-10">
                {/* Education */}
                <div className="gsap-reveal">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">Education</h3>
                  <div className="space-y-6">
                    {cvData.education.map((edu, index) => (
                      <div key={index} className="timeline-item">
                        <h4 className="text-sm font-semibold text-foreground">{edu.degree}</h4>
                        <p className="text-sm text-accent font-medium">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="gsap-reveal">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Download CTA */}
                <div className="gsap-reveal">
                  <button
                    onClick={handleCVDownloadClick}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover btn-glow transition-all duration-200"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    Download Full CV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Contact ────────────────────────────────────── */}
        {isContactEnabled && (
          <section
            ref={sectionRefs.current['contact']}
            className="py-24 px-5 bg-muted"
            id="contact"
          >
            <div className="max-w-6xl mx-auto">
              <div className="mb-14 gsap-reveal">
                <p className="section-label mb-3">Say hello</p>
                <h2 className="display-md text-foreground">Get in Touch</h2>
              </div>

              <div className="max-w-xl gsap-reveal">
                <div className="bento-cell p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground text-sm transition-all duration-200 placeholder:text-muted-foreground"
                        placeholder="Your name"
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
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground text-sm transition-all duration-200 placeholder:text-muted-foreground"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground text-sm transition-all duration-200 placeholder:text-muted-foreground resize-none"
                        placeholder="Tell me about your project..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover btn-glow transition-all duration-200"
                    >
                      Send Message
                    </button>
                  </form>
                  {submitStatus === 'success' && (
                    <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Message sent successfully!
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="mt-4 text-sm text-red-600 dark:text-red-400 font-medium">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} {personalInfo.name}. {footerConfig.rights_text}.
            {footerConfig.show_creator_link && (
              <>
                {' '}Built by{' '}
                <a
                  href={footerConfig.creator_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover transition-colors duration-200 underline underline-offset-2"
                >
                  {footerConfig.creator_text}
                </a>
                .
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            )}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200"
                aria-label="Email"
              >
                <MailIcon className="h-4 w-4" />
              </a>
            )}
            {cvPdfUrl && (
              <button
                onClick={handleCVDownloadClick}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200"
                aria-label="Download CV"
              >
                <FileTextIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* ─── Modals ─────────────────────────────────────────── */}
      {themeSelectorOpen && <ThemeSelector onClose={() => setThemeSelectorOpen(false)} />}

      {showCVTemplateSelector && (
        <CVTemplateSelector
          onTemplateSelect={handleTemplateSelect}
          onClose={() => setShowCVTemplateSelector(false)}
        />
      )}

      {showCVPreview && (
        <CVPreview
          template={selectedTemplate}
          cvData={cvData}
          personalInfo={personalInfo}
          socialLinks={socialLinks}
          onClose={handlePreviewClose}
          onBack={handlePreviewBack}
          onDownload={handleCVDownload}
        />
      )}
    </div>
  )
}
