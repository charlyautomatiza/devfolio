# DevFolio: Your Customizable Developer Portfolio

DevFolio is a modern, responsive, and customizable portfolio template for developers. With easy-to-edit markdown files, you can showcase your projects, skills, and experience in a professional and visually appealing way.

## Features

- 🎨 Modern and clean design
- 🌓 Dark mode support
- 📱 Fully responsive
- ⚡ Built with Next.js for optimal performance
- 🎭 Easy customization through markdown files
- 📄 Automatic CV/resume generation
- 🔗 Social media integration
- 📊 Contact form connected to Google Sheets

## Quick Start

1. Fork this repository
2. Clone your forked repository
3. Navigate to the project directory
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000` in your browser

## Customization

### Personal Information

Edit the [personal-info.md](./src/content/personal-info.md) file in the `content` directory to update your name, role, location, and other personal details.

### Projects

Add or modify projects in the [projects.md](./src/content/projects.md) file in the `content` directory. Each project should have a title, description, image, and link.

### CV/Resume

Update your experience, education, and skills in the [cv.md](./src/content/cv.md) file in the `content` directory.

### Social Links

Edit the [social-links.md](./src/content/social-links.md) file in the `content` directory to add or modify your social media links.

## Feature Configuration

DevFolio includes feature flags and environment variables for flexible configuration.

### Environment Variables

Create a `.env.local` file for local development or configure these in your deployment platform:

#### DEV_MODE
Controls development vs production behavior.
- **Options**: `true`, `false`
- **Default**: `false`
- **Usage**: `DEV_MODE=true npm run dev`

#### SWITCH_THEME  
Controls theme switching availability in production mode.
- **Options**: `true`, `false`
- **Default**: `false`
- **Environment Variable**: Set `SWITCH_THEME=true` to enable theme switching in production

### Environment Modes

DevFolio operates in two distinct modes:

#### Development Mode (DEV_MODE=true)
```bash
DEV_MODE=true npm run dev
```
- Full CV template selection and preview functionality
- All theme combinations accessible via palette selector
- Enhanced debugging and testing features

#### Production Mode (DEV_MODE=false - default)
```bash
npm run build && npm start
```
- Direct CV download using the configured default template
- Single theme mode (Magenta Pink) unless SWITCH_THEME=true
- Optimized for end-user experience

### Feature Flags Configuration

Edit the `src/content/feature-flags.md` file to configure:

#### DEFAULT_CV_TEMPLATE
Sets the default CV template for production mode downloads.
- **Options**: `harvard`, `modern`, `creative`
- **Default**: `harvard`

```markdown
DEFAULT_CV_TEMPLATE: harvard
```

### Theme Configuration

Theme switching is now controlled via environment variables:

- **Production Mode (default)**: Uses Magenta Pink theme only
- **With SWITCH_THEME=true**: Enables theme palette selector in production
- **Development Mode**: Always shows theme selector regardless of SWITCH_THEME setting

### Available Themes

DevFolio includes 5 professional theme combinations:

1. **Ocean Blue** - Professional blue tones
2. **Royal Purple** - Elegant purple palette  
3. **Forest Green** - Natural green colors
4. **Sunset Orange** - Warm orange hues
5. **Magenta Pink** - Vibrant pink accents (production default)

Each theme includes both light and dark mode variants with carefully selected color palettes for optimal readability and professional appearance.

## Portfolio Configuration with Google Sheets for Contact Form (optional)

This guide explains how to set up Google Sheets to use it with the contact form in your portfolio and configure the necessary environment variables in Vercel.

### Setting Up Google Sheets for Your Portfolio

1. **Configure Google Sheets API**:
   - Go to the [Google Developers Console](https://console.developers.google.com/).
   - Create a new project (or select an existing one).
   - Enable the **Google Sheets API** and **Google Drive API** for this project.
   - In "Credentials," create a **Service Account** and download the credentials JSON file.

2. **Share Your Google Sheet**:
   - Open your Google Sheet and share access with the service account email (`GOOGLE_CLIENT_EMAIL`) that you created in Step 1. Ensure that it has **Editor** permissions.
   - Copy your spreadsheet ID from the URL (the part between `/d/` and `/edit`), which will be used for `GOOGLE_SHEET_ID`.

3. **Setting Up Environment Variables in Vercel**:
   To enable Google Sheets functionality on Vercel, you need to configure the following environment variables.

   #### Steps to Add Environment Variables in Vercel

   - Go to your Vercel project dashboard.
   - Navigate to **Settings** > **Environment Variables**.
   - Click on **Add New Variable** and add each variable with its corresponding value as follows:

     - **Variable Name**: `NEXT_PUBLIC_GOOGLE_SHEETS_ENABLED`
       - **Value**: `true`
       - **Environment**: Select the appropriate environment (e.g., Production, Preview, Development).

     - **Variable Name**: `GOOGLE_CLIENT_EMAIL`
       - **Value**: The service account email from Step 1.
       - **Environment**: Choose the environment as needed.

     - **Variable Name**: `GOOGLE_PRIVATE_KEY`
       - **Value**: Copy the private key from your service account JSON file. Make sure to paste it exactly as it appears, without adding `\n` for line breaks if entering directly in Vercel.
       - **Environment**: Select the desired environment.

     - **Variable Name**: `GOOGLE_SHEET_ID`
       - **Value**: The ID of your Google Sheet.
       - **Environment**: Select the appropriate environment.

     - **Variable Name**: `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
       - **Value**: The URL of the Google Apps Script, if used (optional).
       - **Environment**: Select the desired environment.

   - Once all variables are entered, redeploy your project to apply the changes.

### Example Environment Variable Configuration in `.env.local` (for local development)

```env
# DevFolio Configuration
DEV_MODE=false
SWITCH_THEME=false

# Google Sheets Integration (Optional)
NEXT_PUBLIC_GOOGLE_SHEETS_ENABLED=true
GOOGLE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1A2B3C4D5E6F7G8H9I0J
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/EXAMPLE_SCRIPT_ID/exec
```

Alternatively, you can use the deploy button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/charlyautomatiza/devfolio)

## Opening in StackBlitz

To open and edit this project in StackBlitz:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/charlyautomatiza/devfolio)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

Created by [CharlyAutomatiza](https://charlyautomatiza.tech/) with ❤️
