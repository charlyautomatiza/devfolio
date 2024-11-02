import { getMarkdownContent } from '@/utils/markdown'
import Portfolio from '@/components/Portfolio'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'My professional portfolio',
}

export default async function Page() {
  const projectsData = await getMarkdownContent('projects.md')
  const cvData = await getMarkdownContent('cv.md')
  const personalInfoData = await getMarkdownContent('personal-info.md')

  return (
    <Portfolio
      projects={projectsData.data.projects}
      cvData={cvData.data}
      personalInfo={personalInfoData.data}
    />
  )
}
