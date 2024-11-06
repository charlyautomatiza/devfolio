import jsPDF from 'jspdf'
import { CVData, PersonalInfo } from '@/types'

export async function createCVPdf(cvData: CVData, personalInfo: PersonalInfo) {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(24)
  doc.text(personalInfo.name, 105, 20, { align: 'center' })
  doc.setFontSize(16)
  doc.text(personalInfo.role, 105, 30, { align: 'center' })

  let yPos = 50

  // Experiences
  doc.setFontSize(18)
  doc.text('Experience', 20, yPos)
  yPos += 10

  cvData.experiences.forEach((exp) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.text(`${exp.title} at ${exp.company}`, 20, yPos)
    yPos += 7
    doc.setFontSize(12)
    doc.text(`${exp.period} | ${exp.location}`, 20, yPos)
    yPos += 7
    doc.setFontSize(10)
    const descriptionLines = doc.splitTextToSize(exp.description, 170)
    doc.text(descriptionLines, 20, yPos)
    yPos += 7 * descriptionLines.length + 5
  })

  // Education
  if (yPos > 270) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(18)
  doc.text('Education', 20, yPos)
  yPos += 10

  cvData.education.forEach((edu) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.text(edu.degree, 20, yPos)
    yPos += 7
    doc.setFontSize(12)
    doc.text(`${edu.institution}, ${edu.year}`, 20, yPos)
    yPos += 10
  })

  // Skills
  if (yPos > 270) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(18)
  doc.text('Skills', 20, yPos)
  yPos += 10

  const skillsPerLine = 3
  for (let i = 0; i < cvData.skills.length; i += skillsPerLine) {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    const rowSkills = cvData.skills.slice(i, i + skillsPerLine)
    doc.setFontSize(12)
    doc.text(rowSkills.map(skill => skill.name).join(' | '), 20, yPos)
    yPos += 7
  }

  return doc.output('arraybuffer')
}
