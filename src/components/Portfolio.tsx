'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { GithubIcon, LinkedinIcon, MailIcon, FileTextIcon, ChevronDownIcon, MoonIcon, SunIcon, MenuIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { PortfolioProps as PortfolioPropsType } from '@/types'

gsap.registerPlugin(ScrollTrigger)

export default function Portfolio({ projects, cvData, personalInfo, socialLinks, cvPdfUrl }: Readonly<PortfolioPropsType>) {
  const [activeSection, setActiveSection] = useState('home')
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    
    const sections = ['home', 'portfolio', 'cv', 'contact']
    sections.forEach((section) => {
      sectionRefs.current[section] = React.createRef<HTMLDivElement>()
    })

    const handleScroll = () => {
      let current = ''
      sections.forEach((section) => {
        const element = sectionRefs.current[section].current
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
  }, [])

  useEffect(() => {
    if (mounted) {
      gsap.from('.header', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' })

      Object.keys(sectionRefs.current).forEach((section) => {
        if (sectionRefs.current[section].current) {
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
    const element = sectionRefs.current[section].current
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    // For now, we'll just log the form data
    console.log('Form submitted:', { name, email, message })
    alert('Message sent successfully!')
    e.currentTarget.reset()
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-2xl text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="header fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Navigate through different sections of the portfolio
                </SheetDescription>
                <nav className="flex flex-col space-y-4 mt-8">
                  {['home', 'portfolio', 'cv', 'contact'].map((section) => (
                    <Button
                      key={section}
                      variant="ghost"
                      className={`justify-start ${activeSection === section ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => scrollToSection(section)}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">{personalInfo.name}</h1>
          </div>
          <nav className="hidden lg:block">
            <ul className="flex space-x-6">
              {['home', 'portfolio', 'cv', 'contact'].map((section) => (
                <li key={section}>
                  <Button
                    variant="ghost"
                    className={`text-lg ${activeSection === section ? 'bg-primary text-primary-foreground' : ''}`}
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
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="pt-20">
        <section
          ref={sectionRefs.current['home']}
          className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-background to-secondary/20"
        >
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 animate-pulse">{personalInfo.name}</h1>
          <p className="text-xl sm:text-2xl mb-8 text-muted-foreground">{personalInfo.role}</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" onClick={() => scrollToSection('portfolio')}>
              View Portfolio
            </Button>
            {cvPdfUrl && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open(cvPdfUrl, '_blank')}
              >
                Download CV
              </Button>
            )}
          </div>
          <ChevronDownIcon
            className="animate-bounce mt-16 cursor-pointer"
            size={48}
            onClick={() => scrollToSection('portfolio')}
          />
        </section>

        <section
          ref={sectionRefs.current['portfolio']}
          className="min-h-screen py-20 px-4 bg-secondary/20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="overflow-hidden group">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={500}
                    height={250}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button onClick={() => window.open(project.link, '_blank')}>View Project</Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          ref={sectionRefs.current['cv']}
          className="min-h-screen py-20 px-4 bg-background"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Curriculum Vitae</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent>
              <CardContent className="space-y-4">
                    {cvData.experiences.map((exp, index) => (
                      <div key={index}>
                        <h4 className="text-xl font-medium">{exp.title} at {exp.company}</h4>
                        <p className="text-muted-foreground">{exp.period}</p>
                        <p>{exp.description}</p>
                      </div>
                    ))}
              </CardContent>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvData.education.map((edu, index) => (
                  <div key={index}>
                    <h4 className="text-xl font-medium">{edu.degree}</h4>
                    <p className="text-muted-foreground">{edu.institution}, {edu.year}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <span key={index} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          ref={sectionRefs.current['contact']}
          className="min-h-screen py-20 px-4 flex items-center justify-center bg-secondary/20"
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl font-bold text-center">Get in Touch</CardTitle>
              <CardDescription className="text-center">I&apos;d love to hear from you!</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-secondary py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-center md:text-left">&copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved. Created by{' '}
            <a 
              href="https://charlyautomatiza.tech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              CharlyAutomatiza
            </a>
            .
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.github && (
              <Button variant="ghost" size="icon" onClick={() => window.open(socialLinks.github, '_blank')} aria-label="GitHub">
                <GithubIcon size={24} />
              </Button>
            )}
            {socialLinks.linkedin && (
              <Button variant="ghost" size="icon" onClick={() => window.open(socialLinks.linkedin, '_blank')} aria-label="LinkedIn">
                <LinkedinIcon size={24} />
              </Button>
            )}
            {socialLinks.email && (
              <Button variant="ghost" size="icon" onClick={() => window.open(`mailto:${socialLinks.email}`)} aria-label="Email">
                <MailIcon size={24} />
              </Button>
            )}
            {cvPdfUrl && (
              <Button variant="ghost" size="icon" onClick={() => window.open(cvPdfUrl, '_blank')} aria-label="Download CV">
                <FileTextIcon size={24} />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
