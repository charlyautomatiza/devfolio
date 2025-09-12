import jsPDF from 'jspdf'
import { CVData, PersonalInfo, SocialLinks } from '@/types'

export type CVTemplate = 'harvard' | 'modern' | 'creative'

interface CVGeneratorOptions {
  template?: CVTemplate
  accentColor?: string
}

export async function createCVPdf(
  cvData: CVData, 
  personalInfo: PersonalInfo, 
  socialLinks?: SocialLinks,
  options: CVGeneratorOptions = {}
) {
  const { template = 'harvard' } = options
  
  // Merge email from social links if not present in personal info
  const enhancedPersonalInfo = {
    ...personalInfo,
    email: personalInfo.email || socialLinks?.email
  }
  
  switch (template) {
    case 'modern':
      return generateModernCV(cvData, enhancedPersonalInfo)
    case 'creative':
      return generateCreativeCV(cvData, enhancedPersonalInfo)
    case 'harvard':
    default:
      return generateHarvardCV(cvData, enhancedPersonalInfo)
  }
}

// Original Harvard template (enhanced)
function generateHarvardCV(cvData: CVData, personalInfo: PersonalInfo) {
  const doc = new jsPDF()

  // Header with enhanced styling
  doc.setFontSize(18) // Reduced from 20
  doc.setFont('helvetica', 'bold')
  doc.text(personalInfo.name, 105, 25, { align: 'center' })
  
  doc.setFontSize(10) // Reduced from 12
  doc.setFont('helvetica', 'normal')
  doc.text(personalInfo.role, 105, 35, { align: 'center' })
  
  // Add contact info if available
  const contactY = 42
  const contactInfo = []
  if (personalInfo.email) contactInfo.push(personalInfo.email)
  if (personalInfo.phone) contactInfo.push(personalInfo.phone)
  if (personalInfo.location) contactInfo.push(personalInfo.location)
  if (personalInfo.website) contactInfo.push(personalInfo.website)
  if (personalInfo.linkedin) contactInfo.push(personalInfo.linkedin)
  
  if (contactInfo.length > 0) {
    doc.setFontSize(7) // Reduced from 8
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
    doc.setFontSize(9) // Reduced from 10
    doc.text(`${exp.title} at ${exp.company}`, 20, yPos)
    yPos += 5
    
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7) // Reduced from 8
    doc.text(`${exp.period} | ${exp.location || ''}`, 20, yPos)
    yPos += 5
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7) // Reduced from 8
    const descriptionLines = doc.splitTextToSize(exp.description, 170) as string[]
    doc.text(descriptionLines, 20, yPos)
    yPos += 2.8 * descriptionLines.length + 5 // Slightly reduced spacing
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
    doc.setFontSize(10) // Reduced from 12
    doc.text(edu.degree, 20, yPos)
    yPos += 6
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8) // Reduced from 10
    doc.text(`${edu.institution}, ${edu.year}`, 20, yPos)
    yPos += 10 // Slightly reduced spacing
  })

  // Skills Section
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  yPos = addSection(doc, 'SKILLS', yPos)
  
  // Improved horizontal space utilization - create skill chips layout
  const skillsPerLine = 8 // Increased from 5 for better space usage
  const pageWidth = 190 // Page width minus margins
  const chipSpacing = 2
  
  for (let i = 0; i < cvData.skills.length; i += skillsPerLine) {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    const rowSkills = cvData.skills.slice(i, i + skillsPerLine)
    
    // Calculate optimal spacing for chips
    let xPos = 20
    rowSkills.forEach((skill) => {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7) // Smaller font for more skills
      
      // Add skill as a chip-like element
      const skillText = skill.name
      const textWidth = doc.getTextWidth(skillText)
      const chipWidth = textWidth + 4 // Padding for chip
      
      // Check if skill fits on current line
      if (xPos + chipWidth > pageWidth) {
        // Move to next line
        yPos += 6
        xPos = 20
      }
      
      // Draw skill chip background (light gray)
      doc.setFillColor(245, 245, 245)
      doc.rect(xPos, yPos - 3, chipWidth, 5, 'F')
      
      // Draw skill text
      doc.setTextColor(60, 60, 60)
      doc.text(skillText, xPos + 2, yPos, { baseline: 'middle' })
      
      xPos += chipWidth + chipSpacing
    })
    
    yPos += 8 // Line spacing
  }

  // Reset text color to black
  doc.setTextColor(0, 0, 0)

  return doc.output('arraybuffer')
}

