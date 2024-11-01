'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Github, Linkedin, Mail, FileText, ChevronDown, Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'

gsap.registerPlugin(ScrollTrigger)

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home')
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    // Handle click outside of mobile menu
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    ['home', 'portfolio', 'cv', 'contact'].forEach((section) => {
      sectionRefs.current[section] = React.createRef<HTMLDivElement>()
    })
  }, [])

  useEffect(() => {
    // Animate header on load
    gsap.from('.header', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' })

    // Animate sections on scroll
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

    // Update active section on scroll
    const updateActiveSection = () => {
      let currentSection = 'home'
      Object.keys(sectionRefs.current).forEach((section) => {
        const element = sectionRefs.current[section].current
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section
          }
        }
      })
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', updateActiveSection)
    return () => window.removeEventListener('scroll', updateActiveSection)
  }, [])

  const scrollToSection = (section: string) => {
    sectionRefs.current[section]?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!mounted) {
    return <div className="min-h-screen bg-[#C7D8D9]" />
  }

  return (
    <div className="min-h-screen bg-[#C7D8D9] text-[#2F3E44]">
      <header className="header fixed top-0 left-0 right-0 z-50 bg-[#91B8C1]/80 backdrop-blur-md">
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
                      activeSection === section ? 'bg-[#56B281] text-white' : 'text-[#2F3E44] hover:text-[#2F3E44]/80'
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
            className="fixed inset-y-0 left-0 w-64 bg-[#91B8C1] p-6"
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
                      activeSection === section ? 'bg-[#56B281] text-white' : 'text-[#2F3E44] hover:text-[#2F3E44]/80'
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
          className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-[#C7D8D9] to-[#91B8C1]"
        >
          <h1 className="text-6xl font-bold mb-6 animate-pulse text-[#2F3E44]">John Doe</h1>
          <p className="text-2xl mb-8 text-[#2F3E44]/80">Full Stack Developer & UI/UX Enthusiast</p>
          <div className="flex space-x-4">
            <Button size="lg" className="bg-[#56B281] hover:bg-[#56B281]/90 text-white">
              View Portfolio
            </Button>
            <Button size="lg" variant="outline" className="border-[#56B281] text-[#56B281] hover:bg-[#56B281]/10">
              Download CV
            </Button>
          </div>
          <ChevronDown
            className="animate-bounce mt-16 cursor-pointer text-[#2F3E44]"
            size={48}
            onClick={() => scrollToSection('portfolio')}
          />
        </section>

        <section
          ref={sectionRefs.current['portfolio']}
          className="min-h-screen py-20 px-4 bg-[#DED7C9]"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-[#2F3E44]">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="bg-white overflow-hidden group">
                <div className="aspect-video bg-[#91B8C1] relative overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=250&width=500`}
                    alt={`Project ${item}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#2F3E44]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="bg-[#56B281] hover:bg-[#56B281]/90 text-white">View Project</Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-[#2F3E44]">Project {item}</h3>
                  <p className="text-[#2F3E44]/70">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section
          ref={sectionRefs.current['cv']}
          className="min-h-screen py-20 px-4 bg-[#91B8C1]"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-white">Curriculum Vitae</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-[#2F3E44]">Experience</h3>
              <ul className="space-y-4">
                <li>
                  <h4 className="text-xl font-medium text-[#2F3E44]">Senior Developer at Tech Co.</h4>
                  <p className="text-[#2F3E44]/70">2018 - Present</p>
                  <p className="text-[#2F3E44]">Led development of multiple high-impact projects...</p>
                </li>
                <li>
                  <h4 className="text-xl font-medium text-[#2F3E44]">Full Stack Developer at StartUp Inc.</h4>
                  <p className="text-[#2F3E44]/70">2015 - 2018</p>
                  <p className="text-[#2F3E44]">Developed and maintained various web applications...</p>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-[#2F3E44]">Education</h3>
              <ul className="space-y-4">
                <li>
                  <h4 className="text-xl font-medium text-[#2F3E44]">MSc in Computer Science</h4>
                  <p className="text-[#2F3E44]/70">University of Technology, 2015</p>
                </li>
                <li>
                  <h4 className="text-xl font-medium text-[#2F3E44]">BSc in Software Engineering</h4>
                  <p className="text-[#2F3E44]/70">State University, 2013</p>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-[#2F3E44]">Skills</h3>
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
          className="min-h-screen py-20 px-4 flex items-center justify-center bg-[#DED7C9]"
        >
          <Card className="w-full max-w-md p-8 bg-white">
            <h2 className="text-4xl font-bold mb-8 text-center text-[#2F3E44]">Get in Touch</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#2F3E44]">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 bg-[#C7D8D9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#2F3E44]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 bg-[#C7D8D9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-[#2F3E44]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 bg-[#C7D8D9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44]"
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-[#56B281] hover:bg-[#56B281]/90 text-white">
                Send Message
              
              </Button>
            </form>
          </Card>
        </section>
      </main>

      <footer className="bg-[#2F3E44] py-8 px-4">
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
