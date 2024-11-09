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

Edit the `personal-info.md` file in the `content` directory to update your name, role, and other personal details.

### Projects

Add or modify projects in the `projects.md` file in the `content` directory. Each project should have a title, description, image, and link.

### CV/Resume

Update your experience, education, and skills in the `cv.md` file in the `content` directory.

### Social Links

Edit the `social-links.md` file in the `content` directory to add or modify your social media links.

## Google Sheets Integration

To connect the contact form to Google Sheets:

1. Create a new Google Sheet
2. Go to Tools > Script editor
3. Replace the content of the script editor with the following code:

   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     sheet.appendRow([new Date(), data.name, data.email, data.message]);
     return ContentService.createTextOutput("Success");
   }
   ```

4. Deploy the script as a web app:
   - Click on "Deploy" > "New deployment"
   - Select "Web app" as the type
   - Set "Execute as" to your Google account
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
5. Copy the provided URL for the web app

## Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=your_google_script_url_here
```

Replace `your_google_script_url_here` with the URL you copied from the Google Apps Script deployment.

## Deployment

You can easily deploy your portfolio using Vercel:

1. Push your changes to your GitHub repository
2. Go to [Vercel](https://vercel.com) and sign in with GitHub
3. Click "Import Project" and select your repository
4. In the "Environment Variables" section, add the `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` variable with your Google Apps Script URL
5. Click "Deploy"

Alternatively, you can use the deploy button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fdevfolio)

## Opening in StackBlitz

To open and edit this project in StackBlitz:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/yourusername/devfolio)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

Created by CharlyAutomatiza with ❤️