// Modern template with accent colors
// Modern template with professional sidebar design
function generateModernCV(cvData: CVData, personalInfo: PersonalInfo): ArrayBuffer {
  const doc = new jsPDF()
  
  // Use more professional colors - navy blue instead of bright accent
  const professionalAccent = '#1e40af' // Professional navy blue
  
  // Modern header with accent color sidebar - ATS friendly approach
  doc.setFillColor(professionalAccent)
  doc.rect(0, 0, 60, 297, 'F') // Left sidebar
  
  // Name and role in white on accent background
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12) // Reduced for better ATS parsing
  const nameLines = doc.splitTextToSize(personalInfo.name, 50) as string[]
  let nameY = 25
  nameLines.forEach((line: string) => {
    doc.text(line, 30, nameY, { align: 'center' })
    nameY += 5 // Reduced spacing
  })
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7) // Reduced from 8
  const roleLines = doc.splitTextToSize(personalInfo.role, 50) as string[]
  roleLines.forEach((line: string) => {
    doc.text(line, 30, nameY, { align: 'center' })
    nameY += 4 // Reduced spacing
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

  // Add Skills in the left sidebar with improved ATS-friendly design
  nameY += 12
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8) // Reduced from 9
  doc.text('SKILLS', 30, nameY, { align: 'center' })
  nameY += 6
  
  // Use simple text list instead of chips for better ATS compatibility
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6) // Reduced for better fit
  cvData.skills.forEach((skill) => {
    if (nameY > 270) return // Prevent overflow
    doc.text(`• ${skill.name}`, 8, nameY) // Left-aligned bullets
    nameY += 4
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
    doc.setFontSize(8) // Reduced from 9
    doc.text(`${exp.title}`, 70, yPos)
    yPos += 4
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7) // Reduced from 8
    doc.text(`${exp.company} | ${exp.period}`, 70, yPos)
    yPos += 4
    
    doc.setFontSize(6) // Reduced from 7
    const descriptionLines = doc.splitTextToSize(exp.description, 120) as string[]
    doc.text(descriptionLines, 70, yPos)
    yPos += 2.2 * descriptionLines.length + 5 // Slightly reduced spacing
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
    doc.setFontSize(8) // Reduced from 9
    doc.text(edu.degree, 70, yPos)
    yPos += 4
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6) // Reduced from 7
    doc.text(`${edu.institution}, ${edu.year}`, 70, yPos)
    yPos += 7 // Reduced spacing
  })

  return doc.output('arraybuffer')
}

