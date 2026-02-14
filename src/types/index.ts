export interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Skill {
  name: string;
}

export interface CVData {
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface PersonalInfo {
  name: string;
  role: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  email?: string;
  cv?: string;
}

export interface FooterConfig {
  show_creator_link: boolean;
  creator_text: string;
  creator_url: string;
  rights_text: string;
}

export interface PortfolioProps {
  projects: Project[];
  cvData: CVData;
  personalInfo: PersonalInfo;
  socialLinks: SocialLinks;
  cvPdfUrl?: string;
  isDevMode?: boolean;
  featureFlags?: {
    DEFAULT_CV_TEMPLATE: 'harvard' | 'modern' | 'creative';
  };
  showThemeSelector?: boolean;
  footerConfig?: FooterConfig;
}
