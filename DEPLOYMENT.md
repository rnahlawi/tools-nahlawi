# Deployment Guide

## Building for Production
```bash
npm run build
```

Output will be in `dist/` directory.

## Hosting Options

### Vercel (Recommended for beginners)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Output directory: `dist/`
4. Auto-deploys on push to main

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist/`
4. Add `_redirects` file if needed

### Self-Hosting (Hostinger, cPanel, etc.)
1. Build locally: `npm run build`
2. Upload `dist/` contents via FTP
3. Add `.htaccess` for clean URLs:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^/]+)$ /tools/$1 [L,QSA]
```

## Environment Variables

No environment variables needed! All tools run client-side.

## SSL Certificate

Ensure HTTPS is enabled on your host for:
- Security
- PWA functionality
- SEO benefits