import jsPDF from 'jspdf'
import { CVData, PersonalInfo } from '@/types'

export type CVTemplate = 'harvard' | 'modern' | 'creative'

interface CVGeneratorOptions {
  template?: CVTemplate
  accentColor?: string
}

export async function createCVPdf(
  cvData: CVData, 
  personalInfo: PersonalInfo, 
  options: CVGeneratorOptions = {}
) {
  const { template = 'harvard', accentColor = '#00ffaa' } = options
  
  switch (template) {
    case 'modern':
      return generateModernCV(cvData, personalInfo, accentColor)
    case 'creative':
      return generateCreativeCV(cvData, personalInfo, accentColor)
    case 'harvard':
    default:
      return generateHarvardCV(cvData, personalInfo)
  }
}

// Original Harvard template (enhanced)
function generateHarvardCV(cvData: CVData, personalInfo: PersonalInfo) {
  const doc = new jsPDF()

  // Header with enhanced styling
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(personalInfo.name, 105, 25, { align: 'center' })
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.text(personalInfo.role, 105, 35, { align: 'center' })
  
  // Add a subtle line under header
  doc.setLineWidth(0.5)
  doc.line(20, 45, 190, 45)

  let yPos = 60

  // Experience Section
  yPos = addSection(doc, 'EXPERIENCE', yPos)
  cvData.experiences.forEach((exp) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(`${exp.title} at ${exp.company}`, 20, yPos)
    yPos += 6
    
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.text(`${exp.period} | ${exp.location || ''}`, 20, yPos)
    yPos += 6
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const descriptionLines = doc.splitTextToSize(exp.description, 170) as string[]
    doc.text(descriptionLines, 20, yPos)
    yPos += 4 * descriptionLines.length + 8
  })

  // Education Section
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  yPos = addSection(doc, 'EDUCATION', yPos)
  cvData.education.forEach((edu) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(edu.degree, 20, yPos)
    yPos += 6
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`${edu.institution}, ${edu.year}`, 20, yPos)
    yPos += 12
  })

  // Skills Section
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  yPos = addSection(doc, 'SKILLS', yPos)
  
  const skillsPerLine = 4
  for (let i = 0; i < cvData.skills.length; i += skillsPerLine) {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    const rowSkills = cvData.skills.slice(i, i + skillsPerLine)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(rowSkills.map(skill => skill.name).join(' • '), 20, yPos)
    yPos += 6
  }

  return doc.output('arraybuffer')
}

// Modern template with accent colors
function generateModernCV(cvData: CVData, personalInfo: PersonalInfo, accentColor: string) {
  const doc = new jsPDF()
  
  // Modern header with accent color sidebar
  doc.setFillColor(accentColor)
  doc.rect(0, 0, 60, 297, 'F') // Left sidebar
  
  // Name and role in white on accent background
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  const nameLines = doc.splitTextToSize(personalInfo.name, 50) as string[]
  let nameY = 30
  nameLines.forEach((line: string) => {
    doc.text(line, 30, nameY, { align: 'center' })
    nameY += 8
  })
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const roleLines = doc.splitTextToSize(personalInfo.role, 50) as string[]
  roleLines.forEach((line: string) => {
    doc.text(line, 30, nameY, { align: 'center' })
    nameY += 6
  })

  // Reset text color for main content
  doc.setTextColor(0, 0, 0)
  let yPos = 30

  // Experience Section
  yPos = addModernSection(doc, 'EXPERIENCE', yPos, accentColor)
  cvData.experiences.forEach((exp) => {
    if (yPos > 270) {
      doc.addPage()
      // Re-add sidebar on new page
      doc.setFillColor(accentColor)
      doc.rect(0, 0, 60, 297, 'F')
      doc.setTextColor(0, 0, 0)
      yPos = 20
    }
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`${exp.title}`, 70, yPos)
    yPos += 5
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`${exp.company} | ${exp.period}`, 70, yPos)
    yPos += 5
    
    doc.setFontSize(9)
    const descriptionLines = doc.splitTextToSize(exp.description, 120) as string[]
    doc.text(descriptionLines, 70, yPos)
    yPos += 3 * descriptionLines.length + 8
  })

  // Education and Skills sections
  if (yPos > 200) {
    doc.addPage()
    doc.setFillColor(accentColor)
    doc.rect(0, 0, 60, 297, 'F')
    doc.setTextColor(0, 0, 0)
    yPos = 20
  }

  yPos = addModernSection(doc, 'EDUCATION', yPos, accentColor)
  cvData.education.forEach((edu) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(edu.degree, 70, yPos)
    yPos += 5
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`${edu.institution}, ${edu.year}`, 70, yPos)
    yPos += 10
  })

  yPos = addModernSection(doc, 'SKILLS', yPos, accentColor)
  const skillsText = cvData.skills.map(skill => skill.name).join(' • ')
  const skillsLines = doc.splitTextToSize(skillsText, 120) as string[]
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(skillsLines, 70, yPos)

  return doc.output('arraybuffer')
}

