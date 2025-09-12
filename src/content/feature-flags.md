---
# Feature Flags Configuration
# This file controls various features in DevFolio

# CV Download Configuration
# Available options: harvard, modern, creative
# When in production mode (DEV_MODE=false), only this template will be available for download
DEFAULT_CV_TEMPLATE: harvard

# Theme Switching Configuration
# When true, allows theme switching even in production mode
# When false, production mode uses only the default theme (Magenta Pink)
SWITCH_THEME: false
---

# DevFolio Feature Flags

This file contains configuration flags that control various features in DevFolio.

## CV Template Configuration

- **DEFAULT_CV_TEMPLATE**: Sets the default CV template for production mode
  - Options: `harvard`, `modern`, `creative`
  - Default: `harvard`

## Theme Configuration  

- **SWITCH_THEME**: Controls theme switching availability in production mode
  - When `true`: Theme selector is available in production
  - When `false`: Production uses default theme only (Magenta Pink)
  - Default: `false`

## Environment Modes

DevFolio operates in two modes:

### Development Mode (DEV_MODE=true)
- Full CV template selection and preview available
- All theme combinations accessible
- Enhanced debugging and testing features

### Production Mode (DEV_MODE=false - default)
- Direct CV download using DEFAULT_CV_TEMPLATE
- Single theme mode (unless SWITCH_THEME=true)
- Optimized for end-user experience