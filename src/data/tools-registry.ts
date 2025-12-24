// src/data/tools-registry.ts
import type { Tool } from '../types/tool';

/**
 * Central Tool Registry - V3 with Enhanced SEO Descriptions
 * Add/remove tools here to manage the entire site
 */

export const TOOLS: Tool[] = [
  // TEXT TOOLS
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Free word counter tool. Count words, characters, sentences, paragraphs, and reading time instantly. Perfect for essays, articles, and social media posts. No sign-up required.',
    icon: '📊',
    category: 'text',
    keywords: ['word counter', 'character count', 'text analysis', 'essay word count', 'reading time calculator'],
    type: 'v1-port',
    featured: true
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, Sentence case, or aLtErNaTiNg cAsE. Free online text case converter with instant results.',
    icon: '🔤',
    category: 'text',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'text formatter'],
    type: 'v1-port',
    featured: true
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    description: 'Reverse text, words, or lines instantly. Free online text reverser tool. Perfect for creative text effects and fun transformations.',
    icon: '🔄',
    category: 'text',
    keywords: ['text reverser', 'reverse text', 'backwards text', 'flip text', 'mirror text'],
    type: 'v1-port'
  },
  {
    id: 'remove-line-breaks',
    name: 'Remove Line Breaks',
    description: 'Remove or add line breaks in text. Clean up text copied from PDFs, emails, or websites. Free online line break formatter.',
    icon: '📄',
    category: 'text',
    keywords: ['remove line breaks', 'text formatter', 'clean text', 'format text'],
    type: 'v1-port'
  },

  // CALCULATORS
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Free percentage calculator. Calculate percentages, percentage increase/decrease, discounts, and ratios instantly. Mobile-friendly with multiple calculators.',
    icon: '🔢',
    category: 'calculator',
    keywords: ['percentage calculator', 'percent calculator', 'discount calculator', 'percentage increase', 'percentage decrease'],
    type: 'v1-port',
    featured: true
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, days, hours, and minutes. Free age calculator with next birthday countdown. Accurate date calculations.',
    icon: '🎂',
    category: 'calculator',
    keywords: ['age calculator', 'birthday calculator', 'how old am i', 'age in days', 'next birthday'],
    type: 'v1-port',
    featured: true
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Free BMI calculator. Calculate your Body Mass Index and health category instantly. Supports metric and imperial units. Get health insights.',
    icon: '⚖️',
    category: 'calculator',
    keywords: ['bmi calculator', 'body mass index', 'health calculator', 'weight calculator', 'bmi chart'],
    type: 'v1-port'
  },

  // GENERATORS
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate strong, secure random passwords. Customizable length and character types. Free password generator with instant copy. Privacy-focused, no data stored.',
    icon: '🔒',
    category: 'generator',
    keywords: ['password generator', 'random password', 'secure password', 'strong password', 'password maker'],
    type: 'v1-port',
    featured: true
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Create high-quality QR codes for URLs, text, WiFi, and more. Free QR code generator optimized for phone scanning. Customizable colors and sizes.',
    icon: '📱',
    category: 'generator',
    keywords: ['qr code generator', 'qr code maker', 'create qr code', 'free qr code', 'qr scanner'],
    type: 'v1-port'
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum placeholder text for designs and mockups. Free dummy text generator with paragraphs, sentences, or words. Instant copy.',
    icon: '📝',
    category: 'generator',
    keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'fake text generator', 'text filler'],
    type: 'v1-port'
  },
  {
    id: 'random-number',
    name: 'Random Number Generator',
    description: 'Generate random numbers, integers, and decimals. Free random number generator with customizable range. Perfect for games, raffles, and statistics.',
    icon: '🎲',
    category: 'generator',
    keywords: ['random number generator', 'random integer', 'number picker', 'rng', 'random dice'],
    type: 'v1-port'
  },

  // DEVELOPER TOOLS
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 text instantly. Free Base64 converter for developers. Safe, private, works in your browser. No server upload.',
    icon: '🔐',
    category: 'developer',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 converter', 'encode base64', 'decode base64'],
    type: 'v1-port',
    featured: true
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs and URI components. Free URL encoder for special characters. Essential tool for developers and webmasters.',
    icon: '🔗',
    category: 'developer',
    keywords: ['url encoder', 'url decoder', 'uri encoder', 'encode url', 'percent encoding'],
    type: 'v1-port'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly. Free hash generator for checksums and data integrity. Multiple algorithms.',
    icon: '🔑',
    category: 'developer',
    keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'checksum calculator', 'hash calculator'],
    type: 'v1-port'
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, beautify, minify, and validate JSON data. Free JSON formatter with syntax highlighting. Essential tool for developers and API testing.',
    icon: '📋',
    category: 'developer',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'json minifier', 'format json'],
    type: 'v1-port'
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