// Creative template with more visual elements
function generateCreativeCV(cvData: CVData, personalInfo: PersonalInfo): ArrayBuffer {
  const doc = new jsPDF()
  
  // Use more professional creative colors
  const professionalCreative = '#4f46e5' // Professional indigo
  
  // Creative header without complex graphics for ATS compatibility
  doc.setTextColor(professionalCreative)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14) // Reduced from 16
  doc.text(personalInfo.name, 105, 25, { align: 'center' })
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9) // Reduced from 10
  doc.text(personalInfo.role, 105, 33, { align: 'center' })
  
  // Simple line separator instead of filled rectangle for ATS compatibility
  doc.setDrawColor(professionalCreative)
  doc.setLineWidth(1)
  doc.line(20, 40, 190, 40)
  
  // Add contact info
  doc.setTextColor(0, 0, 0)
  let contactY = 48
  const contactInfo = []
  if (personalInfo.email) contactInfo.push(personalInfo.email)
  if (personalInfo.phone) contactInfo.push(personalInfo.phone)
  if (personalInfo.website) contactInfo.push(personalInfo.website)
  if (personalInfo.linkedin) contactInfo.push(personalInfo.linkedin)
  
  if (contactInfo.length > 0) {
    doc.setFontSize(6) // Reduced from 7
    const contactLines = doc.splitTextToSize(contactInfo.join(' • '), 150) as string[]
    contactLines.forEach((line: string) => {
      doc.text(line, 105, contactY, { align: 'center' })
      contactY += 3
    })
  }
  
  let yPos = contactY + 10

  // Creative sections with colored headers
  yPos = addCreativeSection(doc, 'EXPERIENCE', yPos, professionalCreative)
  cvData.experiences.forEach((exp) => {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    
    // Use simple bullet point instead of filled circle for ATS compatibility
    doc.setTextColor(professionalCreative)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6)
    doc.text('•', 20, yPos)
    
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8) // Reduced from 9
    doc.text(`${exp.title}`, 25, yPos)
    yPos += 4
    
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(6) // Reduced from 7
    doc.text(`${exp.company} • ${exp.period}`, 25, yPos)
    yPos += 4
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6) // Reduced from 7
    const descriptionLines = doc.splitTextToSize(exp.description, 165) as string[]
    doc.text(descriptionLines, 25, yPos)
    yPos += 2.2 * descriptionLines.length + 6 // Reduced spacing
  })

  // Education with creative styling
  if (yPos > 200) {
    doc.addPage()
    yPos = 20
  }
  yPos = addCreativeSection(doc, 'EDUCATION', yPos, professionalCreative)
  cvData.education.forEach((edu) => {
    // Use simple bullet point instead of filled circle for ATS compatibility
    doc.setTextColor(professionalCreative)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6)
    doc.text('•', 20, yPos)
    
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8) // Reduced from 9
    doc.text(edu.degree, 25, yPos)
    yPos += 4
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6) // Reduced from 7
    doc.text(`${edu.institution}, ${edu.year}`, 25, yPos)
    yPos += 7 // Reduced spacing
  })

  // Skills in a more compact creative format - ATS friendly
  yPos = addCreativeSection(doc, 'SKILLS', yPos, professionalCreative)
  const skillsPerRow = 5 // Increased from 4
  let xPos = 20
  cvData.skills.forEach((skill, index) => {
    if (index % skillsPerRow === 0 && index > 0) {
      yPos += 5 // Reduced from 6
      xPos = 20
    }
    
    // Use simple text instead of filled rectangles for better ATS compatibility
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.text(`• ${skill.name}`, xPos, yPos)
    
    xPos += 35 // Adjust spacing
  })

  return doc.output('arraybuffer')
}

// Helper functions
function addSection(doc: jsPDF, title: string, yPos: number): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10) // Reduced for better ATS compatibility
  doc.text(title.toUpperCase(), 20, yPos) // Uppercase for ATS recognition
  doc.setLineWidth(0.3) // Thinner line for ATS compatibility
  doc.line(20, yPos + 2, 190, yPos + 2)
  return yPos + 8
}

function addModernSection(doc: jsPDF, title: string, yPos: number, accentColor: string): number {
  doc.setTextColor(accentColor)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9) // Reduced for better ATS compatibility
  doc.text(title.toUpperCase(), 70, yPos) // Uppercase for ATS recognition
  doc.setTextColor(0, 0, 0)
  return yPos + 7
}

function addCreativeSection(doc: jsPDF, title: string, yPos: number, accentColor: string): number {
  // Use text-based header instead of filled rectangle for better ATS compatibility
  doc.setTextColor(accentColor)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(title.toUpperCase(), 20, yPos) // Left-aligned and uppercase for ATS
  
  // Add a simple line instead of filled rectangle
  doc.setDrawColor(accentColor)
  doc.setLineWidth(1)
  doc.line(20, yPos + 2, 190, yPos + 2)
  
  doc.setTextColor(0, 0, 0)
  return yPos + 10
}
