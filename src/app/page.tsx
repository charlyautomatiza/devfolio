import { getMarkdownContent } from '@/utils/markdown'
import Portfolio from '@/components/Portfolio'
import { Metadata } from 'next'
import fs from 'fs/promises'
import path from 'path'
import { createCVPdf } from '@/utils/pdfGenerator'
import { CVData, PersonalInfo, Project, SocialLinks } from '@/types'

export async function generateMetadata(): Promise<Metadata> {
  const personalInfoData = await getMarkdownContent('personal-info.md')
  const personalInfo = personalInfoData.data as PersonalInfo

  return {
    title: personalInfo.name,
    description: `${personalInfo.name} - ${personalInfo.role}`,
  }
}

async function getCvPdfUrl() {
  const cvPath = path.join(process.cwd(), 'public', 'cv.pdf')
  try {
    await fs.access(cvPath)
    return '/cv.pdf'
  } catch {
    return undefined
  }
}

export default async function Page() {
  const projectsData = await getMarkdownContent('projects.md')
  const cvData = await getMarkdownContent('cv.md')
  const personalInfoData = await getMarkdownContent('personal-info.md')
  const socialLinksData = await getMarkdownContent('social-links.md')
  
  let cvPdfUrl = await getCvPdfUrl()
  
  if (!cvPdfUrl) {
    // Create PDF if it doesn't exist
    const pdfBuffer = await createCVPdf(cvData.data as CVData, personalInfoData.data as PersonalInfo)
    await fs.writeFile(path.join(process.cwd(), 'public', 'cv.pdf'), Buffer.from(pdfBuffer))
    cvPdfUrl = '/cv.pdf'
  }

  return (
    <Portfolio
      projects={projectsData.data.projects as Project[]}
      cvData={cvData.data as CVData}
      personalInfo={personalInfoData.data as PersonalInfo}
      socialLinks={socialLinksData.data as SocialLinks}
      cvPdfUrl={cvPdfUrl}
    />
  )
}
