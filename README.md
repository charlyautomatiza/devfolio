# DevFolio: 100% Markdown-Driven Developer Portfolio

**Create your professional developer portfolio in minutes - No coding required!**

DevFolio is a modern, customizable portfolio template that you can personalize entirely through simple Markdown files. Perfect for developers who want a stunning online presence without touching a single line of code.

## ✨ Features

- 🎨 **5 Professional Themes** - Ocean Blue, Royal Purple, Forest Green, Sunset Orange, Magenta Pink
- 🌓 **Light & Dark Mode** for each theme
- 📱 **Fully Responsive** - Perfect on desktop, tablet, and mobile
- 📄 **ATS-Friendly CV Generator** - Download professional CVs in 3 templates (Harvard, Modern, Creative)
- ⚡ **Lightning Fast** - Built with Next.js for optimal performance
- 🎭 **100% Markdown Customization** - Change everything without coding
- 🔍 **SEO Optimized** - Built-in metadata, OpenGraph, and structured data
- ♿ **Accessible** - WCAG compliant with proper ARIA labels

---

## 🚀 3-Step Customization Guide

### Step 1: Clone & Install (One-Time Setup)

```bash
# Fork this repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/devfolio.git
cd devfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your portfolio!

> **Prefer to skip local setup?** Open the project directly in StackBlitz:
>
> [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/charlyautomatiza/devfolio)

### Step 2: Personalize Your Content (Edit Markdown Files)

All customization happens in the `src/content/` folder. No code editing required!

#### 📝 **personal-info.md** - Your Basic Information
```yaml
---
name: Your Name
role: Your Job Title
location: Your City - Country
---
```

#### 💼 **cv.md** - Your Professional Experience
```yaml
---
experiences:
  - title: Your Job Title
    company: Company Name
    period: From YYYY.MM to Present
    location: City, Country
    description: What you did in this role

education:
  - degree: Your Degree
    institution: University Name
    year: YYYY

skills:
  - name: JavaScript
  - name: React
  # Add all your skills
---
```

#### 🎯 **projects.md** - Your Portfolio Projects
```yaml
---
projects:
  - title: Project Name
    description: What this project does
    image: /path-to-image.jpg
    link: https://github.com/username/project
  # Add more projects
---
```

#### 🔗 **social-links.md** - Your Social Profiles
```yaml
---
linkedin: https://linkedin.com/in/your-profile
github: https://github.com/your-username
email: your-email@example.com
---
```

#### 🎨 **site-config.md** - Site Settings
```yaml
---
site_name: YourSite
site_title: Your Professional Portfolio
site_description: Your portfolio description
site_url: https://your-domain.com

footer:
  show_creator_link: true  # Set to false to remove "Created by CharlyAutomatiza"
  creator_text: CharlyAutomatiza
  creator_url: https://charlyautomatiza.tech/
  rights_text: All rights reserved
---
```

#### 💬 **ui-text.md** - Customize All Button Text & Labels
```yaml
---
nav:
  home: Home
  portfolio: Portfolio
  cv: CV

hero:
  greeting: "Hi, I'm"
  cta_primary: View Portfolio
  
# Customize any text on your site!
---
```

### Step 3: Deploy Your Site

#### Deploy to Vercel (Recommended - Free)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/charlyautomatiza/devfolio)

Or deploy manually:

1. Push your changes to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and select your DevFolio repository
4. Click "Deploy" - Done! 🎉

#### Configure Environment Variables (Optional)

In your Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
DEV_MODE=false
SWITCH_THEME=true  # Enable theme selector in production
```

---

## 📋 All Markdown Configuration Files

| File | What It Controls |
|------|-----------------|
| `personal-info.md` | Your name, role, location |
| `cv.md` | Experience, education, skills |
| `projects.md` | Portfolio projects |
| `social-links.md` | LinkedIn, GitHub, email |
| `site-config.md` | Site title, SEO, footer, analytics |
| `ui-text.md` | All button text, labels, messages |
| `feature-flags.md` | Default CV template |

---

## 🎨 Theme Customization

### Environment Variable Reference

| Variable | Options | Default | Description |
|----------|---------|---------|-------------|
| `DEV_MODE` | `true`, `false` | `false` | Enables template preview, all themes, and debug tools |
| `SWITCH_THEME` | `true`, `false` | `false` | Allows theme switching in production |
| `NEXT_PUBLIC_SITE_URL` | any URL | — | Base URL for SEO metadata and structured data |

