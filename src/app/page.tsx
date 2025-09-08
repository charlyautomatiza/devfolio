import { getMarkdownContent } from '@/utils/markdown'
import Portfolio from '@/components/Portfolio'
import { Metadata } from 'next'
import { CVData, PersonalInfo, Project, SocialLinks } from '@/types'

export async function generateMetadata(): Promise<Metadata> {
  const personalInfoData = await getMarkdownContent('personal-info.md')
  const personalInfo = personalInfoData.data as PersonalInfo

  return {
    title: personalInfo.name,
    description: `${personalInfo.name} - ${personalInfo.role}`,
  }
}

export default async function Page() {
  const projectsData = await getMarkdownContent('projects.md')
  const cvData = await getMarkdownContent('cv.md')
  const personalInfoData = await getMarkdownContent('personal-info.md')
  const socialLinksData = await getMarkdownContent('social-links.md')

  return (
    <Portfolio
      projects={projectsData.data.projects as Project[]}
      cvData={cvData.data as CVData}
      personalInfo={personalInfoData.data as PersonalInfo}
      socialLinks={socialLinksData.data as SocialLinks}
      cvPdfUrl="/cv.pdf" // Keep for backward compatibility
    />
  )
}
