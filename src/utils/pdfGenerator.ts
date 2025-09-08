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
  const { template = 'harvard' } = options
  
  switch (template) {
    case 'modern':
      return generateModernCV(cvData, personalInfo)
    case 'creative':
      return generateCreativeCV(cvData, personalInfo)
    case 'harvard':
    default:
      return generateHarvardCV(cvData, personalInfo)
  }
}

// Original Harvard template (enhanced)
function generateHarvardCV(cvData: CVData, personalInfo: PersonalInfo) {
  const doc = new jsPDF()

  // Header with enhanced styling
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(personalInfo.name, 105, 25, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(personalInfo.role, 105, 35, { align: 'center' })
  
  // Add contact info if available
  const contactY = 42
  const contactInfo = []
  if (personalInfo.email) contactInfo.push(personalInfo.email)
  if (personalInfo.phone) contactInfo.push(personalInfo.phone)
  if (personalInfo.website) contactInfo.push(personalInfo.website)
  if (personalInfo.linkedin) contactInfo.push(personalInfo.linkedin)
  
  if (contactInfo.length > 0) {
    doc.setFontSize(8)
    doc.text(contactInfo.join(' • '), 105, contactY, { align: 'center' })
  }
  
  // Add a subtle line under header
  doc.setLineWidth(0.5)
  doc.line(20, 50, 190, 50)

  let yPos = 65

  // Experience Section
  yPos = addSection(doc, 'EXPERIENCE', yPos)
  cvData.experiences.forEach((exp) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(`${exp.title} at ${exp.company}`, 20, yPos)
    yPos += 5
    
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.text(`${exp.period} | ${exp.location || ''}`, 20, yPos)
    yPos += 5
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const descriptionLines = doc.splitTextToSize(exp.description, 170) as string[]
    doc.text(descriptionLines, 20, yPos)
    yPos += 3 * descriptionLines.length + 6
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
// Modern template with professional sidebar design
function generateModernCV(cvData: CVData, personalInfo: PersonalInfo): ArrayBuffer {
  const doc = new jsPDF()
  
  // Use more professional colors - navy blue instead of bright accent
  const professionalAccent = '#1e40af' // Professional navy blue
  
  // Modern header with accent color sidebar
  doc.setFillColor(professionalAccent)
  doc.rect(0, 0, 60, 297, 'F') // Left sidebar
  
  // Name and role in white on accent background
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  const nameLines = doc.splitTextToSize(personalInfo.name, 50) as string[]
  let nameY = 25
  nameLines.forEach((line: string) => {
    doc.text(line, 30, nameY, { align: 'center' })
    nameY += 6
  })
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const roleLines = doc.splitTextToSize(personalInfo.role, 50) as string[]
  roleLines.forEach((line: string) => {
    doc.text(line, 30, nameY, { align: 'center' })
    nameY += 5
  })

  // Add contact info in sidebar
  if (personalInfo.email || personalInfo.phone || personalInfo.website || personalInfo.linkedin) {
    nameY += 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text('CONTACT', 30, nameY, { align: 'center' })
    nameY += 6
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    if (personalInfo.email) {
      const emailLines = doc.splitTextToSize(personalInfo.email, 45) as string[]
      emailLines.forEach((line: string) => {
        doc.text(line, 30, nameY, { align: 'center' })
        nameY += 3
      })
      nameY += 2
    }
    if (personalInfo.phone) {
      doc.text(personalInfo.phone, 30, nameY, { align: 'center' })
      nameY += 5
    }
    if (personalInfo.website) {
      const websiteLines = doc.splitTextToSize(personalInfo.website, 45) as string[]
      websiteLines.forEach((line: string) => {
        doc.text(line, 30, nameY, { align: 'center' })
        nameY += 3
      })
      nameY += 2
    }
    if (personalInfo.linkedin) {
      const linkedinLines = doc.splitTextToSize(personalInfo.linkedin, 45) as string[]
      linkedinLines.forEach((line: string) => {
        doc.text(line, 30, nameY, { align: 'center' })
        nameY += 3
      })
      nameY += 2
    }
  }

  // Add Skills in the left sidebar
  nameY += 15
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('SKILLS', 30, nameY, { align: 'center' })
  nameY += 8
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  cvData.skills.forEach((skill) => {
    if (nameY > 270) return // Prevent overflow
    const skillLines = doc.splitTextToSize(skill.name, 45) as string[]
    skillLines.forEach((line: string) => {
      doc.text(line, 30, nameY, { align: 'center' })
      nameY += 4
    })
    nameY += 2
  })

  // Reset text color for main content
  doc.setTextColor(0, 0, 0)
  let yPos = 30

  // Experience Section
  yPos = addModernSection(doc, 'EXPERIENCE', yPos, professionalAccent)
  cvData.experiences.forEach((exp) => {
    if (yPos > 270) {
      doc.addPage()
      // Re-add sidebar on new page
      doc.setFillColor(professionalAccent)
      doc.rect(0, 0, 60, 297, 'F')
      doc.setTextColor(0, 0, 0)
      yPos = 20
    }
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(`${exp.title}`, 70, yPos)
    yPos += 4
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(`${exp.company} | ${exp.period}`, 70, yPos)
    yPos += 4
    
    doc.setFontSize(7)
    const descriptionLines = doc.splitTextToSize(exp.description, 120) as string[]
    doc.text(descriptionLines, 70, yPos)
    yPos += 2.5 * descriptionLines.length + 6
  })

  // Education section
  if (yPos > 200) {
    doc.addPage()
    doc.setFillColor(professionalAccent)
    doc.rect(0, 0, 60, 297, 'F')
    doc.setTextColor(0, 0, 0)
    yPos = 20
  }

  yPos = addModernSection(doc, 'EDUCATION', yPos, professionalAccent)
  cvData.education.forEach((edu) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(edu.degree, 70, yPos)
    yPos += 4
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.text(`${edu.institution}, ${edu.year}`, 70, yPos)
    yPos += 8
  })

  return doc.output('arraybuffer')
}

// Creative template with more visual elements
function generateCreativeCV(cvData: CVData, personalInfo: PersonalInfo): ArrayBuffer {
  const doc = new jsPDF()
  
  // Use more professional creative colors
  const professionalCreative = '#4f46e5' // Professional indigo
  
  // Creative header with geometric shapes
  doc.setFillColor(professionalCreative)
  doc.circle(30, 30, 15, 'F')
  
  // Name in a modern layout
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(personalInfo.name, 55, 25)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(personalInfo.role, 55, 35)
  
  // Add contact info
  let contactY = 42
  const contactInfo = []
  if (personalInfo.email) contactInfo.push(personalInfo.email)
  if (personalInfo.phone) contactInfo.push(personalInfo.phone)
  if (personalInfo.website) contactInfo.push(personalInfo.website)
  if (personalInfo.linkedin) contactInfo.push(personalInfo.linkedin)
  
  if (contactInfo.length > 0) {
    doc.setFontSize(7)
    const contactLines = doc.splitTextToSize(contactInfo.join(' • '), 130) as string[]
    contactLines.forEach((line: string) => {
      doc.text(line, 55, contactY)
      contactY += 3
    })
  }
  
  // Decorative line
  doc.setLineWidth(2)
  doc.setDrawColor(professionalCreative)
  doc.line(20, 45, 190, 45)

  let yPos = 65

  // Creative sections with colored headers
  yPos = addCreativeSection(doc, 'EXPERIENCE', yPos, professionalCreative)
  cvData.experiences.forEach((exp) => {
    if (yPos > 260) {
      doc.addPage()
      yPos = 20
    }
    
    // Add a small accent dot
    doc.setFillColor(professionalCreative)
    doc.circle(25, yPos - 2, 2, 'F')
    
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(`${exp.title}`, 35, yPos)
    yPos += 4
    
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7)
    doc.text(`${exp.company} • ${exp.period}`, 35, yPos)
    yPos += 4
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    const descriptionLines = doc.splitTextToSize(exp.description, 150) as string[]
    doc.text(descriptionLines, 35, yPos)
    yPos += 2.5 * descriptionLines.length + 8
  })

  // Education with creative styling
  if (yPos > 220) {
    doc.addPage()
    yPos = 20
  }
  yPos = addCreativeSection(doc, 'EDUCATION', yPos, professionalCreative)
  cvData.education.forEach((edu) => {
    doc.setFillColor(professionalCreative)
    doc.circle(25, yPos - 2, 2, 'F')
    
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(edu.degree, 35, yPos)
    yPos += 4
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.text(`${edu.institution}, ${edu.year}`, 35, yPos)
    yPos += 8
  })

  // Skills in a more compact creative grid
  yPos = addCreativeSection(doc, 'SKILLS', yPos, professionalCreative)
  const skillsPerRow = 4
  let xPos = 35
  cvData.skills.forEach((skill, index) => {
    if (index % skillsPerRow === 0 && index > 0) {
      yPos += 6
      xPos = 35
    }
    
    doc.setFillColor(professionalCreative)
    doc.roundedRect(xPos - 2, yPos - 3, 40, 5, 1, 1, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.text(skill.name, xPos + 18, yPos, { align: 'center' })
    
    xPos += 42
    doc.setTextColor(0, 0, 0)
  })

  return doc.output('arraybuffer')
}

// Helper functions
function addSection(doc: jsPDF, title: string, yPos: number): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(title, 20, yPos)
  doc.setLineWidth(0.5)
  doc.line(20, yPos + 2, 190, yPos + 2)
  return yPos + 10
}

function addModernSection(doc: jsPDF, title: string, yPos: number, accentColor: string): number {
  doc.setTextColor(accentColor)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(title, 70, yPos)
  doc.setTextColor(0, 0, 0)
  return yPos + 8
}

function addCreativeSection(doc: jsPDF, title: string, yPos: number, accentColor: string): number {
  doc.setFillColor(accentColor)
  doc.rect(20, yPos - 5, 170, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(title, 105, yPos, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  return yPos + 12
}