### For Development/Demo (Try All Themes)
```bash
# .env.local
DEV_MODE=true
SWITCH_THEME=true
```

### For Production (Choose One Theme)
```bash
# Build and start in production mode
npm run build && npm start

# .env.local
DEV_MODE=false
SWITCH_THEME=false  # Uses Magenta Pink theme by default
```

To let users switch themes in production:
```bash
SWITCH_THEME=true
```

Available theme combinations:
- 🌊 Ocean Blue
- 👑 Royal Purple  
- 🌲 Forest Green
- 🌅 Sunset Orange
- 💖 Magenta Pink

Each theme has both light and dark modes!

---

## 📄 CV Templates

DevFolio includes 3 ATS-friendly CV templates:

1. **Harvard** - Classic academic style with maximum information density
2. **Modern** - Contemporary design with sidebar layout
3. **Creative** - Eye-catching design while maintaining ATS compatibility

### Set Default CV Template

Edit `src/content/feature-flags.md`:
```yaml
---
DEFAULT_CV_TEMPLATE: harvard  # or modern, or creative
---
```

In development mode, users can preview and select any template. In production mode, the default template is automatically used for downloads.

---

## 🔧 Advanced Configuration

### Add Google Analytics

Edit `src/content/site-config.md`:
```yaml
---
analytics:
  google_analytics_id: "G-XXXXXXXXXX"
  google_tag_manager_id: ""  # Optional
---
```

### Enable Contact Form (Google Sheets Integration)

The contact form stores submissions in a Google Sheet. Follow these steps:

#### 1. Configure Google Cloud

- Go to the [Google Developers Console](https://console.developers.google.com/)
- Create a new project (or select an existing one)
- Enable the **Google Sheets API** and **Google Drive API**
- In **Credentials**, create a **Service Account** and download the JSON file

#### 2. Share Your Google Sheet

- Open your Google Sheet and share it with the service account email (`GOOGLE_CLIENT_EMAIL`) with **Editor** permissions
- Copy the spreadsheet ID from the URL — it's the string between `/d/` and `/edit`

#### 3. Configure Environment Variables

Add each variable in your Vercel dashboard under **Settings › Environment Variables**, or in your local `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_SHEETS_ENABLED` | Set to `true` to enable the form |
| `GOOGLE_CLIENT_EMAIL` | Service account email from Step 1 |
| `GOOGLE_PRIVATE_KEY` | Private key from the service account JSON |
| `GOOGLE_SHEET_ID` | Spreadsheet ID from Step 2 |
| `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` | Google Apps Script URL (optional) |

#### Full `.env.local` Example

```env
# DevFolio Configuration
DEV_MODE=false
SWITCH_THEME=false
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Google Sheets Integration (Optional)
NEXT_PUBLIC_GOOGLE_SHEETS_ENABLED=true
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1A2B3C4D5E6F7G8H9I0J
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/EXAMPLE_SCRIPT_ID/exec
```

---

## 📚 Need Help?

- **Documentation**: All Markdown files include helpful comments
- **Issues**: [Open an issue](https://github.com/charlyautomatiza/devfolio/issues) on GitHub
- **Examples**: Each `.md` file includes usage examples

---

## 🛠️ Technical Stack (For Developers)

DevFolio is built with:
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **PDF Generation**: jsPDF
- **Theme Management**: next-themes
- **Type Safety**: TypeScript

All configuration is read from Markdown files using `gray-matter`, ensuring a clean separation between content and code.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📜 License

MIT License - Feel free to use this template for your portfolio!

---

## 🙏 Credits

Created by [CharlyAutomatiza](https://charlyautomatiza.tech/)

If you found this template helpful, please give it a ⭐ on GitHub!

---

## 🚦 Quick Reference: Common Customizations

### Change Your Name & Title
→ Edit `src/content/personal-info.md`

### Add/Remove Projects  
→ Edit `src/content/projects.md`

### Update Your Experience
→ Edit `src/content/cv.md`

### Change Site Title & SEO
→ Edit `src/content/site-config.md`

### Customize Button Text
→ Edit `src/content/ui-text.md`

### Hide "Created by CharlyAutomatiza"
→ Edit `src/content/site-config.md` and set `footer.show_creator_link: false`

### Change Theme Colors
→ Choose from 5 built-in themes via the theme selector

**Remember: All changes are made in Markdown files. No coding required!** 🎉
