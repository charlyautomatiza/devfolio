---
# UI Text Configuration
# This file contains all user-visible text in your portfolio
# Edit these values to customize the text without touching any code

# Navigation Menu
nav:
  home: Home
  portfolio: Portfolio
  cv: CV
  contact: Contact
  download_cv: Download CV

# Hero Section
hero:
  greeting: "Hi, I'm"
  tagline_prefix: "I'm a"
  cta_primary: View Portfolio
  cta_secondary: Download CV
  scroll_hint: Scroll to explore

# Portfolio Section
portfolio:
  heading: Portfolio
  subheading: "Featured Projects"
  view_project: View Project
  no_projects: No projects available

# CV Section
cv:
  heading: CV
  subheading: "Professional Experience & Skills"
  download_button: Download CV
  preview_button: Preview CV
  select_template: Select Template
  template_harvard: Harvard
  template_modern: Modern
  template_creative: Creative
  generating: Generating CV...
  preview_title: CV Preview
  back_to_selection: Back to Templates
  download_pdf: Download PDF
  close: Close

# Contact Section (if enabled)
contact:
  heading: Contact
  subheading: "Get in Touch"
  name_label: Name
  name_placeholder: Your Name
  email_label: Email
  email_placeholder: your.email@example.com
  message_label: Message
  message_placeholder: Your message...
  send_button: Send Message
  sending: Sending...
  success_message: "Message sent successfully!"
  error_message: "Failed to send message. Please try again."

# Theme Selector
theme:
  toggle_tooltip: Toggle theme
  select_theme: Select Theme
  light_mode: Light
  dark_mode: Dark
  ocean_blue: Ocean Blue
  royal_purple: Royal Purple
  forest_green: Forest Green
  sunset_orange: Sunset Orange
  magenta_pink: Magenta Pink

# Accessibility Labels
aria:
  toggle_menu: Toggle navigation menu
  toggle_theme: Toggle theme
  toggle_theme_selector: Open theme selector
  close_theme_selector: Close theme selector
  social_github: Visit GitHub profile
  social_linkedin: Visit LinkedIn profile
  social_email: Send email
  download_cv: Download CV

# Status Messages
status:
  loading: Loading...
  error: Something went wrong
  no_data: No data available
  
# Date Formats
date:
  present: Present
  to: to
  from: From

---

# UI Text Configuration Guide

This file controls all user-visible text in your DevFolio portfolio.

## How to Customize

1. **Navigation**: Update menu labels and buttons
2. **Hero Section**: Customize greeting and call-to-action text
3. **Sections**: Modify headings and subheadings
4. **Forms**: Change labels and placeholders
5. **Buttons**: Customize button text
6. **Status Messages**: Update loading and error messages
7. **Accessibility**: Ensure ARIA labels are descriptive
8. **Date Formats**: Customize date display text

## Multi-Language Support

To create a multi-language version:
1. Copy this file to `ui-text-{language}.md` (e.g., `ui-text-es.md` for Spanish)
2. Translate all values
3. Update your configuration to use the language file

## Important Notes

- Keep ARIA labels descriptive for accessibility
- Maintain consistent tone across all text
- Test form labels and buttons for clarity
- Use title case for headings, sentence case for body text
