'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Github, Linkedin, Mail, FileText, ChevronDown, Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('')
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
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

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#C7D8D9] dark:bg-[#151E21] text-[#2F3E44] dark:text-white transition-colors duration-300">
      <header className="header fixed top-0 left-0 right-0 z-50 bg-[#91B8C1]/80 dark:bg-[#121212]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold tracking-wide">John Doe</h1>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {['home', 'portfolio', 'cv', 'contact'].map((section) => (
                <li key={section}>
                  <Button
                    variant="ghost"
                    className={`text-lg ${
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
            className="ml-auto"
          >
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden">
          <div
            ref={mobileMenuRef}
            className="fixed inset-y-0 left-0 w-64 bg-[#91B8C1] dark:bg-[#121212] p-6"
          >
            <Button variant="ghost" className="absolute top-4 right-4" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
            <ul className="space-y-4 mt-8">
              {['home', 'portfolio', 'cv', 'contact'].map((section) => (
                <li key={section}>
                  <Button
                    variant="ghost"
                    className={`text-lg w-full justify-start ${
                      activeSection === section 
                        ? 'bg-[#56B281] dark:bg-[#151E21] text-white' 
                        : 'text-[#2F3E44] dark:text-white hover:text-[#2F3E44]/80 dark:hover:text-white/80'
                    }`}
                    onClick={() => {
                      scrollToSection(section)
                      setMobileMenuOpen(false)
                    }}
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
        <section
          ref={sectionRefs.current['home']}
          className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-[#C7D8D9] to-[#91B8C1] dark:from-[#151E21] dark:to-[#121212]"
        >
          <h1 className="text-6xl font-bold mb-6 animate-pulse text-[#2F3E44] dark:text-white">John Doe</h1>
          <p className="text-2xl mb-8 text-[#2F3E44]/80 dark:text-white/80">Full Stack Developer & UI/UX Enthusiast</p>
          <div className="flex space-x-4">
            <Button size="lg" className="bg-[#56B281] hover:bg-[#56B281]/90 text-white" onClick={() => scrollToSection('portfolio')}>
              View Portfolio
            </Button>
            <Button size="lg" variant="outline" className="border-[#56B281] text-[#56B281] hover:bg-[#56B281]/10 dark:text-white dark:border-white">
              Download CV
            </Button>
          </div>
          <ChevronDown
            className="animate-bounce mt-16 cursor-pointer text-[#2F3E44] dark:text-white"
            size={48}
            onClick={() => scrollToSection('portfolio')}
          />
        </section>

        <section
          ref={sectionRefs.current['portfolio']}
          className="min-h-screen py-20 px-4 bg-[#DED7C9] dark:bg-[#151E21]"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-[#2F3E44] dark:text-white">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="bg-white dark:bg-[#121212] overflow-hidden group">
                <div className="aspect-video bg-[#91B8C1] dark:bg-[#151E21] relative overflow-hidden">
                  <Image
                    src={`/placeholder.svg`}
                    alt={`Project ${item}`}
                    width={500}
                    height={250}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#2F3E44]/50 dark:bg-[#151E21]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="bg-[#56B281] hover:bg-[#56B281]/90 text-white">View Project</Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-[#2F3E44] dark:text-white">Project {item}</h3>
                  <p className="text-[#2F3E44]/70 dark:text-white/70">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section
          ref={sectionRefs.current['cv']}
          className="min-h-screen py-20 px-4 bg-[#91B8C1] dark:bg-[#121212]"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-white">Curriculum Vitae</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white dark:bg-[#151E21] rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-[#2F3E44] dark:text-white">Experience</h3>
              <ul className="space-y-4">
                <li>
                  <h4 className="text-xl font-medium text-[#2F3E44] dark:text-white">Senior Developer at Tech Co.</h4>
                  <p className="text-[#2F3E44]/70 dark:text-white/70">2018 - Present</p>
                  <p className="text-[#2F3E44] dark:text-white">Led development of multiple high-impact projects...</p>
                </li>
                <li>
                  <h4 className="text-xl font-medium text-[#2F3E44] dark:text-white">Full Stack Developer at StartUp Inc.</h4>
                  <p className="text-[#2F3E44]/70 dark:text-white/70">2015 - 2018</p>
                  <p className="text-[#2F3E44] dark:text-white">Developed and maintained various web applications...</p>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-[#151E21] rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-[#2F3E44] dark:text-white">Education</h3>
              <ul className="space-y-4">
                <li>
                  <h4 className="text-xl font-medium text-[#2F3E44] dark:text-white">MSc in Computer Science</h4>
                  <p className="text-[#2F3E44]/70 dark:text-white/70">University of Technology, 2015</p>
                </li>
                <li>
                  <h4 className="text-xl font-medium text-[#2F3E44] dark:text-white">BSc in Software Engineering</h4>
                  <p className="text-[#2F3E44]/70 dark:text-white/70">State University, 2013</p>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-[#151E21] rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-[#2F3E44] dark:text-white">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git'].map((skill) => (
                  <span key={skill} className="bg-[#56B281] text-white px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          ref={sectionRefs.current['contact']}
          className="min-h-screen py-20 px-4 flex items-center justify-center bg-[#DED7C9] dark:bg-[#151E21]"
        >
          <Card className="w-full max-w-md p-8 bg-white dark:bg-[#121212]">
            <h2 className="text-4xl font-bold mb-8 text-center text-[#2F3E44] dark:text-white">Get in Touch</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#2F3E44] dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
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
                  className="w-full px-3 py-2  bg-[#C7D8D9] dark:bg-[#151E21] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44] dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-[#2F3E44] dark:text-white">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 bg-[#C7D8D9] dark:bg-[#151E21] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44] dark:text-white"
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-[#56B281] hover:bg-[#56B281]/90 text-white">
                Send Message
              </Button>
            </form>
          </Card>
        </section>
      </main>

      <footer className="bg-[#2F3E44] dark:bg-[#121212] py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-white">&copy; 2024 John Doe. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-white/70 hover:text-white">
              <Github size={24} />
            </a>
            <a href="#" className="text-white/70 hover:text-white">
              <Linkedin size={24} />
            </a>
            <a href="#" className="text-white/70 hover:text-white">
              <Mail size={24} />
            </a>
            <a href="#" className="text-white/70 hover:text-white">
              <FileText size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