// Creative template with more visual elements
function generateCreativeCV(cvData: CVData, personalInfo: PersonalInfo, accentColor: string) {
  const doc = new jsPDF()
  
  // Creative header with geometric shapes
  doc.setFillColor(accentColor)
  doc.circle(30, 30, 15, 'F')
  
  // Name in a modern layout
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(personalInfo.name, 55, 25)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.text(personalInfo.role, 55, 35)
  
  // Decorative line
  doc.setLineWidth(2)
  doc.setDrawColor(accentColor)
  doc.line(20, 45, 190, 45)

  let yPos = 65

  // Creative sections with colored headers
  yPos = addCreativeSection(doc, 'EXPERIENCE', yPos, accentColor)
  cvData.experiences.forEach((exp) => {
    if (yPos > 260) {
      doc.addPage()
      yPos = 20
    }
    
    // Add a small accent dot
    doc.setFillColor(accentColor)
    doc.circle(25, yPos - 2, 2, 'F')
    
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`${exp.title}`, 35, yPos)
    yPos += 5
    
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.text(`${exp.company} • ${exp.period}`, 35, yPos)
    yPos += 5
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const descriptionLines = doc.splitTextToSize(exp.description, 150) as string[]
    doc.text(descriptionLines, 35, yPos)
    yPos += 3 * descriptionLines.length + 10
  })

  // Education with creative styling
  if (yPos > 220) {
    doc.addPage()
    yPos = 20
  }
  yPos = addCreativeSection(doc, 'EDUCATION', yPos, accentColor)
  cvData.education.forEach((edu) => {
    doc.setFillColor(accentColor)
    doc.circle(25, yPos - 2, 2, 'F')
    
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(edu.degree, 35, yPos)
    yPos += 5
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`${edu.institution}, ${edu.year}`, 35, yPos)
    yPos += 12
  })

  // Skills in a creative grid
  yPos = addCreativeSection(doc, 'SKILLS', yPos, accentColor)
  const skillsPerRow = 3
  let xPos = 35
  cvData.skills.forEach((skill, index) => {
    if (index % skillsPerRow === 0 && index > 0) {
      yPos += 8
      xPos = 35
    }
    
    doc.setFillColor(accentColor)
    doc.roundedRect(xPos - 2, yPos - 4, 50, 6, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(skill.name, xPos + 23, yPos, { align: 'center' })
    
    xPos += 55
    doc.setTextColor(0, 0, 0)
  })

  return doc.output('arraybuffer')
}

// Helper functions
function addSection(doc: jsPDF, title: string, yPos: number): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(title, 20, yPos)
  doc.setLineWidth(0.5)
  doc.line(20, yPos + 2, 190, yPos + 2)
  return yPos + 12
}

function addModernSection(doc: jsPDF, title: string, yPos: number, accentColor: string): number {
  doc.setTextColor(accentColor)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(title, 70, yPos)
  doc.setTextColor(0, 0, 0)
  return yPos + 10
}

function addCreativeSection(doc: jsPDF, title: string, yPos: number, accentColor: string): number {
  doc.setFillColor(accentColor)
  doc.rect(20, yPos - 5, 170, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(title, 105, yPos, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  return yPos + 15
}
