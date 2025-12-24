# 🛠️ Nahlawi Tools

**Free, privacy-focused online utilities that work entirely in your browser.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-4.0-FF5D01?logo=astro)](https://astro.build)
[![Vue 3](https://img.shields.io/badge/Vue-3.0-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)

[**🌐 Live Demo**](https://tools.nahlawi.com) | [**📖 Documentation**](#documentation) | [**🤝 Contributing**](#contributing)

---

## 🌟 Features

- ✅ **100% Free** - No sign-up, no limits, no premium tiers
- 🔒 **Privacy First** - No tracking, no analytics, no data collection
- 📱 **Works Offline** - Install as PWA, use anywhere
- ⚡ **Lightning Fast** - Built with Astro for optimal performance
- 🌙 **Dark Mode** - Beautiful design that's easy on the eyes
- 🎯 **15+ Tools** - Text processing, calculations, generators, and more

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rnahlawi/tools-nahlawi.git
cd tools-nahlawi

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:4321
```

---

## 🛠️ Available Tools

### Text Tools
- 📊 **Word Counter** - Count words, characters, sentences, and paragraphs
- 🔤 **Case Converter** - Convert to UPPERCASE, lowercase, Title Case, etc.
- 🔄 **Text Reverser** - Reverse text, words, or lines
- 📄 **Remove Line Breaks** - Clean up text formatting

### Calculators
- 🔢 **Percentage Calculator** - Calculate percentages, increases, decreases
- 🎂 **Age Calculator** - Calculate exact age in years, months, days
- ⚖️ **BMI Calculator** - Calculate Body Mass Index

### Generators
- 🔐 **Password Generator** - Generate secure random passwords
- 📱 **QR Code Generator** - Create QR codes for URLs and text
- 📝 **Lorem Ipsum** - Generate placeholder text
- 🎲 **Random Number** - Generate random numbers with custom ranges

### Developer Tools
- 🔑 **Base64 Encoder/Decoder** - Encode/decode Base64
- 🔗 **URL Encoder/Decoder** - Encode/decode URLs
- 🔒 **Hash Generator** - Generate MD5, SHA-1, SHA-256, SHA-512
- 📋 **JSON Formatter** - Format, minify, and validate JSON

---

## 🏗️ Tech Stack

### Frontend
- **[Astro](https://astro.build)** - Modern static site generator
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Build & Tooling
- **Vite** - Fast build tool
- **PostCSS** - CSS processing
- **ESLint** - Code linting

### Deployment
- **Hostinger** - Web hosting
- **GitHub Actions** - CI/CD (optional)

---

## 📁 Project Structure

```
tools-nahlawi/
├── public/                  # Static assets
│   ├── favicon.svg
│   ├── robots.txt
│   ├── manifest.json
│   └── 404.html
├── src/
│   ├── assets/
│   │   └── styles/         # Global CSS
│   │       ├── variables.css
│   │       └── global.css
│   ├── components/
│   │   ├── Header.astro    # Site header
│   │   ├── Footer.astro    # Site footer
│   │   ├── SearchBar.astro # Tool search
│   │   ├── ToolCard.astro  # Tool card
│   │   └── tools/          # Tool components (Vue)
│   ├── data/
│   │   └── tools-registry.ts  # Central tool registry
│   ├── layouts/
│   │   └── BaseLayout.astro   # Main layout
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # About page
│   │   ├── privacy.astro      # Privacy policy
│   │   └── tools/
│   │       └── [slug].astro   # Dynamic tool pages
│   └── types/
│       └── tool.ts            # TypeScript types
├── astro.config.mjs        # Astro configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── README.md              # This file
```

---

## 🔧 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check code for errors
npm run check
```

### Adding a New Tool

1. **Add to registry** (`src/data/tools-registry.ts`):

```typescript
{
  id: 'my-tool',
  name: 'My Tool',
  description: 'What your tool does',
  icon: '🎉',
  category: 'text',
  keywords: ['keyword1', 'keyword2'],
  type: 'native',
  featured: false
}
```

2. **Create component** (`src/components/tools/MyTool.vue`):

```vue
<template>
  <div class="my-tool">
    <!-- Your tool UI -->
  </div>
</template>

<script setup>
// Your tool logic
</script>
```

3. **Tool page auto-generates** at `/tools/my-tool`

---

## 🎨 Design System

### CSS Variables

All styling uses CSS custom properties for easy theming:

```css
/* Primary colors */
--color-primary: #2563eb;
--color-secondary: #10b981;

/* Text colors */
--color-text: #111827;
--color-text-secondary: #6b7280;

/* Spacing */
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
```

### Dark Mode

Dark mode is automatically detected and persisted:

```javascript
// Toggle programmatically
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## 📦 Building for Production

```bash
# Build static site
npm run build

# Output directory: dist/
# Upload dist/ contents to your web host
```

### Deployment Options

**Hostinger (Current):**
1. Build locally: `npm run build`
2. Upload `dist/` contents to `public_html/`
3. Add `.htaccess` for clean URLs

**Vercel/Netlify:**
- Connect GitHub repository
- Build command: `npm run build`
- Output directory: `dist/`
- Auto-deploys on push

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check if the issue already exists
2. Open a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS info

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and use case
3. Explain why it would be useful

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Update documentation if needed
- Test on multiple browsers
- Ensure dark mode works
- Keep tools privacy-focused (no external API calls)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Design inspiration** from V1 (vanilla HTML/CSS/JS version)
- **[Astro](https://astro.build)** for the amazing static site generator
- **[it-tools](https://github.com/CorentinTh/it-tools)** for tool component inspiration
- **Open source community** for countless libraries and resources

---

## 📞 Contact

- **Website:** [tools.nahlawi.com](https://tools.nahlawi.com)
- **GitHub:** [@rnahlawi](https://github.com/rnahlawi)
- **Email:** contact@nahlawi.com

---

## 🗺️ Roadmap

### ✅ Phase 1 (Complete)
- [x] Astro + Vue setup
- [x] Tool registry system
- [x] 15 V1 tools ported
- [x] Dark mode
- [x] Responsive design
- [x] Production deployment

### 🚧 Phase 2 (In Progress)
- [ ] Add 10 more tools from it-tools
- [ ] PWA enhancements
- [ ] Tool history/favorites
- [ ] Offline mode improvements

### 📋 Phase 3 (Planned)
- [ ] 50+ total tools
- [ ] Multi-language support (i18n)
- [ ] Chrome extension
- [ ] API for developers
- [ ] Tool categories page

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ by the community**