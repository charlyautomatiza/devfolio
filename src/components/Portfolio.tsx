'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GithubIcon, LinkedinIcon, MailIcon, FileTextIcon, ChevronDownIcon, MoonIcon, SunIcon, MenuIcon, XIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { PortfolioProps } from '@/types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export default function Portfolio({ projects, cvData, personalInfo, socialLinks, cvPdfUrl }: Readonly<PortfolioProps>) {
  const [activeSection, setActiveSection] = useState('')
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const [isContactEnabled, setIsContactEnabled] = useState(false)

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

      if (response.ok) {
        alert('Message sent successfully!')
        e.currentTarget.reset()
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred. Please try again.')
    }
  }

  if (!mounted) {
    return null
  }

  const navItems = ['home', 'portfolio', 'cv']
  if (isContactEnabled) navItems.push('contact')

  return (
    <div className="min-h-screen bg-[#C7D8D9] dark:bg-[#151E21] text-[#2F3E44] dark:text-white transition-colors duration-300">
      <header className="header fixed top-0 left-0 right-0 z-50 bg-[#91B8C1]/80 dark:bg-[#121212]/80 backdrop-blur-md">
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
                    className={`text-sm sm:text-lg px-2 sm:px-4 ${
                      activeSection === section 
                        ? 'bg-[#56B281] dark:bg-[#151E21] text-white' 
                        : 'text-[#2F3E44] dark:text-white hover:text-[#2F3E44]/80 dark:hover:text-white/80'
                    }`}
                    onClick={() => scrollToSection(section)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden">
          <div
            ref={mobileMenuRef}
            className="fixed inset-y-0 left-0 w-64 bg-[#91B8C1] dark:bg-[#121212] p-6"
          >
            <Button variant="ghost" className="absolute top-4 right-4" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <XIcon className="h-6 w-6" />
            </Button>
            <ul className="space-y-4 mt-8">
              {navItems.map((section) => (
                <li key={section}>
                  <Button
                    variant="ghost"
                    className={`text-lg w-full justify-start ${
                      activeSection === section 
                        ? 'bg-[#56B281] dark:bg-[#151E21] text-white' 
                        : 'text-[#2F3E44] dark:text-white hover:text-[#2F3E44]/80 dark:hover:text-white/80'
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
          className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-[#C7D8D9] to-[#91B8C1] dark:from-[#151E21] dark:to-[#121212]"
        >
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 animate-pulse text-[#2F3E44] dark:text-white">{personalInfo.name}</h1>
          <p className="text-xl sm:text-2xl mb-8 text-[#2F3E44]/80 dark:text-white/80">{personalInfo.role}</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-[#56B281] hover:bg-[#56B281]/90 text-white" onClick={() => scrollToSection('portfolio')}>
              View Portfolio
            </Button>
            {cvPdfUrl && (
              <Button 
                size="lg" 
                variant="outline" 
                className="border-[#56B281] text-[#56B281] hover:bg-[#56B281]/10 dark:text-white dark:border-white"
                onClick={() => window.open(cvPdfUrl, '_blank')}
              >
                Download CV
              </Button>
            )}
          </div>
          <ChevronDownIcon
            className="animate-bounce mt-16 cursor-pointer text-[#2F3E44] dark:text-white"
            size={48}
            onClick={() => scrollToSection('portfolio')}
          />
        </section>

        {/* Portfolio section */}
        <section
          ref={sectionRefs.current['portfolio']}
          className="min-h-screen py-20 px-4 bg-[#DED7C9] dark:bg-[#151E21]"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-[#2F3E44] dark:text-white">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="bg-white dark:bg-[#121212] overflow-hidden group">
                <div className="aspect-video bg-[#91B8C1] dark:bg-[#151E21] relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={500}
                    height={250}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#2F3E44]/50 dark:bg-[#151E21]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="bg-[#56B281] hover:bg-[#56B281]/90 text-white" onClick={() => window.open(project.link, '_blank')}>View Project</Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-[#2F3E44] dark:text-white">{project.title}</h3>
                  <p className="text-[#2F3E44]/70 dark:text-white/70">{project.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CV section */}
        <section
          ref={sectionRefs.current['cv']}
          className="min-h-screen py-20 px-4 bg-[#91B8C1] dark:bg-[#121212]"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-white">Curriculum Vitae</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white dark:bg-[#151E21] rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-[#2F3E44] dark:text-white">Experience</h3>
              <ul className="space-y-4">
                {cvData.experiences.map((exp, index) => (
                  <li key={index}>
                    <h4 className="text-xl font-medium text-[#2F3E44] dark:text-white">{exp.title} at {exp.company}</h4>
                    <p className="text-[#2F3E44]/70 dark:text-white/70">{exp.period}</p>
                    <p className="text-[#2F3E44] dark:text-white">{exp.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-[#151E21] rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-[#2F3E44] dark:text-white">Education</h3>
              <ul className="space-y-4">
                {cvData.education.map((edu, index) => (
                  <li key={index}>
                    <h4 className="text-xl font-medium text-[#2F3E44] dark:text-white">{edu.degree}</h4>
                    <p className="text-[#2F3E44]/70 dark:text-white/70">{edu.institution}, {edu.year}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-[#151E21] rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-[#2F3E44] dark:text-white">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, index) => (
                  <span key={index} className="bg-[#56B281] text-white px-3 py-1 rounded-full text-sm">
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
            className="min-h-screen py-20 px-4 flex items-center justify-center bg-[#DED7C9] dark:bg-[#151E21]"
          >
            <Card className="w-full max-w-md p-8 bg-white dark:bg-[#121212]">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[#2F3E44] dark:text-white">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#2F3E44] dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 bg-[#C7D8D9] dark:bg-[#151E21] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44] dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#2F3E44] dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 bg-[#C7D8D9] dark:bg-[#151E21] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44] dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-[#2F3E44] dark:text-white">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 bg-[#C7D8D9] dark:bg-[#151E21] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44] dark:text-white"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-[#56B281] hover:bg-[#56B281]/90 text-white">
                  Send Message
                </Button>
              </form>
            </Card>
          </section>
        )}
      </main>

      <footer className="bg-[#2F3E44] dark:bg-[#121212] py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-center md:text-left">&copy; 2024 {personalInfo.name}. All rights reserved. This site was created by CharlyAutomatiza.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.github && (
              <Button variant="ghost" className="text-white/70 hover:text-white" onClick={() => window.open(socialLinks.github, '_blank')} aria-label="GitHub">
                <GithubIcon size={24} />
              </Button>
            )}
            {socialLinks.linkedin && (
              <Button variant="ghost" className="text-white/70 hover:text-white" onClick={() => window.open(socialLinks.linkedin, '_blank')} aria-label="LinkedIn">
                <LinkedinIcon size={24} />
              </Button>
            )}
            {socialLinks.email && (
              <Button variant="ghost" className="text-white/70 hover:text-white" onClick={() => window.open(`mailto:${socialLinks.email}`)} aria-label="Email">
                <MailIcon size={24} />
              </Button>
            )}
            {cvPdfUrl && (
              <Button variant="ghost" className="text-white/70 hover:text-white" onClick={() => window.open(cvPdfUrl, '_blank')} aria-label="Download CV">
                <FileTextIcon size={24} />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
