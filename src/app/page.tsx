import { getMarkdownContent } from '@/utils/markdown'
import Portfolio from '@/components/Portfolio'
import { Metadata } from 'next'
import { CVData, PersonalInfo, Project, SocialLinks } from '@/types'
import { getFeatureFlags, isDevMode, shouldShowThemeSelector } from '@/utils/featureFlags'
import Script from 'next/script'

export async function generateMetadata(): Promise<Metadata> {
  const personalInfoData = await getMarkdownContent('personal-info.md')
  const personalInfo = personalInfoData.data as PersonalInfo

  return {
    title: `${personalInfo.name} - ${personalInfo.role}`,
    description: `Professional ${personalInfo.role} portfolio showcasing projects, experience, and skills. Download ATS-friendly CV templates.`,
    openGraph: {
      title: `${personalInfo.name} - ${personalInfo.role}`,
      description: `Professional ${personalInfo.role} portfolio showcasing projects, experience, and skills.`,
      type: 'profile',
      images: ['/og-image.png'],
    },
  }
}

export default async function Page() {
  const projectsData = await getMarkdownContent('projects.md')
  const cvData = await getMarkdownContent('cv.md')
  const personalInfoData = await getMarkdownContent('personal-info.md')
  const socialLinksData = await getMarkdownContent('social-links.md')

  const personalInfo = personalInfoData.data as PersonalInfo
  const socialLinks = socialLinksData.data as SocialLinks
  const projects = projectsData.data.projects as Project[]
  const flags = getFeatureFlags()
  const devMode = isDevMode()
  const showThemeSelector = shouldShowThemeSelector()

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personalInfo.name,
    "jobTitle": personalInfo.role,
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://devfolio.charlyautomatiza.com",
    "sameAs": [
      socialLinks.linkedin,
      socialLinks.github,
    ].filter(Boolean),
    "email": personalInfo.email,
    "telephone": personalInfo.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Global",
      "addressCountry": "Remote"
    },
    "knowsAbout": (cvData.data as CVData).skills.map(skill => skill.name),
    "hasOccupation": {
      "@type": "Occupation",
      "name": personalInfo.role
    }
  }

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Portfolio
        projects={projects}
        cvData={cvData.data as CVData}
        personalInfo={personalInfo}
        socialLinks={socialLinks}
        cvPdfUrl="/cv.pdf" // Keep for backward compatibility
        isDevMode={devMode}
        featureFlags={flags}
        showThemeSelector={showThemeSelector}
      />
    </>
  )
}
