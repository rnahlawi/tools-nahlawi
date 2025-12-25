import type { Tool } from '../types/tool';

/**
 * Central Tool Registry
 * Add/remove tools here to manage the entire site
 */

export const TOOLS: Tool[] = [
  // TEXT TOOLS
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in your text.',
    icon: '📊',
    category: 'text',
    keywords: ['word counter', 'character count', 'text analysis'],
    type: 'v1-port',
    featured: true,
    tier: 1,
    privacyNote: 'All text processing happens in your browser. Nothing is uploaded or stored.'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, or Sentence case.',
    icon: '🔤',
    category: 'text',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case'],
    type: 'v1-port',
    featured: true,
    tier: 1,
    privacyNote: 'All conversion happens locally in your browser.'
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    description: 'Reverse text, words, or lines instantly.',
    icon: '🔄',
    category: 'text',
    keywords: ['text reverser', 'reverse', 'backwards', 'flip'],
    type: 'v1-port',
    tier: 1,
    privacyNote: 'All text processing happens in your browser.'
  },
  {
    id: 'remove-line-breaks',
    name: 'Remove Line Breaks',
    description: 'Remove or add line breaks in your text.',
    icon: '📄',
    category: 'text',
    keywords: ['remove line breaks', 'text formatter'],
    type: 'v1-port',
    tier: 1,
    privacyNote: 'All text processing happens in your browser.'
  },

  // CALCULATORS
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, percentage increase/decrease, and more.',
    icon: '🔢',
    category: 'calculator',
    keywords: ['percentage', 'percent', 'calculator'],
    type: 'v1-port',
    featured: true,
    tier: 1,
    privacyNote: 'All calculations happen in your browser.'
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days.',
    icon: '🎂',
    category: 'calculator',
    keywords: ['age calculator', 'birthday', 'date'],
    type: 'v1-port',
    featured: true,
    tier: 1,
    privacyNote: 'All date calculations happen in your browser.'
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and health category.',
    icon: '⚖️',
    category: 'calculator',
    keywords: ['bmi', 'body mass index', 'health'],
    type: 'v1-port',
    tier: 1,
    privacyNote: 'All BMI calculations happen in your browser. No health data is stored.'
  },

  // GENERATORS
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate strong, random passwords with customizable options.',
    icon: '🔐',
    category: 'generator',
    keywords: ['password', 'generator', 'random', 'secure'],
    type: 'v1-port',
    featured: true,
    tier: 1,
    privacyNote: 'Passwords are generated locally in your browser. Never sent to any server.'
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes for URLs, text, and more.',
    icon: '📱',
    category: 'generator',
    keywords: ['qr code', 'generator', 'barcode'],
    type: 'v1-port',
    tier: 1,
    privacyNote: 'QR codes are generated locally. Your data never leaves your browser.'
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs.',
    icon: '📝',
    category: 'generator',
    keywords: ['lorem ipsum', 'placeholder', 'dummy text'],
    type: 'v1-port',
    tier: 1,
    privacyNote: 'All text generation happens in your browser.'
  },
  {
    id: 'random-number',
    name: 'Random Number Generator',
    description: 'Generate random numbers, integers, and decimals.',
    icon: '🎲',
    category: 'generator',
    keywords: ['random number', 'generator', 'integer'],
    type: 'v1-port',
    tier: 1,
    privacyNote: 'Random numbers are generated locally using browser crypto API.'
  },
  {
    id: 'url-shortener',
    name: 'URL Shortener',
    description: 'Shorten long URLs using is.gd API (privacy-focused).',
    icon: '🔗',
    category: 'generator',
    keywords: ['url', 'shortener', 'link', 'shorten', 'isgd'],
    type: 'native',
    tier: 2,
    privacyNote: 'Uses is.gd API to shorten URLs. Recent URLs stored locally in your browser.'
  },

  // DEVELOPER TOOLS
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode or decode text to/from Base64 format.',
    icon: '🔒',
    category: 'developer',
    keywords: ['base64', 'encoder', 'decoder'],
    type: 'v1-port',
    featured: true,
    tier: 1,
    privacyNote: 'All encoding/decoding happens in your browser.'
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode or decode URLs and URI components.',
    icon: '🔗',
    category: 'developer',
    keywords: ['url', 'encoder', 'decoder', 'uri'],
    type: 'v1-port',
    tier: 1,
    privacyNote: 'All URL processing happens in your browser.'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.',
    icon: '🔐',
    category: 'developer',
    keywords: ['hash', 'md5', 'sha256', 'generator'],
    type: 'v1-port',
    tier: 1,
    privacyNote: 'All hashing happens in your browser using Web Crypto API.'
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, minify, and validate JSON data.',
    icon: '📋',
    category: 'developer',
    keywords: ['json', 'formatter', 'validator', 'beautifier'],
    type: 'v1-port',
    tier: 1,
    privacyNote: 'All JSON processing happens in your browser.'
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors and convert between HEX, RGB, HSL, and CMYK formats.',
    icon: '🎨',
    category: 'developer',
    keywords: ['color picker', 'hex', 'rgb', 'hsl', 'cmyk', 'converter'],
    type: 'native',
    tier: 1,
    privacyNote: 'All color processing happens in your browser. Palettes saved locally.'
  },
  {
    id: 'ip-lookup',
    name: 'IP Address Lookup',
    description: 'Get your public IP address and geolocation information using ipify API.',
    icon: '🌐',
    category: 'developer',
    keywords: ['ip', 'address', 'lookup', 'geolocation', 'ipify'],
    type: 'native',
    tier: 2,
    privacyNote: 'Uses ipify API and ipapi.co to get IP information. Lookups stored locally only.'
  },

  // CONVERTERS
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images by pixels or percentage. Convert between JPEG, PNG, and WebP formats.',
    icon: '🖼️',
    category: 'converter',
    keywords: ['image', 'resize', 'converter', 'jpeg', 'png', 'webp'],
    type: 'native',
    tier: 1,
    privacyNote: 'All image processing happens in your browser. Images never uploaded.'
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON Converter',
    description: 'Convert between CSV and JSON formats with drag & drop support.',
    icon: '📊',
    category: 'converter',
    keywords: ['csv', 'json', 'converter', 'data'],
    type: 'native',
    tier: 1,
    privacyNote: 'All conversion happens in your browser. Files never uploaded.'
  }
];

// Utility functions for working with the registry

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find(tool => tool.id === id);
}

export function getToolsByCategory(category: string): Tool[] {
  return TOOLS.filter(tool => tool.category === category);
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter(tool => tool.featured);
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
}

export function getAllCategories(): string[] {
  return Array.from(new Set(TOOLS.map(tool => tool.category)));
}

export function getToolsByTier(tier: 1 | 2 | 3): Tool[] {
  return TOOLS.filter(tool => tool.tier === tier);
}