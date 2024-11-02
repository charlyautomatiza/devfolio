export interface Project {
    title: string
    description: string
    image: string
    link: string
}

export interface Experience {
    title: string
    company: string
    period: string
    description: string
}

export interface Education {
    degree: string
    institution: string
    year: string
}

export interface Skill {
    name: string
}

export interface CVData {
    experiences: Experience[]
    education: Education[]
    skills: Skill[]
}

export interface PersonalInfo {
    name: string
    role: string
}
